"use client"

import { LayoutNew } from "@/components/layout-new"
import { DataTable } from "@/components/data-table"
import { FilterToolbar } from "@/components/filter-toolbar"
import { FormSheet } from "@/components/form-sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ColumnDef } from "@tanstack/react-table"
import { Plus, Building2 } from "lucide-react"

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

const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "name",
    header: "Nome/Ragione Sociale",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row }) => {
      const type = row.getValue("type") as string
      return (
        <Badge variant={type === "Azienda" ? "default" : "secondary"}>
          {type}
        </Badge>
      )
    },
  },
  {
    accessorKey: "phone",
    header: "Telefono",
    cell: ({ row }) => {
      const phone = row.getValue("phone") as string
      return phone ? (
        <span className="font-mono text-sm">{phone}</span>
      ) : (
        <span className="text-muted-foreground text-sm">-</span>
      )
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
  },
]

export default function ClientsPage() {
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

        {/* Filters */}
        <FilterToolbar
          searchPlaceholder="Cerca per nome, telefono o email..."
          filters={[
            {
              key: "type",
              label: "Tipo Cliente",
              type: "select",
              options: [
                { label: "Privato", value: "private" },
                { label: "Azienda", value: "company" },
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
            title: "Nessun cliente trovato",
            description: "Inizia aggiungendo il tuo primo cliente",
            icon: <Building2 className="h-12 w-12" />,
          }}
          mobileCardRender={(client) => (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{client.name}</span>
                <Badge variant={client.type === "Azienda" ? "default" : "secondary"}>
                  {client.type}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                {client.phone && <p>Tel: {client.phone}</p>}
                {client.email && <p>Email: {client.email}</p>}
                {client.notes && <p>Note: {client.notes}</p>}
              </div>
            </div>
          )}
          sorting={{
            enableSorting: true,
            sorting: [{ id: "name", desc: false }]
          }}
        />
      </div>
    </LayoutNew>
  )
}