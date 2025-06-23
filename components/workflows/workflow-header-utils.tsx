"use client"

import * as React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { 
  GripVerticalIcon, 
  EditIcon, 
  XIcon, 
  CheckIcon,
  DollarSignIcon,
  CalendarIcon,
  UserIcon,
  FileTextIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export interface WorkflowAttribute {
  id: string
  name: string
  type: string
  isCustom?: boolean
}

export interface WorkflowStage {
  id: string
  name: string
  color: string
}

export interface WorkflowConfig {
  name: string
  description: string
  objectType: string
  attributes: WorkflowAttribute[]
  stages: WorkflowStage[]
}

// Helper function to get attributes based on object type
export function getAttributesForObjectType(objectType: string): WorkflowAttribute[] {
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
    case "investment":
      return [
        { id: "name", name: "Investment Name", type: "text" },
        { id: "type", name: "Investment Type", type: "select" },
        { id: "amount", name: "Amount Invested", type: "currency" },
        { id: "date", name: "Investment Date", type: "date" },
        { id: "status", name: "Status", type: "select" },
        { id: "owner", name: "Owner", type: "user" },
      ]
    case "person":
      return [
        { id: "firstName", name: "First Name", type: "text" },
        { id: "lastName", name: "Last Name", type: "text" },
        { id: "role", name: "Role", type: "text" },
        { id: "email", name: "Email", type: "text" },
        { id: "phone", name: "Phone", type: "text" },
      ]
    case "company":
      return [
        { id: "name", name: "Company Name", type: "text" },
        { id: "industry", name: "Industry", type: "text" },
        { id: "size", name: "Company Size", type: "number" },
        { id: "country", name: "Country", type: "text" },
        { id: "founded", name: "Founded", type: "date" },
        { id: "website", name: "Website", type: "text" },
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

export const getAttributeIcon = (type: string) => {
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

// Sortable attribute item component for selected fields
export function SelectedAttributeItem({
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
export function SortableStageItem({
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
