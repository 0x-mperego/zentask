"use client"

import { LayoutNew } from "@/components/layout-new"
import { DataTable } from "@/components/data-table-old"
import { FilterToolbar } from "@/components/filter-toolbar"
import { FormSheet } from "@/components/form-sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ColumnDef } from "@tanstack/react-table"
import { Plus, Activity } from "lucide-react"

interface ActivityType {
  id: string
  name: string
}

const mockData: ActivityType[] = [
  {
    id: "1",
    name: "Installazione",
  },
  {
    id: "2", 
    name: "Manutenzione",
  },
  {
    id: "3",
    name: "Riparazione",
  }
]

const columns: ColumnDef<ActivityType>[] = [
  {
    accessorKey: "name",
    header: "Nome Attività",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
]

export default function ActivitiesPage() {
  return (
    <LayoutNew>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Attività</h1>
            <p className="text-muted-foreground">
              Gestisci i tipi di attività disponibili
            </p>
          </div>
          
          <FormSheet
            title="Nuova Attività"
            description="Aggiungi una nuova tipologia di attività"
            trigger={
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nuova Attività
              </Button>
            }
            onSubmit={async (e) => {
              console.log("Form submitted")
            }}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Attività *</Label>
                <Input placeholder="Inserisci nome attività" />
              </div>
            </div>
          </FormSheet>
        </div>

        {/* Filters */}
        <FilterToolbar
          searchPlaceholder="Cerca per nome attività..."
          onExport={() => console.log("Export clicked")}
        />

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={mockData}
          emptyState={{
            title: "Nessuna attività trovata",
            description: "Inizia aggiungendo la tua prima attività",
            icon: <Activity className="h-12 w-12" />,
          }}
          mobileCardRender={(activity) => (
            <div className="space-y-2">
              <span className="font-medium">{activity.name}</span>
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