"use client"

import { WorkflowManagement } from "@/components/workflows/workflow-management"

export default function WorkflowsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Workflows</h2>
          <p className="text-muted-foreground">Create and manage workflows to track your business processes.</p>
        </div>
      </div>

      <WorkflowManagement />
    </div>
  )
}
