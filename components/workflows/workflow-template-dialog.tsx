"use client"

import { useState } from "react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GitBranch, Zap, FileCheck, Plus, ChevronLeftIcon } from "lucide-react"
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
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="right" className="flex w-full max-w-2xl flex-col p-0 sm:max-w-2xl [&>button]:hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={onClose}>
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <Badge variant="outline" className="bg-background">
                Workflow Template
              </Badge>
            </div>
          </div>

          {/* Record Header */}
          <div className="border-b bg-background px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                W
              </div>
              <div>
                <h2 className="text-lg font-semibold">Choose a Workflow Template</h2>
                <p className="text-sm text-muted-foreground">
                  Select a pre-built template to get started quickly, or create a workflow from scratch.
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              {/* Start from Scratch Option */}
              <Card
                className="cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.01]"
                onClick={handleStartFromScratch}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Plus className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base font-medium">Start from Scratch</CardTitle>
                      <CardDescription className="text-sm">
                        Create a custom workflow tailored to your specific needs
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Template Options */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Templates</h3>
                {workflowTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className="cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.01]"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <template.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base font-medium">{template.name}</CardTitle>
                          <CardDescription className="text-sm mt-1">{template.description}</CardDescription>
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
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{template.stages.length} stages</span>
                        <span>{template.attributes.length} attributes</span>
                        <span className="capitalize">{template.objectType.replace("-", " ")} tracking</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

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
