"use client"
import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OpportunitiesTable } from "./opportunities-table"
import { OpportunitiesKanban } from "./opportunities-kanban"
import { WorkflowHeader } from "./workflows/workflow-header"

export function OpportunitiesView() {
  const [workflowConfig, setWorkflowConfig] = React.useState({
    name: "Opportunities Pipeline",
    description: "Track and manage investment opportunities",
    objectType: "opportunity",
    attributes: [
      { id: "name", name: "Name", type: "text" },
      { id: "company", name: "Company", type: "relation" },
      { id: "contact", name: "Contact", type: "relation" },
      { id: "amount", name: "Amount", type: "currency" },
      { id: "probability", name: "Probability", type: "number" },
      { id: "expectedClose", name: "Expected Close", type: "date" },
    ],
    stages: [
      { id: "initial-contact", name: "Initial Contact", color: "bg-gray-100" },
      { id: "proposal", name: "Proposal", color: "bg-blue-100" },
      { id: "due-diligence", name: "Due Diligence", color: "bg-yellow-100" },
      { id: "term-sheet", name: "Term Sheet", color: "bg-purple-100" },
      { id: "closed-won", name: "Closed Won", color: "bg-green-100" },
      { id: "closed-lost", name: "Closed Lost", color: "bg-red-100" },
    ],
  })

  const handleSaveWorkflow = (config: any) => {
    setWorkflowConfig(config)
    console.log("Workflow updated:", config)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Tabs defaultValue="table" className="w-full">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="table">Table</TabsTrigger>
              <TabsTrigger value="kanban">Kanban</TabsTrigger>
            </TabsList>
            <WorkflowHeader
              workflowName="Opportunities Pipeline"
              workflowConfig={workflowConfig}
              onSave={handleSaveWorkflow}
            />
          </div>
          <TabsContent value="table" className="mt-6">
            <OpportunitiesTable />
          </TabsContent>
          <TabsContent value="kanban" className="mt-6">
            <OpportunitiesKanban workflowConfig={workflowConfig} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
