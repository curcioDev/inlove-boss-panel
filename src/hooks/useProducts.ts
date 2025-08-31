import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import QRCode from 'qrcode';

export interface Product {
  id: string;
  name: string;
  short_code: string;
  qr_code: string;
  category: string;
  price: number;
  cost_price?: number;
  stock_quantity: number;
  minimum_stock: number;
  description?: string;
  status: 'active' | 'inactive' | 'out_of_stock';
  created_at: string;
  updated_at: string;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar produtos',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async (productId: string, shortCode: string): Promise<string> => {
    const qrData = `inlove_product:${productId}:${shortCode}`;
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      return qrCodeDataUrl;
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      throw error;
    }
  };

  const createProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'short_code' | 'qr_code'>) => {
    try {
      // Gerar código único
      const { data: shortCodeData, error: shortCodeError } = await supabase
        .rpc('generate_product_short_code');
      
      if (shortCodeError) throw shortCodeError;
      
      const shortCode = shortCodeData;
      const productId = crypto.randomUUID();
      
      // Gerar QR Code
      const qrCodeData = `inlove_product:${productId}:${shortCode}`;
      
      const { data, error } = await supabase
        .from('products')
        .insert([{
          ...productData,
          id: productId,
          short_code: shortCode,
          qr_code: qrCodeData
        }])
        .select()
        .single();

      if (error) throw error;
      
      setProducts(prev => [data, ...prev]);
      toast({
        title: 'Produto criado com sucesso',
        description: `${productData.name} foi adicionado com código ${shortCode}.`
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: 'Erro ao criar produto',
        description: error.message,
        variant: 'destructive'
      });
      throw error;
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setProducts(prev => prev.map(product => product.id === id ? data : product));
      toast({
        title: 'Produto atualizado',
        description: 'Dados do produto foram atualizados com sucesso.'
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar produto',
        description: error.message,
        variant: 'destructive'
      });
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setProducts(prev => prev.filter(product => product.id !== id));
      toast({
        title: 'Produto removido',
        description: 'Produto foi removido com sucesso.'
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao remover produto',
        description: error.message,
        variant: 'destructive'
      });
      throw error;
    }
  };

  const updateStock = async (id: string, newQuantity: number) => {
    try {
      const status = newQuantity === 0 ? 'out_of_stock' : 'active';
      
      const { data, error } = await supabase
        .from('products')
        .update({ 
          stock_quantity: newQuantity,
          status 
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setProducts(prev => prev.map(product => product.id === id ? data : product));
      
      return data;
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar estoque',
        description: error.message,
        variant: 'destructive'
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    createProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    generateQRCode,
    refetch: fetchProducts
  };
};