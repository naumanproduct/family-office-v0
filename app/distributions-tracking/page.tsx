"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { DistributionsTrackingKanban } from "@/components/distributions-tracking-kanban"
import { WorkflowHeader } from "@/components/workflows/workflow-header"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { AddWorkflowItemDrawer } from "@/components/workflows/add-workflow-item-drawer"

export default function DistributionsTrackingPage() {
  const [workflowConfig, setWorkflowConfig] = React.useState({
    name: "Distributions Tracking",
    description: "Monitor fund distributions and confirmations",
    objectType: "distribution",
    attributes: [
      { id: "fundName", name: "Fund", type: "text" },
      { id: "distributionNumber", name: "Dist #", type: "text" },
      { id: "distributionAmount", name: "Amount", type: "currency" },
      { id: "distributionDate", name: "Date", type: "date" },
      { id: "investor", name: "Investor", type: "text" },
    ],
    stages: [
      { id: "announced", name: "Announced", color: "bg-gray-100" },
      { id: "in-progress", name: "In Progress", color: "bg-blue-100" },
      { id: "sent", name: "Sent", color: "bg-yellow-100" },
      { id: "confirmed", name: "Confirmed", color: "bg-green-100" },
    ],
  })

  const handleSaveWorkflow = (config: any) => {
    setWorkflowConfig(config)
    console.log("Workflow updated:", config)
  }

  const handleAddDistribution = (data: any) => {
    console.log("New distribution added:", data)
    // Here you would typically update your state or make an API call
  }

  // Custom fields for the Distributions workflow
  const distributionFields = [
    { id: "stage", name: "Stage", type: "select" as const, options: workflowConfig.stages.map(s => s.name), required: true },
    { id: "fundName", name: "Fund", type: "text" as const, required: true },
    { id: "distributionNumber", name: "Distribution #", type: "text" as const, required: true },
    { id: "distributionAmount", name: "Amount", type: "text" as const },
    { id: "distributionDate", name: "Date", type: "date" as const },
    { id: "notes", name: "Notes", type: "textarea" as const },
  ]

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center border-b">
          <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Distributions Tracking</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-semibold">Distributions Tracking</h1>
                    <p className="text-muted-foreground">Monitor fund distributions and confirmations</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <AddWorkflowItemDrawer 
                      workflowType="Distribution" 
                      onAddItem={handleAddDistribution}
                      customFields={distributionFields}
                    />
                    <WorkflowHeader 
                      workflowName="Distributions Tracking" 
                      workflowConfig={workflowConfig} 
                      onSave={handleSaveWorkflow} 
                    />
                  </div>
                </div>
                <DistributionsTrackingKanban workflowConfig={workflowConfig} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 