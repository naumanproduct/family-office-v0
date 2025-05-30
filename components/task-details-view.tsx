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
  PlusIcon,
  CircleIcon,
  ClockIcon,
  DotIcon as DotsHorizontalIcon,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

  const [subtasks, setSubtasks] = React.useState([
    {
      id: "SUBTASK-1",
      title: "Review financial statements",
      status: "Completed",
      assignee: "John Smith",
      dueDate: "2023-05-18T17:00:00Z",
    },
    {
      id: "SUBTASK-2",
      title: "Analyze market conditions",
      status: "In Progress",
      assignee: "Sarah Johnson",
      dueDate: "2023-05-20T17:00:00Z",
    },
    {
      id: "SUBTASK-3",
      title: "Prepare investment memo",
      status: "To Do",
      assignee: "Michael Brown",
      dueDate: "2023-05-22T17:00:00Z",
    },
  ])
  const [newSubtaskTitle, setNewSubtaskTitle] = React.useState("")
  const [isAddingSubtask, setIsAddingSubtask] = React.useState(false)

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

  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      const newSubtask = {
        id: `SUBTASK-${Date.now()}`,
        title: newSubtaskTitle.trim(),
        status: "To Do",
        assignee: "Unassigned",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      }
      setSubtasks([...subtasks, newSubtask])
      setNewSubtaskTitle("")
      setIsAddingSubtask(false)
    }
  }

  const handleSubtaskStatusChange = (subtaskId: string, newStatus: string) => {
    setSubtasks(subtasks.map((subtask) => (subtask.id === subtaskId ? { ...subtask, status: newStatus } : subtask)))
  }

  const handleDeleteSubtask = (subtaskId: string) => {
    setSubtasks(subtasks.filter((subtask) => subtask.id !== subtaskId))
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

            {/* Subtasks Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Subtasks ({subtasks.length})</h4>
                <Button variant="outline" size="sm" onClick={() => setIsAddingSubtask(true)} className="h-8">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Subtask
                </Button>
              </div>

              <div className="space-y-2">
                {subtasks.map((subtask) => (
                  <div key={subtask.id} className="rounded-lg border border-muted bg-muted/10 p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => {
                            const newStatus = subtask.status === "Completed" ? "To Do" : "Completed"
                            handleSubtaskStatusChange(subtask.id, newStatus)
                          }}
                        >
                          {subtask.status === "Completed" ? (
                            <CheckCircleIcon className="h-4 w-4 text-green-500" />
                          ) : subtask.status === "In Progress" ? (
                            <ClockIcon className="h-4 w-4 text-blue-500" />
                          ) : (
                            <CircleIcon className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                        <div className="flex-1">
                          <div
                            className={`text-sm font-medium ${subtask.status === "Completed" ? "line-through text-muted-foreground" : ""}`}
                          >
                            {subtask.title}
                          </div>
                          <div className="flex items-center gap-4 mt-1">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <UserIcon className="h-3 w-3" />
                              {subtask.assignee}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <CalendarIcon className="h-3 w-3" />
                              {new Date(subtask.dueDate).toLocaleDateString()}
                            </div>
                            <Badge
                              variant={
                                subtask.status === "Completed"
                                  ? "default"
                                  : subtask.status === "In Progress"
                                    ? "secondary"
                                    : "outline"
                              }
                              className="text-xs"
                            >
                              {subtask.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <DotsHorizontalIcon className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleSubtaskStatusChange(subtask.id, "To Do")}>
                            Mark as To Do
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSubtaskStatusChange(subtask.id, "In Progress")}>
                            Mark as In Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSubtaskStatusChange(subtask.id, "Completed")}>
                            Mark as Completed
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteSubtask(subtask.id)}
                            className="text-destructive"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}

                {/* Add New Subtask */}
                {isAddingSubtask && (
                  <div className="rounded-lg border border-muted bg-muted/10 p-3">
                    <div className="flex items-center gap-2">
                      <CircleIcon className="h-4 w-4 text-muted-foreground" />
                      <Input
                        value={newSubtaskTitle}
                        onChange={(e) => setNewSubtaskTitle(e.target.value)}
                        placeholder="Enter subtask title..."
                        className="flex-1 h-8"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleAddSubtask()
                          }
                          if (e.key === "Escape") {
                            setIsAddingSubtask(false)
                            setNewSubtaskTitle("")
                          }
                        }}
                        autoFocus
                      />
                      <Button size="sm" onClick={handleAddSubtask} className="h-8">
                        Add
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setIsAddingSubtask(false)
                          setNewSubtaskTitle("")
                        }}
                        className="h-8"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {subtasks.length === 0 && !isAddingSubtask && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckSquareIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No subtasks yet</p>
                    <p className="text-xs">Break down this task into smaller steps</p>
                  </div>
                )}
              </div>
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
