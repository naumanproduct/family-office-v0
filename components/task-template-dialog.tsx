"use client"

import type React from "react"

import { useState } from "react"
import { MasterCreationDialog } from "./master-creation-dialog"
import { TaskCreator } from "./task-creator"

// Convert task templates to MasterCreationDialog types format
const taskTypes = [
  {
    id: "from-scratch",
    name: "Start from Scratch",
    description: "Create a custom task tailored to your specific needs",
    category: "Custom",
    isCustom: true,
  },
  {
    id: "capital-call-processing",
    name: "Capital Call Processing",
    description:
      "Complete capital call workflow including investor notifications, document preparation, and fund collection",
    category: "Templates",
    subtasks: [
      {
        title: "Prepare capital call notice",
        description: "Draft and review capital call documentation",
        priority: "High",
      },
      {
        title: "Send investor notifications",
        description: "Distribute capital call notices to all investors",
        priority: "High",
      },
      {
        title: "Track investor responses",
        description: "Monitor and follow up on investor commitments",
        priority: "Medium",
      },
      {
        title: "Process wire transfers",
        description: "Coordinate and verify incoming fund transfers",
        priority: "High",
      },
      {
        title: "Update fund records",
        description: "Record capital contributions in fund accounting system",
        priority: "Medium",
      },
    ],
  },
  {
    id: "k1-processing",
    name: "K-1 Processing",
    description: "Annual K-1 tax document preparation and distribution workflow for fund investors",
    category: "Templates",
    subtasks: [
      {
        title: "Gather tax information",
        description: "Collect all necessary tax documents and data",
        priority: "High",
      },
      { title: "Prepare draft K-1s", description: "Generate initial K-1 documents for review", priority: "High" },
      {
        title: "Review with tax advisor",
        description: "Have tax professional review all K-1 documents",
        priority: "High",
      },
      { title: "Finalize K-1 documents", description: "Make final revisions and approve K-1s", priority: "Medium" },
      { title: "Distribute to investors", description: "Send K-1s to all fund investors", priority: "Medium" },
      { title: "Handle investor questions", description: "Respond to investor inquiries about K-1s", priority: "Low" },
    ],
  },
  {
    id: "quarterly-report-processing",
    name: "Quarterly Report Processing",
    description:
      "Comprehensive quarterly reporting workflow including performance analysis and investor communications",
    category: "Templates",
    subtasks: [
      {
        title: "Collect portfolio data",
        description: "Gather performance data from all portfolio companies",
        priority: "High",
      },
      { title: "Analyze fund performance", description: "Calculate returns and performance metrics", priority: "High" },
      {
        title: "Prepare financial statements",
        description: "Generate quarterly financial statements",
        priority: "High",
      },
      { title: "Draft investor letter", description: "Write quarterly letter to investors", priority: "Medium" },
      {
        title: "Review and approve report",
        description: "Final review of all quarterly materials",
        priority: "Medium",
      },
      { title: "Distribute to investors", description: "Send quarterly report to all investors", priority: "Medium" },
    ],
  },
]

// Dummy form fields for MasterCreationDialog (won't be shown as we'll close immediately)
const taskFormFields = [
  {
    id: "title",
    label: "Title",
    type: "text" as const,
    placeholder: "Task title",
    required: true,
  },
]

interface TaskTemplateDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function TaskTemplateDialog({ isOpen, onClose }: TaskTemplateDialogProps) {
  const [isCreatorOpen, setIsCreatorOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [editingTemplate, setEditingTemplate] = useState<any>(null)

  const handleTypeSelect = (type: any) => {
    if (type.id === "from-scratch") {
      setSelectedTemplate(null)
      setEditingTemplate(null)
    } else {
      // Find the full template data
      const template = taskTypes.find(t => t.id === type.id)
      setSelectedTemplate(template)
      setEditingTemplate(null)
    }
    setIsCreatorOpen(true)
    onClose()
    
    // Return empty object to prevent form from showing
    return {}
  }

  const handleSaveTask = (data: any) => {
    // This won't be called as we're using custom TaskCreator
    console.log("Saving task:", data)
  }

  return (
    <>
      <MasterCreationDialog
        isOpen={isOpen}
        onClose={onClose}
        onSave={handleSaveTask}
        title="Choose a Task Template"
        description="Select a pre-built template to get started quickly, or create a task from scratch."
        recordType="Task"
        avatarLetter="T"
        avatarColor="bg-primary"
        types={taskTypes}
        typeSelectionTitle="Task Template"
        formFields={taskFormFields}
        requiredFields={["title"]}
        onTypeSelect={handleTypeSelect}
      />

      <TaskCreator
        isOpen={isCreatorOpen}
        onClose={() => {
          setIsCreatorOpen(false)
          setSelectedTemplate(null)
          setEditingTemplate(null)
        }}
        onSave={(task: any) => {
          console.log("Saving task:", task)
          // Add your save logic here
        }}
        existingTemplate={selectedTemplate}
        isEditingTemplate={!!editingTemplate}
      />
    </>
  )
}
