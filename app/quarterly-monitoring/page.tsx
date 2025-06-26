"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { QuarterlyMonitoringKanban } from "@/components/quarterly-monitoring-kanban"
import { WorkflowHeader } from "@/components/workflows/workflow-header"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"

export default function QuarterlyMonitoringPage() {
  const [workflowConfig, setWorkflowConfig] = React.useState({
    name: "Quarterly Monitoring",
    description: "Standardize quarterly review and documentation across asset classes",
    objectType: "investment",
    attributes: [
      { id: "investmentName", name: "Investment", type: "text" },
      { id: "fundManager", name: "Fund Manager", type: "text" },
      { id: "assetClass", name: "Asset Class", type: "text" },
      { id: "quarter", name: "Quarter", type: "text" },
      { id: "dueDate", name: "Due Date", type: "date" },
      { id: "analyst", name: "Analyst", type: "user" },
      { id: "currentNAV", name: "Current NAV", type: "currency" },
    ],
    stages: [
      { id: "to-review", name: "To Review", color: "bg-gray-100" },
      { id: "documents-received", name: "Documents Received", color: "bg-blue-100" },
      { id: "analysis-in-progress", name: "Analysis in Progress", color: "bg-yellow-100" },
      { id: "review-complete", name: "Review Complete", color: "bg-purple-100" },
      { id: "insights-logged", name: "Insights Logged", color: "bg-green-100" },
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
                  <BreadcrumbPage>Quarterly Monitoring</BreadcrumbPage>
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
                    <h1 className="text-2xl font-semibold">Quarterly Monitoring</h1>
                    <p className="text-muted-foreground">Standardize quarterly review and documentation across asset classes</p>
                  </div>
                  <WorkflowHeader
                    workflowName="Quarterly Monitoring"
                    workflowConfig={workflowConfig}
                    onSave={handleSaveWorkflow}
                  />
                </div>
                <QuarterlyMonitoringKanban workflowConfig={workflowConfig} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 