"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GitBranch, Zap, FileCheck, Plus } from "lucide-react"
import { WorkflowCreator } from "./workflow-creator"

const workflowTemplates = [
  {
    id: "deal-pipeline",
    name: "Deal Pipeline",
    description: "Track investment opportunities through the pipeline from initial contact to closing",
    icon: GitBranch,
    objectType: "opportunity",
    attributes: [
      { id: "name", name: "Name", type: "text" },
      { id: "company", name: "Company", type: "relation" },
      { id: "amount", name: "Amount", type: "currency" },
      { id: "stage", name: "Stage", type: "select" },
      { id: "owner", name: "Owner", type: "user" },
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
    tags: ["Investment", "Pipeline", "Opportunities"],
  },
  {
    id: "capital-call-tracking",
    name: "Capital Call Tracking",
    description: "Track capital call processes with automated notifications and document generation",
    icon: Zap,
    objectType: "capital-call",
    attributes: [
      { id: "fund", name: "Fund", type: "relation" },
      { id: "amount", name: "Amount", type: "currency" },
      { id: "dueDate", name: "Due Date", type: "date" },
      { id: "status", name: "Status", type: "select" },
      { id: "investor", name: "Investor", type: "relation" },
      { id: "percentOfCommitment", name: "% of Commitment", type: "number" },
      { id: "callNumber", name: "Call Number", type: "number" },
    ],
    stages: [
      { id: "new", name: "New", color: "bg-gray-100" },
      { id: "in-progress", name: "In Progress", color: "bg-blue-100" },
      { id: "done", name: "Done", color: "bg-green-100" },
    ],
    tags: ["Capital Calls", "Fund Management", "Tracking"],
  },
  {
    id: "document-review",
    name: "Document Review",
    description: "Track document reviews and approvals with compliance tracking and deadline management",
    icon: FileCheck,
    objectType: "document",
    attributes: [
      { id: "title", name: "Title", type: "text" },
      { id: "type", name: "Document Type", type: "select" },
      { id: "reviewer", name: "Reviewer", type: "user" },
      { id: "dueDate", name: "Due Date", type: "date" },
      { id: "entity", name: "Related Entity", type: "relation" },
      { id: "confidentiality", name: "Confidentiality", type: "select" },
      { id: "version", name: "Version", type: "text" },
    ],
    stages: [
      { id: "draft", name: "Draft", color: "bg-gray-100" },
      { id: "review", name: "Review", color: "bg-yellow-100" },
      { id: "approved", name: "Approved", color: "bg-green-100" },
      { id: "rejected", name: "Rejected", color: "bg-red-100" },
    ],
    tags: ["Documents", "Review", "Compliance"],
  },
]

interface WorkflowTemplateDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function WorkflowTemplateDialog({ isOpen, onClose }: WorkflowTemplateDialogProps) {
  const [isCreatorOpen, setIsCreatorOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template)
    setIsCreatorOpen(true)
    onClose()
  }

  const handleStartFromScratch = () => {
    setSelectedTemplate(null)
    setIsCreatorOpen(true)
    onClose()
  }

  const handleSaveWorkflow = (workflow: any) => {
    // This would typically save to your backend
    console.log("Saving workflow:", workflow)
    // Navigate to the new workflow
    const path = workflow.name.toLowerCase().replace(/\s+/g, "-")
    window.location.href = `/${path}`
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Choose a Workflow Template</DialogTitle>
            <DialogDescription>
              Select a pre-built template to get started quickly, or create a workflow from scratch.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Start from Scratch Option */}
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleStartFromScratch}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Plus className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Start from Scratch</CardTitle>
                    <CardDescription>Create a custom workflow tailored to your specific needs</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Template Options */}
            <div className="grid gap-4 md:grid-cols-1">
              {workflowTemplates.map((template) => (
                <Card
                  key={template.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleTemplateSelect(template)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <template.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <CardDescription className="mt-1">{template.description}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-1 mb-3">
                      {template.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{template.stages.length} stages</span>
                      <span>{template.attributes.length} attributes</span>
                      <span className="capitalize">{template.objectType.replace("-", " ")} tracking</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <WorkflowCreator
        isOpen={isCreatorOpen}
        onClose={() => {
          setIsCreatorOpen(false)
          setSelectedTemplate(null)
        }}
        onSave={handleSaveWorkflow}
        existingWorkflow={selectedTemplate}
      />
    </>
  )
}
