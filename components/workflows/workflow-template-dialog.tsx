"use client"

import { useState } from "react"
import { MasterCreationDialog } from "../master-creation-dialog"
import { CreateWorkflowDialog } from "./create-workflow-dialog"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"

// Updated workflow templates with complete configurations
const workflowTypes = [
  {
    id: "capital-call-tracking",
    name: "Capital Call Tracking",
    description: "Track capital call processes with automated notifications and document generation",
    category: "Fund Management",
    objectType: "capital-call",
    attributes: [
      { id: "fund", name: "Fund", type: "relation" },
      { id: "callNumber", name: "Call Number", type: "number" },
      { id: "amount", name: "Amount", type: "currency" },
      { id: "dueDate", name: "Due Date", type: "date" },
      { id: "investor", name: "Investor", type: "relation" },
      { id: "noticeDate", name: "Notice Date", type: "date" },
    ],
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
    attributes: [
      { id: "name", name: "Name", type: "text" },
      { id: "company", name: "Company", type: "relation" },
      { id: "amount", name: "Amount", type: "currency" },
      { id: "expectedClose", name: "Expected Close", type: "date" },
      { id: "owner", name: "Owner", type: "user" },
      { id: "fundingRound", name: "Funding Round", type: "select" },
    ],
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
    id: "tax-document-collection",
    name: "Tax Document Collection",
    description: "Track and manage tax document requests and submissions with deadline management",
    category: "Compliance",
    objectType: "document",
    attributes: [
      { id: "title", name: "Document Name", type: "text" },
      { id: "entity", name: "Entity", type: "relation" },
      { id: "type", name: "Document Type", type: "select" },
      { id: "dueDate", name: "Due Date", type: "date" },
      { id: "reviewer", name: "Assigned To", type: "user" },
      { id: "taxYear", name: "Tax Year", type: "text" },
    ],
    stages: [
      { id: "requested", name: "Requested", color: "bg-gray-100" },
      { id: "pending", name: "Pending", color: "bg-blue-100" },
      { id: "received", name: "Received", color: "bg-yellow-100" },
      { id: "reviewed", name: "Reviewed", color: "bg-purple-100" },
      { id: "filed", name: "Filed", color: "bg-green-100" },
    ],
  },
  {
    id: "entity-compliance",
    name: "Entity Compliance & Legal",
    description: "Monitor and manage compliance requirements for all entities",
    category: "Compliance",
    objectType: "entity",
    attributes: [
      { id: "name", name: "Entity Name", type: "text" },
      { id: "type", name: "Item Type", type: "text" },
      { id: "jurisdiction", name: "Jurisdiction", type: "text" },
      { id: "dueDate", name: "Due Date", type: "date" },
      { id: "responsiblePerson", name: "Responsible Person", type: "user" },
      { id: "priority", name: "Priority", type: "select" },
    ],
    stages: [
      { id: "upcoming", name: "Upcoming", color: "bg-blue-100" },
      { id: "in-progress", name: "In Progress", color: "bg-yellow-100" },
      { id: "review", name: "Review", color: "bg-purple-100" },
      { id: "needs-attention", name: "Needs Attention", color: "bg-red-100" },
      { id: "completed", name: "Completed", color: "bg-green-100" },
    ],
  },
]

interface WorkflowTemplateDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function WorkflowTemplateDialog({ isOpen, onClose }: WorkflowTemplateDialogProps) {
  const [showTemplateSelector, setShowTemplateSelector] = useState(true)
  const [showWorkflowDialog, setShowWorkflowDialog] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [isFromScratch, setIsFromScratch] = useState(false)
  
  const handleTemplateSelect = (template: any) => {
    if (template.id === "from-scratch") {
      setIsFromScratch(true)
      setSelectedTemplate(null)
    } else {
      setIsFromScratch(false)
      setSelectedTemplate({
        name: template.name,
        description: template.description,
        objectType: template.objectType,
        attributes: template.attributes,
        stages: template.stages,
      })
    }
    setShowTemplateSelector(false)
    setShowWorkflowDialog(true)
  }
  
  const handleWorkflowSave = (config: any) => {
    console.log("Saving workflow:", config)
    // Navigate to the new workflow
    const path = config.name.toLowerCase().replace(/\s+/g, "-")
    window.location.href = `/${path}`
  }
  
  const handleWorkflowClose = () => {
    setShowWorkflowDialog(false)
    setShowTemplateSelector(true)
    setSelectedTemplate(null)
    setIsFromScratch(false)
    onClose()
  }

  return (
    <>
      {/* Template Selection Sheet */}
      <Sheet open={isOpen && showTemplateSelector} onOpenChange={(open) => {
        if (!open) onClose()
        setShowTemplateSelector(open)
      }}>
        <SheetContent side="right" className="flex w-full max-w-2xl flex-col p-0 sm:max-w-2xl [&>button]:hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
            <div className="flex items-center gap-3">
              <div>Create New Workflow</div>
            </div>
          </div>

          {/* Record Header */}
          <div className="border-b bg-background px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500 text-white text-sm font-medium">
                W
              </div>
              <div>
                <h2 className="text-lg font-semibold">Choose Template</h2>
                <p className="text-sm text-muted-foreground">
                  Select a template or start from scratch
                </p>
              </div>
            </div>
          </div>
          
          {/* Template Options */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 gap-4">
              {/* Custom Workflow Option */}
              <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => handleTemplateSelect({ id: "from-scratch" })}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <div className="bg-purple-100 text-purple-800 p-2 rounded-full mr-2">
                      <PlusIcon className="h-4 w-4" />
                    </div>
                    Start from scratch
                  </CardTitle>
                  <CardDescription>Create a completely custom workflow with your own stages and fields</CardDescription>
                </CardHeader>
              </Card>
              
              {/* Template Options */}
              {workflowTypes.map((template) => (
                <Card 
                  key={template.id} 
                  className="cursor-pointer hover:shadow-md transition-all"
                  onClick={() => handleTemplateSelect(template)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <div className="bg-blue-100 text-blue-800 p-2 rounded-full mr-2">
                        <PlusIcon className="h-4 w-4" />
                      </div>
                      {template.name}
                    </CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span className="capitalize">{template.category}</span>
                      <span className="mx-2">•</span>
                      <span>{template.stages.length} stages</span>
                      <span className="mx-2">•</span>
                      <span>{template.attributes.length} attributes</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Workflow Creation Dialog */}
      <CreateWorkflowDialog 
        isOpen={showWorkflowDialog}
        onClose={handleWorkflowClose}
        onSave={handleWorkflowSave}
        existingWorkflow={selectedTemplate}
      />
    </>
  )
}
