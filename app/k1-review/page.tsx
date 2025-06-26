"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { K1ReviewKanban } from "@/components/k1-review-kanban"
import { WorkflowHeader } from "@/components/workflows/workflow-header"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"

export default function K1ReviewPage() {
  const [workflowConfig, setWorkflowConfig] = React.useState({
    name: "K-1 Review & Tax Documents",
    description: "Track and process tax documents including K-1s and 1099s",
    objectType: "document",
    attributes: [
      { id: "documentName", name: "Document", type: "text" },
      { id: "entityName", name: "Entity", type: "text" },
      { id: "taxYear", name: "Tax Year", type: "text" },
      { id: "documentType", name: "Type", type: "text" },
      { id: "receivedDate", name: "Received", type: "date" },
      { id: "reviewer", name: "Reviewer", type: "user" },
      { id: "dueDate", name: "Due Date", type: "date" },
    ],
    stages: [
      { id: "received", name: "Received", color: "bg-gray-100" },
      { id: "under-review", name: "Under Review", color: "bg-blue-100" },
      { id: "filed", name: "Filed", color: "bg-purple-100" },
      { id: "sent-to-cpa", name: "Sent to CPA", color: "bg-green-100" },
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
                  <BreadcrumbPage>K-1 Review & Tax Documents</BreadcrumbPage>
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
                    <h1 className="text-2xl font-semibold">K-1 Review & Tax Documents</h1>
                    <p className="text-muted-foreground">Track and process tax documents including K-1s and 1099s</p>
                  </div>
                  <WorkflowHeader
                    workflowName="K-1 Review & Tax Documents"
                    workflowConfig={workflowConfig}
                    onSave={handleSaveWorkflow}
                  />
                </div>
                <K1ReviewKanban workflowConfig={workflowConfig} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 