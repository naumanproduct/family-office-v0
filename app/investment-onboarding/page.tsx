"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { InvestmentOnboardingKanban } from "@/components/investment-onboarding-kanban"
import { WorkflowHeader } from "@/components/workflows/workflow-header"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"

export default function InvestmentOnboardingPage() {
  const [workflowConfig, setWorkflowConfig] = React.useState({
    name: "Investment Onboarding",
    description: "Operationalize new investments from approval to system entry",
    objectType: "investment",
    attributes: [
      { id: "investmentName", name: "Investment", type: "text" },
      { id: "fundManager", name: "Fund Manager", type: "text" },
      { id: "commitmentAmount", name: "Commitment", type: "currency" },
      { id: "investmentType", name: "Type", type: "text" },
      { id: "leadPartner", name: "Lead Partner", type: "user" },
      { id: "targetCloseDate", name: "Target Close", type: "date" },
      { id: "status", name: "Status", type: "text" },
    ],
    stages: [
      { id: "legal-setup", name: "Legal Setup", color: "bg-gray-100" },
      { id: "wire-sent", name: "Wire Sent", color: "bg-blue-100" },
      { id: "document-filing", name: "Document Filing", color: "bg-yellow-100" },
      { id: "system-entry", name: "System Entry", color: "bg-purple-100" },
      { id: "final-confirmation", name: "Final Confirmation", color: "bg-green-100" },
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
                  <BreadcrumbPage>Investment Onboarding</BreadcrumbPage>
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
                    <h1 className="text-2xl font-semibold">Investment Onboarding</h1>
                    <p className="text-muted-foreground">Operationalize new investments from approval to system entry</p>
                  </div>
                  <WorkflowHeader
                    workflowName="Investment Onboarding"
                    workflowConfig={workflowConfig}
                    onSave={handleSaveWorkflow}
                  />
                </div>
                <InvestmentOnboardingKanban workflowConfig={workflowConfig} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 