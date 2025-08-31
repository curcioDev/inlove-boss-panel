import { useState } from "react"
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  HandHeart, 
  CreditCard, 
  FileText, 
  Tag,
  Settings,
  LogOut,
  ChevronLeft,
  Menu
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Clientes", url: "/clientes", icon: Users },
  { title: "Produtos", url: "/produtos", icon: Package },
  { title: "Pedidos", url: "/pedidos", icon: FileText },
  { title: "Consignados", url: "/consignados", icon: HandHeart },
  { title: "Caixa", url: "/caixa", icon: CreditCard },
  { title: "Etiquetas", url: "/etiquetas", icon: Tag },
]

interface AppSidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

export function AppSidebar({ isCollapsed, onToggle }: AppSidebarProps) {
  const location = useLocation()
  const currentPath = location.pathname

  const isActive = (path: string) => {
    if (path === "/" && currentPath === "/") return true
    if (path !== "/" && currentPath.startsWith(path)) return true
    return false
  }

  return (
    <div className={cn(
      "sidebar-3d h-screen transition-all duration-300 flex flex-col",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">IL</span>
              </div>
              <div>
                <h1 className="font-bold text-foreground">In Love</h1>
                <p className="text-xs text-muted-foreground">Dashboard</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="hover:bg-accent"
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            className={cn(
              "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              "hover:bg-accent hover:text-accent-foreground",
              isActive(item.url) 
                ? "bg-primary text-primary-foreground shadow-lg" 
                : "text-muted-foreground"
            )}
          >
            <item.icon className={cn("h-5 w-5 flex-shrink-0")} />
            {!isCollapsed && <span className="truncate">{item.title}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-border space-y-1">
        <NavLink
          to="/configuracoes"
          className={cn(
            "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
            "hover:bg-accent hover:text-accent-foreground text-muted-foreground"
          )}
        >
          <Settings className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span>Configurações</span>}
        </NavLink>
        
        <button
          className={cn(
            "w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
            "hover:bg-destructive hover:text-destructive-foreground text-muted-foreground"
          )}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span>Sair</span>}
        </button>
      </div>
    </div>
  )
}