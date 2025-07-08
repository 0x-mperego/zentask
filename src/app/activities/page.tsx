"use client"

import * as React from "react"
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import { LayoutNew } from "@/components/layout-new"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { FormSheet } from "@/components/form-sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Activity } from "lucide-react"

interface ActivityType {
  id: string
  name: string
}

const mockData: ActivityType[] = [
  {
    id: "1",
    name: "Installazione",
  },
  {
    id: "2", 
    name: "Manutenzione",
  },
  {
    id: "3",
    name: "Riparazione",
  }
]

export default function ActivitiesPage() {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const columns: ColumnDef<ActivityType>[] = [
    {
      accessorKey: "name",
      header: "Nome Attività",
      cell: ({ row }) => (
        <span className="inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium text-muted-foreground bg-transparent">
          {row.getValue("name")}
        </span>
      ),
      meta: {
        label: "Nome Attività",
      },
    },
  ]

  const table = useReactTable({
    data: mockData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    enableGlobalFilter: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })
  return (
    <LayoutNew>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Attività</h1>
            <p className="text-muted-foreground">
              Gestisci i tipi di attività disponibili
            </p>
          </div>
          
          <FormSheet
            title="Nuova Attività"
            description="Aggiungi una nuova tipologia di attività"
            trigger={
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nuova Attività
              </Button>
            }
            onSubmit={async (e) => {
              console.log("Form submitted")
            }}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Attività *</Label>
                <Input placeholder="Inserisci nome attività" />
              </div>
            </div>
          </FormSheet>
        </div>

        {/* Data Table */}
        <DataTable
          table={table}
          loading={false}
          emptyState={{
            title: "Nessuna attività trovata",
            description: "Inizia aggiungendo la tua prima attività",
            icon: <Activity className="h-12 w-12" />,
          }}
          mobileCardRender={(activity) => (
            <div className="space-y-2">
              <span className="font-medium">{activity.name}</span>
            </div>
          )}
        >
          <DataTableToolbar 
            table={table} 
            searchPlaceholder="Cerca per nome attività..."
          />
        </DataTable>
      </div>
    </LayoutNew>
  )
}