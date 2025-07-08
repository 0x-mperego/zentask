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
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, BarChart3, MoreHorizontal, Edit, Trash2, Download } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface StateType {
  id: string
  name: string
  color: string
}

const mockData: StateType[] = [
  {
    id: "1",
    name: "Nuovo",
    color: "#3b82f6",
  },
  {
    id: "2", 
    name: "In corso",
    color: "#f59e0b",
  },
  {
    id: "3",
    name: "Completato",
    color: "#10b981",
  },
  {
    id: "4",
    name: "Sospeso",
    color: "#ef4444",
  }
]

const columns: ColumnDef<StateType>[] = [
  {
    accessorKey: "name",
    header: "Nome Stato",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
    size: 200,
    enableGlobalFilter: true,
    meta: {
      label: "Nome Stato",
    },
  },
  {
    accessorKey: "color",
    header: "Colore",
    cell: ({ row }) => {
      const color = row.getValue("color") as string
      const name = row.getValue("name") as string
      return (
        <div className="flex items-center gap-2">
          <div 
            className="h-4 w-4 rounded-full border" 
            style={{ backgroundColor: color }}
          />
          <span className="inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium text-muted-foreground bg-transparent">
            {name}
          </span>
        </div>
      )
    },
    size: 250,
    meta: {
      label: "Colore",
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Edit className="h-4 w-4 mr-2" />
            Modifica
          </DropdownMenuItem>
          <DropdownMenuItem className="text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Elimina
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    size: 80,
    enableHiding: false,
    meta: {
      label: "Azioni",
    },
  },
]

export default function StatesPage() {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "name", desc: false }])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  // Initialize table
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
            <h1 className="text-3xl font-bold tracking-tight">Stati</h1>
            <p className="text-muted-foreground">
              Gestisci gli stati disponibili per gli interventi
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Esporta
            </Button>
            
            <FormSheet
              title="Nuovo Stato"
              description="Aggiungi un nuovo stato per gli interventi"
              trigger={
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nuovo Stato
                </Button>
              }
              onSubmit={async (e) => {
                console.log("Form submitted")
              }}
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Stato *</Label>
                  <Input placeholder="Inserisci nome stato" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">Colore *</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="color" 
                      className="w-16 h-10 p-1 border rounded" 
                      defaultValue="#3b82f6"
                    />
                    <Input 
                      placeholder="#3b82f6" 
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </FormSheet>
          </div>
        </div>
      </div>
      
      {/* Table */}
      <DataTable
        table={table}
        loading={false}
        emptyState={{
          title: "Nessuno stato trovato",
          description: "Inizia aggiungendo il tuo primo stato",
          icon: <BarChart3 className="h-12 w-12" />,
        }}
        mobileCardRender={(state) => (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div 
                className="h-4 w-4 rounded-full border" 
                style={{ backgroundColor: state.color }}
              />
              <span className="font-medium">{state.name}</span>
            </div>
            <span className="inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium text-muted-foreground bg-transparent">
              {state.name}
            </span>
          </div>
        )}
      >
        <DataTableToolbar 
          table={table} 
          searchPlaceholder="Cerca per nome stato..."
        />
      </DataTable>
    </LayoutNew>
  )
}