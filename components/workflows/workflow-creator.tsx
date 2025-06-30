"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowRight, Check, Plus, X, ChevronLeftIcon, FileTextIcon, LayoutIcon, ListIcon } from "lucide-react"

// Define the object types that can be tracked in workflows
const objectTypes = [
  { id: "task", name: "Task", description: "Track tasks and their progress" },
  { id: "opportunity", name: "Opportunity", description: "Track investment opportunities" },
  { id: "capital-call", name: "Capital Call", description: "Track capital call processes" },
  { id: "document", name: "Document", description: "Track document reviews and approvals" },
  { id: "entity", name: "Entity", description: "Track entity compliance and filings" },
]

// Define available attributes by object type
const availableAttributes: Record<string, Array<{ id: string; name: string; type: string }>> = {
  task: [
    { id: "title", name: "Title", type: "text" },
    { id: "description", name: "Description", type: "text" },
    { id: "assignee", name: "Assignee", type: "user" },
    { id: "dueDate", name: "Due Date", type: "date" },
    { id: "priority", name: "Priority", type: "select" },
    { id: "status", name: "Status", type: "select" },
    { id: "progress", name: "Progress", type: "number" },
    { id: "tags", name: "Tags", type: "tags" },
    { id: "relatedEntity", name: "Related Entity", type: "relation" },
    { id: "relatedOpportunity", name: "Related Opportunity", type: "relation" },
  ],
  opportunity: [
    { id: "name", name: "Name", type: "text" },
    { id: "company", name: "Company", type: "relation" },
    { id: "amount", name: "Amount", type: "currency" },
    { id: "stage", name: "Stage", type: "select" },
    { id: "probability", name: "Probability", type: "number" },
    { id: "expectedClose", name: "Expected Close", type: "date" },
    { id: "owner", name: "Owner", type: "user" },
    { id: "fundingRound", name: "Funding Round", type: "select" },
    { id: "sector", name: "Sector", type: "select" },
    { id: "location", name: "Location", type: "text" },
  ],
  "capital-call": [
    { id: "fund", name: "Fund", type: "relation" },
    { id: "amount", name: "Amount", type: "currency" },
    { id: "dueDate", name: "Due Date", type: "date" },
    { id: "status", name: "Status", type: "select" },
    { id: "investor", name: "Investor", type: "relation" },
    { id: "callNumber", name: "Call Number", type: "number" },
    { id: "percentOfCommitment", name: "% of Commitment", type: "number" },
    { id: "noticeDate", name: "Notice Date", type: "date" },
    { id: "wireDate", name: "Wire Date", type: "date" },
    { id: "purpose", name: "Purpose", type: "text" },
  ],
  document: [
    { id: "title", name: "Title", type: "text" },
    { id: "type", name: "Document Type", type: "select" },
    { id: "status", name: "Status", type: "select" },
    { id: "reviewer", name: "Reviewer", type: "user" },
    { id: "dueDate", name: "Due Date", type: "date" },
    { id: "entity", name: "Related Entity", type: "relation" },
    { id: "tags", name: "Tags", type: "tags" },
    { id: "version", name: "Version", type: "text" },
    { id: "confidentiality", name: "Confidentiality", type: "select" },
    { id: "expirationDate", name: "Expiration Date", type: "date" },
  ],
  entity: [
    { id: "name", name: "Entity Name", type: "text" },
    { id: "type", name: "Entity Type", type: "select" },
    { id: "jurisdiction", name: "Jurisdiction", type: "text" },
    { id: "status", name: "Status", type: "select" },
    { id: "formationDate", name: "Formation Date", type: "date" },
    { id: "annualFilingDate", name: "Annual Filing Date", type: "date" },
    { id: "registeredAgent", name: "Registered Agent", type: "text" },
    { id: "taxId", name: "Tax ID", type: "text" },
    { id: "parentEntity", name: "Parent Entity", type: "relation" },
    { id: "complianceStatus", name: "Compliance Status", type: "select" },
  ],
}

