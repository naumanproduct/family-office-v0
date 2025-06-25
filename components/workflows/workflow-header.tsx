"use client"

import * as React from "react"
import {
  Settings2Icon,
  GripVerticalIcon,
  PlusIcon,
  XIcon,
  EditIcon,
  CheckIcon,
  DollarSignIcon,
  CalendarIcon,
  UserIcon,
  FileTextIcon,
  SearchIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  LayoutIcon,
  ListIcon,
  BuildingIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { MasterDetailsPanel } from "@/components/shared/master-details-panel"
import { UnifiedActivitySection } from "@/components/shared/unified-activity-section"
import { generateWorkflowActivities } from "@/components/shared/activity-generators"

interface WorkflowAttribute {
  id: string
  name: string
  type: string
  isCustom?: boolean
}

interface WorkflowStage {
  id: string
  name: string
  color: string
}

interface WorkflowConfig {
  name: string
  description: string
  objectType: string
  attributes: WorkflowAttribute[]
  stages: WorkflowStage[]
}

interface WorkflowHeaderProps {
  workflowName: string
  workflowConfig: WorkflowConfig
  onSave: (config: WorkflowConfig) => void
}

// Sortable attribute item component for selected fields
function SelectedAttributeItem({
  attribute,
  onEdit,
  onDelete,
}: {
  attribute: WorkflowAttribute
  onEdit: (id: string, name: string, type: string) => void
  onDelete: (id: string) => void
}) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [editName, setEditName] = React.useState(attribute.name)
  const [editType, setEditType] = React.useState(attribute.type)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: attribute.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleSaveEdit = () => {
    onEdit(attribute.id, editName, editType)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditName(attribute.name)
    setEditType(attribute.type)
    setIsEditing(false)
  }

  const Icon = getAttributeIcon(attribute.type)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group flex items-center space-x-3 rounded-lg border border-border bg-card p-3 hover:shadow-sm transition-all duration-200"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors"
      >
        <GripVerticalIcon className="h-4 w-4" />
      </div>

      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />

        {isEditing ? (
          <div className="space-y-2 flex-1" onClick={(e) => e.stopPropagation()}>
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="h-8 text-sm"
              placeholder="Field name"
            />
            <Select value={editType} onValueChange={setEditType}>
              <SelectTrigger className="h-8 text-sm">
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
        ) : (
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm text-card-foreground">{attribute.name}</div>
            <div className="text-xs text-muted-foreground capitalize">{attribute.type}</div>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-1">
        {isEditing ? (
          <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleSaveEdit}>
              <CheckIcon className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCancelEdit}>
              <XIcon className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {attribute.isCustom && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsEditing(true)
                }}
              >
                <EditIcon className="h-3 w-3" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(attribute.id)
              }}
            >
              <XIcon className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

