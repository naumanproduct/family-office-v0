"use client"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { TaxDocumentKanban } from "@/components/tax-document-kanban"

export default function TaxDocumentCollectionPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Tax Document Collection</h1>
              <p className="text-muted-foreground">
                Manage tax document collection workflow and track submission status
              </p>
            </div>
          </div>
          <TaxDocumentKanban />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
