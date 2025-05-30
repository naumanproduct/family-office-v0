"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarProvider } from "@/components/ui/sidebar"
import { CapitalCallKanban } from "@/components/capital-call-kanban"
import { WorkflowHeader } from "@/components/workflows/workflow-header"

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
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <SiteHeader />
          <main className="flex-1 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Capital Call Tracking</h1>
                <p className="text-gray-600 mt-1">Manage and track your capital call processes</p>
              </div>
              <WorkflowHeader
                workflowName="Capital Call Tracking"
                workflowConfig={workflowConfig}
                onSave={handleSaveWorkflow}
              />
            </div>
            <CapitalCallKanban workflowConfig={workflowConfig} />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
