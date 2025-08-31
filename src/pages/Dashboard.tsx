import { DashboardStats } from "@/components/DashboardStats"
import { RecentActivities } from "@/components/RecentActivities"
import { QuickActions } from "@/components/QuickActions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Clock } from "lucide-react"

export default function Dashboard() {
  const currentTime = new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Bem-vindo ao painel administrativo da In Love
          </p>
        </div>
        
        <Card className="card-3d">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="font-mono">{currentTime}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Carandaí, MG</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Grid */}
      <DashboardStats />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions - Spans 1 column */}
        <div className="lg:col-span-1">
          <QuickActions />
        </div>

        {/* Recent Activities - Spans 2 columns */}
        <div className="lg:col-span-2">
          <RecentActivities />
        </div>
      </div>

      {/* Store Info */}
      <Card className="card-3d">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">IL</span>
            </div>
            <span>Informações da Loja</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-foreground mb-1">Endereço</h4>
              <p className="text-muted-foreground">
                R. Prof. Patrus de Souza<br />
                Carandaí, MG - 36284-009
              </p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1">Horário de Funcionamento</h4>
              <p className="text-muted-foreground">
                Segunda a Sexta: 9h às 18h<br />
                Sábado: 9h às 16h
              </p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1">Status do Sistema</h4>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-500 font-medium">Online</span>
              </div>
              <p className="text-muted-foreground mt-1">
                Todas as integrações funcionando
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}