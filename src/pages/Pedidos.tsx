import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, ShoppingCart, CheckCircle, XCircle, Eye, Edit, Trash2 } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import { formatCurrency } from "@/lib/formatters";
import { RealTimeClock } from "@/components/RealTimeClock";

export default function Pedidos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [typeFilter, setTypeFilter] = useState("todos");
  const { orders, loading, updateOrderStatus, deleteOrder } = useOrders();

  const filteredOrders = orders.filter(order => {
    const matchSearch = order.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       order.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchStatus = statusFilter === "todos" || order.status === statusFilter;
    const matchType = typeFilter === "todos" || order.type === typeFilter;
    
    return matchSearch && matchStatus && matchType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return { label: 'Pendente', variant: 'secondary' as const };
      case 'completed':
        return { label: 'Concluído', variant: 'default' as const };
      case 'cancelled':
        return { label: 'Cancelado', variant: 'destructive' as const };
      default:
        return { label: status, variant: 'outline' as const };
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'normal':
        return { label: 'Normal', variant: 'outline' as const };
      case 'consignment':
        return { label: 'Consignado', variant: 'secondary' as const };
      default:
        return { label: type, variant: 'outline' as const };
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: 'pending' | 'completed' | 'cancelled') => {
    await updateOrderStatus(orderId, newStatus);
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (confirm('Tem certeza que deseja excluir este pedido?')) {
      await deleteOrder(orderId);
    }
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    completed: orders.filter(o => o.status === 'completed').length,
    consignment: orders.filter(o => o.type === 'consignment').length,
    totalValue: orders
      .filter(o => o.status === 'completed')
      .reduce((acc, o) => acc + o.total_amount, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão de Pedidos</h1>
          <p className="text-muted-foreground mt-1">
            Controle de pedidos normais e consignados
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <RealTimeClock />
          <Button className="btn-gradient">
            <Plus className="h-4 w-4 mr-2" />
            Novo Pedido
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="card-3d">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Pedidos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-3d">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-3d">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-green-500">{stats.completed}</p>
                <p className="text-sm text-muted-foreground">Concluídos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-3d">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-blue-500">{stats.consignment}</p>
                <p className="text-sm text-muted-foreground">Consignados</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-3d">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">R$</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{formatCurrency(stats.totalValue)}</p>
                <p className="text-sm text-muted-foreground">Vendido</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="card-3d">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  placeholder="Buscar por cliente ou ID do pedido..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos Status</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos Tipos</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="consignment">Consignado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="grid gap-4">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <Card key={i} className="card-3d">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="flex justify-between">
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-32" />
                      <div className="h-3 bg-muted rounded w-24" />
                    </div>
                    <div className="h-6 bg-muted rounded w-20" />
                  </div>
                  <div className="h-3 bg-muted rounded w-full" />
                  <div className="flex justify-between">
                    <div className="h-6 bg-muted rounded w-24" />
                    <div className="flex gap-2">
                      <div className="h-8 w-8 bg-muted rounded" />
                      <div className="h-8 w-8 bg-muted rounded" />
                      <div className="h-8 w-8 bg-muted rounded" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          filteredOrders.map((order) => {
            const statusBadge = getStatusBadge(order.status);
            const typeBadge = getTypeBadge(order.type);
            
            return (
              <Card key={order.id} className="card-3d hover:scale-[1.01] transition-transform">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        Pedido #{order.id.slice(0, 8)}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Cliente: {order.client_name || 'Cliente não informado'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={statusBadge.variant}>
                        {statusBadge.label}
                      </Badge>
                      <Badge variant={typeBadge.variant}>
                        {typeBadge.label}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Itens:</span>
                    <div className="mt-1 space-y-1">
                      {order.items.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex justify-between text-xs">
                          <span>{item.product_name} x{item.quantity}</span>
                          <span>{formatCurrency(item.total_price)}</span>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          +{order.items.length - 3} itens...
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div>
                      <p className="text-lg font-bold text-primary">
                        {formatCurrency(order.total_amount)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                      </p>
                    </div>
                    
                    <div className="flex space-x-1">
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <Eye className="h-3 w-3" />
                      </Button>
                      
                      {order.status === 'pending' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 w-8 p-0 hover:bg-green-500 hover:text-white"
                          onClick={() => handleStatusChange(order.id, 'completed')}
                        >
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                      )}
                      
                      {order.status !== 'cancelled' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 w-8 p-0 hover:bg-red-500 hover:text-white"
                          onClick={() => handleStatusChange(order.id, 'cancelled')}
                        >
                          <XCircle className="h-3 w-3" />
                        </Button>
                      )}
                      
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleDeleteOrder(order.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && !loading && (
        <Card className="card-3d">
          <CardContent className="text-center py-12">
            <div className="text-muted-foreground">
              <p className="text-lg mb-2">Nenhum pedido encontrado</p>
              <p>Tente ajustar os filtros ou crie um novo pedido</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}