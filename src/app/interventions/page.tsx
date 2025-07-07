"use client"

import * as React from "react"
import { LayoutNew } from "@/components/layout-new"
import { DataTable } from "@/components/data-table"
import { FormSheet, useFormSheet } from "@/components/form-sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pill } from "@/components/ui/pill"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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
  notes?: string
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
    createdAt: "2025-07-07T09:00:00Z",
    notes: "Backup automatico configurato correttamente"
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
    createdAt: "2025-07-06T14:00:00Z",
    notes: "Sistema aggiornato senza problemi"
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
    createdAt: "2025-07-07T10:30:00Z",
    notes: "Driver aggiornati richiesti"
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
    createdAt: "2025-07-07T08:15:00Z",
    notes: "Configurazione POS complessa"
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
    createdAt: "2025-07-05T09:30:00Z",
    notes: "Migrazione completata con successo"
  }
]

export default function InterventionsPage() {
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [editingIntervention, setEditingIntervention] = React.useState<Intervention | null>(null)
  const [deletingIntervention, setDeletingIntervention] = React.useState<Intervention | null>(null)
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [employeeFilter, setEmployeeFilter] = React.useState("all")
  const [urgencyFilter, setUrgencyFilter] = React.useState("all")
  const [activityFilter, setActivityFilter] = React.useState("all")
  const [clientFilter, setClientFilter] = React.useState("all")
  const [dateFromFilter, setDateFromFilter] = React.useState("")
  const [dateToFilter, setDateToFilter] = React.useState("")

  const filteredData = React.useMemo(() => {
    let filtered = mockData

    // Filtro testuale
    if (globalFilter) {
      const searchTerm = globalFilter.toLowerCase()
      filtered = filtered.filter(intervention => 
        intervention.code.toLowerCase().includes(searchTerm) ||
        intervention.description.toLowerCase().includes(searchTerm) ||
        intervention.client.toLowerCase().includes(searchTerm) ||
        (intervention.notes && intervention.notes.toLowerCase().includes(searchTerm))
      )
    }

    // Filtro stato
    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter(intervention => intervention.status === statusFilter)
    }

    // Filtro dipendente
    if (employeeFilter && employeeFilter !== "all") {
      filtered = filtered.filter(intervention => intervention.employee === employeeFilter)
    }

    // Filtro urgenza
    if (urgencyFilter && urgencyFilter !== "all") {
      if (urgencyFilter === "urgent") {
        filtered = filtered.filter(intervention => intervention.urgent)
      } else if (urgencyFilter === "normal") {
        filtered = filtered.filter(intervention => !intervention.urgent)
      }
    }

    // Filtro attività
    if (activityFilter && activityFilter !== "all") {
      filtered = filtered.filter(intervention => intervention.activity === activityFilter)
    }

    // Filtro cliente
    if (clientFilter && clientFilter !== "all") {
      filtered = filtered.filter(intervention => intervention.client === clientFilter)
    }

    // Filtro data inizio
    if (dateFromFilter) {
      filtered = filtered.filter(intervention => intervention.startDate >= dateFromFilter)
    }

    // Filtro data fine
    if (dateToFilter) {
      filtered = filtered.filter(intervention => intervention.startDate <= dateToFilter)
    }

    return filtered
  }, [globalFilter, statusFilter, employeeFilter, urgencyFilter, activityFilter, clientFilter, dateFromFilter, dateToFilter])

  const handleEditIntervention = (intervention: Intervention) => {
    setEditingIntervention(intervention)
  }

  const handleDeleteIntervention = (intervention: Intervention) => {
    setDeletingIntervention(intervention)
  }

  const confirmDelete = () => {
    if (deletingIntervention) {
      console.log("Eliminando intervento:", deletingIntervention.code)
      // Qui implementeresti l'eliminazione reale
      setDeletingIntervention(null)
    }
  }

  const columns: ColumnDef<Intervention>[] = [
  {
    accessorKey: "code",
    header: () => (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 flex-shrink-0"></div>
        <span>ID</span>
      </div>
    ),
    cell: ({ row }) => {
      const intervention = row.original
      return (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full flex-shrink-0">
            {intervention.urgent && <div className="w-2 h-2 rounded-full bg-red-500" />}
          </div>
          <div className="font-mono text-sm text-muted-foreground">{row.getValue("code")}</div>
        </div>
      )
    },
    size: 120,
  },
  {
    accessorKey: "description",
    header: "Descrizione",
    cell: ({ row }) => {
      const intervention = row.original
      return (
        <div className="flex items-center gap-2">
          <Pill variant="default" size="sm" className="flex-shrink-0">
            {intervention.activity}
          </Pill>
          <div className="font-medium truncate">{row.getValue("description")}</div>
        </div>
      )
    },
    size: 350,
  },
  {
    accessorKey: "client",
    header: "Cliente",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("client")}</div>
    ),
    size: 180,
  },
  {
    accessorKey: "status",
    header: "Stato",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const statusConfig: Record<string, { variant: "success" | "warning" | "info" | "error" | "default", color: string }> = {
        "Completato": { variant: "success", color: "bg-green-500" },
        "In corso": { variant: "warning", color: "bg-yellow-500" },
        "Programmato": { variant: "info", color: "bg-blue-500" },
        "Sospeso": { variant: "error", color: "bg-red-500" }
      }
      const config = statusConfig[status] || { variant: "default", color: "bg-gray-500" }
      
      return (
        <Pill variant={config.variant} size="sm" status statusColor={config.color}>
          {status}
        </Pill>
      )
    },
    size: 120,
  },
  {
    accessorKey: "employee",
    header: "Dipendente",
    cell: ({ row }) => {
      const employee = row.getValue("employee") as string
      const getAvatarColor = (name: string) => {
        const colors = [
          "bg-blue-600", "bg-green-600", "bg-purple-600", "bg-orange-600", 
          "bg-pink-600", "bg-indigo-600", "bg-teal-600", "bg-red-600"
        ]
        const index = name.length % colors.length
        return colors[index]
      }
      
      return (
        <Pill 
          variant="default" 
          size="sm"
          avatar={
            <Avatar className="w-5 h-5">
              <AvatarFallback className={`text-xs text-white font-medium ${getAvatarColor(employee)}`}>
                {employee.split(" ").map(n => n.charAt(0)).join("").toUpperCase()}
              </AvatarFallback>
            </Avatar>
          }
        >
          {employee}
        </Pill>
      )
    },
    size: 150,
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
    size: 110,
  },
  {
    accessorKey: "duration",
    header: "Durata",
    cell: ({ row }) => (
      <div className="text-sm font-mono">{row.getValue("duration")}</div>
    ),
    size: 100,
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
          <DropdownMenuItem onClick={() => handleEditIntervention(row.original)}>
            <Edit className="h-4 w-4 mr-2" />
            Modifica
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="text-destructive"
            onClick={() => handleDeleteIntervention(row.original)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Elimina
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    size: 80,
  },
]

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
              placeholder="Cerca per codice, descrizione, cliente o note..."
              className="pl-10"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder={statusFilter === "all" ? "Tutti gli stati" : statusFilter} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti gli stati</SelectItem>
              <SelectItem value="In corso">In corso</SelectItem>
              <SelectItem value="Completato">Completato</SelectItem>
              <SelectItem value="Programmato">Programmato</SelectItem>
              <SelectItem value="Sospeso">Sospeso</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder={urgencyFilter === "all" ? "Urgenza" : urgencyFilter === "urgent" ? "Urgenti" : "Normali"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutte urgenze</SelectItem>
              <SelectItem value="urgent">Solo urgenti</SelectItem>
              <SelectItem value="normal">Solo normali</SelectItem>
            </SelectContent>
          </Select>

          <Select value={activityFilter} onValueChange={setActivityFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder={activityFilter === "all" ? "Tutte attività" : activityFilter} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutte le attività</SelectItem>
              <SelectItem value="Installazione">Installazione</SelectItem>
              <SelectItem value="Manutenzione">Manutenzione</SelectItem>
              <SelectItem value="Riparazione">Riparazione</SelectItem>
              <SelectItem value="Consulenza">Consulenza</SelectItem>
            </SelectContent>
          </Select>

          <Select value={clientFilter} onValueChange={setClientFilter}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder={clientFilter === "all" ? "Tutti i clienti" : clientFilter} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti i clienti</SelectItem>
              <SelectItem value="Azienda ABC S.r.l.">Azienda ABC S.r.l.</SelectItem>
              <SelectItem value="Studio Legale XYZ">Studio Legale XYZ</SelectItem>
              <SelectItem value="Farmacia Centrale">Farmacia Centrale</SelectItem>
              <SelectItem value="Negozio Elettronica">Negozio Elettronica</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={employeeFilter === "all" ? "Tutti dipendenti" : employeeFilter} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti i dipendenti</SelectItem>
              <SelectItem value="Mario Rossi">Mario Rossi</SelectItem>
              <SelectItem value="Luigi Verdi">Luigi Verdi</SelectItem>
              <SelectItem value="Anna Bianchi">Anna Bianchi</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="date"
            placeholder="Data da"
            value={dateFromFilter}
            onChange={(e) => setDateFromFilter(e.target.value)}
            className="w-36"
          />

          <Input
            type="date"
            placeholder="Data a"
            value={dateToFilter}
            onChange={(e) => setDateToFilter(e.target.value)}
            className="w-36"
          />
          
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
          data={filteredData}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingIntervention} onOpenChange={() => setDeletingIntervention(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Conferma Eliminazione</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler eliminare l'intervento <strong>{deletingIntervention?.code}</strong>?
              <br />
              <span className="text-sm text-muted-foreground mt-2 block">
                {deletingIntervention?.description}
              </span>
              <br />
              Questa azione non può essere annullata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Modal - For now just shows console log */}
      {editingIntervention && (
        <AlertDialog open={!!editingIntervention} onOpenChange={() => setEditingIntervention(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Modifica Intervento</AlertDialogTitle>
              <AlertDialogDescription>
                Modifica dell'intervento <strong>{editingIntervention.code}</strong>
                <br />
                <span className="text-sm text-muted-foreground mt-2 block">
                  Funzionalità in sviluppo - per ora mostra solo un messaggio in console
                </span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Chiudi</AlertDialogCancel>
              <AlertDialogAction onClick={() => {
                console.log("Modifica intervento:", editingIntervention)
                setEditingIntervention(null)
              }}>
                Conferma (Demo)
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </LayoutNew>
  )
}