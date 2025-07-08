"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { type DateRange } from "react-day-picker"
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
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Combobox, type ComboboxOption } from "@/components/ui/combobox"
import { InterventionDatePicker } from "@/components/intervention-date-picker"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUpload } from "@/components/file-upload"
import { Plus, MoreHorizontal, ClipboardList, Edit, Trash2, Download, Circle, Clock, CheckCircle2, AlertCircle, Users, Building2, Settings, Zap, CalendarIcon } from "lucide-react"
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
    label: "Completato",
    value: "Completato",
  },
  {
    label: "In corso",
    value: "In corso",
  },
  {
    label: "Programmato",
    value: "Programmato",
  },
  {
    label: "Sospeso",
    value: "Sospeso",
  },
]

const activityComboboxOptions: ComboboxOption[] = [
  {
    label: "Consulenza",
    value: "consulenza",
  },
  {
    label: "Installazione",
    value: "installazione",
  },
  {
    label: "Manutenzione",
    value: "manutenzione",
  },
  {
    label: "Riparazione",
    value: "riparazione",
  },
]

const clientComboboxOptions: ComboboxOption[] = [
  {
    label: "Azienda ABC S.r.l.",
    value: "azienda-abc",
  },
  {
    label: "Studio Legale XYZ",
    value: "studio-xyz",
  },
  {
    label: "Farmacia Centrale",
    value: "farmacia",
  },
  {
    label: "Negozio Elettronica",
    value: "negozio",
  },
]

const employeeSelectOptions = [
  {
    label: "Anna Bianchi",
    value: "anna-bianchi",
  },
  {
    label: "Luigi Verdi",
    value: "luigi-verdi",
  },
  {
    label: "Mario Rossi",
    value: "mario-rossi",
  },
]

const statusSelectOptions = [
  {
    label: "Programmato",
    value: "programmato",
  },
  {
    label: "In corso",
    value: "in-corso",
  },
  {
    label: "Completato",
    value: "completato",
  },
  {
    label: "Sospeso",
    value: "sospeso",
  },
]

const activityOptions: FilterOption[] = [
  {
    label: "Consulenza",
    value: "Consulenza",
  },
  {
    label: "Installazione",
    value: "Installazione",
  },
  {
    label: "Manutenzione",
    value: "Manutenzione",
  },
  {
    label: "Riparazione",
    value: "Riparazione",
  },
]

const clientOptions: FilterOption[] = [
  {
    label: "Azienda ABC S.r.l.",
    value: "Azienda ABC S.r.l.",
  },
  {
    label: "Studio Legale XYZ",
    value: "Studio Legale XYZ",
  },
  {
    label: "Farmacia Centrale",
    value: "Farmacia Centrale",
  },
  {
    label: "Negozio Elettronica",
    value: "Negozio Elettronica",
  },
]

