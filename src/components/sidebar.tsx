"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import {
  ClipboardList,
  Users,
  Building2,
  Activity,
  Settings,
  Users2,
  BarChart3,
} from "lucide-react"

interface SidebarProps {
  className?: string
}

const navigationItems = [
  {
    title: "Interventi",
    href: "/interventions",
    icon: ClipboardList,
  },
  {
    title: "Clienti",
    href: "/clients",
    icon: Building2,
  },
  {
    title: "Attività",
    href: "/activities",
    icon: Activity,
  },
  {
    title: "Stati",
    href: "/states",
    icon: BarChart3,
  },
  {
    title: "Utenti",
    href: "/users",
    icon: Users2,
  },
  {
    title: "Impostazioni",
    href: "/settings",
    icon: Settings,
  },
]

export function Sidebar({ className }: SidebarProps) {
  const [isHovered, setIsHovered] = useState(false)
  const pathname = usePathname()

  return (
    <div
      className={cn(
        "group flex flex-col border-r bg-background",
        isHovered ? "w-64" : "w-16",
        "transition-all duration-300 ease-in-out",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex h-14 items-center px-3">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <ClipboardList className="h-4 w-4 text-primary-foreground" />
          </div>
          <span 
            className={cn(
              "text-lg font-semibold transition-opacity duration-300",
              isHovered ? "opacity-100" : "opacity-0"
            )}
          >
            ZenTask
          </span>
        </div>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  !isHovered && "justify-center"
                )}
              >
                <Icon className={cn("h-4 w-4", isHovered && "mr-3")} />
                <span 
                  className={cn(
                    "transition-opacity duration-300",
                    isHovered ? "opacity-100" : "opacity-0"
                  )}
                >
                  {item.title}
                </span>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto p-2">
        <Separator className="mb-2" />
        <div 
          className={cn(
            "px-3 py-2 text-xs text-muted-foreground transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0"
          )}
        >
          © 2024 ZenTask
        </div>
      </div>
    </div>
  )
}