import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Package, Users, HandHeart } from "lucide-react"

const stats = [
  {
    title: "Vendas Hoje",
    value: "R$ 2.450,00",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    description: "em relação a ontem"
  },
  {
    title: "Consignados Ativos",
    value: "24",
    change: "+3",
    trend: "up", 
    icon: HandHeart,
    description: "pedidos em aberto"
  },
  {
    title: "Produtos em Estoque",
    value: "1.247",
    change: "-8",
    trend: "down",
    icon: Package,
    description: "itens disponíveis"
  },
  {
    title: "Clientes Ativos",
    value: "89",
    change: "+5",
    trend: "up",
    icon: Users,
    description: "este mês"
  }
]

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="card-3d">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center space-x-1 text-xs">
              {stat.trend === "up" ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>
                {stat.change}
              </span>
              <span className="text-muted-foreground">{stat.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}