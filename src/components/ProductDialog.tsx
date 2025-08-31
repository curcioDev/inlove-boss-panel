import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CurrencyInput } from '@/components/ui/currency-input';
import { useProducts, type Product } from '@/hooks/useProducts';
import { PRODUCT_CATEGORIES } from '@/lib/formatters';
import { Plus, Edit, QrCode } from 'lucide-react';

interface ProductDialogProps {
  product?: Product;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export const ProductDialog = ({ product, trigger, onSuccess }: ProductDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: product?.name || '',
    category: product?.category || '',
    price: product?.price || 0,
    cost_price: product?.cost_price || 0,
    stock_quantity: product?.stock_quantity || 0,
    minimum_stock: product?.minimum_stock || 10,
    description: product?.description || '',
    status: product?.status || 'active' as 'active' | 'inactive' | 'out_of_stock'
  });
  
  const { createProduct, updateProduct } = useProducts();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.category.trim() || formData.price <= 0) return;

    setLoading(true);
    try {
      if (product) {
        await updateProduct(product.id, formData);
      } else {
        await createProduct(formData);
      }
      
      setOpen(false);
      onSuccess?.();
      
      if (!product) {
        setFormData({
          name: '',
          category: '',
          price: 0,
          cost_price: 0,
          stock_quantity: 0,
          minimum_stock: 10,
          description: '',
          status: 'active'
        });
      }
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    } finally {
      setLoading(false);
    }
  };

  const defaultTrigger = product ? (
    <Button variant="outline" size="sm">
      <Edit className="h-4 w-4" />
    </Button>
  ) : (
    <Button className="btn-gradient">
      <Plus className="h-4 w-4 mr-2" />
      Novo Produto
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {product ? 'Editar Produto' : 'Novo Produto'}
            {product && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <QrCode className="h-4 w-4" />
                {product.short_code}
              </div>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name">Nome do Produto *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nome do produto"
                required
              />
            </div>
            
            <div className="col-span-2">
              <Label htmlFor="category">Categoria *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="price">Preço de Venda *</Label>
              <CurrencyInput
                id="price"
                value={formData.price}
                onChange={(value) => setFormData(prev => ({ ...prev, price: value }))}
                placeholder="R$ 0,00"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="cost_price">Preço de Custo</Label>
              <CurrencyInput
                id="cost_price"
                value={formData.cost_price}
                onChange={(value) => setFormData(prev => ({ ...prev, cost_price: value }))}
                placeholder="R$ 0,00"
              />
            </div>
            
            <div>
              <Label htmlFor="stock_quantity">Quantidade em Estoque</Label>
              <Input
                id="stock_quantity"
                type="number"
                min="0"
                value={formData.stock_quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, stock_quantity: parseInt(e.target.value) || 0 }))}
                placeholder="0"
              />
            </div>
            
            <div>
              <Label htmlFor="minimum_stock">Estoque Mínimo</Label>
              <Input
                id="minimum_stock"
                type="number"
                min="0"
                value={formData.minimum_stock}
                onChange={(e) => setFormData(prev => ({ ...prev, minimum_stock: parseInt(e.target.value) || 0 }))}
                placeholder="10"
              />
            </div>
            
            <div className="col-span-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'active' | 'inactive' | 'out_of_stock') => 
                  setFormData(prev => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                  <SelectItem value="out_of_stock">Fora de Estoque</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="col-span-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descrição detalhada do produto"
                rows={3}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !formData.name.trim() || !formData.category.trim() || formData.price <= 0}>
              {loading ? 'Salvando...' : (product ? 'Atualizar' : 'Criar')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};