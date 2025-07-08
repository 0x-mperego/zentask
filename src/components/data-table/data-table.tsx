"use client"

import * as React from "react"
import { flexRender, type Table as TanstackTable } from "@tanstack/react-table"

import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import { getCommonPinningStyles } from "@/lib/data-table"

interface DataTableProps<TData> extends React.ComponentProps<"div"> {
  table: TanstackTable<TData>
  loading?: boolean
  emptyState?: {
    title: string
    description: string
    icon?: React.ReactNode
  }
  mobileCardRender?: (item: TData) => React.ReactNode
  showPagination?: boolean
}

export function DataTable<TData>({
  table,
  loading = false,
  emptyState,
  mobileCardRender,
  showPagination = true,
  children,
  className,
  ...props
}: DataTableProps<TData>) {
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
                      {cell.column.columnDef.meta?.label || cell.column.id}
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
    <div className={cn("flex w-full flex-col gap-2.5 overflow-auto", className)} {...props}>
      {children}
      
      {loading ? (
        <LoadingSkeleton />
      ) : table.getRowModel().rows?.length ? (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <div className="overflow-hidden rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          colSpan={header.colSpan}
                          style={{
                            ...getCommonPinningStyles({ column: header.column }),
                          }}
                          className={header.index === 0 ? "pl-4" : ""}
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
                          style={{
                            ...getCommonPinningStyles({ column: cell.column }),
                          }}
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
          {showPagination && <DataTablePagination table={table} />}
        </>
      ) : (
        <EmptyState />
      )}
    </div>
  )
}