const employeeOptions: FilterOption[] = [
  {
    label: "Anna Bianchi",
    value: "Anna Bianchi",
  },
  {
    label: "Luigi Verdi",
    value: "Luigi Verdi",
  },
  {
    label: "Mario Rossi",
    value: "Mario Rossi",
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
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>()
  const [isUrgent, setIsUrgent] = React.useState(false)
  const [selectedActivity, setSelectedActivity] = React.useState<string>("")
  const [selectedClient, setSelectedClient] = React.useState<string>("")
  const [selectedStatus, setSelectedStatus] = React.useState<string>("")
  const [selectedEmployee, setSelectedEmployee] = React.useState<string>("")

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
            <div className="text-sm">{row.getValue("code")}</div>
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
        variant: "toggle",
        filterIcon: Zap,
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
        filterIcon: Settings,
      },
    },
    {
      accessorKey: "description",
      header: "Descrizione",
      cell: ({ row }) => {
        const intervention = row.original
        
        return (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium bg-transparent">
              {intervention.activity}
            </span>
            <span className="font-medium text-sm truncate">{row.getValue("description")}</span>
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
        <div className="font-medium text-sm">{row.getValue("client")}</div>
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
        filterIcon: Building2,
      },
    },
    {
      accessorKey: "status",
      header: "Stato",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        const intervention = row.original
        
        return (
          <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium bg-transparent">
            {status}
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
        filterIcon: Circle,
      },
    },
    {
      accessorKey: "employee",
      header: "Dipendente",
      cell: ({ row }) => {
        const employee = row.getValue("employee") as string
        
        return (
          <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium bg-transparent">
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
        filterIcon: Users,
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
          <div className="text-sm">{formattedDate}</div>
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
        <div className="text-sm">{row.getValue("duration")}</div>
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
        <div className="flex items-center justify-between px-4">
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
              submitLabel="Crea Intervento"
              cancelLabel="Annulla"
              size="2xl"
              trigger={
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nuovo Intervento
                </Button>
              }
              onSubmit={async (e) => {
                console.log("Form submitted")
                // Qui implementeremo la logica di salvataggio
              }}
            >
            <Tabs defaultValue="dettagli" className="h-full -mx-6">
              <TabsList className="grid w-full grid-cols-2 rounded-none">
                <TabsTrigger value="dettagli" className="rounded-none">Dettagli</TabsTrigger>
                <TabsTrigger value="log" className="rounded-none">Log</TabsTrigger>
              </TabsList>
              
              <TabsContent value="dettagli" className="space-y-6 mt-6 px-6">
                {/* Descrizione */}
                <div className="space-y-2">
                  <Label htmlFor="description">Descrizione *</Label>
                  <Input placeholder="Breve descrizione dell'intervento" className="w-full" />
                </div>

                {/* Attività e Cliente */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="activity">Attività *</Label>
                    <Combobox
                      options={activityComboboxOptions}
                      value={selectedActivity}
                      onValueChange={setSelectedActivity}
                      placeholder="Seleziona attività"
                      searchPlaceholder="Cerca attività..."
                      emptyMessage="Nessuna attività trovata."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="client">Cliente *</Label>
                    <Combobox
                      options={clientComboboxOptions}
                      value={selectedClient}
                      onValueChange={setSelectedClient}
                      placeholder="Seleziona cliente"
                      searchPlaceholder="Cerca cliente..."
                      emptyMessage="Nessun cliente trovato."
                    />
                  </div>
                </div>

                {/* Stato e Dipendente */}
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="space-y-2">
                    <Label htmlFor="status">Stato *</Label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleziona stato" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusSelectOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employee">Dipendente *</Label>
                    <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleziona dipendente" />
                      </SelectTrigger>
                      <SelectContent>
                        {employeeSelectOptions.map((employee) => (
                          <SelectItem key={employee.value} value={employee.value}>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {employee.label.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              {employee.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Urgenza */}
                <Card className="w-full">
                  <CardContent style={{ padding: '16px' }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">!</span>
                        </div>
                        <Label htmlFor="urgent" className="text-sm font-medium">
                          Urgente
                        </Label>
                      </div>
                      <Switch
                        id="urgent"
                        checked={isUrgent}
                        onCheckedChange={setIsUrgent}
                        className="urgency-switch"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Date Intervento */}
                <div className="space-y-2">
                  <Label>Date Intervento *</Label>
                  <InterventionDatePicker 
                    value={dateRange}
                    onChange={setDateRange}
                    placeholder="Seleziona date"
                  />
                </div>
                
                {/* Durata */}
                <div className="space-y-2">
                  <Label>Durata</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hours" className="text-sm text-muted-foreground">Ore</Label>
                      <Input type="number" min="0" max="23" defaultValue="0" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minutes" className="text-sm text-muted-foreground">Minuti</Label>
                      <Input type="number" min="0" max="59" defaultValue="0" />
                    </div>
                  </div>
                </div>

                {/* Note */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Note</Label>
                  <Textarea 
                    placeholder="Note aggiuntive, dettagli tecnici o commenti..." 
                    className="min-h-[100px] w-full"
                  />
                </div>

                {/* Allegati */}
                <div className="space-y-2">
                  <Label>Allegati</Label>
                  <FileUpload 
                    maxFiles={5}
                    maxSize={10 * 1024 * 1024}
                    onFilesChange={(files) => console.log("Files uploaded:", files)}
                    className="w-full"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="log" className="space-y-4 mt-6 px-6">
                <div className="text-center text-muted-foreground py-8">
                  <p>Il log degli eventi sarà disponibile dopo la creazione dell&apos;intervento.</p>
                  <p className="text-sm mt-2">Qui verranno mostrati tutti i cambiamenti di stato, note e azioni eseguite.</p>
                </div>
              </TabsContent>
            </Tabs>
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
              Sei sicuro di voler eliminare l&apos;intervento <strong>{deletingIntervention?.code}</strong>?
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
                Modifica dell&apos;intervento <strong>{editingIntervention.code}</strong>
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