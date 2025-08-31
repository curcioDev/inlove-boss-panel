import { useState } from "react"
import { AppSidebar } from "@/components/AppSidebar"
import { QRScanner } from "@/components/QRScanner"
import { RealTimeClock } from "@/components/RealTimeClock"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen flex bg-background">
      <AppSidebar 
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="border-b border-border bg-card p-4">
          <div className="flex items-center justify-end gap-4">
            <RealTimeClock />
            <QRScanner />
          </div>
        </header>
        
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}