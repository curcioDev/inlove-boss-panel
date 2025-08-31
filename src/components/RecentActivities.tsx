import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, ShoppingCart, Package, UserPlus } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "sale",
    title: "Nova venda registrada",
    description: "Conjunto lingerie Rosa - Cliente: Maria Silva",
    value: "R$ 89,90",
    time: "há 15 min",
    icon: ShoppingCart,
    status: "success"
  },
  {
    id: 2,
    type: "consignment",
    title: "Consignado retornado",
    description: "Ana Costa - 3 peças devolvidas",
    value: "R$ 180,00",
    time: "há 32 min",
    icon: Package,
    status: "warning"
  },
  {
    id: 3,
    type: "customer",
    title: "Novo cliente cadastrado",
    description: "Fernanda Lima - (31) 99999-8888",
    value: "",
    time: "há 1h",
    icon: UserPlus,
    status: "info"
  },
  {
    id: 4,
    type: "sale",
    title: "Venda finalizada",
    description: "Kit produtos íntimos - Cliente: Julia Santos",
    value: "R$ 156,50",
    time: "há 2h",
    icon: ShoppingCart,
    status: "success"
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "success": return "bg-green-500/10 text-green-500 border-green-500/20"
    case "warning": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    case "info": return "bg-blue-500/10 text-blue-500 border-blue-500/20"
    default: return "bg-gray-500/10 text-gray-500 border-gray-500/20"
  }
}

export function RecentActivities() {
  return (
    <Card className="card-3d">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-primary" />
          <span>Atividades Recentes</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
              <div className={`p-2 rounded-lg ${getStatusColor(activity.status)}`}>
                <activity.icon className="h-4 w-4" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground truncate">
                    {activity.title}
                  </p>
                  {activity.value && (
                    <Badge variant="outline" className="ml-2 font-mono text-xs">
                      {activity.value}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {activity.description}
                </p>
                <div className="flex items-center mt-2">
                  <Clock className="h-3 w-3 text-muted-foreground mr-1" />
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}