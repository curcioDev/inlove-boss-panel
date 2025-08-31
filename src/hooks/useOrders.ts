import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Order {
  id: string;
  client_id?: string;
  client_name?: string;
  type: 'normal' | 'consignment';
  status: 'pending' | 'completed' | 'cancelled' | 'consignment';
  total_amount: number;
  items: OrderItem[];
  notes?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const { data: clientsData } = await supabase
        .from('clients')
        .select('id, name');

      const clientsMap = new Map(clientsData?.map(client => [client.id, client.name]) || []);

      const formattedOrders = data?.map(order => ({
        id: order.id,
        client_id: order.client_id,
        client_name: order.client_id ? clientsMap.get(order.client_id) : undefined,
        type: order.is_consignment ? 'consignment' as const : 'normal' as const,
        status: order.status,
        total_amount: order.total_amount,
        notes: undefined,
        created_at: order.created_at,
        updated_at: order.updated_at,
        completed_at: undefined,
        items: order.order_items?.map((item: any) => ({
          id: item.id,
          product_id: item.product_id,
          product_name: item.products?.name || 'Produto não encontrado',
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price
        })) || []
      })) || [];

      setOrders(formattedOrders);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar pedidos',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          client_id: orderData.client_id,
          is_consignment: orderData.type === 'consignment',
          status: orderData.status,
          total_amount: orderData.total_amount,
          consignment_due_date: orderData.type === 'consignment' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Inserir itens do pedido
      if (orderData.items.length > 0) {
        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(
            orderData.items.map(item => ({
              order_id: order.id,
              product_id: item.product_id,
              quantity: item.quantity,
              unit_price: item.unit_price,
              total_price: item.total_price
            }))
          );

        if (itemsError) throw itemsError;
      }

      await fetchOrders();
      toast({
        title: 'Pedido criado com sucesso',
        description: `Pedido #${order.id.slice(0, 8)} foi criado.`
      });

      return order;
    } catch (error: any) {
      toast({
        title: 'Erro ao criar pedido',
        description: error.message,
        variant: 'destructive'
      });
      throw error;
    }
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ 
          status
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await fetchOrders();
      toast({
        title: 'Status atualizado',
        description: `Pedido foi marcado como ${status === 'completed' ? 'concluído' : status}.`
      });

      return data;
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar pedido',
        description: error.message,
        variant: 'destructive'
      });
      throw error;
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      // Primeiro deletar os itens do pedido
      const { error: itemsError } = await supabase
        .from('order_items')
        .delete()
        .eq('order_id', id);

      if (itemsError) throw itemsError;

      // Depois deletar o pedido
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setOrders(prev => prev.filter(order => order.id !== id));
      toast({
        title: 'Pedido removido',
        description: 'Pedido foi removido com sucesso.'
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao remover pedido',
        description: error.message,
        variant: 'destructive'
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    createOrder,
    updateOrderStatus,
    deleteOrder,
    refetch: fetchOrders
  };
};