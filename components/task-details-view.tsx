"use client"

import * as React from "react"
import {
  CheckCircleIcon,
  CalendarIcon,
  UserIcon,
  AlertTriangleIcon,
  FileTextIcon,
  CheckSquareIcon,
  PlusIcon,
  CircleIcon,
  ClockIcon,
  DotIcon as DotsHorizontalIcon,
  ChevronLeftIcon,
  UserRoundIcon,
  BuildingIcon,
  LayoutIcon,
  DollarSignIcon,
  TrendingUpIcon,
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

import { NoteContent } from "@/components/shared/note-content"
import { FileContent } from "@/components/shared/file-content"
import { useTasks } from "./tasks-table"
import { UnifiedDetailsPanel, type DetailSection } from "@/components/shared/unified-details-panel"
import { UnifiedActivitySection } from "@/components/shared/unified-activity-section"
import { generateTaskActivities } from "@/components/shared/activity-generators"

interface TaskDetailsViewProps {
  task: any
  onBack: () => void
  recordName: string
  recordType?: string
  parentTask?: any
  onBackToParent?: () => void
  isInDrawer?: boolean
  onNavigateBack?: () => void
  onSubtaskClick?: (subtask: any) => void
  isFullScreen?: boolean
  hideSubtasks?: boolean
}

export function TaskDetailsView({
  task,
  onBack,
  recordName,
  recordType,
  parentTask,
  onBackToParent,
  isInDrawer,
  onNavigateBack,
  onSubtaskClick,
  isFullScreen = false,
  hideSubtasks = false,
}: TaskDetailsViewProps) {
  const [commentText, setCommentText] = React.useState("")
  const [taskTitle, setTaskTitle] = React.useState(task.title || "")
  const [isEditingTitle, setIsEditingTitle] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("details")
  const [editingField, setEditingField] = React.useState<string | null>(null)
  const [fieldValues, setFieldValues] = React.useState({
    description: task.description || "Complete due diligence review for the investment opportunity",
    priority: task.priority || "High",
    status: task.status || "In Progress",
    assignee: task.assignee || "John Smith",
    dueDate: task.dueDate || "2023-05-25",
  })

  // Get the tasks context for updating task status
  const tasksContext = useTasks();

  const [subtasks, setSubtasks] = React.useState(
    task.subtasks || (
      task.title?.includes("Update capital schedule") ? [
        {
          id: "SUBTASK-1",
          title: "Calculate pro-rata allocation for each LP",
          description: "Determine each limited partner's share based on their commitment percentage",
          status: "To Do",
          priority: "High",
          assignee: "Finance Team",
          dueDate: "2023-05-18",
        },
        {
          id: "SUBTASK-2", 
          title: "Update LP capital accounts in the system",
          description: "Record the capital call amounts in each LP's account ledger",
          status: "To Do",
          priority: "High",
          assignee: "Fund Administrator",
          dueDate: "2023-05-19",
        },
        {
          id: "SUBTASK-3",
          title: "Generate capital call notices for LPs",
          description: "Create formal call notices with payment instructions and wire details",
          status: "To Do",
          priority: "Medium",
          assignee: "Investor Relations",
          dueDate: "2023-05-20",
        },
        {
          id: "SUBTASK-4",
          title: "Update fund commitment tracker",
          description: "Reflect new called capital amounts and remaining uncalled commitments",
          status: "To Do",
          priority: "Medium",
          assignee: "Finance Team",
          dueDate: "2023-05-21",
        },
        {
          id: "SUBTASK-5",
          title: "Reconcile capital schedule with fund accounting",
          description: "Ensure capital schedule matches the fund's accounting records",
          status: "To Do",
          priority: "High",
          assignee: "Fund Controller",
          dueDate: "2023-05-22",
        },
      ] : [
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
      ]
    ),
  )
  const [newSubtaskTitle, setNewSubtaskTitle] = React.useState("")
  const [isAddingSubtask, setIsAddingSubtask] = React.useState(false)
  const [selectedSubtask, setSelectedSubtask] = React.useState<any>(null)

  const tabs = [
    { id: "details", label: "Details", icon: FileTextIcon },
    { id: "notes", label: "Notes", icon: FileTextIcon },
    { id: "files", label: "Files", icon: FileTextIcon },
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
    
    // If the field is status and we have a task context, update the global state
    if (field === "status" && tasksContext && task.id) {
      tasksContext.updateTaskStatus(task.id, value);
    }
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
    setSubtasks(
      subtasks.map((subtask: any) => (subtask.id === subtaskId ? { ...subtask, status: newStatus } : subtask)),
    )
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

  // Mock navigation handler for related records
  const navigateToRecord = (recordType: string, id: number) => {
    console.log(`Navigate to ${recordType} record with ID: ${id}`);
    // This would be implemented to navigate to the record
  };

  // Mock handler for adding a linked record
  const handleAddRecord = (sectionId: string) => {
    console.log(`Add new ${sectionId} record for ${task.title}`);
    // This would open the appropriate creation dialog
  };

  // Mock handler for removing a linked record
  const handleUnlinkRecord = (sectionId: string, id: number) => {
    console.log(`Unlink ${sectionId} record with ID ${id} from ${task.title}`);
    // This would handle removal of the relationship
  };

  // Mock data for related entities
  const relatedData = {
    companies: [
      { id: 1, name: "TechFlow Inc.", type: "Portfolio Company" },
      { id: 2, name: "Meridian Capital", type: "Investment Fund" },
    ],
    people: [
      { id: 1, name: "Sarah Johnson", role: "CEO" },
      { id: 2, name: "Michael Chen", role: "Investment Manager" },
    ],
    entities: [
      { id: 1, name: "Trust #1231", type: "Family Trust" },
      { id: 2, name: "Offshore Holdings LLC", type: "Holding Company" },
    ],
    investments: [
      { id: 1, name: "Series B Round", amount: "$5M" },
      { id: 2, name: "Series C Round", amount: "$10M" },
    ],
    opportunities: [
      { id: 1, name: "Expansion Funding", status: "In Discussion" },
      { id: 2, name: "Strategic Partnership", status: "Initial Review" },
    ],
  };

  // Custom subtasks section rendering
  const renderSubtasksSection = () => {
    if (parentTask || hideSubtasks) return null;

    return (
      <div className="space-y-2 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium">Subtasks ({subtasks.length})</h4>
          <Button variant="outline" size="sm" onClick={() => setIsAddingSubtask(true)} className="h-8">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Subtask
          </Button>
        </div>

        {subtasks.map((subtask: any) => (
          <div
            key={subtask.id}
            className="rounded-lg border border-muted bg-muted/10 p-3 hover:bg-muted/20 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div
                className="flex items-center gap-3 flex-1 cursor-pointer"
                onClick={() => handleSubtaskClick(subtask)}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    const newStatus = subtask.status === "Completed" ? "To Do" : "Completed"
                    // Update the local state
                    handleSubtaskStatusChange(subtask.id, newStatus)
                    
                    // If this is a task in the global context (has numeric ID), update global state too
                    if (tasksContext && !isNaN(Number(subtask.id))) {
                      tasksContext.updateTaskStatus(Number(subtask.id), newStatus);
                    }
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
                    <Badge className={`text-xs ${getPriorityColor(subtask.priority)}`}>
                      {subtask.priority}
                    </Badge>
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DotsHorizontalIcon className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleSubtaskClick(subtask)}>
                    Open Details
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
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
          <div className="text-center py-6 text-muted-foreground">
            <CheckSquareIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No subtasks yet</p>
            <p className="text-xs">Break down this task into smaller steps</p>
          </div>
        )}
      </div>
    );
  };

  // Custom comment section rendering (for activity)
  const renderCommentSection = () => {
    const activities = generateTaskActivities()

    if (isInDrawer) {
      return (
        <div className="mt-4">
          <UnifiedActivitySection activities={activities} />
        </div>
      );
    }

    return (
      <div className="space-y-4 mt-8">
        {/* Comment Input */}
        <TypableArea
          value={commentText}
          onChange={setCommentText}
          placeholder="Add a comment about this task..."
          onSubmit={handleCommentSubmit}
          showButtons={true}
          submitLabel="Add comment"
        />
        
        {/* Activity Section Heading */}
        <div className="mt-8 mb-2">
          <h4 className="text-sm font-medium">Activity</h4>
        </div>
        
        {/* Comments List */}
        <div className="mt-4">
          <UnifiedActivitySection activities={activities} />
        </div>
      </div>
    );
  };

  // Define all sections for the details panel 
  const sections: DetailSection[] = [
    {
      id: "details",
      title: "Task Details",
      icon: <FileTextIcon className="h-4 w-4 text-muted-foreground" />,
      fields: [
        {
          label: "Description",
          value: fieldValues.description,
        },
        {
          label: "Priority",
          value: <Badge className={getPriorityColor(fieldValues.priority)}>{fieldValues.priority}</Badge>
        },
        {
          label: "Status",
          value: <Badge className={getStatusColor(fieldValues.status)}>{fieldValues.status}</Badge>
        },
        {
          label: "Assignee",
          value: fieldValues.assignee,
        },
        {
          label: "Due Date",
          value: fieldValues.dueDate,
        },
        {
          label: "Related to",
          value: parentTask ? parentTask.title : recordName,
        },
      ],
    },
    // Only include entity sections if this is NOT a subtask AND NOT a task belonging to an entity
    // Entity types that should not show entity sections: Company, People/Person, Entities/Entity, Investment, Opportunities/Opportunity
    // Workflow types that should not show entity sections: Capital Calls, Distributions, Diligence, Compliance Items, Tax Documents, Onboarding, Workflow
    ...((!parentTask && !['Company', 'People', 'Person', 'Entities', 'Entity', 'Investment', 'Opportunities', 'Opportunity', 'Capital Calls', 'Distributions', 'Diligence', 'Compliance Items', 'Tax Documents', 'Onboarding', 'Workflow'].includes(recordType || '')) ? [
      {
        id: "companies",
        title: "Companies",
        icon: <BuildingIcon className="h-4 w-4 text-muted-foreground" />,
        sectionData: {
          items: relatedData.companies
        },
      },
      {
        id: "people",
        title: "People",
        icon: <UserRoundIcon className="h-4 w-4 text-muted-foreground" />,
        sectionData: {
          items: relatedData.people
        },
      },
      {
        id: "entities",
        title: "Entities",
        icon: <LayoutIcon className="h-4 w-4 text-muted-foreground" />,
        sectionData: {
          items: relatedData.entities
        },
      },
      {
        id: "investments",
        title: "Investments",
        icon: <DollarSignIcon className="h-4 w-4 text-muted-foreground" />,
        sectionData: {
          items: relatedData.investments
        },
      },
      {
        id: "opportunities",
        title: "Opportunities",
        icon: <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />,
        sectionData: {
          items: relatedData.opportunities
        },
      },
    ] : []),
  ];

  // If a subtask is selected, render the subtask view
  if (selectedSubtask && !onSubtaskClick) {
    return (
      <TaskDetailsView
        task={selectedSubtask}
        onBack={getBackHandler()}
        recordName={recordName}
        recordType={recordType}
        parentTask={task}
        onBackToParent={handleBackFromSubtask}
        isInDrawer={isInDrawer}
        onNavigateBack={onNavigateBack}
        onSubtaskClick={onSubtaskClick}
        isFullScreen={isFullScreen}
        hideSubtasks={hideSubtasks}
      />
    )
  }

  // Custom content for tabs other than details
  const getTabContent = () => {
    if (activeTab === "notes") {
      return <NoteContent />;
    } else if (activeTab === "files") {
      return <FileContent />;
    }
    return null;
  };

  return (
    <div className="flex flex-col flex-1">
      {/* Task Header - show only when not in fullscreen (parent container renders its own header) */}
      {!isFullScreen && (
        <div className="border-b bg-background px-6 py-2">
          <div className="flex items-center gap-3">
            {/* Removed back button - navigation should be handled by drawer/sheet header */}
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
            </div>
          </div>
        </div>
      )}

      {/* Tabs - hide in fullscreen to avoid duplication */}
      {!isFullScreen && (
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
      )}

      {/* Tab Content */}
      {activeTab === "details" ? (
        <UnifiedDetailsPanel
          sections={sections}
          isFullScreen={isFullScreen}
          onNavigateToRecord={navigateToRecord}
          onAddRecord={handleAddRecord}
          onUnlinkRecord={handleUnlinkRecord}
          activityContent={
            <>
              {renderSubtasksSection()}
              {renderCommentSection()}
            </>
          }
          additionalContent={null}
        />
      ) : (
        <div className={`${isFullScreen ? 'px-6 py-6' : 'p-6'}`}>
          {getTabContent()}
        </div>
      )}
    </div>
  )
}
