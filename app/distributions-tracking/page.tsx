"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { DistributionsTrackingKanban } from "@/components/distributions-tracking-kanban"
import { WorkflowHeader } from "@/components/workflows/workflow-header"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"

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
                  <WorkflowHeader workflowName="Distributions Tracking" workflowConfig={workflowConfig} onSave={handleSaveWorkflow} />
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