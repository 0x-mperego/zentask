"use client"

import * as React from "react"
import type { Column } from "@tanstack/react-table"
import { Zap } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface DataTableUrgencyFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
}

export function DataTableUrgencyFilter<TData, TValue>({
  column,
}: DataTableUrgencyFilterProps<TData, TValue>) {
  const isActive = column?.getFilterValue() === "true"

  const handleToggle = () => {
    if (!column) return
    
    // Toggle between showing only urgent items or showing all
    const newValue = isActive ? undefined : "true"
    column.setFilterValue(newValue)
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        "h-8 border-dashed",
        isActive && "border-solid bg-accent text-accent-foreground"
      )}
      onClick={handleToggle}
    >
      <Zap className="mr-2 h-4 w-4" />
      Urgenza
      {isActive && (
        <span className="ml-2 text-xs">Attivo</span>
      )}
    </Button>
  )
}