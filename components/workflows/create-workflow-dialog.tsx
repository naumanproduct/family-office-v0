"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusIcon, ChevronLeftIcon } from "lucide-react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { MasterDetailsPanel } from "@/components/shared/master-details-panel"

// Import components from workflow-header-utils.tsx
import { 
  getAttributeIcon, 
  SortableStageItem, 
  SelectedAttributeItem,
  getAttributesForObjectType,
  type WorkflowAttribute,
  type WorkflowStage,
  type WorkflowConfig
} from "./workflow-header-utils"
import { FileTextIcon, LayoutIcon, ListIcon, BuildingIcon } from "lucide-react"

interface CreateWorkflowDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (config: WorkflowConfig) => void
  existingWorkflow?: Partial<WorkflowConfig>
}

export function CreateWorkflowDialog({ isOpen, onClose, onSave, existingWorkflow }: CreateWorkflowDialogProps) {
  const [step, setStep] = useState(1)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showDiscardDialog, setShowDiscardDialog] = useState(false)
  const [pendingAction, setPendingAction] = useState<"close" | null>(null)
  const [originalConfig, setOriginalConfig] = useState<WorkflowConfig>({
    name: "",
    description: "",
    objectType: "task",
    attributes: [],
    stages: [
      { id: "stage-1", name: "To Do", color: "bg-gray-100" },
      { id: "stage-2", name: "In Progress", color: "bg-blue-100" },
      { id: "stage-3", name: "Done", color: "bg-green-100" },
    ],
  })
  const [config, setConfig] = useState<WorkflowConfig>({
    name: "",
    description: "",
    objectType: "task",
    attributes: [],
    stages: [
      { id: "stage-1", name: "To Do", color: "bg-gray-100" },
      { id: "stage-2", name: "In Progress", color: "bg-blue-100" },
      { id: "stage-3", name: "Done", color: "bg-green-100" },
    ],
  })
  
  const [customName, setCustomName] = useState("")
  const [customType, setCustomType] = useState("text")
  const [showCustomFieldInputs, setShowCustomFieldInputs] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // Step labels (acts as non-clickable stepper)
  const steps = [
    { id: 1, label: "Details" },
    { id: 2, label: "Card Attributes" },
    { id: 3, label: "Stages" },
  ]

  // Initialize with existingWorkflow if provided
  useEffect(() => {
    if (existingWorkflow && isOpen) {
      setConfig({
        name: existingWorkflow.name || "",
        description: existingWorkflow.description || "",
        objectType: existingWorkflow.objectType || "task",
        attributes: existingWorkflow.attributes || [],
        stages: existingWorkflow.stages && existingWorkflow.stages.length > 0 
          ? existingWorkflow.stages 
          : [{ id: "stage-1", name: "New", color: "bg-gray-100" }],
      })
    }
  }, [existingWorkflow, isOpen])

  // Reset form when dialog is closed
  useEffect(() => {
    if (!isOpen) {
      resetForm()
    }
  }, [isOpen])

  // Track changes for unsaved state
  useEffect(() => {
    const hasChanges = JSON.stringify(config) !== JSON.stringify(originalConfig)
    setHasUnsavedChanges(hasChanges)
  }, [config, originalConfig])

  const handleSave = () => {
    onSave(config)
    onClose()
    resetForm()
  }

  const handleCloseRequest = () => {
    if (hasUnsavedChanges) {
      setPendingAction("close")
      setShowDiscardDialog(true)
    } else {
      onClose()
      resetForm()
    }
  }

  const handleConfirmDiscard = () => {
    if (pendingAction === "close") {
      onClose()
      resetForm()
    }
    setShowDiscardDialog(false)
  }

  const handleCancelDiscard = () => {
    setPendingAction(null)
    setShowDiscardDialog(false)
  }

  const resetForm = () => {
    setStep(1)
    setConfig({
      name: "",
      description: "",
      objectType: "task",
      attributes: [],
      stages: [
        { id: "stage-1", name: "To Do", color: "bg-gray-100" },
        { id: "stage-2", name: "In Progress", color: "bg-blue-100" },
        { id: "stage-3", name: "Done", color: "bg-green-100" },
      ],
    })
  }

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleAttributeDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = config.attributes.findIndex((attr) => attr.id === active.id)
      const newIndex = config.attributes.findIndex((attr) => attr.id === over.id)

      setConfig({
        ...config,
        attributes: arrayMove(config.attributes, oldIndex, newIndex),
      })
    }
  }

  const handleStageDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = config.stages.findIndex((stage) => stage.id === active.id)
      const newIndex = config.stages.findIndex((stage) => stage.id === over.id)

      setConfig({
        ...config,
        stages: arrayMove(config.stages, oldIndex, newIndex),
      })
    }
  }

  const addField = (field: WorkflowAttribute) => {
    setConfig({
      ...config,
      attributes: [...config.attributes, { ...field }],
    })
  }

  const createCustomField = () => {
    if (customName.trim()) {
      const newAttribute: WorkflowAttribute = {
        id: `custom-${Date.now()}`,
        name: customName,
        type: customType,
        isCustom: true,
      }
      setConfig({
        ...config,
        attributes: [...config.attributes, newAttribute],
      })
      setCustomName("")
      setCustomType("text")
      setShowCustomFieldInputs(false)
    }
  }

  const editAttribute = (id: string, name: string, type: string) => {
    setConfig({
      ...config,
      attributes: config.attributes.map((attr) => (attr.id === id ? { ...attr, name, type } : attr)),
    })
  }

  const deleteAttribute = (id: string) => {
    setConfig({
      ...config,
      attributes: config.attributes.filter((attr) => attr.id !== id),
    })
  }

  const editStage = (id: string, name: string, color: string) => {
    setConfig({
      ...config,
      stages: config.stages.map((stage) => (stage.id === id ? { ...stage, name, color } : stage)),
    })
  }

  const deleteStage = (id: string) => {
    setConfig({
      ...config,
      stages: config.stages.filter((stage) => stage.id !== id),
    })
  }

  const addStage = () => {
    const newStage: WorkflowStage = {
      id: `stage-${Date.now()}`,
      name: "New Stage",
      color: "bg-gray-100",
    }
    setConfig({
      ...config,
      stages: [...config.stages, newStage],
    })
  }

  const getAvailableFields = () => {
    const allFields = getAttributesForObjectType(config.objectType)
    return allFields.filter((field) => !config.attributes.some((selected) => selected.id === field.id))
  }

  const filteredAvailableFields = getAvailableFields().filter((field) =>
    field.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const isStepValid = () => {
    switch (step) {
      case 1:
        return config.name.trim() !== "" && config.objectType !== ""
      case 2:
        return config.attributes.length > 0
      case 3:
        return config.stages.length > 0
      default:
        return false
    }
  }

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center">
          <div className={`flex items-center justify-center rounded-full w-8 h-8 ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
            <span className="text-sm font-medium">1</span>
          </div>
          <div className={`h-1 w-12 ${step > 1 ? "bg-primary" : "bg-muted"}`}></div>
          <div className={`flex items-center justify-center rounded-full w-8 h-8 ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
            <span className="text-sm font-medium">2</span>
          </div>
          <div className={`h-1 w-12 ${step > 2 ? "bg-primary" : "bg-muted"}`}></div>
          <div className={`flex items-center justify-center rounded-full w-8 h-8 ${step >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
            <span className="text-sm font-medium">3</span>
          </div>
        </div>
      </div>
    )
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <MasterDetailsPanel 
            fieldGroups={[
              {
                id: "workflow-info",
                label: "Workflow Information",
                icon: FileTextIcon,
                fields: [
                  { 
                    label: "Workflow Name *", 
                    value: (
                      <Input
                        value={config.name}
                        onChange={(e) => setConfig({ ...config, name: e.target.value })}
                        placeholder="e.g., Contract Review Process"
                        className="mt-1"
                      />
                    )
                  },
                  { 
                    label: "Description", 
                    value: (
                      <Textarea
                        value={config.description}
                        onChange={(e) => setConfig({ ...config, description: e.target.value })}
                        className="resize-none mt-1"
                        rows={3}
                        placeholder="Describe what this workflow is for..."
                      />
                    )
                  },
                  { 
                    label: "Object Type *", 
                    value: (
                      <Select
                        value={config.objectType}
                        onValueChange={(value) => setConfig({ ...config, objectType: value, attributes: [] })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="investment">Investment</SelectItem>
                          <SelectItem value="opportunity">Opportunity</SelectItem>
                          <SelectItem value="task">Task</SelectItem>
                          <SelectItem value="person">Person</SelectItem>
                          <SelectItem value="company">Company</SelectItem>
                        </SelectContent>
                      </Select>
                    )
                  },
                ],
              },
            ]}
          />
        )
      case 2:
        return (
          <div className="flex flex-col h-full space-y-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Card Fields</h3>
              <p className="text-sm text-muted-foreground">
                Select which fields to display on your cards
              </p>
            </div>
            
            {/* Selected Fields */}
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Selected Fields</h4>
              {config.attributes.length > 0 ? (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleAttributeDragEnd}>
                  <SortableContext
                    items={config.attributes.map((attr) => attr.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2">
                      {config.attributes.map((attribute) => (
                        <SelectedAttributeItem
                          key={attribute.id}
                          attribute={attribute}
                          onEdit={editAttribute}
                          onDelete={deleteAttribute}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              ) : (
                <div className="text-center py-6 border border-dashed border-border rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">No fields selected yet</p>
                </div>
              )}
            </div>
            
            {/* Available Fields */}
            <div className="flex flex-col flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">Available Fields</h4>
                {!showCustomFieldInputs ? (
                  <Button variant="outline" size="sm" onClick={() => setShowCustomFieldInputs(true)}>
                    <PlusIcon className="h-3 w-3 mr-1" />
                    Add Custom Field
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={createCustomField}
                      disabled={!customName.trim()}
                    >
                      <PlusIcon className="h-3 w-3 mr-1" />
                      Save Field
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => { setShowCustomFieldInputs(false); setCustomName("") }}>
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
              
              {showCustomFieldInputs && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="customName" className="text-xs font-medium">
                      Custom Field Name
                    </Label>
                    <Input
                      id="customName"
                      placeholder="Enter field name"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customType" className="text-xs font-medium">
                      Field Type
                    </Label>
                    <Select value={customType} onValueChange={setCustomType}>
                      <SelectTrigger id="customType" className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="currency">Currency</SelectItem>
                        <SelectItem value="select">Select</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="relation">Relation</SelectItem>
                        <SelectItem value="tags">Tags</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              
              <div className="flex-1 overflow-y-auto rounded-lg border pb-8">
                {filteredAvailableFields.length > 0 ? (
                  <div className="divide-y divide-border">
                    {filteredAvailableFields.map((field) => {
                      const Icon = getAttributeIcon(field.type)
                      return (
                        <div
                          key={field.id}
                          className="flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                          onClick={() => addField(field)}
                        >
                          <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium">{field.name}</div>
                            <div className="text-xs text-muted-foreground capitalize">{field.type}</div>
                          </div>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-full">
                            <PlusIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-4 text-sm text-muted-foreground">
                    No available fields for this object type
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-6">
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Workflow Stages</h3>
                  <p className="text-sm text-muted-foreground">
                    Define and arrange the stages for your workflow
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={addStage}>
                  <PlusIcon className="h-3 w-3 mr-1" />
                  Add Stage
                </Button>
              </div>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleStageDragEnd}>
              <SortableContext
                items={config.stages.map((stage) => stage.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {config.stages.map((stage) => (
                    <SortableStageItem
                      key={stage.id}
                      stage={stage}
                      onEdit={editStage}
                      onDelete={deleteStage}
                      canDelete={config.stages.length > 1}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={handleCloseRequest}>
        <SheetContent side="right" className="flex w-full max-w-2xl flex-col p-0 sm:max-w-2xl [&>button]:hidden overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={handleCloseRequest}>
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <Badge variant="outline" className="bg-background">
                Workflow
              </Badge>
            </div>
            <div className="flex items-center gap-2"></div>
          </div>

          {/* Record Header */}
          <div className="border-b bg-background px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500 text-white text-sm font-medium">
                W
              </div>
              <div>
                <h2 className="text-lg font-semibold">Create Workflow from Scratch</h2>
                <p className="text-sm text-muted-foreground">
                  Configure your custom workflow in a few steps
                </p>
              </div>
            </div>
          </div>

          {/* Stepper Navigation (non-clickable) */}
          <div className="flex-1 overflow-y-auto">
            <Tabs value={String(step)} onValueChange={(value) => {}} className="flex flex-col h-full">
              <div className="border-b bg-background px-6">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger 
                    value="1" 
                    className="pointer-events-none"
                  >
                    <FileTextIcon className="h-4 w-4 mr-2" />
                    Details
                  </TabsTrigger>
                  <TabsTrigger 
                    value="2"
                    disabled={!isStepValid() && step === 1}
                    className="pointer-events-none"
                  >
                    <LayoutIcon className="h-4 w-4 mr-2" />
                    Card Attributes
                  </TabsTrigger>
                  <TabsTrigger 
                    value="3"
                    disabled={!isStepValid() && step === 2}
                    className="pointer-events-none"
                  >
                    <ListIcon className="h-4 w-4 mr-2" />
                    Stages
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="1" className="flex-1 p-6 space-y-4 m-0">
                {step === 1 && renderStepContent()}
              </TabsContent>
              <TabsContent value="2" className="flex-1 p-6 space-y-4 m-0">
                {step === 2 && renderStepContent()}
              </TabsContent>
              <TabsContent value="3" className="flex-1 p-6 space-y-4 m-0">
                {step === 3 && renderStepContent()}
              </TabsContent>
            </Tabs>
          </div>

          {/* Footer with Back / Next / Create */}
          <div className="border-t bg-background px-6 py-4">
            <div className="flex justify-between">
              {step === 1 ? (
                <>
                  <Button variant="outline" onClick={handleCloseRequest}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!isStepValid()}
                    className="flex items-center gap-2"
                  >
                    Next
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                  {step < 3 ? (
                    <Button
                      onClick={handleNext}
                      disabled={!isStepValid()}
                      className="flex items-center gap-2"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button onClick={handleSave} disabled={!isStepValid()}>
                      Create Workflow
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
        
      <AlertDialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to discard them?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDiscard}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDiscard}>Discard</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
