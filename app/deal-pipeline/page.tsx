"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { DealPipelineKanban } from "@/components/deal-pipeline-kanban"
import { WorkflowHeader } from "@/components/workflows/workflow-header"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"

export default function DealPipelinePage() {
  const [workflowConfig, setWorkflowConfig] = React.useState({
    name: "Deal Pipeline",
    description: "Track investment opportunities through the deal process",
    objectType: "opportunity",
    attributes: [
      { id: "companyName", name: "Company", type: "text" },
      { id: "fundingRound", name: "Funding Round", type: "text" },
      { id: "targetRaise", name: "Target Raise", type: "currency" },
      { id: "owner", name: "Owner", type: "user" },
      { id: "nextMeeting", name: "Next Meeting", type: "date" },
    ],
    stages: [
      { id: "awareness", name: "Awareness", color: "bg-gray-100" },
      { id: "initial-contact", name: "Initial Contact", color: "bg-blue-100" },
      { id: "work-in-progress", name: "Work in Progress", color: "bg-yellow-100" },
      { id: "term-sheet", name: "Term Sheet", color: "bg-purple-100" },
      { id: "due-diligence", name: "Due Diligence", color: "bg-orange-100" },
      { id: "invested", name: "Invested", color: "bg-green-100" },
      { id: "passed", name: "Passed", color: "bg-red-100" },
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
                  <BreadcrumbPage>Deal Pipeline</BreadcrumbPage>
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
                    <h1 className="text-2xl font-semibold">Deal Pipeline</h1>
                    <p className="text-muted-foreground">Track investment opportunities through the deal process</p>
                  </div>
                  <WorkflowHeader
                    workflowName="Deal Pipeline"
                    workflowConfig={workflowConfig}
                    onSave={handleSaveWorkflow}
                  />
                </div>
                <DealPipelineKanban workflowConfig={workflowConfig} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
