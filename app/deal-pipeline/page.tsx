"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarProvider } from "@/components/ui/sidebar"
import { DealPipelineKanban } from "@/components/deal-pipeline-kanban"
import { WorkflowHeader } from "@/components/workflows/workflow-header"

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
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <SiteHeader />
          <main className="flex-1 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Deal Pipeline</h1>
                <p className="text-gray-600 mt-1">Track investment opportunities through the deal process</p>
              </div>
              <WorkflowHeader
                workflowName="Deal Pipeline"
                workflowConfig={workflowConfig}
                onSave={handleSaveWorkflow}
              />
            </div>
            <DealPipelineKanban workflowConfig={workflowConfig} />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
