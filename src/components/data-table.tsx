"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  OnChangeFn,
} from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, ChevronRight, MoreHorizontal, Search } from "lucide-react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  loading?: boolean
  title?: string
  description?: string
  emptyState?: {
    title: string
    description: string
    icon?: React.ReactNode
  }
  pagination?: {
    pageSize?: number
    showPagination?: boolean
  }
  filters?: {
    columnFilters?: ColumnFiltersState
    onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>
  }
  sorting?: {
    sorting?: SortingState
    onSortingChange?: OnChangeFn<SortingState>
    enableSorting?: boolean
  }
  className?: string
  mobileCardRender?: (item: TData) => React.ReactNode
}

export function DataTable<TData, TValue>({
  columns,
  data,
  loading = false,
  title,
  description,
  emptyState,
  pagination = { pageSize: 10, showPagination: true },
  filters,
  sorting,
  className,
  mobileCardRender,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    filters?.columnFilters || []
  )
  const [internalSorting, setInternalSorting] = React.useState<SortingState>(
    sorting?.sorting || []
  )
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: sorting?.onSortingChange || setInternalSorting,
    onColumnFiltersChange: filters?.onColumnFiltersChange || setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting: sorting?.sorting || internalSorting,
      columnFilters: filters?.columnFilters || columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: pagination.pageSize || 10,
      },
    },
    enableSorting: sorting?.enableSorting ?? true,
  })

  const LoadingSkeleton = () => (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      ))}
    </div>
  )

  const EmptyState = () => (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        {emptyState?.icon && (
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center text-muted-foreground">
            {emptyState.icon}
          </div>
        )}
        <h3 className="text-lg font-medium">
          {emptyState?.title || "Nessun dato disponibile"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {emptyState?.description || "Non ci sono elementi da visualizzare"}
        </p>
      </div>
    </div>
  )

  const MobileCards = () => (
    <div className="space-y-4 md:hidden">
      {table.getRowModel().rows.map((row) => (
        <Card key={row.id}>
          <CardContent className="p-4">
            {mobileCardRender ? (
              mobileCardRender(row.original)
            ) : (
              <div className="space-y-2">
                {row.getVisibleCells().map((cell) => (
                  <div key={cell.id} className="flex justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      {cell.column.columnDef.header as string}
                    </span>
                    <span className="text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )

  return (
    <div className={cn("w-full", className)}>
      {(title || description) && (
        <div className="mb-4">
          {title && <h2 className="text-2xl font-bold tracking-tight">{title}</h2>}
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      {loading ? (
        <LoadingSkeleton />
      ) : table.getRowModel().rows?.length ? (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <div className="border pl-4">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Mobile Cards */}
          <MobileCards />

          {/* Pagination */}
          {pagination.showPagination && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} di{" "}
                {table.getFilteredRowModel().rows.length} elemento/i selezionato/i.
              </div>
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">
                  Pagina {table.getState().pagination.pageIndex + 1} di{" "}
                  {table.getPageCount()}
                </p>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <EmptyState />
      )}
    </div>
  )
}