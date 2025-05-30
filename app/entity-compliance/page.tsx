"use client"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { EntityComplianceKanban } from "@/components/entity-compliance-kanban"

export default function EntityCompliancePage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Entity Compliance</h1>
              <p className="text-muted-foreground">
                Track regulatory compliance requirements and filing deadlines across entities
              </p>
            </div>
          </div>
          <EntityComplianceKanban />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
