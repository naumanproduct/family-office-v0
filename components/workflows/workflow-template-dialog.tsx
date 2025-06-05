"use client"

import { MasterCreationDialog } from "../master-creation-dialog"

const workflowTypes = [
  {
    id: "capital-call-tracking",
    name: "Capital Call Tracking",
    description: "Track capital call processes with automated notifications and document generation",
    category: "Fund Management",
    objectType: "capital-call",
    stages: [
      { id: "new", name: "New", color: "bg-gray-100" },
      { id: "in-progress", name: "In Progress", color: "bg-blue-100" },
      { id: "done", name: "Done", color: "bg-green-100" },
    ],
  },
  {
    id: "deal-pipeline",
    name: "Deal Pipeline",
    description: "Track investment opportunities through the pipeline from initial contact to closing",
    category: "Investment",
    objectType: "opportunity",
    stages: [
      { id: "initial-contact", name: "Initial Contact", color: "bg-gray-100" },
      { id: "proposal", name: "Proposal", color: "bg-blue-100" },
      { id: "due-diligence", name: "Due Diligence", color: "bg-yellow-100" },
      { id: "term-sheet", name: "Term Sheet", color: "bg-purple-100" },
      { id: "closed-won", name: "Closed Won", color: "bg-green-100" },
      { id: "closed-lost", name: "Closed Lost", color: "bg-red-100" },
    ],
  },
  {
    id: "document-review",
    name: "Document Review",
    description: "Track document reviews and approvals with compliance tracking and deadline management",
    category: "Compliance",
    objectType: "document",
    stages: [
      { id: "draft", name: "Draft", color: "bg-gray-100" },
      { id: "review", name: "Review", color: "bg-yellow-100" },
      { id: "approved", name: "Approved", color: "bg-green-100" },
      { id: "rejected", name: "Rejected", color: "bg-red-100" },
    ],
  },
]

const formFields = [
  {
    id: "name",
    label: "Workflow Name",
    type: "text" as const,
    placeholder: "e.g., Deal Pipeline Process",
    required: true,
  },
  {
    id: "type",
    label: "Workflow Type",
    type: "readonly" as const,
  },
  {
    id: "description",
    label: "Description",
    type: "textarea" as const,
    placeholder: "Describe what this workflow is for...",
    rows: 3,
  },
  {
    id: "objectType",
    label: "Object Type",
    type: "select" as const,
    options: ["capital-call", "document", "opportunity", "task"].sort(),
    required: true,
  },
]

interface WorkflowTemplateDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function WorkflowTemplateDialog({ isOpen, onClose }: WorkflowTemplateDialogProps) {
  const handleSave = (data: any) => {
    console.log("Saving workflow:", data)
    // Navigate to the new workflow
    const path = data.name.toLowerCase().replace(/\s+/g, "-")
    window.location.href = `/${path}`
  }

  const handleTypeSelect = (type: any) => {
    return {
      objectType: type.objectType,
      stages: type.stages,
    }
  }

  return (
    <MasterCreationDialog
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSave}
      title="Create New Workflow"
      description="Configure the workflow details below"
      recordType="Workflow"
      avatarLetter="W"
      avatarColor="bg-purple-500"
      types={workflowTypes}
      typeSelectionTitle="Workflow Templates"
      formFields={formFields}
      requiredFields={["name", "objectType"]}
      onTypeSelect={handleTypeSelect}
    />
  )
}