// Define default stages by object type
const defaultStages: Record<string, Array<{ id: string; name: string; color: string }>> = {
  task: [
    { id: "todo", name: "To Do", color: "bg-gray-100" },
    { id: "in-progress", name: "In Progress", color: "bg-blue-100" },
    { id: "review", name: "Review", color: "bg-yellow-100" },
    { id: "done", name: "Done", color: "bg-green-100" },
  ],
  opportunity: [
    { id: "initial-contact", name: "Initial Contact", color: "bg-gray-100" },
    { id: "proposal", name: "Proposal", color: "bg-blue-100" },
    { id: "due-diligence", name: "Due Diligence", color: "bg-yellow-100" },
    { id: "term-sheet", name: "Term Sheet", color: "bg-purple-100" },
    { id: "closed-won", name: "Closed Won", color: "bg-green-100" },
    { id: "closed-lost", name: "Closed Lost", color: "bg-red-100" },
  ],
  "capital-call": [
    { id: "new", name: "New", color: "bg-gray-100" },
    { id: "in-progress", name: "In Progress", color: "bg-blue-100" },
    { id: "done", name: "Done", color: "bg-green-100" },
  ],
  document: [
    { id: "draft", name: "Draft", color: "bg-gray-100" },
    { id: "review", name: "Review", color: "bg-yellow-100" },
    { id: "approved", name: "Approved", color: "bg-green-100" },
    { id: "rejected", name: "Rejected", color: "bg-red-100" },
  ],
  entity: [
    { id: "active", name: "Active", color: "bg-green-100" },
    { id: "pending", name: "Pending", color: "bg-yellow-100" },
    { id: "inactive", name: "Inactive", color: "bg-gray-100" },
    { id: "dissolved", name: "Dissolved", color: "bg-red-100" },
  ],
}

interface WorkflowCreatorProps {
  isOpen: boolean
  onClose: () => void
  onSave: (workflow: any) => void
  existingWorkflow?: any
}

