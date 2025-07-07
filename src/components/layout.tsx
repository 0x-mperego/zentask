"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Toaster } from "sonner"

interface LayoutProps {
  children: ReactNode
  className?: string
}

export function Layout({ children, className }: LayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Content Area */}
        <main
          className={cn(
            "flex-1 overflow-auto bg-muted/40 p-4 lg:p-6",
            className
          )}
        >
          {children}
        </main>
      </div>

      {/* Toast Notifications */}
      <Toaster richColors />
    </div>
  )
}