// Sortable stage item component
function SortableStageItem({
  stage,
  onEdit,
  onDelete,
  canDelete,
}: {
  stage: WorkflowStage
  onEdit: (id: string, name: string, color: string) => void
  onDelete: (id: string) => void
  canDelete: boolean
}) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [editName, setEditName] = React.useState(stage.name)
  const [editColor, setEditColor] = React.useState(stage.color)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: stage.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleSaveEdit = () => {
    onEdit(stage.id, editName, editColor)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditName(stage.name)
    setEditColor(stage.color)
    setIsEditing(false)
  }

  const colorOptions = [
    { value: "bg-gray-100", label: "Gray", color: "bg-gray-100" },
    { value: "bg-blue-100", label: "Blue", color: "bg-blue-100" },
    { value: "bg-green-100", label: "Green", color: "bg-green-100" },
    { value: "bg-yellow-100", label: "Yellow", color: "bg-yellow-100" },
    { value: "bg-purple-100", label: "Purple", color: "bg-purple-100" },
    { value: "bg-red-100", label: "Red", color: "bg-red-100" },
    { value: "bg-orange-100", label: "Orange", color: "bg-orange-100" },
    { value: "bg-pink-100", label: "Pink", color: "bg-pink-100" },
  ]

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group flex items-center space-x-3 rounded-lg border border-border bg-card p-4 hover:shadow-sm transition-all duration-200"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors"
      >
        <GripVerticalIcon className="h-4 w-4" />
      </div>

      <div className={`w-6 h-6 rounded-md ${stage.color} border border-border flex-shrink-0`} />

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="space-y-3">
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="h-8 text-sm"
              placeholder="Stage name"
            />
            <div className="grid grid-cols-4 gap-2">
              {colorOptions.map((option) => (
                <div
                  key={option.value}
                  className={`h-8 rounded-md cursor-pointer ${option.color} border-2 transition-all ${
                    editColor === option.value
                      ? "border-primary scale-105"
                      : "border-border hover:border-muted-foreground"
                  }`}
                  onClick={() => setEditColor(option.value)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="font-medium text-sm text-card-foreground">{stage.name}</div>
        )}
      </div>

      <div className="flex items-center space-x-1">
        {isEditing ? (
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleSaveEdit}>
              <CheckIcon className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCancelEdit}>
              <XIcon className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsEditing(true)}>
              <EditIcon className="h-3 w-3" />
            </Button>
            {canDelete && (
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onDelete(stage.id)}>
                <XIcon className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Helper function to get attributes based on object type
function getAttributesForObjectType(objectType: string): WorkflowAttribute[] {
  switch (objectType) {
    case "task":
      return [
        { id: "title", name: "Title", type: "text" },
        { id: "description", name: "Description", type: "text" },
        { id: "status", name: "Status", type: "select" },
        { id: "priority", name: "Priority", type: "select" },
        { id: "assignee", name: "Assignee", type: "user" },
        { id: "dueDate", name: "Due Date", type: "date" },
        { id: "createdAt", name: "Created At", type: "date" },
        { id: "updatedAt", name: "Updated At", type: "date" },
        { id: "tags", name: "Tags", type: "tags" },
      ]
    case "opportunity":
      return [
        { id: "name", name: "Name", type: "text" },
        { id: "company", name: "Company", type: "relation" },
        { id: "amount", name: "Amount", type: "currency" },
        { id: "stage", name: "Stage", type: "select" },
        { id: "owner", name: "Owner", type: "user" },
        { id: "probability", name: "Probability", type: "number" },
        { id: "expectedClose", name: "Expected Close", type: "date" },
        { id: "source", name: "Source", type: "select" },
        { id: "description", name: "Description", type: "text" },
        { id: "lastContact", name: "Last Contact", type: "date" },
        { id: "nextStep", name: "Next Step", type: "text" },
      ]
    case "capital-call":
      return [
        { id: "fundName", name: "Fund Name", type: "text" },
        { id: "callNumber", name: "Call Number", type: "text" },
        { id: "callAmount", name: "Call Amount", type: "currency" },
        { id: "commitmentAmount", name: "Commitment Amount", type: "currency" },
        { id: "dueDate", name: "Due Date", type: "date" },
        { id: "noticeDate", name: "Notice Date", type: "date" },
        { id: "investor", name: "Investor", type: "relation" },
        { id: "fundManager", name: "Fund Manager", type: "text" },
        { id: "purpose", name: "Purpose", type: "text" },
        { id: "remainingCommitment", name: "Remaining Commitment", type: "currency" },
      ]
    case "document":
      return [
        { id: "name", name: "Name", type: "text" },
        { id: "type", name: "Type", type: "select" },
        { id: "status", name: "Status", type: "select" },
        { id: "owner", name: "Owner", type: "user" },
        { id: "createdAt", name: "Created At", type: "date" },
        { id: "updatedAt", name: "Updated At", type: "date" },
        { id: "size", name: "Size", type: "number" },
        { id: "tags", name: "Tags", type: "tags" },
      ]
    default:
      return []
  }
}

const getAttributeIcon = (type: string) => {
  switch (type) {
    case "currency":
      return DollarSignIcon
    case "date":
      return CalendarIcon
    case "user":
    case "relation":
      return UserIcon
    case "text":
    default:
      return FileTextIcon
  }
}

export function WorkflowHeader({ workflowName, workflowConfig, onSave }: WorkflowHeaderProps) {
  const [config, setConfig] = React.useState<WorkflowConfig>(workflowConfig)
  const [activeTab, setActiveTab] = React.useState("details")
  const [showAddFields, setShowAddFields] = React.useState(false)
  const [showCustomField, setShowCustomField] = React.useState(false)
  const [customName, setCustomName] = React.useState("")
  const [customType, setCustomType] = React.useState("text")
  const [searchQuery, setSearchQuery] = React.useState("")

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleSave = () => {
    onSave(config)
    // Close the sheet by clicking the close button
    const element = document.querySelector('[data-state="open"]');
    if (element && element instanceof HTMLElement) {
      element.click();
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
      setShowCustomField(false)
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

  const tabs = [
    { id: "details", label: "Details", icon: FileTextIcon },
    { id: "activity", label: "Activity", icon: CalendarIcon },
    { id: "attributes", label: "Card Attributes", icon: LayoutIcon },
    { id: "stages", label: "Stages", icon: ListIcon },
  ]

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" title="Configure Workflow">
          <Settings2Icon className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex w-full max-w-2xl flex-col p-0 sm:max-w-2xl [&>button]:hidden">
        {/* Header - matches master-drawer pattern */}
        <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-background">
              Workflow Configuration
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>

        {/* Record Header - matches master-drawer pattern */}
        <div className="border-b bg-background px-6 py-2">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
              {workflowName.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-semibold">{workflowName}</h2>
              <p className="text-sm text-muted-foreground">Configure workflow settings</p>
            </div>
          </div>
        </div>

        {/* Tabs - matches master-drawer pattern */}
        <div className="border-b bg-background px-6">
          <div className="flex gap-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative whitespace-nowrap py-3 text-sm font-medium flex items-center gap-2 ${
                    activeTab === tab.id
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {tab.label}
                  {activeTab === tab.id && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"></span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "details" && (
            <MasterDetailsPanel 
              fieldGroups={[
                {
                  id: "workflow-info",
                  label: "Workflow Information",
                  icon: FileTextIcon,
                  fields: [
                    { 
                      label: "Workflow Name", 
                      value: (
                        <Input
                          value={config.name}
                          onChange={(e) => setConfig({ ...config, name: e.target.value })}
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
                        />
                      )
                    },
                  ],
                },
                {
                  id: "workflow-stats",
                  label: "Workflow Statistics",
                  icon: LayoutIcon,
                  fields: [
                    { label: "Object Type", value: <span className="text-sm capitalize">{config.objectType}</span> },
                    { label: "Card Fields", value: `${config.attributes.length} fields configured` },
                    { label: "Stages", value: `${config.stages.length} stages configured` },
                    { label: "Created", value: "January 15, 2024" },
                    { label: "Last Modified", value: "Today" },
                  ],
                },
              ]}
            />
          )}

          {activeTab === "activity" && (
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Workflow Activity</h3>
              <UnifiedActivitySection activities={generateWorkflowActivities()} />
            </div>
          )}

          {activeTab === "attributes" && (
            <div className="flex flex-col h-full">
              <div className="p-6 pb-3">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Card Fields</h3>
                  <Badge variant="secondary">
                    {config.attributes.length} field{config.attributes.length !== 1 ? "s" : ""}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {config.attributes.length > 0
                    ? "Drag to reorder how they appear on cards"
                    : "Add fields to display on your cards"}
                </p>
              </div>

              {/* Selected Fields List */}
              <div className="px-6 flex-1 overflow-auto">
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
                  <div className="text-center py-12 border border-dashed border-border rounded-lg bg-muted/50">
                    <div className="max-w-sm mx-auto">
                      <div className="text-muted-foreground mb-3">
                        <FileTextIcon className="h-8 w-8 mx-auto" />
                      </div>
                      <h4 className="text-sm font-medium mb-1">No fields selected</h4>
                      <p className="text-xs text-muted-foreground mb-4">
                        Choose which fields to display on your kanban cards
                      </p>
                      <Button size="sm" onClick={() => setShowAddFields(true)}>
                        <PlusIcon className="h-3 w-3 mr-1" />
                        Add Your First Field
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Add Field Section - matches drawer pattern */}
              <div className="border-t mt-auto">
                <div
                  className={`p-3 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors ${
                    showAddFields ? "bg-muted/50" : ""
                  }`}
                  onClick={() => setShowAddFields(!showAddFields)}
                >
                  <div className="flex items-center gap-2 text-sm font-medium text-primary">
                    <PlusIcon className="h-4 w-4" />
                    Add Field
                  </div>
                  <div>
                    {showAddFields ? (
                      <ChevronUpIcon className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {showAddFields && (
                  <div className="p-4 border-t bg-muted/50">
                    {/* Search and Custom Field Toggle */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative flex-1">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search fields..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9 h-8 text-sm"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowCustomField(!showCustomField)}
                        className="whitespace-nowrap h-8 text-xs"
                      >
                        {showCustomField ? "Cancel" : "Create Custom"}
                      </Button>
                    </div>

                    {/* Custom Field Creator */}
                    {showCustomField && (
                      <div className="mb-4 p-3 bg-background rounded-lg border shadow-sm">
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="customName" className="text-xs font-medium">
                              Field Name
                            </Label>
                            <Input
                              id="customName"
                              placeholder="Enter field name"
                              value={customName}
                              onChange={(e) => setCustomName(e.target.value)}
                              className="h-8 text-sm mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="customType" className="text-xs font-medium">
                              Field Type
                            </Label>
                            <Select value={customType} onValueChange={setCustomType}>
                              <SelectTrigger id="customType" className="h-8 text-sm mt-1">
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
                          <div className="pt-1">
                            <Button
                              size="sm"
                              onClick={createCustomField}
                              disabled={!customName.trim()}
                              className="w-full"
                            >
                              Create Field
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Available Fields List */}
                    <div className="max-h-48 overflow-y-auto rounded-lg border bg-background">
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
                          {searchQuery ? "No fields match your search" : "All available fields have been added"}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "stages" && (
            <div className="p-6 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Workflow Stages</h3>
                    <p className="text-sm text-muted-foreground mt-1">Drag to reorder columns on your kanban board</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{config.stages.length} stages</Badge>
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
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
