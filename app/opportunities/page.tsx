"use client"

import * as React from "react"
import { AppSidebar } from "../../components/app-sidebar"
import { SiteHeader } from "../../components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { OpportunitiesView } from "../../components/opportunities-view"
import { SectionCards } from "../../components/section-cards"
import { ChartAreaInteractive } from "../../components/chart-area-interactive"
import { AddWorkflowItemDrawer } from "@/components/workflows/add-workflow-item-drawer"

export default function OpportunitiesPage() {
  const handleAddOpportunity = (data: any) => {
    console.log("New opportunity added:", data)
    // Here you would typically update your state or make an API call
  }

  // Custom fields for the Opportunities workflow
  const opportunityFields = [
    { id: "status", name: "Status", type: "select" as const, options: ["Active", "On Hold", "Closed Won", "Closed Lost"], required: true },
    { id: "dealSize", name: "Deal Size", type: "text" as const, required: true },
    { id: "expectedCloseDate", name: "Expected Close Date", type: "date" as const },
    { id: "probability", name: "Probability", type: "select" as const, options: ["Low", "Medium", "High"], required: true },
    { id: "notes", name: "Notes", type: "textarea" as const },
  ]

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards viewType="assets" />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <div className="px-4 lg:px-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-semibold">Opportunities</h1>
                    <p className="text-muted-foreground">Manage your investment opportunities and deal pipeline</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <AddWorkflowItemDrawer 
                      workflowType="Opportunity" 
                      onAddItem={handleAddOpportunity}
                      customFields={opportunityFields}
                    />
                  </div>
                </div>
                <OpportunitiesView />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
