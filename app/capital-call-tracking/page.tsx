"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { CapitalCallKanban } from "@/components/capital-call-kanban"
import { WorkflowHeader } from "@/components/workflows/workflow-header"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"

export default function CapitalCallTrackingPage() {
  const [workflowConfig, setWorkflowConfig] = React.useState({
    name: "Capital Call Tracking",
    description: "Track and manage capital call processes",
    objectType: "capital-call",
    attributes: [
      { id: "fundName", name: "Fund Name", type: "text" },
      { id: "callAmount", name: "Call Amount", type: "currency" },
      { id: "investor", name: "Investor", type: "text" },
      { id: "dueDate", name: "Due Date", type: "date" },
      { id: "noticeDate", name: "Notice Date", type: "date" },
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
                  <BreadcrumbPage>Capital Call Tracking</BreadcrumbPage>
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
                    <h1 className="text-2xl font-semibold">Capital Call Tracking</h1>
                    <p className="text-muted-foreground">Manage and track your capital call processes</p>
                  </div>
                  <WorkflowHeader
                    workflowName="Capital Call Tracking"
                    workflowConfig={workflowConfig}
                    onSave={handleSaveWorkflow}
                  />
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
