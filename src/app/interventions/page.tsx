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
import { Plus, MoreHorizontal, ClipboardList, Edit, Trash2, Download, Circle, Clock, CheckCircle2, AlertCircle, Users, Building2, Settings, Zap } from "lucide-react"
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
import type { FilterOption } from "@/lib/data-table"

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

// Filter options for faceted filters
const statusOptions: FilterOption[] = [
  {
    label: "In corso",
    value: "In corso",
    icon: Clock,
  },
  {
    label: "Completato",
    value: "Completato",
    icon: CheckCircle2,
  },
  {
    label: "Programmato",
    value: "Programmato",
    icon: Circle,
  },
  {
    label: "Sospeso",
    value: "Sospeso",
    icon: AlertCircle,
  },
]

const urgencyOptions: FilterOption[] = [
  {
    label: "Urgente",
    value: "true",
    icon: Zap,
  },
  {
    label: "Normale",
    value: "false",
    icon: Circle,
  },
]

const activityOptions: FilterOption[] = [
  {
    label: "Installazione",
    value: "Installazione",
    icon: Settings,
  },
  {
    label: "Manutenzione",
    value: "Manutenzione",
    icon: Settings,
  },
  {
    label: "Riparazione",
    value: "Riparazione",
    icon: Settings,
  },
  {
    label: "Consulenza",
    value: "Consulenza",
    icon: Settings,
  },
]

const clientOptions: FilterOption[] = [
  {
    label: "Azienda ABC S.r.l.",
    value: "Azienda ABC S.r.l.",
    icon: Building2,
  },
  {
    label: "Studio Legale XYZ",
    value: "Studio Legale XYZ",
    icon: Building2,
  },
  {
    label: "Farmacia Centrale",
    value: "Farmacia Centrale",
    icon: Building2,
  },
  {
    label: "Negozio Elettronica",
    value: "Negozio Elettronica",
    icon: Building2,
  },
]

const employeeOptions: FilterOption[] = [
  {
    label: "Mario Rossi",
    value: "Mario Rossi",
    icon: Users,
  },
  {
    label: "Luigi Verdi",
    value: "Luigi Verdi",
    icon: Users,
  },
  {
    label: "Anna Bianchi",
    value: "Anna Bianchi",
    icon: Users,
  },
]

export default function InterventionsPage() {
  const [editingIntervention, setEditingIntervention] = React.useState<Intervention | null>(null)
  const [deletingIntervention, setDeletingIntervention] = React.useState<Intervention | null>(null)
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    urgent: false,
    activity: false,
  })
  const [rowSelection, setRowSelection] = React.useState({})

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
            <div className="text-sm text-white">{row.getValue("code")}</div>
          </div>
        )
      },
      size: 120,
      enableGlobalFilter: true,
      meta: {
        label: "ID",
      },
    },
    {
      accessorKey: "urgent",
      header: "Urgenza",
      cell: ({ row }) => null,
      enableColumnFilter: true,
      enableGlobalFilter: false,
      enableHiding: false,
      accessorFn: (row) => row.urgent ? "true" : "false",
      filterFn: (row, id, value) => {
        const isUrgent = row.original.urgent
        const urgentStr = isUrgent ? "true" : "false"
        return value.includes(urgentStr)
      },
      meta: {
        label: "Urgenza",
        variant: "multi-select",
        options: urgencyOptions,
      },
    },
    {
      accessorKey: "activity",
      header: "Attività",
      cell: ({ row }) => null,
      enableColumnFilter: true,
      enableGlobalFilter: false,
      enableHiding: false,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
      meta: {
        label: "Attività",
        variant: "multi-select",
        options: activityOptions,
      },
    },
    {
      accessorKey: "description",
      header: "Descrizione",
      cell: ({ row }) => {
        const intervention = row.original
        
        return (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium text-white bg-transparent">
              {intervention.activity}
            </span>
            <span className="font-medium text-sm truncate text-white">{row.getValue("description")}</span>
          </div>
        )
      },
      size: 400,
      enableGlobalFilter: true,
      meta: {
        label: "Descrizione",
      },
    },
    {
      accessorKey: "client",
      header: "Cliente",
      cell: ({ row }) => (
        <div className="font-medium text-sm text-white">{row.getValue("client")}</div>
      ),
      size: 200,
      enableGlobalFilter: true,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
      meta: {
        label: "Cliente",
        variant: "multi-select",
        options: clientOptions,
      },
    },
    {
      accessorKey: "status",
      header: "Stato",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        const intervention = row.original
        
        return (
          <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium text-white bg-transparent">
            {intervention.urgent && "🔴 "}{status}
          </span>
        )
      },
      size: 120,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
      meta: {
        label: "Stato",
        variant: "multi-select",
        options: statusOptions,
      },
    },
    {
      accessorKey: "employee",
      header: "Dipendente",
      cell: ({ row }) => {
        const employee = row.getValue("employee") as string
        
        return (
          <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium text-white bg-transparent">
            {employee}
          </span>
        )
      },
      size: 150,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
      meta: {
        label: "Dipendente",
        variant: "multi-select",
        options: employeeOptions,
      },
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
          <div className="text-sm text-white">{formattedDate}</div>
        )
      },
      size: 120,
      meta: {
        label: "Data",
      },
    },
    {
      accessorKey: "duration",
      header: "Durata",
      cell: ({ row }) => (
        <div className="text-sm text-white">{row.getValue("duration")}</div>
      ),
      size: 110,
      meta: {
        label: "Durata",
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
      enableHiding: false,
      meta: {
        label: "Azioni",
      },
    },
  ]

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
      columnVisibility: {
        urgent: false,
        activity: false,
      },
    },
  })

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
          
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Esporta
            </Button>
            
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
        </div>

      </div>
      
      {/* Table */}
      <DataTable
        table={table}
        loading={false}
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
              <p>Dipendente: {intervention.employee}</p>
              <p>Durata: {intervention.duration}</p>
            </div>
          </div>
        )}
      >
        <DataTableToolbar 
          table={table} 
          searchPlaceholder="Cerca per codice, descrizione, cliente o note..."
        />
      </DataTable>

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