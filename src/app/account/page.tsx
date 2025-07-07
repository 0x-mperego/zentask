"use client"

import { LayoutNew } from "@/components/layout-new"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { FileUpload } from "@/components/file-upload"
import { User, Lock } from "lucide-react"

export default function AccountPage() {
  return (
    <LayoutNew>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Account</h1>
          <p className="text-muted-foreground">
            Gestisci le informazioni del tuo profilo personale
          </p>
        </div>

        <div className="grid gap-6 max-w-2xl">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informazioni Profilo
              </CardTitle>
              <CardDescription>
                Modifica le tue informazioni personali
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nome</Label>
                  <Input 
                    id="firstName" 
                    defaultValue="Mario" 
                    placeholder="Il tuo nome" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Cognome</Label>
                  <Input 
                    id="lastName" 
                    defaultValue="Rossi" 
                    placeholder="Il tuo cognome" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  defaultValue="mario.rossi@zentask.it" 
                  placeholder="La tua email" 
                />
              </div>

              <div className="space-y-2">
                <Label>Foto Profilo</Label>
                <FileUpload
                  accept="image/*"
                  multiple={false}
                  maxFiles={1}
                  placeholder={{
                    title: "Carica la tua foto profilo",
                    description: "Formato supportato: PNG, JPG (max 1MB)"
                  }}
                />
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button>Salva Modifiche</Button>
              </div>
            </CardContent>
          </Card>

          {/* Password Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Sicurezza
              </CardTitle>
              <CardDescription>
                Cambia la tua password per mantenere l'account sicuro
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Password Attuale</Label>
                <Input 
                  id="currentPassword" 
                  type="password"
                  placeholder="Inserisci la password attuale" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nuova Password</Label>
                  <Input 
                    id="newPassword" 
                    type="password"
                    placeholder="Inserisci nuova password" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Conferma Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password"
                    placeholder="Conferma nuova password" 
                  />
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button>Cambia Password</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </LayoutNew>
  )
}