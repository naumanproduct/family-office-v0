"use client"

import * as React from "react"
import { AppSidebar } from "../../components/app-sidebar"
import { SiteHeader } from "../../components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { EntityComplianceKanban } from "../../components/entity-compliance-kanban"
import { WorkflowHeader } from "../../components/workflows/workflow-header"

export default function EntityComplianceLegalPage() {
  const [workflowConfig, setWorkflowConfig] = React.useState({
    name: "Entity Compliance & Legal Tasks",
    description: "Monitor and manage compliance requirements and legal tasks for all entities",
    objectType: "compliance-item",
    attributes: [
      { id: "entityName", name: "Entity Name", type: "relation" },
      { id: "itemType", name: "Item Type", type: "text" },
      { id: "dueDate", name: "Due Date", type: "date" },
      { id: "responsiblePerson", name: "Responsible Person", type: "user" },
      { id: "priority", name: "Priority", type: "text" },
      { id: "jurisdiction", name: "Jurisdiction", type: "text" },
    ],
    stages: [
      { id: "upcoming", name: "Upcoming", color: "bg-blue-100" },
      { id: "in-progress", name: "In Progress", color: "bg-yellow-100" },
      { id: "review", name: "Review", color: "bg-purple-100" },
      { id: "needs-attention", name: "Needs Attention", color: "bg-red-100" },
      { id: "completed", name: "Completed", color: "bg-green-100" },
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
                    <h1 className="text-2xl font-semibold">Entity Compliance & Legal</h1>
                    <p className="text-muted-foreground">Monitor and manage compliance requirements for all entities</p>
                  </div>
                  <WorkflowHeader
                    workflowName="Entity Compliance & Legal Tasks"
                    workflowConfig={workflowConfig}
                    onSave={handleSaveWorkflow}
                  />
                </div>
                <EntityComplianceKanban workflowConfig={workflowConfig} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
