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
  getFacetedRowModel,
  getFacetedUniqueValues,
  FilterFn,
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
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu"
import { ChevronLeft, ChevronRight, MoreHorizontal, Search, X, Plus } from "lucide-react"

// Filter field types
interface FilterField {
  id: string
  label: string
  type: "select" | "text" | "date-range" | "faceted"
  options?: { label: string; value: string }[]
  placeholder?: string
}

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
  filterFields?: FilterField[]
  searchPlaceholder?: string
  className?: string
  mobileCardRender?: (item: TData) => React.ReactNode
}

// Custom hook for debounced search
function useDebounced<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value)

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
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
  filterFields = [],
  searchPlaceholder = "Search...",
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
  const [globalFilter, setGlobalFilter] = React.useState("")
  
  // Debounced search
  const debouncedGlobalFilter = useDebounced(globalFilter, 300)

  // Helper functions for faceted filters
  const getFilterValue = (columnId: string): string[] => {
    const filter = columnFilters.find(f => f.id === columnId)
    return Array.isArray(filter?.value) ? filter.value : filter?.value ? [String(filter.value)] : []
  }

  const updateFilterValue = (columnId: string, value: string, checked: boolean) => {
    const column = table.getColumn(columnId)
    if (!column) return

    const currentValues = getFilterValue(columnId)
    let newValues: string[]

    if (checked) {
      newValues = [...currentValues, value]
    } else {
      newValues = currentValues.filter(v => v !== value)
    }

    column.setFilterValue(newValues.length > 0 ? newValues : undefined)
  }

  const clearAllFilters = () => {
    table.resetColumnFilters()
    setGlobalFilter("")
  }

  const table = useReactTable({
    data,
    columns,
    onSortingChange: sorting?.onSortingChange || setInternalSorting,
    onColumnFiltersChange: filters?.onColumnFiltersChange || setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting: sorting?.sorting || internalSorting,
      columnFilters: filters?.columnFilters || columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter: debouncedGlobalFilter,
    },
    initialState: {
      pagination: {
        pageSize: pagination.pageSize || 10,
      },
    },
    enableSorting: sorting?.enableSorting ?? true,
    enableGlobalFilter: true,
    columnResizeMode: 'onChange',
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

  // Filter components
  const SearchFilter = () => (
    <div className="relative w-80">
      <Input
        placeholder={searchPlaceholder}
        className="pl-10"
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
      />
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  )

  const FacetedFilter = ({ field }: { field: FilterField }) => {
    const column = table.getColumn(field.id)
    const facetedUniqueValues = column?.getFacetedUniqueValues()
    const selectedValues = getFilterValue(field.id)

    if (!column || !field.options) return null

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            {field.label}
            {selectedValues.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                {selectedValues.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <div className="p-2">
            <div className="text-sm font-medium mb-2">{field.label}</div>
            {field.options.map((option) => {
              const count = facetedUniqueValues?.get(option.value) || 0
              return (
                <div key={option.value} className="flex items-center justify-between space-x-2 py-1">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedValues.includes(option.value)}
                      onChange={(e) => updateFilterValue(field.id, option.value, e.target.checked)}
                      className="rounded"
                    />
                    <label className="text-sm">{option.label}</label>
                  </div>
                  <span className="text-xs text-muted-foreground">{count}</span>
                </div>
              )
            })}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  const ActiveFilters = () => {
    const activeFilters = columnFilters.filter(filter => filter.value !== undefined)
    
    if (activeFilters.length === 0 && !globalFilter) return null

    return (
      <div className="flex items-center gap-2 flex-wrap">
        {/* Active filter badges */}
        {activeFilters.map((filter) => {
          const field = filterFields.find(f => f.id === filter.id)
          if (!field) return null

          const values = Array.isArray(filter.value) ? filter.value : [filter.value]
          const displayValue = values.length === 1 
            ? field.options?.find(opt => opt.value === values[0])?.label || values[0]
            : `${values.length} selezionati`

          return (
            <Badge key={filter.id} variant="secondary" className="flex items-center gap-1">
              <span className="text-muted-foreground">{field.label}:</span>
              <span className="font-medium">{displayValue}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent ml-1"
                onClick={() => {
                  const column = table.getColumn(filter.id)
                  if (column) column.setFilterValue(undefined)
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )
        })}

        {/* Clear all filters button */}
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={clearAllFilters}
        >
          Clear filters
        </Button>
      </div>
    )
  }

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

      {/* Filters */}
      {filterFields.length > 0 && (
        <div className="space-y-4 mb-6">
          {/* Search and Active Filters */}
          <div className="flex items-center gap-4 flex-wrap">
            <SearchFilter />
            <ActiveFilters />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex items-center gap-2 flex-wrap">
            {filterFields.map((field) => (
              <FacetedFilter key={field.id} field={field} />
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <LoadingSkeleton />
      ) : table.getRowModel().rows?.length ? (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <div className="border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header, index) => (
                        <TableHead 
                          key={header.id}
                          style={{ width: header.getSize() }}
                          className={index === 0 ? "pl-4" : ""}
                        >
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
                      {row.getVisibleCells().map((cell, index) => (
                        <TableCell 
                          key={cell.id}
                          style={{ width: cell.column.getSize() }}
                          className={index === 0 ? "pl-4" : ""}
                        >
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