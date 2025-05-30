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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
      className="group flex items-center space-x-3 rounded-lg border border-gray-200 bg-white p-3 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition-colors"
      >
        <GripVerticalIcon className="h-4 w-4" />
      </div>

      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Icon className="h-4 w-4 text-gray-400 flex-shrink-0" />

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
            <div className="font-medium text-sm text-gray-900">{attribute.name}</div>
            <div className="text-xs text-gray-500 capitalize">{attribute.type}</div>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-1">
        {isEditing ? (
          <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={handleSaveEdit}
            >
              <CheckIcon className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              onClick={handleCancelEdit}
            >
              <XIcon className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {attribute.isCustom && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
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
              className="h-6 w-6 text-gray-400 hover:text-red-600 hover:bg-red-50"
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
      className="group flex items-center space-x-3 rounded-xl border border-gray-200 bg-white p-4 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition-colors"
      >
        <GripVerticalIcon className="h-4 w-4" />
      </div>

      <div className={`w-6 h-6 rounded-md ${stage.color} border border-gray-200 flex-shrink-0`} />

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
                    editColor === option.value ? "border-blue-500 scale-105" : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setEditColor(option.value)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="font-medium text-sm text-gray-900">{stage.name}</div>
        )}
      </div>

      <div className="flex items-center space-x-1">
        {isEditing ? (
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={handleSaveEdit}
            >
              <CheckIcon className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              onClick={handleCancelEdit}
            >
              <XIcon className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
              onClick={() => setIsEditing(true)}
            >
              <EditIcon className="h-3 w-3" />
            </Button>
            {canDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-gray-400 hover:text-red-600 hover:bg-red-50"
                onClick={() => onDelete(stage.id)}
              >
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
  const [open, setOpen] = React.useState(false)
  const [config, setConfig] = React.useState<WorkflowConfig>(workflowConfig)
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
    setOpen(false)
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

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        title="Configure Workflow"
      >
        <Settings2Icon className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] p-0">
          <DialogHeader className="px-6 py-4 border-b border-gray-100">
            <DialogTitle className="text-lg font-semibold text-gray-900">Configure: {workflowName}</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="general" className="flex-1">
            <div className="px-6 py-2 border-b border-gray-100">
              <TabsList className="grid w-full grid-cols-3 bg-gray-50">
                <TabsTrigger value="general" className="data-[state=active]:bg-white">
                  General
                </TabsTrigger>
                <TabsTrigger value="attributes" className="data-[state=active]:bg-white">
                  Card Attributes
                </TabsTrigger>
                <TabsTrigger value="stages" className="data-[state=active]:bg-white">
                  Stages
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="general" className="p-6 space-y-6 m-0">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Workflow Name
                    </Label>
                    <Input
                      id="name"
                      value={config.name}
                      onChange={(e) => setConfig({ ...config, name: e.target.value })}
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={config.description}
                      onChange={(e) => setConfig({ ...config, description: e.target.value })}
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="objectType" className="text-sm font-medium text-gray-700">
                      Object Type
                    </Label>
                    <Select
                      value={config.objectType}
                      onValueChange={(value) => setConfig({ ...config, objectType: value })}
                    >
                      <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="task">Task</SelectItem>
                        <SelectItem value="opportunity">Opportunity</SelectItem>
                        <SelectItem value="capital-call">Capital Call</SelectItem>
                        <SelectItem value="document">Document</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="attributes" className="p-0 m-0 flex flex-col h-full">
                <div className="p-6 pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Card Fields</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {config.attributes.length > 0
                          ? "Drag to reorder how they appear on cards"
                          : "Add fields to display on your cards"}
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                      {config.attributes.length} field{config.attributes.length !== 1 ? "s" : ""}
                    </Badge>
                  </div>
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
                    <div className="text-center py-12 border border-dashed border-gray-200 rounded-lg bg-gray-50">
                      <div className="max-w-sm mx-auto">
                        <div className="text-gray-400 mb-3">
                          <FileTextIcon className="h-8 w-8 mx-auto" />
                        </div>
                        <h4 className="text-sm font-medium text-gray-900 mb-1">No fields selected</h4>
                        <p className="text-xs text-gray-500 mb-4">
                          Choose which fields to display on your kanban cards
                        </p>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() => setShowAddFields(true)}
                        >
                          <PlusIcon className="h-3 w-3 mr-1" />
                          Add Your First Field
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Add Field Section - Inline at the bottom */}
                <div className="border-t border-gray-100 mt-auto">
                  <div
                    className={`p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors ${
                      showAddFields ? "bg-gray-50" : ""
                    }`}
                    onClick={() => setShowAddFields(!showAddFields)}
                  >
                    <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
                      <PlusIcon className="h-4 w-4" />
                      Add Field
                    </div>
                    <div>
                      {showAddFields ? (
                        <ChevronUpIcon className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {showAddFields && (
                    <div className="p-4 border-t border-gray-100 bg-gray-50">
                      {/* Search and Custom Field Toggle */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="relative flex-1">
                          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Search fields..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-8 text-sm border-gray-200"
                          />
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowCustomField(!showCustomField)}
                          className="whitespace-nowrap h-8 text-xs border-gray-200"
                        >
                          {showCustomField ? "Cancel" : "Create Custom"}
                        </Button>
                      </div>

                      {/* Custom Field Creator */}
                      {showCustomField && (
                        <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                          <div className="space-y-3">
                            <div>
                              <Label htmlFor="customName" className="text-xs font-medium text-gray-700">
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
                              <Label htmlFor="customType" className="text-xs font-medium text-gray-700">
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
                      <div className="max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white">
                        {filteredAvailableFields.length > 0 ? (
                          <div className="divide-y divide-gray-100">
                            {filteredAvailableFields.map((field) => {
                              const Icon = getAttributeIcon(field.type)
                              return (
                                <div
                                  key={field.id}
                                  className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                                  onClick={() => addField(field)}
                                >
                                  <Icon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-gray-900">{field.name}</div>
                                    <div className="text-xs text-gray-500 capitalize">{field.type}</div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 p-0 rounded-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                  >
                                    <PlusIcon className="h-4 w-4" />
                                  </Button>
                                </div>
                              )
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-sm text-gray-500">
                            {searchQuery ? "No fields match your search" : "All available fields have been added"}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="stages" className="p-6 space-y-6 m-0">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Workflow Stages</h3>
                        <p className="text-xs text-gray-500 mt-1">Drag to reorder columns on your kanban board</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                          {config.stages.length} stages
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={addStage}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
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
                        <div className="space-y-2 max-h-[400px] overflow-y-auto rounded-lg border border-gray-100 bg-gray-50 p-2">
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
              </TabsContent>
            </div>
          </Tabs>

          <div className="flex justify-end space-x-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
            <Button variant="outline" onClick={() => setOpen(false)} className="border-gray-300">
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
