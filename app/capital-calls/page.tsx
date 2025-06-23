"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { CapitalCallKanban } from "@/components/capital-call-kanban"
import { WorkflowHeader } from "@/components/workflows/workflow-header"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"

export default function CapitalCallsPage() {
  const [workflowConfig, setWorkflowConfig] = React.useState({
    name: "Capital Calls",
    description: "Track and manage capital call notices across funds and investors",
    objectType: "capitalCall",
    attributes: [
      { id: "fundName", name: "Fund", type: "text" },
      { id: "callNumber", name: "Call #", type: "text" },
      { id: "callAmount", name: "Call Amount", type: "currency" },
      { id: "investor", name: "Investor", type: "text" },
      { id: "dueDate", name: "Due Date", type: "date" },
    ],
    stages: [
      { id: "new", name: "New", color: "bg-gray-100" },
      { id: "in-progress", name: "In Progress", color: "bg-blue-100" },
      { id: "done", name: "Done", color: "bg-green-100" },
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
                  <BreadcrumbPage>Capital Calls</BreadcrumbPage>
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
                    <h1 className="text-2xl font-semibold">Capital Calls</h1>
                    <p className="text-muted-foreground">Track and manage capital call notices across funds and investors</p>
                  </div>
                  <WorkflowHeader workflowName="Capital Calls" workflowConfig={workflowConfig} onSave={handleSaveWorkflow} />
                </div>
                <CapitalCallKanban workflowConfig={workflowConfig} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 