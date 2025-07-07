"use client"

import { LayoutNew } from "@/components/layout-new"
import { DataTable } from "@/components/data-table"
import { FormSheet, useFormSheet } from "@/components/form-sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ColumnDef } from "@tanstack/react-table"
import { Plus, MoreHorizontal, ClipboardList, Edit, Trash2, Search, Download } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
    description: "Installazione nuovo sistema di backup automatico per server principale",
    client: "Azienda ABC S.r.l.",
    activity: "Installazione",
    status: "In corso",
    employee: "Mario Rossi",
    urgent: true,
    startDate: "2025-07-07",
    endDate: "2025-07-08",
    duration: "3h 25min",
    createdAt: "2025-07-07T09:00:00Z"
  },
  {
    id: "2", 
    code: "INT-00002",
    description: "Manutenzione ordinaria server e aggiornamento sistema operativo",
    client: "Studio Legale XYZ",
    activity: "Manutenzione",
    status: "Completato",
    employee: "Luigi Verdi",
    urgent: false,
    startDate: "2025-07-06",
    endDate: "2025-07-06",
    duration: "2h 15min",
    createdAt: "2025-07-06T14:00:00Z"
  },
  {
    id: "3",
    code: "INT-00003", 
    description: "Riparazione stampante di rete e configurazione driver",
    client: "Farmacia Centrale",
    activity: "Riparazione",
    status: "Programmato",
    employee: "Anna Bianchi",
    urgent: false,
    startDate: "2025-07-08",
    duration: "1h 30min",
    createdAt: "2025-07-07T10:30:00Z"
  },
  {
    id: "4",
    code: "INT-00004",
    description: "Installazione nuovo punto vendita e configurazione POS",
    client: "Negozio Elettronica",
    activity: "Installazione", 
    status: "In corso",
    employee: "Mario Rossi",
    urgent: true,
    startDate: "2025-07-07",
    duration: "5h 45min",
    createdAt: "2025-07-07T08:15:00Z"
  },
  {
    id: "5",
    code: "INT-00005",
    description: "Consulenza tecnica per migrazione cloud",
    client: "Azienda ABC S.r.l.",
    activity: "Consulenza",
    status: "Completato",
    employee: "Luigi Verdi",
    urgent: false,
    startDate: "2025-07-05",
    endDate: "2025-07-05", 
    duration: "4h 10min",
    createdAt: "2025-07-05T09:30:00Z"
  }
]

const columns: ColumnDef<Intervention>[] = [
  {
    accessorKey: "code",
    header: "ID",
    cell: ({ row }) => (
      <div className="font-mono text-sm text-muted-foreground">{row.getValue("code")}</div>
    ),
    size: 100,
  },
  {
    accessorKey: "description",
    header: "Descrizione",
    cell: ({ row }) => (
      <div className="max-w-[400px] truncate font-medium">{row.getValue("description")}</div>
    ),
  },
  {
    accessorKey: "client",
    header: "Cliente",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("client")}</div>
    ),
  },
  {
    accessorKey: "activity", 
    header: "Attività",
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue("activity")}</div>
    ),
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
    accessorKey: "employee",
    header: "Dipendente",
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue("employee")}</div>
    ),
  },
  {
    accessorKey: "startDate",
    header: "Data",
    cell: ({ row }) => {
      const date = row.getValue("startDate") as string
      const formattedDate = new Date(date).toLocaleDateString('it-IT', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
      return (
        <div className="text-sm text-muted-foreground">{formattedDate}</div>
      )
    },
  },
  {
    accessorKey: "duration",
    header: "Durata",
    cell: ({ row }) => (
      <div className="text-sm font-mono">{row.getValue("duration")}</div>
    ),
  },
  {
    id: "actions",
    header: "Azioni",
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

        {/* Inline Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Input
              placeholder="Cerca per codice, descrizione o cliente..."
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          
          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Stato" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="in-progress">In corso</SelectItem>
              <SelectItem value="completed">Completato</SelectItem>
              <SelectItem value="suspended">Sospeso</SelectItem>
            </SelectContent>
          </Select>
          
          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Attività" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="installation">Installazione</SelectItem>
              <SelectItem value="maintenance">Manutenzione</SelectItem>
              <SelectItem value="repair">Riparazione</SelectItem>
            </SelectContent>
          </Select>
          
          <Select>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Dipendente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mario">Mario Rossi</SelectItem>
              <SelectItem value="luigi">Luigi Verdi</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Esporta Excel
          </Button>
        </div>
      </div>
      
      {/* Full-width table section */}
      <div className="-mx-4">
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