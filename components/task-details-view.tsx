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
  ChevronLeftIcon,
  MessageSquareIcon,
  EditIcon,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface TaskDetailsViewProps {
  task: any
  onBack: () => void
  recordName: string
  parentTask?: any
  onBackToParent?: () => void
  isInDrawer?: boolean
  onNavigateBack?: () => void
  onSubtaskClick?: (subtask: any) => void
  isFullScreen?: boolean
}

export function TaskDetailsView({ task, onBack, recordName, parentTask, onBackToParent, isInDrawer, onNavigateBack, onSubtaskClick, isFullScreen = false }: TaskDetailsViewProps) {
  const [commentText, setCommentText] = React.useState("")
  const [taskTitle, setTaskTitle] = React.useState(task.title || "")
  const [isEditingTitle, setIsEditingTitle] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState(isFullScreen ? "activity" : "details")
  const [editingField, setEditingField] = React.useState<string | null>(null)
  const [fieldValues, setFieldValues] = React.useState({
    description: task.description || "Complete due diligence review for the investment opportunity",
    priority: task.priority || "High",
    status: task.status || "In Progress",
    assignee: task.assignee || "John Smith",
    dueDate: task.dueDate || "2023-05-25",
  })

  const [subtasks, setSubtasks] = React.useState(
    task.subtasks || [
      {
        id: "SUBTASK-1",
        title: "Review financial statements",
        description: "Analyze the company's financial performance over the last 3 years",
        status: "Completed",
        priority: "High",
        assignee: "John Smith",
        dueDate: "2023-05-18",
      },
      {
        id: "SUBTASK-2",
        title: "Analyze market conditions",
        description: "Research industry trends and competitive landscape",
        status: "In Progress",
        priority: "Medium",
        assignee: "Sarah Johnson",
        dueDate: "2023-05-20",
      },
      {
        id: "SUBTASK-3",
        title: "Prepare investment memo",
        description: "Draft comprehensive investment recommendation",
        status: "To Do",
        priority: "High",
        assignee: "Michael Brown",
        dueDate: "2023-05-22",
      },
    ],
  )
  const [newSubtaskTitle, setNewSubtaskTitle] = React.useState("")
  const [isAddingSubtask, setIsAddingSubtask] = React.useState(false)
  const [selectedSubtask, setSelectedSubtask] = React.useState<any>(null)

  // Tabs depend on whether we're in fullscreen mode
  const tabs = isFullScreen 
    ? [
        { id: "activity", label: "Activity", icon: ClockIcon },
        { id: "subtasks", label: "Subtasks", icon: CheckSquareIcon },
        { id: "comments", label: "Comments", icon: MessageSquareIcon },
      ]
    : [
        { id: "details", label: "Details", icon: FileTextIcon }
      ]

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
      case "to do":
        return "bg-gray-100 text-gray-800"
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
        description: "",
        status: "To Do",
        priority: "Medium",
        assignee: "Unassigned",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      }
      setSubtasks([...subtasks, newSubtask])
      setNewSubtaskTitle("")
      setIsAddingSubtask(false)
    }
  }

  const handleSubtaskStatusChange = (subtaskId: string, newStatus: string) => {
    setSubtasks(subtasks.map((subtask: any) => (subtask.id === subtaskId ? { ...subtask, status: newStatus } : subtask)))
  }

  const handleDeleteSubtask = (subtaskId: string) => {
    setSubtasks(subtasks.filter((subtask: any) => subtask.id !== subtaskId))
  }

  const handleSubtaskClick = (subtask: any) => {
    if (onSubtaskClick) {
      // If parent provided a subtask click handler, use it
      onSubtaskClick(subtask)
    } else {
      // Otherwise, handle locally
      setSelectedSubtask(subtask)
    }
  }

  const handleBackFromSubtask = () => {
    setSelectedSubtask(null)
  }

  // Determine the correct back handler
  const getBackHandler = () => {
    if (selectedSubtask) {
      // If we're viewing a subtask, return to the parent task
      return handleBackFromSubtask
    } else if (parentTask && onBackToParent) {
      // If we're viewing a subtask of another task, return to that parent
      return onBackToParent
    } else if (isInDrawer && onNavigateBack) {
      // If we're in a drawer and have a navigation handler, use it
      return onNavigateBack
    } else {
      // Default back behavior
      return onBack
    }
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

  // Render content based on active tab (for fullscreen mode)
  const renderContent = () => {
    if (!isFullScreen) {
      // If not in fullscreen, always render the details tab content
      return renderDetailsTab();
    }

    switch (activeTab) {
      case "subtasks":
        return renderSubtasksTab();
      case "comments":
        return renderCommentsTab();
      case "activity":
      default:
        return renderActivityTab();
    }
  }

  // Details tab content
  const renderDetailsTab = () => {
    return (
      <div className="space-y-6">
        {/* Fields Section */}
        <div className="space-y-3">
          {renderEditableField("status", fieldValues.status, <CircleIcon className="h-4 w-4 text-blue-500" />, "Status", true)}
          {renderEditableField("priority", fieldValues.priority, <AlertTriangleIcon className="h-4 w-4 text-amber-500" />, "Priority", true)}
          {renderEditableField("assignee", fieldValues.assignee, <UserIcon className="h-4 w-4 text-purple-500" />, "Assignee")}
          {renderEditableField("dueDate", fieldValues.dueDate, <CalendarIcon className="h-4 w-4 text-red-500" />, "Due Date")}
        </div>

        {/* Description Section */}
        <div>
          <h3 className="text-sm font-medium mb-2">Description</h3>
          <div className="p-3 border rounded-md bg-muted/20">
            <p className="text-sm text-muted-foreground">{fieldValues.description}</p>
          </div>
        </div>

        {/* Subtasks Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Subtasks ({subtasks.length})</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsAddingSubtask(true)}>
              <PlusIcon className="h-3.5 w-3.5 mr-1" />
              Add subtask
            </Button>
          </div>

          {isAddingSubtask ? (
            <div className="p-3 border rounded-md mb-3">
              <Input
                placeholder="Enter subtask title..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                className="mb-2"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsAddingSubtask(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleAddSubtask}>
                  Add
                </Button>
              </div>
            </div>
          ) : null}

          <div className="space-y-2">
            {subtasks.map((subtask: any) => (
              <div
                key={subtask.id}
                className="p-3 border rounded-md hover:bg-muted/30 cursor-pointer transition-colors"
                onClick={() => handleSubtaskClick(subtask)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      className={`text-xs ${getStatusColor(subtask.status)}`}
                    >
                      {subtask.status}
                    </Badge>
                    <span className="font-medium text-sm">{subtask.title}</span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <DotsHorizontalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        handleSubtaskStatusChange(subtask.id, "To Do");
                      }}>
                        Mark as To Do
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        handleSubtaskStatusChange(subtask.id, "In Progress");
                      }}>
                        Mark as In Progress
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        handleSubtaskStatusChange(subtask.id, "Completed");
                      }}>
                        Mark as Completed
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSubtask(subtask.id);
                        }}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Due {subtask.dueDate} • Assigned to {subtask.assignee}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comments Section */}
        <div>
          <h3 className="text-sm font-medium mb-2">Comments</h3>
          <TypableArea
            placeholder="Add a comment..."
            value={commentText}
            onChange={setCommentText}
            onSubmit={handleCommentSubmit}
          />
        </div>
      </div>
    );
  }

  // Subtasks tab content (for fullscreen mode)
  const renderSubtasksTab = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">Subtasks ({subtasks.length})</h3>
          <Button variant="outline" size="sm" onClick={() => setIsAddingSubtask(true)}>
            <PlusIcon className="h-3.5 w-3.5 mr-1" />
            Add subtask
          </Button>
        </div>

        {isAddingSubtask ? (
          <div className="p-3 border rounded-md mb-3">
            <Input
              placeholder="Enter subtask title..."
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              className="mb-2"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsAddingSubtask(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleAddSubtask}>
                Add
              </Button>
            </div>
          </div>
        ) : null}

        <div className="space-y-2">
          {subtasks.map((subtask: any) => (
            <div
              key={subtask.id}
              className="p-3 border rounded-md hover:bg-muted/30 cursor-pointer transition-colors"
              onClick={() => handleSubtaskClick(subtask)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge
                    className={`text-xs ${getStatusColor(subtask.status)}`}
                  >
                    {subtask.status}
                  </Badge>
                  <span className="font-medium text-sm">{subtask.title}</span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <DotsHorizontalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      handleSubtaskStatusChange(subtask.id, "To Do");
                    }}>
                      Mark as To Do
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      handleSubtaskStatusChange(subtask.id, "In Progress");
                    }}>
                      Mark as In Progress
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      handleSubtaskStatusChange(subtask.id, "Completed");
                    }}>
                      Mark as Completed
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSubtask(subtask.id);
                      }}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                Due {subtask.dueDate} • Assigned to {subtask.assignee}
              </div>
              <div className="mt-2 text-xs">
                <p className="text-muted-foreground">{subtask.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Activity tab content (for fullscreen mode)
  const renderActivityTab = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
              <EditIcon className="h-4 w-4 text-blue-700" />
            </div>
            <div>
              <div className="flex gap-2 text-sm">
                <span className="font-medium">You</span>
                <span className="text-muted-foreground">updated the status</span>
              </div>
              <p className="text-xs text-muted-foreground">Yesterday at 3:45 PM</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
              <UserIcon className="h-4 w-4 text-green-700" />
            </div>
            <div>
              <div className="flex gap-2 text-sm">
                <span className="font-medium">John Smith</span>
                <span className="text-muted-foreground">assigned the task to</span>
                <span className="font-medium">You</span>
              </div>
              <p className="text-xs text-muted-foreground">2 days ago at 10:30 AM</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
              <PlusIcon className="h-4 w-4 text-purple-700" />
            </div>
            <div>
              <div className="flex gap-2 text-sm">
                <span className="font-medium">Sarah Johnson</span>
                <span className="text-muted-foreground">created the task</span>
              </div>
              <p className="text-xs text-muted-foreground">3 days ago at 2:15 PM</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Comments tab content (for fullscreen mode)
  const renderCommentsTab = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Comments</h3>
        <TypableArea
          placeholder="Add a comment..."
          value={commentText}
          onChange={setCommentText}
          onSubmit={handleCommentSubmit}
        />
        <div className="space-y-4">
          <div className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>JS</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">John Smith</span>
                <span className="text-xs text-muted-foreground">2 days ago</span>
              </div>
              <p className="text-sm mt-1">
                I've reviewed the financial statements and everything looks good. Ready to move forward with the next steps.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>SJ</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">Sarah Johnson</span>
                <span className="text-xs text-muted-foreground">3 days ago</span>
              </div>
              <p className="text-sm mt-1">
                Let's schedule a call with the client to discuss the preliminary findings.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If a subtask is selected, render the subtask view
  if (selectedSubtask) {
    return (
      <TaskDetailsView
        task={selectedSubtask}
        onBack={handleBackFromSubtask}
        recordName={taskTitle}
        parentTask={task}
        onBackToParent={handleBackFromSubtask}
        isInDrawer={isInDrawer}
        onNavigateBack={onNavigateBack}
        onSubtaskClick={onSubtaskClick}
        isFullScreen={isFullScreen}
      />
    )
  }

  // For fullscreen mode, implement a two-panel layout
  if (isFullScreen) {
    return (
      <div className="flex h-full">
        {/* Left Panel - Details (fixed) */}
        <div className="w-96 border-r overflow-auto p-6 bg-background">
          <div className="space-y-6">
            {/* Fields Section */}
            <div className="space-y-3">
              {renderEditableField("status", fieldValues.status, <CircleIcon className="h-4 w-4 text-blue-500" />, "Status", true)}
              {renderEditableField("priority", fieldValues.priority, <AlertTriangleIcon className="h-4 w-4 text-amber-500" />, "Priority", true)}
              {renderEditableField("assignee", fieldValues.assignee, <UserIcon className="h-4 w-4 text-purple-500" />, "Assignee")}
              {renderEditableField("dueDate", fieldValues.dueDate, <CalendarIcon className="h-4 w-4 text-red-500" />, "Due Date")}
            </div>

            {/* Description Section */}
            <div>
              <h3 className="text-sm font-medium mb-2">Description</h3>
              <div className="p-3 border rounded-md bg-muted/20">
                <p className="text-sm text-muted-foreground">{fieldValues.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Tab Content */}
        <div className="flex-1 overflow-auto">
          {/* Tabs */}
          <div className="border-b bg-background px-6">
            <div className="flex gap-6 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex items-center gap-2 whitespace-nowrap py-3 text-sm font-medium transition-colors ${
                      activeTab === tab.id ? "text-foreground border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"
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
          <div className="p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    )
  }

  // Standard drawer view
  return (
    <div className="flex flex-col flex-1">
      {/* Task Header */}
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
            <p className="text-sm text-muted-foreground">
              Task • {task.id} • {parentTask ? `Subtask of ${parentTask.title}` : `Related to ${recordName}`}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
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
        {renderContent()}
      </div>
    </div>
  )
}
