import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Package, QrCode, Edit, Trash2, AlertTriangle } from "lucide-react"
import { useProducts } from "@/hooks/useProducts"
import { ProductDialog } from "@/components/ProductDialog"
import { QRCodeDisplay } from "@/components/QRCodeDisplay"
import { PrintLabel } from "@/components/PrintLabel"
import { RealTimeClock } from "@/components/RealTimeClock"
import { formatCurrency } from "@/lib/formatters"

export default function Produtos() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroCategoria, setFiltroCategoria] = useState("todos")
  const { products, loading, deleteProduct } = useProducts()

  const categorias = ["todos", ...Array.from(new Set(products.map(p => p.category)))]

  const produtosFiltrados = products.filter(produto => {
    const matchSearch = produto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       produto.short_code.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchCategoria = filtroCategoria === "todos" || produto.category === filtroCategoria
    
    return matchSearch && matchCategoria
  })

  const getStatusEstoque = (estoque: number, minimo: number) => {
    if (estoque === 0) return { label: "Esgotado", variant: "destructive" as const }
    if (estoque <= minimo) return { label: "Estoque Baixo", variant: "secondary" as const }
    return { label: "Em Estoque", variant: "default" as const }
  }

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      await deleteProduct(id)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão de Produtos</h1>
          <p className="text-muted-foreground mt-1">
            Controle de estoque e catálogo de produtos
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <ProductDialog />
        </div>
      </div>

      {/* Resumo de Estoque */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="card-3d">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{products.length}</p>
                <p className="text-sm text-muted-foreground">Total Produtos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-3d">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold text-yellow-500">
                  {products.filter(p => p.stock_quantity <= p.minimum_stock && p.stock_quantity > 0).length}
                </p>
                <p className="text-sm text-muted-foreground">Estoque Baixo</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-3d">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold text-red-500">
                  {products.filter(p => p.stock_quantity === 0).length}
                </p>
                <p className="text-sm text-muted-foreground">Esgotados</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-3d">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-green-500">
                  {products.reduce((acc, p) => acc + p.stock_quantity, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Itens Totais</p>
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
                  placeholder="Buscar por nome ou código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {categorias.map((categoria) => (
                <Button
                  key={categoria}
                  variant={filtroCategoria === categoria ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFiltroCategoria(categoria)}
                >
                  {categoria === "todos" ? "Todos" : categoria}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Produtos Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <Card key={i} className="card-3d">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="flex justify-between">
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-32" />
                      <div className="h-3 bg-muted rounded w-20" />
                    </div>
                    <div className="h-6 bg-muted rounded w-16" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-3 bg-muted rounded" />
                    <div className="h-3 bg-muted rounded" />
                    <div className="h-3 bg-muted rounded" />
                    <div className="h-3 bg-muted rounded" />
                  </div>
                  <div className="flex justify-between">
                    <div className="h-6 bg-muted rounded w-20" />
                    <div className="flex gap-1">
                      <div className="h-8 w-8 bg-muted rounded" />
                      <div className="h-8 w-8 bg-muted rounded" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          produtosFiltrados.map((producto) => {
            const statusEstoque = getStatusEstoque(producto.stock_quantity, producto.minimum_stock)
            
            return (
              <Card key={producto.id} className="card-3d hover:scale-[1.02] transition-transform">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg leading-tight">{producto.name}</CardTitle>
                      <p className="text-sm text-muted-foreground font-mono">{producto.short_code}</p>
                    </div>
                    <Badge variant={statusEstoque.variant}>
                      {statusEstoque.label}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Categoria:</span>
                      <p className="font-medium">{producto.category}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <p className="font-medium capitalize">{producto.status}</p>
                    </div>
                     <div className="col-span-2">
                       <span className="text-muted-foreground">Descrição:</span>
                       <p className="font-medium">{producto.description || 'Sem descrição'}</p>
                     </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div>
                      <p className="text-lg font-bold text-primary">
                        {formatCurrency(producto.price)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Estoque: {producto.stock_quantity} un.
                      </p>
                    </div>
                    
                    <div className="flex space-x-1">
                      <QRCodeDisplay product={producto} />
                      <PrintLabel product={producto} />
                      <ProductDialog product={producto} />
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleDeleteProduct(producto.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Empty State */}
      {produtosFiltrados.length === 0 && (
        <Card className="card-3d">
          <CardContent className="text-center py-12">
            <div className="text-muted-foreground">
              <p className="text-lg mb-2">Nenhum produto encontrado</p>
              <p>Tente ajustar os filtros ou adicione um novo produto</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}