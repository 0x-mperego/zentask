"use client"

import * as React from "react"
import type { Table } from "@tanstack/react-table"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options"
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter"
import { DataTableUrgencyFilter } from "@/components/data-table/data-table-urgency-filter"
import type { FilterOption } from "@/lib/data-table"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchPlaceholder?: string
  searchColumn?: string
  children?: React.ReactNode
}

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = "Cerca...",
  searchColumn = "code",
  children,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const [globalFilter, setGlobalFilter] = React.useState("")

  // Handle global filter with debounce
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      table.setGlobalFilter(globalFilter)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [globalFilter, table])

  // Get filterable columns
  const filterableColumns = table
    .getAllColumns()
    .filter((column) => {
      const meta = column.columnDef.meta
      return meta?.variant && (meta?.options || meta?.variant === "toggle") && column.getCanFilter()
    })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder={searchPlaceholder}
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="h-8 w-[150px] lg:w-[250px]"
          />
          
          {/* Faceted Filters */}
          {filterableColumns.map((column) => {
            const meta = column.columnDef.meta
            if (!meta?.options) return null

            // Special handling for urgency filter
            if (column.id === "urgent") {
              return (
                <DataTableUrgencyFilter
                  key={column.id}
                  column={column}
                />
              )
            }

            return (
              <DataTableFacetedFilter
                key={column.id}
                column={column}
                title={meta.label || column.id}
                options={meta.options}
                multiple={meta.variant === "multi-select"}
              />
            )
          })}

          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {children}
          <DataTableViewOptions table={table} />
        </div>
      </div>
    </div>
  )
}