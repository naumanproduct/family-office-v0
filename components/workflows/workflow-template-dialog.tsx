"use client"

import type React from "react"
import { useState } from "react"
import { MasterCreationDialog } from "../master-creation-dialog"
import { WorkflowCreator } from "./workflow-creator"

// Convert workflow templates to MasterCreationDialog types format
const workflowTypes = [
  {
    id: "from-scratch",
    name: "Start from Scratch",
    description: "Create a custom workflow tailored to your specific needs",
    category: "Custom",
    isCustom: true,
  },
  {
    id: "deal-pipeline",
    name: "Deal Pipeline",
    description: "Track investment opportunities through stages from initial contact to close",
    category: "Templates",
    config: {
      name: "Deal Pipeline",
      description: "Track investment opportunities through stages from initial contact to close",
      objectType: "opportunity",
      attributes: [
        { id: "name", name: "Name", type: "text" },
        { id: "company", name: "Company", type: "relation" },
        { id: "amount", name: "Amount", type: "currency" },
        { id: "stage", name: "Stage", type: "select" },
        { id: "expectedClose", name: "Expected Close", type: "date" },
      ],
      stages: [
        { id: "initial-contact", name: "Initial Contact", color: "bg-gray-100" },
        { id: "proposal", name: "Proposal", color: "bg-blue-100" },
        { id: "due-diligence", name: "Due Diligence", color: "bg-yellow-100" },
        { id: "term-sheet", name: "Term Sheet", color: "bg-purple-100" },
        { id: "closed-won", name: "Closed Won", color: "bg-green-100" },
      ],
    },
  },
  {
    id: "task-management",
    name: "Task Management",
    description: "Organize and track tasks through completion with assignees and due dates",
    category: "Templates",
    config: {
      name: "Task Management",
      description: "Organize and track tasks through completion with assignees and due dates",
      objectType: "task",
      attributes: [
        { id: "title", name: "Title", type: "text" },
        { id: "assignee", name: "Assignee", type: "user" },
        { id: "dueDate", name: "Due Date", type: "date" },
        { id: "priority", name: "Priority", type: "select" },
        { id: "status", name: "Status", type: "select" },
      ],
      stages: [
        { id: "todo", name: "To Do", color: "bg-gray-100" },
        { id: "in-progress", name: "In Progress", color: "bg-blue-100" },
        { id: "review", name: "Review", color: "bg-yellow-100" },
        { id: "done", name: "Done", color: "bg-green-100" },
      ],
    },
  },
  {
    id: "capital-call-tracking",
    name: "Capital Call Tracking",
    description: "Manage capital call processes from notification to fund collection",
    category: "Templates",
    config: {
      name: "Capital Call Tracking",
      description: "Manage capital call processes from notification to fund collection",
      objectType: "capital-call",
      attributes: [
        { id: "fund", name: "Fund", type: "relation" },
        { id: "amount", name: "Amount", type: "currency" },
        { id: "dueDate", name: "Due Date", type: "date" },
        { id: "investor", name: "Investor", type: "relation" },
        { id: "status", name: "Status", type: "select" },
      ],
      stages: [
        { id: "new", name: "New", color: "bg-gray-100" },
        { id: "in-progress", name: "In Progress", color: "bg-blue-100" },
        { id: "done", name: "Done", color: "bg-green-100" },
      ],
    },
  },
  {
    id: "document-approval",
    name: "Document Approval",
    description: "Review and approve documents with multiple stakeholders",
    category: "Templates",
    config: {
      name: "Document Approval",
      description: "Review and approve documents with multiple stakeholders",
      objectType: "document",
      attributes: [
        { id: "title", name: "Title", type: "text" },
        { id: "type", name: "Document Type", type: "select" },
        { id: "reviewer", name: "Reviewer", type: "user" },
        { id: "dueDate", name: "Due Date", type: "date" },
        { id: "status", name: "Status", type: "select" },
      ],
      stages: [
        { id: "draft", name: "Draft", color: "bg-gray-100" },
        { id: "review", name: "Review", color: "bg-yellow-100" },
        { id: "approved", name: "Approved", color: "bg-green-100" },
        { id: "rejected", name: "Rejected", color: "bg-red-100" },
      ],
    },
  },
  {
    id: "entity-compliance",
    name: "Entity Compliance",
    description: "Track entity compliance status and regulatory filings",
    category: "Templates",
    config: {
      name: "Entity Compliance",
      description: "Track entity compliance status and regulatory filings",
      objectType: "entity",
      attributes: [
        { id: "name", name: "Entity Name", type: "text" },
        { id: "type", name: "Entity Type", type: "select" },
        { id: "jurisdiction", name: "Jurisdiction", type: "text" },
        { id: "annualFilingDate", name: "Annual Filing Date", type: "date" },
        { id: "complianceStatus", name: "Compliance Status", type: "select" },
      ],
      stages: [
        { id: "active", name: "Active", color: "bg-green-100" },
        { id: "pending", name: "Pending", color: "bg-yellow-100" },
        { id: "inactive", name: "Inactive", color: "bg-gray-100" },
      ],
    },
  },
]

// Dummy form fields for MasterCreationDialog (won't be shown as we'll close immediately)
const workflowFormFields = [
  {
    id: "name",
    label: "Name",
    type: "text" as const,
    placeholder: "Workflow name",
    required: true,
  },
]

interface WorkflowTemplateDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function WorkflowTemplateDialog({ isOpen, onClose }: WorkflowTemplateDialogProps) {
  const [isCreatorOpen, setIsCreatorOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)

  const handleTypeSelect = (type: any) => {
    if (type.id === "from-scratch") {
      setSelectedTemplate(null)
    } else {
      // Find the full template data
      const template = workflowTypes.find(t => t.id === type.id)
      setSelectedTemplate(template?.config || null)
    }
    setIsCreatorOpen(true)
    onClose()
    
    // Return empty object to prevent form from showing
    return {}
  }

  const handleSaveWorkflow = (data: any) => {
    // This won't be called as we're using custom WorkflowCreator
    console.log("Saving workflow:", data)
  }

  return (
    <>
      <MasterCreationDialog
        isOpen={isOpen}
        onClose={onClose}
        onSave={handleSaveWorkflow}
        title="Choose a Workflow Template"
        description="Select a pre-built template to get started quickly, or create a workflow from scratch."
        recordType="Workflow"
        avatarLetter="W"
        avatarColor="bg-purple-500"
        types={workflowTypes}
        typeSelectionTitle="Workflow Template"
        formFields={workflowFormFields}
        requiredFields={["name"]}
        onTypeSelect={handleTypeSelect}
      />

      <WorkflowCreator
        isOpen={isCreatorOpen}
        onClose={() => {
          setIsCreatorOpen(false)
          setSelectedTemplate(null)
        }}
        onSave={(workflow: any) => {
          console.log("Saving workflow:", workflow)
          // Add your save logic here
        }}
        existingWorkflow={selectedTemplate}
      />
    </>
  )
}
