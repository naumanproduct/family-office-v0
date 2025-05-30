"use client"

import * as React from "react"
import {
  CheckCircleIcon,
  CalendarIcon,
  UserIcon,
  AlertTriangleIcon,
  FileTextIcon,
  CheckSquareIcon,
  InfoIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { TypableArea } from "@/components/typable-area"

interface TaskDetailsViewProps {
  task: any
  onBack: () => void
  recordName: string
}

export function TaskDetailsView({ task, onBack, recordName }: TaskDetailsViewProps) {
  const [commentText, setCommentText] = React.useState("")
  const [taskTitle, setTaskTitle] = React.useState(task.title || "")
  const [isEditingTitle, setIsEditingTitle] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("details")
  const [editingField, setEditingField] = React.useState<string | null>(null)
  const [fieldValues, setFieldValues] = React.useState({
    description: task.description,
    priority: task.priority,
    status: task.status,
    assignee: task.assignee,
    dueDate: task.dueDate,
  })

  const tabs = [{ id: "details", label: "Details", icon: InfoIcon }]

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "in progress":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleFieldEdit = (field: string, value: string) => {
    setFieldValues((prev) => ({ ...prev, [field]: value }))
    setEditingField(null)
  }

  const handleCommentSubmit = (comment: string) => {
    console.log("Adding comment:", comment)
    // Handle comment submission here
  }

  const renderEditableField = (field: string, value: string, icon: React.ReactNode, label: string, isBadge = false) => {
    const isEditing = editingField === field

    return (
      <div className="flex items-center gap-2">
        {icon}
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <Label className="text-xs text-muted-foreground">{label}</Label>
            {isEditing ? (
              <Input
                value={value}
                onChange={(e) => setFieldValues((prev) => ({ ...prev, [field]: e.target.value }))}
                onBlur={() => handleFieldEdit(field, value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleFieldEdit(field, value)
                  }
                  if (e.key === "Escape") {
                    setEditingField(null)
                  }
                }}
                className="h-6 text-sm w-32"
                autoFocus
              />
            ) : (
              <div
                className="cursor-pointer hover:bg-muted/50 px-2 py-1 rounded text-sm"
                onClick={() => setEditingField(field)}
              >
                {isBadge ? (
                  <Badge
                    className={`text-xs ${field === "priority" ? getPriorityColor(value) : getStatusColor(value)}`}
                  >
                    {value}
                  </Badge>
                ) : (
                  value
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1">
      {/* Task Header - Exact same placement as main drawer record header */}
      <div className="border-b bg-background px-6 py-2">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <CheckSquareIcon className="h-4 w-4" />
          </div>
          <div className="flex-1">
            {isEditingTitle ? (
              <Input
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setIsEditingTitle(false)
                  }
                  if (e.key === "Escape") {
                    setTaskTitle(task.title || "")
                    setIsEditingTitle(false)
                  }
                }}
                className="text-lg font-semibold border-none p-0 h-auto bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                autoFocus
              />
            ) : (
              <h2
                className="text-lg font-semibold cursor-pointer hover:bg-muted/50 px-1 py-0.5 rounded -ml-1"
                onClick={() => setIsEditingTitle(true)}
              >
                {taskTitle || "Untitled"}
              </h2>
            )}
            <p className="text-sm text-muted-foreground">Task in {recordName}</p>
          </div>
        </div>
      </div>

      {/* Tabs - Exact same styling as main drawer tabs */}
      <div className="border-b bg-background px-6 py-1">
        <div className="flex gap-6 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 whitespace-nowrap py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary rounded-full"></span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6 space-y-6">
        {activeTab === "details" && (
          <>
            {/* Task Details */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Task Details</h4>

              <div className="rounded-lg border border-muted bg-muted/10 p-4">
                <div className="space-y-3">
                  {renderEditableField(
                    "description",
                    fieldValues.description,
                    <FileTextIcon className="h-4 w-4 text-muted-foreground" />,
                    "Description",
                  )}

                  {renderEditableField(
                    "priority",
                    fieldValues.priority,
                    <AlertTriangleIcon className="h-4 w-4 text-muted-foreground" />,
                    "Priority",
                    true,
                  )}

                  {renderEditableField(
                    "status",
                    fieldValues.status,
                    <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />,
                    "Status",
                    true,
                  )}

                  {renderEditableField(
                    "assignee",
                    fieldValues.assignee,
                    <UserIcon className="h-4 w-4 text-muted-foreground" />,
                    "Assignee",
                  )}

                  {renderEditableField(
                    "dueDate",
                    fieldValues.dueDate,
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />,
                    "Due Date",
                  )}

                  <div className="flex items-center gap-2">
                    <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <Label className="text-xs text-muted-foreground">Related to</Label>
                        <p className="text-sm">{recordName}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Button variant="link" className="h-auto p-0 text-xs text-blue-600">
                Show all values
              </Button>
            </div>

            {/* Comments Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Add Comment</h4>

              <TypableArea
                value={commentText}
                onChange={setCommentText}
                placeholder="Add a comment about this task..."
                onSubmit={handleCommentSubmit}
                showButtons={true}
                submitLabel="Add comment"
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
