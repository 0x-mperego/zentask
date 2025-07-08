"use client"

import { LayoutNew } from "@/components/layout-new"
import { DataTable } from "@/components/data-table-old"
import { FilterToolbar } from "@/components/filter-toolbar"
import { FormSheet } from "@/components/form-sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ColumnDef } from "@tanstack/react-table"
import { Plus, Users2 } from "lucide-react"

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
  },
  {
    accessorKey: "fullName",
    header: "Nome Completo",
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="font-medium">{user.firstName} {user.lastName}</div>
      )
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "role",
    header: "Ruolo",
    cell: ({ row }) => {
      const role = row.getValue("role") as string
      return (
        <Badge variant={getRoleBadgeVariant(role)}>
          {getRoleLabel(role)}
        </Badge>
      )
    },
  },
]

export default function UsersPage() {
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

        {/* Filters */}
        <FilterToolbar
          searchPlaceholder="Cerca per nome o email..."
          filters={[
            {
              key: "role",
              label: "Ruolo",
              type: "select",
              options: [
                { label: "Operatore", value: "operatore" },
                { label: "Admin", value: "admin" },
                { label: "Super Admin", value: "super_admin" },
              ],
            },
          ]}
          onExport={() => console.log("Export clicked")}
        />

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={mockData}
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
              <Badge variant={getRoleBadgeVariant(user.role)}>
                {getRoleLabel(user.role)}
              </Badge>
            </div>
          )}
          sorting={{
            enableSorting: true,
            sorting: [{ id: "fullName", desc: false }]
          }}
        />
      </div>
    </LayoutNew>
  )
}