"use client"

import { LayoutNew } from "@/components/layout-new"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { FileUpload } from "@/components/file-upload"
import { Building2 } from "lucide-react"

// Mock user role - in real app this would come from authentication context
const currentUserRole = "admin" // or "operatore"

export default function SettingsPage() {
  // Only show company settings for admin users
  if (currentUserRole !== "admin" && currentUserRole !== "super_admin") {
    return (
      <LayoutNew>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Impostazioni</h1>
            <p className="text-muted-foreground">
              Non hai i permessi per accedere alle impostazioni aziendali
            </p>
          </div>
          
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">Accesso Limitato</h3>
                <p className="text-sm text-muted-foreground">
                  Solo gli amministratori possono modificare le impostazioni aziendali.
                  Per modificare le tue informazioni personali, vai alla sezione Account.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </LayoutNew>
    )
  }

  return (
    <LayoutNew>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Impostazioni Azienda</h1>
          <p className="text-muted-foreground">
            Configura le impostazioni dell&apos;azienda
          </p>
        </div>

        <div className="grid gap-6 max-w-2xl">
          {/* Company Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Informazioni Azienda
              </CardTitle>
              <CardDescription>
                Configura le informazioni della tua azienda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nome Azienda</Label>
                  <Input 
                    id="companyName" 
                    defaultValue="ZenTask S.r.l." 
                    placeholder="Nome della tua azienda" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="interventionPrefix">Prefisso Interventi</Label>
                  <Input 
                    id="interventionPrefix" 
                    defaultValue="INT" 
                    placeholder="es. INT, WO, TIC" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyDescription">Descrizione</Label>
                <Textarea 
                  id="companyDescription"
                  placeholder="Descrizione della tua azienda"
                  defaultValue="Azienda specializzata in servizi IT e assistenza tecnica"
                />
              </div>

              <div className="space-y-2">
                <Label>Logo Azienda</Label>
                <FileUpload
                  accept="image/*"
                  maxFiles={1}
                  maxSize={2 * 1024 * 1024} // 2MB
                />
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button>Salva Impostazioni</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </LayoutNew>
  )
}