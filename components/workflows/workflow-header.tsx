"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import { WorkflowCreator } from "./workflow-creator"

interface WorkflowHeaderProps {
  workflowName: string
  workflowConfig?: any
  onSave?: (workflow: any) => void
}

export function WorkflowHeader({ workflowName, workflowConfig, onSave }: WorkflowHeaderProps) {
  const [isEditorOpen, setIsEditorOpen] = useState(false)

  const handleSaveWorkflow = (workflow: any) => {
    if (onSave) {
      onSave(workflow)
    }
    console.log("Updated workflow:", workflow)
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{workflowName}</h1>
          <p className="text-muted-foreground">Manage and track your workflow items</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsEditorOpen(true)} className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Configure Workflow
        </Button>
      </div>

      <WorkflowCreator
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveWorkflow}
        existingWorkflow={workflowConfig}
      />
    </>
  )
}
