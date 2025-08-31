import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useProducts, Product } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/formatters';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Package, DollarSign, Archive, AlertTriangle } from 'lucide-react';

interface ProductViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductView = ({ product, isOpen, onClose }: ProductViewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({});

  const { updateProduct, updateStock } = useProducts();
  const { toast } = useToast();

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price,
        cost_price: product.cost_price,
        stock_quantity: product.stock_quantity,
        minimum_stock: product.minimum_stock,
        status: product.status,
        description: product.description,
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setLoading(true);
    try {
      await updateProduct(product.id, formData);
      setIsEditing(false);
      toast({
        title: 'Produto atualizado',
        description: 'As alterações foram salvas com sucesso.',
      });
    } catch (error) {
      // Error handled by the hook
    } finally {
      setLoading(false);
    }
  };

  const handleStockUpdate = async (newQuantity: number) => {
    if (!product) return;

    try {
      await updateStock(product.id, newQuantity);
      toast({
        title: 'Estoque atualizado',
        description: `Estoque alterado para ${newQuantity} unidades.`,
      });
    } catch (error) {
      // Error handled by the hook
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'out_of_stock': return 'destructive';
      default: return 'default';
    }
  };

  const getStockStatus = (stock: number, minimum: number) => {
    if (stock === 0) return { text: 'Esgotado', color: 'text-red-500', icon: AlertTriangle };
    if (stock <= minimum) return { text: 'Estoque Baixo', color: 'text-yellow-500', icon: AlertTriangle };
    return { text: 'Em Estoque', color: 'text-green-500', icon: Package };
  };

  if (!product) return null;

  const stockStatus = getStockStatus(product.stock_quantity, product.minimum_stock);
  const StatusIcon = stockStatus.icon;

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Produto Escaneado</span>
            <Badge variant={getStatusVariant(product.status)}>
              {product.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Produto</span>
              </div>
              <p className="text-lg font-bold">{product.name}</p>
              <p className="text-sm text-muted-foreground font-mono">{product.short_code}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Preço</span>
              </div>
              <p className="text-lg font-bold text-primary">{formatCurrency(product.price)}</p>
              {product.cost_price && (
                <p className="text-sm text-muted-foreground">
                  Custo: {formatCurrency(product.cost_price)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <StatusIcon className={`h-4 w-4 ${stockStatus.color}`} />
                <span className="text-sm font-medium">Estoque</span>
              </div>
              <p className={`text-lg font-bold ${stockStatus.color}`}>
                {product.stock_quantity} unidades
              </p>
              <p className="text-sm text-muted-foreground">
                Mínimo: {product.minimum_stock}
              </p>
            </div>
          </div>

          <Separator />

          {/* Quick Actions */}
          <div className="space-y-4">
            <h3 className="font-medium">Ações Rápidas</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStockUpdate(product.stock_quantity + 1)}
              >
                +1 Estoque
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStockUpdate(Math.max(0, product.stock_quantity - 1))}
                disabled={product.stock_quantity === 0}
              >
                -1 Estoque
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStockUpdate(product.stock_quantity + 10)}
              >
                +10 Estoque
              </Button>
              <Button
                variant={isEditing ? "secondary" : "default"}
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancelar" : "Editar"}
              </Button>
            </div>
          </div>

          {/* Edit Form */}
          {isEditing && (
            <>
              <Separator />
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome do Produto</Label>
                    <Input
                      id="name"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Input
                      id="category"
                      value={formData.category || ''}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Preço de Venda (R$)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price || ''}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cost_price">Preço de Custo (R$)</Label>
                    <Input
                      id="cost_price"
                      type="number"
                      step="0.01"
                      value={formData.cost_price || ''}
                      onChange={(e) => setFormData({ ...formData, cost_price: parseFloat(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock_quantity">Quantidade em Estoque</Label>
                    <Input
                      id="stock_quantity"
                      type="number"
                      min="0"
                      value={formData.stock_quantity || ''}
                      onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minimum_stock">Estoque Mínimo</Label>
                    <Input
                      id="minimum_stock"
                      type="number"
                      min="0"
                      value={formData.minimum_stock || ''}
                      onChange={(e) => setFormData({ ...formData, minimum_stock: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => setFormData({ ...formData, status: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                      <SelectItem value="out_of_stock">Fora de Estoque</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descrição do produto (opcional)"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </>
          )}

          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};