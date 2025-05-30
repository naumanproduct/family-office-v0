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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
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

// Sortable attribute item component
function SortableAttributeItem({
  attribute,
  isSelected,
  onToggle,
  onEdit,
  onDelete,
}: {
  attribute: WorkflowAttribute
  isSelected: boolean
  onToggle: () => void
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
      className={`group flex items-center space-x-3 rounded-lg border p-3 cursor-pointer transition-all duration-200 ${
        isSelected
          ? "border-white bg-white shadow-sm"
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
      }`}
      onClick={!isEditing ? onToggle : undefined}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition-colors"
      >
        <GripVerticalIcon className="h-4 w-4" />
      </div>

      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Icon className="h-4 w-4 text-gray-400" />

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
  const [newAttributeName, setNewAttributeName] = React.useState("")
  const [newAttributeType, setNewAttributeType] = React.useState("text")
  const [showAddAttribute, setShowAddAttribute] = React.useState(false)
  const [showAvailableFields, setShowAvailableFields] = React.useState(true)

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

  const toggleAttribute = (attributeId: string) => {
    const isSelected = config.attributes.some((attr) => attr.id === attributeId)

    if (isSelected) {
      setConfig({
        ...config,
        attributes: config.attributes.filter((attr) => attr.id !== attributeId),
      })
    } else {
      const attribute = getAttributesForObjectType(config.objectType).find((attr) => attr.id === attributeId)
      if (attribute) {
        setConfig({
          ...config,
          attributes: [...config.attributes, { ...attribute }],
        })
      }
    }
  }

  const addCustomAttribute = () => {
    if (newAttributeName.trim()) {
      const newAttribute: WorkflowAttribute = {
        id: `custom-${Date.now()}`,
        name: newAttributeName,
        type: newAttributeType,
        isCustom: true,
      }
      setConfig({
        ...config,
        attributes: [...config.attributes, newAttribute],
      })
      setNewAttributeName("")
      setNewAttributeType("text")
      setShowAddAttribute(false)
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

  const getAvailableAttributes = () => {
    const allAttributes = getAttributesForObjectType(config.objectType)
    return allAttributes.filter((attr) => !config.attributes.some((selected) => selected.id === attr.id))
  }

  const allAttributes = getAttributesForObjectType(config.objectType)
  const isAttributeSelected = (attributeId: string) => {
    return config.attributes.some((attr) => attr.id === attributeId)
  }

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

              <TabsContent value="attributes" className="p-6 space-y-6 m-0">
                <div className="space-y-6">
                  {/* Selected Fields Section with Reordering */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Selected Fields</h3>
                        <p className="text-xs text-gray-500 mt-1">Drag to reorder how they appear on cards</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                          {config.attributes.length} selected
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowAvailableFields(!showAvailableFields)}
                          className="text-gray-600 border-gray-200 hover:bg-gray-50"
                        >
                          {showAvailableFields ? "Hide Available Fields" : "Add More Fields"}
                        </Button>
                      </div>
                    </div>

                    {config.attributes.length > 0 ? (
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleAttributeDragEnd}
                      >
                        <SortableContext
                          items={config.attributes.map((attr) => attr.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="space-y-2 max-h-64 overflow-y-auto rounded-lg border border-gray-100 bg-gray-50 p-2">
                            {config.attributes.map((attribute) => (
                              <SortableAttributeItem
                                key={attribute.id}
                                attribute={attribute}
                                isSelected={true}
                                onToggle={() => {}}
                                onEdit={editAttribute}
                                onDelete={deleteAttribute}
                              />
                            ))}
                          </div>
                        </SortableContext>
                      </DndContext>
                    ) : (
                      <div className="text-center py-8 border border-dashed border-gray-200 rounded-lg bg-gray-50">
                        <p className="text-sm text-gray-500">No fields selected yet</p>
                        <p className="text-xs text-gray-400 mt-1">Select fields from the list below</p>
                      </div>
                    )}
                  </div>

                  {/* Available Fields Section (Collapsible) */}
                  {showAvailableFields && (
                    <div className="space-y-3 border-t border-gray-100 pt-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900">Available Fields</h3>
                        {config.objectType === "custom" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowAddAttribute(!showAddAttribute)}
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            <PlusIcon className="h-3 w-3 mr-1" />
                            Add Custom Field
                          </Button>
                        )}
                      </div>

                      {showAddAttribute && (
                        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex space-x-2">
                            <Input
                              placeholder="Field name"
                              value={newAttributeName}
                              onChange={(e) => setNewAttributeName(e.target.value)}
                              className="flex-1 h-8 text-sm"
                            />
                            <Select value={newAttributeType} onValueChange={setNewAttributeType}>
                              <SelectTrigger className="w-32 h-8 text-sm">
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
                            <Button
                              size="sm"
                              onClick={addCustomAttribute}
                              disabled={!newAttributeName.trim()}
                              className="h-8 px-3"
                            >
                              Add
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Note: Custom fields will be available to all workflows using this object type
                          </p>
                        </div>
                      )}

                      <ScrollArea className="h-64 border border-gray-200 rounded-lg">
                        <div className="p-2 space-y-2">
                          {getAvailableAttributes().map((attribute) => (
                            <div
                              key={attribute.id}
                              className="flex items-center space-x-3 rounded-lg border border-gray-200 p-3 cursor-pointer transition-all duration-200 bg-white hover:border-gray-300 hover:shadow-sm"
                              onClick={() => toggleAttribute(attribute.id)}
                            >
                              <div className="flex-1">
                                <div className="font-medium text-sm text-gray-900">{attribute.name}</div>
                                <div className="text-xs text-gray-500 capitalize">{attribute.type}</div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs border-gray-200 hover:bg-gray-50"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleAttribute(attribute.id)
                                }}
                              >
                                Add
                              </Button>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>

                      {getAvailableAttributes().length === 0 && (
                        <div className="text-center py-4 text-sm text-gray-500">
                          All available fields have been selected
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="stages" className="p-6 space-y-6 m-0">
                <div className="space-y-6">
                  {/* Stages Reordering Section */}
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
