import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Mail, Phone, MapPin } from "lucide-react"
import { useState } from "react"
import { useClients } from "@/hooks/useClients"
import { ClientDialog } from "@/components/ClientDialog"
import { RealTimeClock } from "@/components/RealTimeClock"

export default function Clientes() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroTipo, setFiltroTipo] = useState("todos")
  const { clients, loading, deleteClient } = useClients()

  const clientesFiltrados = clients.filter(cliente => {
    const matchesSearch = cliente.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (cliente.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                         (cliente.phone?.includes(searchTerm) || false)
    
    const matchesFilter = filtroTipo === "todos" || cliente.client_type === filtroTipo
    
    return matchesSearch && matchesFilter
  })

  const handleDeleteClient = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      await deleteClient(id)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão de Clientes</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie seus clientes e histórico de compras
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <RealTimeClock />
          <ClientDialog />
        </div>
      </div>

      {/* Filters */}
      <Card className="card-3d">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, email ou telefone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant={filtroTipo === "todos" ? "default" : "outline"}
                onClick={() => setFiltroTipo("todos")}
              >
                Todos ({clients.length})
              </Button>
              <Button 
                variant={filtroTipo === "normal" ? "default" : "outline"}
                onClick={() => setFiltroTipo("normal")}
              >
                Normais ({clients.filter(c => c.client_type === 'normal').length})
              </Button>
              <Button 
                variant={filtroTipo === "consignado" ? "default" : "outline"}
                onClick={() => setFiltroTipo("consignado")}
              >
                Consignados ({clients.filter(c => c.client_type === 'consignado').length})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clientes Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          // Loading skeleton
          [...Array(6)].map((_, i) => (
            <Card key={i} className="card-3d">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-muted rounded-full" />
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-32" />
                      <div className="h-3 bg-muted rounded w-20" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          clientesFiltrados.map((cliente) => (
            <Card key={cliente.id} className="card-3d hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold">
                      {cliente.name.split(' ').map(name => name[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{cliente.name}</h3>
                      <Badge variant={cliente.client_type === "consignado" ? "default" : "secondary"}>
                        {cliente.client_type === "consignado" ? "Consignado" : "Normal"}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <ClientDialog client={cliente} />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteClient(cliente.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {cliente.email && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{cliente.email}</span>
                    </div>
                  )}
                  {cliente.phone && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{cliente.phone}</span>
                    </div>
                  )}
                  {cliente.address && (
                    <div className="flex items-start space-x-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>
                        {[cliente.address.street, cliente.address.city, cliente.address.state]
                          .filter(Boolean).join(', ')}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Última compra:</span>
                    <span className="font-medium">
                      {cliente.last_purchase_date 
                        ? new Date(cliente.last_purchase_date).toLocaleDateString('pt-BR')
                        : 'Nenhuma'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-muted-foreground">Total em compras:</span>
                    <span className="font-medium text-primary">R$ {cliente.total_purchases.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Empty State */}
      {!loading && clientesFiltrados.length === 0 && (
        <Card className="card-3d">
          <CardContent className="text-center py-12">
            <div className="text-muted-foreground">
              <p className="text-lg mb-2">Nenhum cliente encontrado</p>
              <p>Tente ajustar os filtros ou adicione um novo cliente</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}