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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Building2, MoreHorizontal, Edit, Trash2, Download } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { FilterOption } from "@/lib/data-table"

interface Client {
  id: string
  name: string
  type: "Privato" | "Azienda"
  phone?: string
  email?: string
  notes?: string
}

const mockData: Client[] = [
  {
    id: "1",
    name: "Azienda ABC S.r.l.",
    type: "Azienda",
    phone: "+39 02 1234567",
    email: "info@aziendaabc.it",
    notes: "Cliente importante"
  },
  {
    id: "2", 
    name: "Studio Legale XYZ",
    type: "Azienda",
    phone: "+39 06 7654321",
    email: "contatti@studioxyz.it"
  },
  {
    id: "3",
    name: "Mario Bianchi",
    type: "Privato",
    phone: "+39 347 1234567",
    email: "mario.bianchi@email.it"
  }
]

// Filter options for faceted filters
const typeOptions: FilterOption[] = [
  {
    label: "Azienda",
    value: "Azienda",
  },
  {
    label: "Privato",
    value: "Privato",
  },
]

const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "name",
    header: "Nome/Ragione Sociale",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
    size: 250,
    enableGlobalFilter: true,
    meta: {
      label: "Nome/Ragione Sociale",
    },
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row }) => {
      const type = row.getValue("type") as string
      return (
        <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium bg-transparent">
          {type}
        </span>
      )
    },
    size: 120,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    meta: {
      label: "Tipo",
      variant: "multi-select",
      options: typeOptions,
    },
  },
  {
    accessorKey: "phone",
    header: "Telefono",
    cell: ({ row }) => {
      const phone = row.getValue("phone") as string
      return phone ? (
        <span className="text-sm">{phone}</span>
      ) : (
        <span className="text-muted-foreground text-sm">-</span>
      )
    },
    size: 150,
    enableGlobalFilter: true,
    meta: {
      label: "Telefono",
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.getValue("email") as string
      return email ? (
        <span className="text-sm">{email}</span>
      ) : (
        <span className="text-muted-foreground text-sm">-</span>
      )
    },
    size: 200,
    enableGlobalFilter: true,
    meta: {
      label: "Email",
    },
  },
  {
    accessorKey: "notes",
    header: "Note",
    cell: ({ row }) => {
      const notes = row.getValue("notes") as string
      return notes ? (
        <div className="max-w-[200px] truncate text-sm">{notes}</div>
      ) : (
        <span className="text-muted-foreground text-sm">-</span>
      )
    },
    size: 200,
    enableGlobalFilter: true,
    meta: {
      label: "Note",
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

export default function ClientsPage() {
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
            <h1 className="text-3xl font-bold tracking-tight">Clienti</h1>
            <p className="text-muted-foreground">
              Gestisci la lista dei tuoi clienti
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Esporta
            </Button>
            
            <FormSheet
              title="Nuovo Cliente"
              description="Aggiungi un nuovo cliente alla lista"
              trigger={
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nuovo Cliente
                </Button>
              }
              onSubmit={async (e) => {
                console.log("Form submitted")
              }}
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo Cliente *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">Privato</SelectItem>
                      <SelectItem value="company">Azienda</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Nome/Ragione Sociale *</Label>
                  <Input placeholder="Inserisci nome o ragione sociale" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefono</Label>
                    <Input placeholder="+39 xxx xxxxxxx" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" placeholder="email@esempio.it" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Note</Label>
                  <Textarea placeholder="Note aggiuntive sul cliente" />
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
          title: "Nessun cliente trovato",
          description: "Inizia aggiungendo il tuo primo cliente",
          icon: <Building2 className="h-12 w-12" />,
        }}
        mobileCardRender={(client) => (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">{client.name}</span>
              <span className="inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium text-muted-foreground bg-transparent">
                {client.type}
              </span>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              {client.phone && <p>Tel: {client.phone}</p>}
              {client.email && <p>Email: {client.email}</p>}
              {client.notes && <p>Note: {client.notes}</p>}
            </div>
          </div>
        )}
      >
        <DataTableToolbar 
          table={table} 
          searchPlaceholder="Cerca per nome, telefono o email..."
        />
      </DataTable>
    </LayoutNew>
  )
}