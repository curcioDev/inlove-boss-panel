import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, QrCode, FileText, Tag, Calculator, Users } from "lucide-react"

const quickActions = [
  {
    title: "Nova Venda",
    description: "Registrar venda direta",
    icon: Plus,
    action: "sale",
    variant: "default" as const
  },
  {
    title: "Novo Consignado",
    description: "Criar pedido consignado",
    icon: Users,
    action: "consignment",
    variant: "outline" as const
  },
  {
    title: "Ler Código",
    description: "Scanner produtos",
    icon: QrCode,
    action: "scan",
    variant: "outline" as const
  },
  {
    title: "Relatório",
    description: "Gerar relatório",
    icon: FileText,
    action: "report",
    variant: "outline" as const
  },
  {
    title: "Etiquetas",
    description: "Imprimir etiquetas",
    icon: Tag,
    action: "labels",
    variant: "outline" as const
  },
  {
    title: "Fechar Caixa",
    description: "Fechamento diário",
    icon: Calculator,
    action: "close",
    variant: "secondary" as const
  }
]

export function QuickActions() {
  const handleAction = (action: string) => {
    console.log(`Ação executada: ${action}`)
    // Aqui implementaremos as navegações ou modais específicos
  }

  return (
    <Card className="card-3d">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Ações Rápidas</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {quickActions.map((action) => (
            <Button
              key={action.action}
              variant={action.variant}
              className="h-auto p-4 flex flex-col items-center space-y-2 hover:scale-105 transition-transform"
              onClick={() => handleAction(action.action)}
            >
              <action.icon className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium text-sm">{action.title}</div>
                <div className="text-xs opacity-70">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}