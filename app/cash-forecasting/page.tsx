"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { CashForecastingKanban } from "@/components/cash-forecasting-kanban"
import { WorkflowHeader } from "@/components/workflows/workflow-header"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"

export default function CashForecastingPage() {
  const [workflowConfig, setWorkflowConfig] = React.useState({
    name: "Cash Forecasting & Liquidity",
    description: "Monthly/quarterly cash flow projections and liquidity management",
    objectType: "forecast",
    attributes: [
      { id: "entityName", name: "Entity", type: "text" },
      { id: "period", name: "Period", type: "text" },
      { id: "preparedBy", name: "Prepared By", type: "user" },
      { id: "cashBalance", name: "Starting Cash", type: "currency" },
      { id: "projectedInflows", name: "Projected Inflows", type: "currency" },
      { id: "projectedOutflows", name: "Projected Outflows", type: "currency" },
      { id: "dueDate", name: "Due Date", type: "date" },
    ],
    stages: [
      { id: "entity-review", name: "Entity Review", color: "bg-gray-100" },
      { id: "projections-drafted", name: "Projections Drafted", color: "bg-blue-100" },
      { id: "reconciled", name: "Reconciled", color: "bg-purple-100" },
      { id: "approved", name: "Approved", color: "bg-green-100" },
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
                  <BreadcrumbPage>Cash Forecasting & Liquidity</BreadcrumbPage>
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
                    <h1 className="text-2xl font-semibold">Cash Forecasting & Liquidity</h1>
                    <p className="text-muted-foreground">Monthly/quarterly cash flow projections and liquidity management</p>
                  </div>
                  <WorkflowHeader
                    workflowName="Cash Forecasting & Liquidity"
                    workflowConfig={workflowConfig}
                    onSave={handleSaveWorkflow}
                  />
                </div>
                <CashForecastingKanban workflowConfig={workflowConfig} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 