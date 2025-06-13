"use client"

import * as React from "react"
import { AppSidebar } from "../../components/app-sidebar"
import { SiteHeader } from "../../components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TaxDocumentKanban } from "../../components/tax-document-kanban"
import { WorkflowHeader } from "../../components/workflows/workflow-header"

export default function TaxDocumentCollectionPage() {
  const [workflowConfig, setWorkflowConfig] = React.useState({
    name: "Tax Document Collection & Filing",
    description: "Track and manage tax document requests, submissions, and filings",
    objectType: "tax-document",
    attributes: [
      { id: "documentName", name: "Document Name", type: "text" },
      { id: "entityName", name: "Entity", type: "relation" },
      { id: "documentType", name: "Type", type: "text" },
      { id: "dueDate", name: "Due Date", type: "date" },
      { id: "assignedTo", name: "Assigned To", type: "user" },
      { id: "taxYear", name: "Tax Year", type: "text" },
    ],
    stages: [
      { id: "requested", name: "Requested", color: "bg-gray-100" },
      { id: "pending", name: "Pending", color: "bg-blue-100" },
      { id: "received", name: "Received", color: "bg-yellow-100" },
      { id: "reviewed", name: "Reviewed", color: "bg-purple-100" },
      { id: "filed", name: "Filed", color: "bg-green-100" },
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
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-semibold">Tax Document Collection</h1>
                    <p className="text-muted-foreground">Track and manage tax document requests and submissions</p>
                  </div>
                  <WorkflowHeader
                    workflowName="Tax Document Collection & Filing"
                    workflowConfig={workflowConfig}
                    onSave={handleSaveWorkflow}
                  />
                </div>
                <TaxDocumentKanban workflowConfig={workflowConfig} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
