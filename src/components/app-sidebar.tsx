"use client"

import * as React from "react"
import {
  ClipboardList,
  Building2,
  Activity,
  BarChart3,
  Users2,
  Settings,
  Home,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// ZenTask data
const data = {
  user: {
    name: "Mario Rossi",
    email: "mario.rossi@zentask.it",
    avatar: "/placeholder-avatar.jpg",
  },
  teams: [
    {
      name: "ZenTask",
      logo: ClipboardList,
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
    },
    {
      title: "Interventi",
      url: "/interventions",
      icon: ClipboardList,
    },
    {
      title: "Clienti",
      url: "/clients",
      icon: Building2,
    },
    {
      title: "Attività",
      url: "/activities",
      icon: Activity,
    },
    {
      title: "Stati",
      url: "/states",
      icon: BarChart3,
    },
    {
      title: "Utenti",
      url: "/users",
      icon: Users2,
    },
    {
      title: "Impostazioni",
      url: "/settings",
      icon: Settings,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
