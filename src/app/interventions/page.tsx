"use client"

import { LayoutNew } from "@/components/layout-new"
import { DataTable } from "@/components/data-table"
import { FilterToolbar } from "@/components/filter-toolbar"
import { FormSheet, useFormSheet } from "@/components/form-sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ColumnDef } from "@tanstack/react-table"
import { Plus, MoreHorizontal, ClipboardList } from "lucide-react"

interface Intervention {
  id: string
  code: string
  description: string
  client: string
  activity: string
  status: string
  employee: string
  urgent: boolean
  startDate: string
  endDate?: string
  duration: string
  createdAt: string
}

const mockData: Intervention[] = [
  {
    id: "1",
    code: "INT-00001",
    description: "Installazione nuovo sistema",
    client: "Azienda ABC",
    activity: "Installazione",
    status: "In corso",
    employee: "Mario Rossi",
    urgent: true,
    startDate: "2024-01-15",
    endDate: "2024-01-16",
    duration: "8h",
    createdAt: "2024-01-15T09:00:00Z"
  },
  {
    id: "2", 
    code: "INT-00002",
    description: "Manutenzione server",
    client: "Studio Legale XYZ",
    activity: "Manutenzione",
    status: "Completato",
    employee: "Luigi Verdi",
    urgent: false,
    startDate: "2024-01-14",
    endDate: "2024-01-14",
    duration: "4h",
    createdAt: "2024-01-14T14:00:00Z"
  }
]

const columns: ColumnDef<Intervention>[] = [
  {
    accessorKey: "code",
    header: "Codice",
    cell: ({ row }) => (
      <div className="font-mono text-sm">{row.getValue("code")}</div>
    ),
  },
  {
    accessorKey: "description",
    header: "Descrizione",
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate">{row.getValue("description")}</div>
    ),
  },
  {
    accessorKey: "client",
    header: "Cliente",
  },
  {
    accessorKey: "activity", 
    header: "Attività",
  },
  {
    accessorKey: "status",
    header: "Stato",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge variant={status === "Completato" ? "default" : status === "In corso" ? "secondary" : "outline"}>
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "urgent",
    header: "Urgente",
    cell: ({ row }) => {
      const urgent = row.getValue("urgent") as boolean
      return urgent ? (
        <Badge variant="destructive">Urgente</Badge>
      ) : null
    },
  },
  {
    accessorKey: "employee",
    header: "Dipendente",
  },
  {
    accessorKey: "duration",
    header: "Durata",
  },
]

export default function InterventionsPage() {
  return (
    <LayoutNew>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Interventi</h1>
            <p className="text-muted-foreground">
              Gestisci tutti gli interventi presso i clienti
            </p>
          </div>
          
          <FormSheet
            title="Nuovo Intervento"
            description="Crea un nuovo intervento per un cliente"
            trigger={
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nuovo Intervento
              </Button>
            }
            onSubmit={async (e) => {
              console.log("Form submitted")
            }}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client">Cliente *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="abc">Azienda ABC</SelectItem>
                      <SelectItem value="xyz">Studio Legale XYZ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="activity">Attività *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona attività" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="install">Installazione</SelectItem>
                      <SelectItem value="maintenance">Manutenzione</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrizione *</Label>
                <Input placeholder="Descrizione dell'intervento" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Data Inizio *</Label>
                  <Input type="date" defaultValue="2024-01-15" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration">Durata Stimata</Label>
                  <Input placeholder="es. 4h, 2 giorni" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Note</Label>
                <Textarea placeholder="Note aggiuntive sull'intervento" />
              </div>
            </div>
          </FormSheet>
        </div>

        {/* Filters */}
        <FilterToolbar
          searchPlaceholder="Cerca per codice, descrizione o cliente..."
          filters={[
            {
              key: "status",
              label: "Stato",
              type: "select",
              options: [
                { label: "In corso", value: "in-progress" },
                { label: "Completato", value: "completed" },
                { label: "Sospeso", value: "suspended" },
              ],
            },
            {
              key: "activity",
              label: "Attività",
              type: "select", 
              options: [
                { label: "Installazione", value: "installation" },
                { label: "Manutenzione", value: "maintenance" },
                { label: "Riparazione", value: "repair" },
              ],
            },
            {
              key: "employee",
              label: "Dipendente",
              type: "select",
              options: [
                { label: "Mario Rossi", value: "mario" },
                { label: "Luigi Verdi", value: "luigi" },
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
            title: "Nessun intervento trovato",
            description: "Inizia creando il tuo primo intervento",
            icon: <ClipboardList className="h-12 w-12" />,
          }}
          mobileCardRender={(intervention) => (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm">{intervention.code}</span>
                <div className="flex gap-2">
                  {intervention.urgent && (
                    <Badge variant="destructive" className="text-xs">Urgente</Badge>
                  )}
                  <Badge variant={intervention.status === "Completato" ? "default" : "secondary"} className="text-xs">
                    {intervention.status}
                  </Badge>
                </div>
              </div>
              <p className="font-medium">{intervention.description}</p>
              <div className="text-sm text-muted-foreground">
                <p>Cliente: {intervention.client}</p>
                <p>Attività: {intervention.activity}</p>
                <p>Dipendente: {intervention.employee}</p>
                <p>Durata: {intervention.duration}</p>
              </div>
            </div>
          )}
        />
      </div>
    </LayoutNew>
  )
}