import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Transaction {
  id: string;
  type: 'sale' | 'consignment_close' | 'return' | 'consignment_open';
  amount: number;
  description: string;
  order_id?: string;
  client_id?: string;
  client_name?: string;
  payment_method?: 'cash' | 'card' | 'pix' | 'consignment';
  created_at: string;
}

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          clients (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedTransactions = (data || []).map((transaction: any) => ({
        id: transaction.id,
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description || '',
        order_id: transaction.order_id,
        client_id: transaction.client_id,
        payment_method: transaction.payment_method,
        created_at: transaction.created_at,
        client_name: transaction.clients?.name || null
      }));

      setTransactions(formattedTransactions);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar transações',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const createTransaction = async (transactionData: Omit<Transaction, 'id' | 'created_at' | 'client_name'>) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([{
          type: transactionData.type,
          amount: transactionData.amount,
          description: transactionData.description,
          order_id: transactionData.order_id || null,
          client_id: transactionData.client_id || null,
          payment_method: transactionData.payment_method || null
        }])
        .select()
        .single();

      if (error) throw error;
      
      const newTransaction: Transaction = {
        ...data,
        client_name: null
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      return newTransaction;
    } catch (error: any) {
      toast({
        title: 'Erro ao criar transação',
        description: error.message,
        variant: 'destructive'
      });
      throw error;
    }
  };

  const getTodaysRevenue = () => {
    const today = new Date().toDateString();
    return transactions
      .filter(t => new Date(t.created_at).toDateString() === today && t.type !== 'return')
      .reduce((total, t) => total + (t.type === 'return' ? -t.amount : t.amount), 0);
  };

  const getMonthlyRevenue = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return transactions
      .filter(t => {
        const date = new Date(t.created_at);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .reduce((total, t) => total + (t.type === 'return' ? -t.amount : t.amount), 0);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    transactions,
    loading,
    createTransaction,
    getTodaysRevenue,
    getMonthlyRevenue,
    refetch: fetchTransactions
  };
};