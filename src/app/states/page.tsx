"use client"

import { LayoutNew } from "@/components/layout-new"
import { DataTable } from "@/components/data-table"
import { FilterToolbar } from "@/components/filter-toolbar"
import { FormSheet } from "@/components/form-sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ColumnDef } from "@tanstack/react-table"
import { Plus, BarChart3 } from "lucide-react"

interface StateType {
  id: string
  name: string
  color: string
}

const mockData: StateType[] = [
  {
    id: "1",
    name: "Nuovo",
    color: "#3b82f6",
  },
  {
    id: "2", 
    name: "In corso",
    color: "#f59e0b",
  },
  {
    id: "3",
    name: "Completato",
    color: "#10b981",
  },
  {
    id: "4",
    name: "Sospeso",
    color: "#ef4444",
  }
]

const columns: ColumnDef<StateType>[] = [
  {
    accessorKey: "name",
    header: "Nome Stato",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "color",
    header: "Colore",
    cell: ({ row }) => {
      const color = row.getValue("color") as string
      const name = row.getValue("name") as string
      return (
        <div className="flex items-center gap-2">
          <div 
            className="h-4 w-4 rounded-full border" 
            style={{ backgroundColor: color }}
          />
          <Badge 
            variant="outline" 
            style={{ 
              borderColor: color, 
              color: color,
              backgroundColor: `${color}10`
            }}
          >
            {name}
          </Badge>
        </div>
      )
    },
  },
]

export default function StatesPage() {
  return (
    <LayoutNew>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Stati</h1>
            <p className="text-muted-foreground">
              Gestisci gli stati disponibili per gli interventi
            </p>
          </div>
          
          <FormSheet
            title="Nuovo Stato"
            description="Aggiungi un nuovo stato per gli interventi"
            trigger={
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nuovo Stato
              </Button>
            }
            onSubmit={async (e) => {
              console.log("Form submitted")
            }}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Stato *</Label>
                <Input placeholder="Inserisci nome stato" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Colore *</Label>
                <div className="flex gap-2">
                  <Input 
                    type="color" 
                    className="w-16 h-10 p-1 border rounded" 
                    defaultValue="#3b82f6"
                  />
                  <Input 
                    placeholder="#3b82f6" 
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </FormSheet>
        </div>

        {/* Filters */}
        <FilterToolbar
          searchPlaceholder="Cerca per nome stato..."
          onExport={() => console.log("Export clicked")}
        />

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={mockData}
          emptyState={{
            title: "Nessuno stato trovato",
            description: "Inizia aggiungendo il tuo primo stato",
            icon: <BarChart3 className="h-12 w-12" />,
          }}
          mobileCardRender={(state) => (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div 
                  className="h-4 w-4 rounded-full border" 
                  style={{ backgroundColor: state.color }}
                />
                <span className="font-medium">{state.name}</span>
              </div>
              <Badge 
                variant="outline" 
                style={{ 
                  borderColor: state.color, 
                  color: state.color,
                  backgroundColor: `${state.color}10`
                }}
              >
                {state.name}
              </Badge>
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