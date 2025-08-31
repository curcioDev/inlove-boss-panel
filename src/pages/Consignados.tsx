import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HandHeart, Plus, Clock, Package, AlertCircle } from "lucide-react"

export default function Consignados() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão de Consignados</h1>
          <p className="text-muted-foreground mt-1">
            Controle de produtos em consignação e devoluções
          </p>
        </div>
        
        <Button className="btn-gradient">
          <Plus className="h-4 w-4 mr-2" />
          Novo Consignado
        </Button>
      </div>

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="card-3d">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <HandHeart className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">24</p>
                <p className="text-sm text-muted-foreground">Pedidos Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-3d">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-500/10 rounded-lg">
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">7</p>
                <p className="text-sm text-muted-foreground">Vencendo em 7 dias</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-3d">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <Package className="h-8 w-8 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">156</p>
                <p className="text-sm text-muted-foreground">Produtos Consignados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Em Desenvolvimento */}
      <Card className="card-3d">
        <CardContent className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Módulo em Desenvolvimento</h3>
            <p className="text-muted-foreground mb-6">
              O sistema completo de gestão de consignados está sendo desenvolvido. 
              Em breve você poderá gerenciar pedidos, devoluções e controle de estoque.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>✅ Controle de pedidos consignados</p>
              <p>✅ Gestão de devoluções</p>
              <p>✅ Relatórios de consignação</p>
              <p>✅ Integração com estoque</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}