# ZenTask - Requirements Iniziali

## 📋 Panoramica Progetto

**ZenTask** è una webapp multi-tenant per registrare il tempo impiegato per interventi presso clienti. Integrazione completa con Supabase per dati, autenticazione e storage.

## 🏗️ Stack Tecnico

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Tabelle**: TanStack Table v8
- **Notifiche**: Sonner

## 📊 Modello Dati

### Aziende
**Campi:**
- id, nome, descrizione (opzionale)
- logo_url (opzionale)
- prefisso_interventi (es. "INT", personalizzabile)

### Utenti
**Campi:**
- id (collegato auth.users), nome, cognome
- email, avatar_url (opzionale)
- ruolo (super_admin/admin/operatore)
- azienda_id (null per super_admin)

### Clienti
**Campi:**
- id, nome, tipo (Privato/Azienda)
- telefono, email (opzionale)
- note (opzionale)
- azienda_id

### Attivita
**Campi:**
- id, nome
- azienda_id

### Stati
**Campi:**
- id, nome, colore (hex)
- azienda_id

### Interventi
**Campi:**
- id, codice (formato: PREFISSO-00001)
- descrizione
- attivita_id, cliente_id, stato_id, dipendente_id
- urgente (boolean)
- data_inizio, data_fine (opzionale)
- durata (inserita manualmente)
- note (opzionale)
- azienda_id
- timestamp_creazione (per ordinamento cronologico)

### Allegati
**Campi:**
- id, intervento_id
- url_storage (Supabase Storage)

## 🎯 Funzionalità

### Autenticazione
- Login email/password (Supabase Auth)
- Reset password via email
- Utenti non possono auto-registrarsi
- Admin creano nuovi utenti della propria azienda
- Super Admin gestisce tutte le aziende e crea primi utenti

### Gestione Super Admin
- Creazione e gestione aziende
- Impostazione nome, descrizione, logo, prefisso per ogni azienda
- Creazione primi utenti admin per ogni azienda
- Accesso a tutti i dati di tutte le aziende

### Pagina Principale - Lista Interventi
- Tabella principale dell'app
- Ordinamento cronologico (non ordinabile per colonna)
- Filtri: stato, cliente, attività, dipendente, urgenza, date
- Export Excel con dati filtrati
- Visibilità: operatori vedono solo propri interventi, admin tutti

### Gestione Interventi
- Form creazione/modifica completo
- Upload allegati
- Codice auto-generato con prefisso aziendale
- **Default creazione**: dipendente = utente corrente, data inizio = oggi

### Gestione Clienti
- Lista con ordinamento alfabetico
- Filtri: tipo cliente, ricerca testo

### Gestione Attività
- Lista con ordinamento alfabetico

### Gestione Stati
- Lista con ordinamento alfabetico

### Gestione Utenti (Solo Admin)
- Creazione nuovi utenti
- Modifica dati e password altrui

### Impostazioni Azienda
- Modifica nome, descrizione, logo
- Personalizzazione prefisso interventi

### Gestione Password
- Utenti modificano propria password da pagina account
- Admin possono modificare password altrui

## 🎨 Interfaccia

### Layout
- **Barra Laterale**: collapsed di default (solo icone)
- **Intestazione**: breadcrumb, menu utente, theme toggle
- **Contenuto**: area principale responsive

### Componenti Standardizzati
- **DataTable**: componente riutilizzabile per tutte le liste
- **FormSheet**: componenti standardizzati per tutti i form
- **FilterToolbar**: barra filtri riutilizzabile
- **FileUpload**: componente drag & drop per allegati

### Responsive
- **Desktop**: tabelle complete
- **Mobile**: vista card automatica

## 🔧 Multi-Tenant

### Isolamento Dati
- Row Level Security (RLS) per azienda
- Ogni utente accede solo ai dati della propria azienda

### Permissions
- **Super Admin**: accesso completo a tutte le aziende, gestione aziende
- **Admin**: accesso completo alla propria azienda
- **Operatore**: solo propri interventi e dati condivisi (clienti, attività, stati)

## 📋 Ordinamenti

- **Interventi**: cronologico (più recenti prima)
- **Clienti, Attività, Stati**: alfabetico per nome
- **Utenti**: alfabetico per cognome
- **Tabelle non ordinabili** per colonna dall'utente

## 🚀 Fasi Sviluppo

### Fase 1: Base
1. Setup Supabase e schema database
2. Autenticazione e layout base
3. Lista interventi con filtri

### Fase 2: CRUD
1. Gestione interventi completa
2. Upload allegati
3. Gestione clienti e attività

### Fase 3: Amministrazione
1. Gestione utenti e stati
2. Impostazioni azienda
3. Export Excel

---

*Requirements essenziali per webapp time tracking multi-tenant.*