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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Users2, MoreHorizontal, Edit, Trash2, Download } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { FilterOption } from "@/lib/data-table"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: "super_admin" | "admin" | "operatore"
  avatarUrl?: string
}

const mockData: User[] = [
  {
    id: "1",
    firstName: "Mario",
    lastName: "Rossi",
    email: "mario.rossi@zentask.it",
    role: "admin",
  },
  {
    id: "2", 
    firstName: "Luigi",
    lastName: "Verdi",
    email: "luigi.verdi@zentask.it", 
    role: "operatore",
  },
  {
    id: "3",
    firstName: "Anna",
    lastName: "Bianchi",
    email: "anna.bianchi@zentask.it",
    role: "operatore",
  }
]

// Filter options for faceted filters
const roleOptions: FilterOption[] = [
  {
    label: "Operatore",
    value: "operatore",
  },
  {
    label: "Admin",
    value: "admin",
  },
  {
    label: "Super Admin",
    value: "super_admin",
  },
]

const getRoleBadgeVariant = (role: string) => {
  switch (role) {
    case "super_admin":
      return "destructive"
    case "admin": 
      return "default"
    case "operatore":
      return "secondary"
    default:
      return "outline"
  }
}

const getRoleLabel = (role: string) => {
  switch (role) {
    case "super_admin":
      return "Super Admin"
    case "admin":
      return "Admin"
    case "operatore":
      return "Operatore"
    default:
      return role
  }
}

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "avatar",
    header: "",
    cell: ({ row }) => {
      const user = row.original
      return (
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.avatarUrl} alt={`${user.firstName} ${user.lastName}`} />
          <AvatarFallback>
            {user.firstName[0]}{user.lastName[0]}
          </AvatarFallback>
        </Avatar>
      )
    },
    size: 60,
    enableHiding: false,
    meta: {
      label: "Avatar",
    },
  },
  {
    accessorKey: "fullName",
    header: "Nome Completo",
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="font-medium text-white">{user.firstName} {user.lastName}</div>
      )
    },
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    size: 200,
    enableGlobalFilter: true,
    meta: {
      label: "Nome Completo",
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="text-sm text-white">{row.getValue("email")}</div>
    ),
    size: 250,
    enableGlobalFilter: true,
    meta: {
      label: "Email",
    },
  },
  {
    accessorKey: "role",
    header: "Ruolo",
    cell: ({ row }) => {
      const role = row.getValue("role") as string
      return (
        <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium text-white bg-transparent">
          {getRoleLabel(role)}
        </span>
      )
    },
    size: 120,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    meta: {
      label: "Ruolo",
      variant: "multi-select",
      options: roleOptions,
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

export default function UsersPage() {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "fullName", desc: false }])
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
            <h1 className="text-3xl font-bold tracking-tight">Utenti</h1>
            <p className="text-muted-foreground">
              Gestisci gli utenti del sistema
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Esporta
            </Button>
            
            <FormSheet
              title="Nuovo Utente"
              description="Aggiungi un nuovo utente al sistema"
              trigger={
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nuovo Utente
                </Button>
              }
              onSubmit={async (e) => {
                console.log("Form submitted")
              }}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nome *</Label>
                    <Input placeholder="Inserisci nome" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Cognome *</Label>
                    <Input placeholder="Inserisci cognome" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input type="email" placeholder="email@esempio.it" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Ruolo *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona ruolo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operatore">Operatore</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password Temporanea *</Label>
                  <Input type="password" placeholder="Password temporanea" />
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
          title: "Nessun utente trovato",
          description: "Inizia aggiungendo il tuo primo utente",
          icon: <Users2 className="h-12 w-12" />,
        }}
        mobileCardRender={(user) => (
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatarUrl} alt={`${user.firstName} ${user.lastName}`} />
                <AvatarFallback>
                  {user.firstName[0]}{user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user.firstName} {user.lastName}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <span className="inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium text-muted-foreground bg-transparent">
              {getRoleLabel(user.role)}
            </span>
          </div>
        )}
      >
        <DataTableToolbar 
          table={table} 
          searchPlaceholder="Cerca per nome o email..."
        />
      </DataTable>
    </LayoutNew>
  )
}