export function WorkflowCreator({ isOpen, onClose, onSave, existingWorkflow }: WorkflowCreatorProps) {
  const [activeTab, setActiveTab] = useState("basic")
  const [workflow, setWorkflow] = useState(() => {
    if (existingWorkflow) {
      return {
        name: existingWorkflow.name || "",
        description: existingWorkflow.description || "",
        objectType: existingWorkflow.objectType || "",
        attributes: existingWorkflow.attributes || [],
        stages: existingWorkflow.stages || [],
      }
    }
    return {
      name: "",
      description: "",
      objectType: "",
      attributes: [],
      stages: [],
    }
  })

  useEffect(() => {
    if (existingWorkflow) {
      setWorkflow({
        name: existingWorkflow.name || "",
        description: existingWorkflow.description || "",
        objectType: existingWorkflow.objectType || "",
        attributes: existingWorkflow.attributes || [],
        stages: existingWorkflow.stages || [],
      })
    }
  }, [existingWorkflow])

  const handleObjectTypeChange = (type: string) => {
    setWorkflow({
      ...workflow,
      objectType: type,
      attributes: [],
      stages: defaultStages[type] || [],
    })
  }

  const toggleAttribute = (attributeId: string) => {
    const isSelected = workflow.attributes.some((attr: any) => attr.id === attributeId)

    if (isSelected) {
      setWorkflow({
        ...workflow,
        attributes: workflow.attributes.filter((attr: any) => attr.id !== attributeId),
      })
    } else {
      const attribute = availableAttributes[workflow.objectType].find((attr) => attr.id === attributeId)
      if (attribute) {
        setWorkflow({
          ...workflow,
          attributes: [...workflow.attributes, { ...attribute }],
        })
      }
    }
  }

  const handleSave = () => {
    onSave(workflow)
    onClose()
  }

  const isAttributeSelected = (attributeId: string) => {
    return workflow.attributes.some((attr: any) => attr.id === attributeId)
  }

  const canProceedToAttributes = workflow.name && workflow.objectType
  const canProceedToStages = canProceedToAttributes && workflow.attributes.length > 0
  const canSave = canProceedToStages && workflow.stages.length > 0

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="flex w-full max-w-2xl flex-col p-0 sm:max-w-2xl [&>button]:hidden overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Badge variant="outline" className="bg-background">
              Workflow
            </Badge>
          </div>
        </div>

        {/* Record Header */}
        <div className="border-b bg-background px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500 text-white text-sm font-medium">
              W
            </div>
            <div>
              <h2 className="text-lg font-semibold">{existingWorkflow ? "Edit Workflow" : "Create New Workflow"}</h2>
              <p className="text-sm text-muted-foreground">
                {existingWorkflow
                  ? "Update your workflow settings and configuration."
                  : "Create a new workflow to track and manage your business processes."}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
            <div className="border-b bg-background px-6">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="basic">
                  <FileTextIcon className="h-4 w-4 mr-2" />
                  Basic Info
                </TabsTrigger>
                <TabsTrigger value="attributes" disabled={!canProceedToAttributes}>
                  <LayoutIcon className="h-4 w-4 mr-2" />
                  Card Attributes
                </TabsTrigger>
                <TabsTrigger value="stages" disabled={!canProceedToStages}>
                  <ListIcon className="h-4 w-4 mr-2" />
                  Workflow Stages
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="basic" className="flex-1 p-6 space-y-4 m-0">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Workflow Name</Label>
                  <Input
                    id="name"
                    value={workflow.name}
                    onChange={(e) => setWorkflow({ ...workflow, name: e.target.value })}
                    placeholder="e.g., Deal Pipeline, Task Management"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={workflow.description}
                    onChange={(e) => setWorkflow({ ...workflow, description: e.target.value })}
                    placeholder="Describe what this workflow is used for..."
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="objectType">Object Type</Label>
                  <Select
                    value={workflow.objectType}
                    onValueChange={handleObjectTypeChange}
                    disabled={!!existingWorkflow}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select object type" />
                    </SelectTrigger>
                    <SelectContent>
                      {objectTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    {workflow.objectType
                      ? objectTypes.find((t) => t.id === workflow.objectType)?.description
                      : "Select the type of object this workflow will track."}
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="attributes" className="flex-1 p-6 m-0">
              <div className="grid gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Select Card Attributes</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Choose which attributes will appear on cards in your workflow. These attributes will be visible at a
                    glance on the kanban board.
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    {workflow.objectType &&
                      availableAttributes[workflow.objectType].map((attribute) => (
                        <div
                          key={attribute.id}
                          className={`flex items-center space-x-2 rounded-md border p-3 cursor-pointer ${
                            isAttributeSelected(attribute.id) ? "border-primary bg-primary/5" : ""
                          }`}
                          onClick={() => toggleAttribute(attribute.id)}
                        >
                          <Checkbox
                            id={`attribute-${attribute.id}`}
                            checked={isAttributeSelected(attribute.id)}
                            onCheckedChange={() => toggleAttribute(attribute.id)}
                          />
                          <div className="flex-1">
                            <Label htmlFor={`attribute-${attribute.id}`} className="text-sm font-medium cursor-pointer">
                              {attribute.name}
                            </Label>
                            <p className="text-xs text-muted-foreground">{attribute.type}</p>
                          </div>
                          {isAttributeSelected(attribute.id) && <Check className="h-4 w-4 text-primary" />}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="stages" className="flex-1 p-6 m-0">
              <div className="grid gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Configure Workflow Stages</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Define the stages that items will move through in your workflow. These will appear as columns on
                    your kanban board.
                  </p>

                  <div className="space-y-2">
                    {workflow.stages.map((stage: any, index: number) => (
                      <div key={stage.id} className="flex items-center gap-2 p-2 border rounded-md">
                        <div className={`w-4 h-4 rounded-full ${stage.color}`}></div>
                        <div className="flex-1">
                          <Input
                            value={stage.name}
                            onChange={(e) => {
                              const updatedStages = [...workflow.stages]
                              updatedStages[index] = { ...stage, name: e.target.value }
                              setWorkflow({ ...workflow, stages: updatedStages })
                            }}
                            className="h-8"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const updatedStages = workflow.stages.filter((_: any, i: number) => i !== index)
                            setWorkflow({ ...workflow, stages: updatedStages })
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                    <Button
                      variant="outline"
                      className="w-full mt-2"
                      onClick={() => {
                        const newStage = {
                          id: `stage-${Date.now()}`,
                          name: `New Stage`,
                          color: "bg-gray-100",
                        }
                        setWorkflow({ ...workflow, stages: [...workflow.stages, newStage] })
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Stage
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="border-t bg-background px-6 py-4">
          <div className="flex justify-between">
            {activeTab === "basic" ? (
              <Button
                onClick={() => setActiveTab("attributes")}
                disabled={!canProceedToAttributes}
                className="flex items-center gap-2 ml-auto"
              >
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            ) : activeTab === "attributes" ? (
              <>
                <Button variant="outline" onClick={() => setActiveTab("basic")}>
                  Back
                </Button>
                <Button
                  onClick={() => setActiveTab("stages")}
                  disabled={!canProceedToStages}
                  className="flex items-center gap-2"
                >
                  Next <ArrowRight className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setActiveTab("attributes")}>
                  Back
                </Button>
                <Button onClick={handleSave} disabled={!canSave}>
                  {existingWorkflow ? "Save Changes" : "Create Workflow"}
                </Button>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
