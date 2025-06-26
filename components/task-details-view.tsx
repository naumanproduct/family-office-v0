"use client"

import * as React from "react"
import {
  CheckCircleIcon,
  CalendarIcon,
  UserIcon,
  AlertTriangleIcon,
  FileTextIcon,
  FileIcon,
  CheckSquareIcon,
  PlusIcon,
  CircleIcon,
  ClockIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  UserRoundIcon,
  BuildingIcon,
  LayoutIcon,
  DollarSignIcon,
  TrendingUpIcon,
  MoreVerticalIcon,
  Sparkles,
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
import { Textarea } from "@/components/ui/textarea"

import { NoteContent } from "@/components/shared/note-content"
import { FileContent } from "@/components/shared/file-content"
import { useTasks } from "./tasks-table"
import { UnifiedDetailsPanel, type DetailSection } from "@/components/shared/unified-details-panel"
import { getContextualNotes } from "@/components/shared/note-content"
import { getContextualFiles } from "@/components/shared/file-content"
import { UnifiedActivitySection, type ActivityItem } from "@/components/shared/unified-activity-section"
import { generateTaskActivities } from "@/components/shared/activity-generators"
import { AIAssistantSection } from "@/components/shared/ai-output-section"
import { TabContentRenderer } from "@/components/shared/tab-content-renderer"
import { ViewModeSelector } from "@/components/shared/view-mode-selector"

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
          assignee: "Michael Chen",
          dueDate: "2023-05-18",
        },
        {
          id: "SUBTASK-2", 
          title: "Update LP capital accounts in the system",
          description: "Record the capital call amounts in each LP's account ledger",
          status: "To Do",
          priority: "High",
          assignee: "Robert Kim",
          dueDate: "2023-05-19",
        },
        {
          id: "SUBTASK-3",
          title: "Generate capital call notices for LPs",
          description: "Create formal call notices with payment instructions and wire details",
          status: "To Do",
          priority: "Medium",
          assignee: "Emily Watson",
          dueDate: "2023-05-20",
        },
        {
          id: "SUBTASK-4",
          title: "Update fund commitment tracker",
          description: "Reflect new called capital amounts and remaining uncalled commitments",
          status: "To Do",
          priority: "Medium",
          assignee: "Michael Chen",
          dueDate: "2023-05-21",
        },
        {
          id: "SUBTASK-5",
          title: "Reconcile capital schedule with fund accounting",
          description: "Ensure capital schedule matches the fund's accounting records",
          status: "To Do",
          priority: "High",
          assignee: "Robert Kim",
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

  // State for which sections are open
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({
    subtasks: true,
  })

  // Toggle section open/closed
  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  const tabs = [
    { id: "details", label: "Details", icon: FileTextIcon },
    { id: "notes", label: "Notes", icon: FileIcon },
    { id: "files", label: "Files", icon: FileTextIcon },
  ]

  // Add state for view modes
  const [notesViewMode, setNotesViewMode] = React.useState<"card" | "list" | "table">("list")
  const [filesViewMode, setFilesViewMode] = React.useState<"card" | "list" | "table">("list")

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "critical":
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

  // Helper function to format date as relative time
  const formatRelativeTime = (date: string | Date) => {
    const now = new Date();
    const then = new Date(date);
    const diffInMs = now.getTime() - then.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    } else if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    } else {
      return then.toLocaleDateString();
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
    // In a real app, this would add the comment to the database
    // For now, we'll just log it
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

    // Helper function to check if a subtask has AI workflow
    const hasAIWorkflow = (title: string) => {
      return title.includes("Calculate pro-rata allocation") ||
             title.includes("Update LP capital accounts") ||
             title.includes("Generate capital call notices") ||
             title.includes("Update fund commitment tracker") ||
             title.includes("Reconcile capital schedule");
    };

    return (
      <div className="mb-8">
        <div className="rounded-lg border border-muted overflow-hidden">
          <button
            onClick={() => toggleSection('subtasks')}
            className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors group/section"
          >
            {openSections.subtasks ? (
              <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />
            )}
            <CheckSquareIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Subtasks ({subtasks.length})</span>
            <div className="flex-1" />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                setIsAddingSubtask(true);
              }} 
              className="h-8 opacity-0 group-hover/section:opacity-100 transition-opacity"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Subtask
            </Button>
          </button>
          
          {openSections.subtasks && (
            <div className="px-4 pb-4 pt-1">
              <div className="space-y-2">
                {subtasks.map((subtask: any) => (
                  <div
                    key={subtask.id}
                    className="group rounded-lg border border-muted bg-muted/10 p-3 hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex items-start">
                      {/* Leading checkbox */}
                      <div className="mt-0.5 mr-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0"
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
                      </div>

                      <div className="flex-1">
                        {/* Title row with actions */}
                        <div className="flex items-start justify-between">
                          <div
                            className={`font-medium text-sm cursor-pointer flex items-center gap-2 ${subtask.status === "Completed" ? "line-through text-muted-foreground" : ""}`}
                            onClick={() => handleSubtaskClick(subtask)}
                          >
                            {subtask.title}
                            {hasAIWorkflow(subtask.title) && (
                              <Sparkles className="h-3.5 w-3.5 text-primary" />
                            )}
                          </div>
                          
                          {/* More menu - only visible on hover */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVerticalIcon className="h-4 w-4" />
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
                        
                        {/* Secondary metadata row */}
                        <div className="flex justify-between items-center mt-2">
                          {/* Left side: assignee, status and priority as text */}
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{subtask.assignee}</span>
                            <span>•</span>
                            <span>{subtask.status}</span>
                            <span>•</span>
                            <span>{subtask.priority}</span>
                          </div>
                          
                          {/* Right side: due date */}
                          <div className="text-xs text-muted-foreground">
                            {formatRelativeTime(subtask.dueDate)}
                          </div>
                        </div>
                      </div>
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
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Custom comment section rendering (for activity)
  const renderCommentSection = () => {
    const activities = generateTaskActivities()
    
    // Generate mock comments
    const comments: ActivityItem[] = [
      {
        id: 101,
        type: "comment",
        actor: "Sarah Johnson",
        action: "commented",
        target: "",
        content: "I've reviewed the capital call calculations and they look correct. Ready to proceed with LP notifications.",
        timestamp: "2 hours ago",
        date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 102,
        type: "comment",
        actor: "Michael Chen",
        action: "commented",
        target: "",
        content: "Please make sure to use the updated wire instructions for this call. Treasury updated them last week.",
        timestamp: "5 hours ago",
        date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 103,
        type: "comment",
        actor: "You",
        action: "commented",
        target: "",
        content: "Noted. I'll double-check with Treasury before sending out the notices.",
        timestamp: "4 hours ago",
        date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      },
    ]

    if (isInDrawer) {
      return (
        <div className="mt-4">
          <UnifiedActivitySection 
            activities={activities} 
            comments={comments}
            showHeader={true}
            onCommentSubmit={handleCommentSubmit}
          />
        </div>
      );
    }

    return (
      <div className="space-y-4 mt-8">
        {/* Activity Section with Header and integrated comment input */}
        <UnifiedActivitySection 
          activities={activities} 
          comments={comments}
          showHeader={true}
          onCommentSubmit={handleCommentSubmit}
        />
      </div>
    );
  };

  // Generate contextual AI output based on subtask title
  const generateAIOutput = (taskTitle: string) => {
    if (taskTitle.includes("Calculate pro-rata allocation")) {
      return {
        title: "LP Allocation Calculations",
        type: "calculation" as const,
        explanation: "AI calculated each limited partner's share of the $10M capital call based on their commitment percentages in the fund agreement.",
        content: (
          <div className="space-y-3">
            <p className="font-medium">Pro-rata allocation for Call #1 ($10,000,000):</p>
            <div className="space-y-2 font-mono text-xs">
              <div className="grid grid-cols-3 gap-4 pb-2 border-b">
                <span className="font-semibold">LP Name</span>
                <span className="font-semibold text-right">Commitment %</span>
                <span className="font-semibold text-right">Call Amount</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <span>Apex Capital Partners</span>
                <span className="text-right">25.0%</span>
                <span className="text-right">$2,500,000</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <span>Summit Ventures LLC</span>
                <span className="text-right">20.0%</span>
                <span className="text-right">$2,000,000</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <span>Ridge Family Office</span>
                <span className="text-right">15.0%</span>
                <span className="text-right">$1,500,000</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <span>Meridian Holdings</span>
                <span className="text-right">40.0%</span>
                <span className="text-right">$4,000,000</span>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-2 border-t font-semibold">
                <span>Total</span>
                <span className="text-right">100.0%</span>
                <span className="text-right">$10,000,000</span>
              </div>
            </div>
          </div>
        )
      }
    } else if (taskTitle.includes("Update LP capital accounts")) {
      return {
        title: "Capital Account Updates",
        type: "data" as const,
        explanation: "AI generated capital account transaction entries for each LP, pre-formatted with the required fields for your accounting system.",
        content: (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="border-b pb-3">
                <p className="font-medium">Account: Apex Capital Partners</p>
                <p className="text-sm text-muted-foreground">Transaction Type: Capital Call</p>
                <p className="text-sm text-muted-foreground">Call Number: #1</p>
                <p className="text-sm text-muted-foreground">Amount: $2,500,000</p>
                <p className="text-sm text-muted-foreground">Effective Date: {new Date().toLocaleDateString()}</p>
                <p className="text-sm text-muted-foreground">Reference: CC-GF3-001</p>
              </div>
              <div className="border-b pb-3">
                <p className="font-medium">Account: Summit Ventures LLC</p>
                <p className="text-sm text-muted-foreground">Transaction Type: Capital Call</p>
                <p className="text-sm text-muted-foreground">Call Number: #1</p>
                <p className="text-sm text-muted-foreground">Amount: $2,000,000</p>
                <p className="text-sm text-muted-foreground">Effective Date: {new Date().toLocaleDateString()}</p>
                <p className="text-sm text-muted-foreground">Reference: CC-GF3-001</p>
              </div>
              <p className="text-sm text-muted-foreground italic">[Continue for all LPs...]</p>
            </div>
          </div>
        )
      }
    } else if (taskTitle.includes("Generate capital call notices")) {
      return {
        title: "Draft Capital Call Notice",
        type: "email" as const,
        explanation: "AI drafted a formal capital call notice email template with payment instructions, ready to personalize and send to each limited partner.",
        content: (
          <div className="space-y-4">
            <div className="border-b pb-2">
              <p className="font-medium">Subject: Growth Fund III - Capital Call Notice #1</p>
            </div>
            <div className="space-y-3">
              <p>Dear [LP Name],</p>
              <p>This letter serves as formal notice of Capital Call #1 for Growth Fund III, L.P.</p>
              
              <div>
                <p className="font-medium mb-2">CAPITAL CALL DETAILS:</p>
                <div className="pl-4 space-y-1">
                  <p className="text-sm">Fund: Growth Fund III, L.P.</p>
                  <p className="text-sm">Call Number: 1</p>
                  <p className="text-sm">Your Pro-Rata Share: [Amount]</p>
                  <p className="text-sm">Due Date: [Due Date]</p>
                  <p className="text-sm">Purpose: Initial portfolio investments and fund expenses</p>
                </div>
              </div>
              
              <div>
                <p className="font-medium mb-2">PAYMENT INSTRUCTIONS:</p>
                <div className="pl-4 space-y-1">
                  <p className="text-sm">Please wire your capital contribution to:</p>
                  <p className="text-sm">Bank: First National Bank</p>
                  <p className="text-sm">ABA: 123456789</p>
                  <p className="text-sm">Account: 987654321</p>
                  <p className="text-sm">Reference: GF3-CC1-[LP ID]</p>
                </div>
              </div>
              
              <p>Please confirm receipt of this notice and your wire transfer by responding to this email.</p>
              <p>If you have any questions, please contact Investor Relations at ir@growthfund.com.</p>
              
              <div className="pt-2">
                <p>Sincerely,</p>
                <p>Growth Fund III GP, LLC</p>
              </div>
            </div>
          </div>
        )
      }
    } else if (taskTitle.includes("Update fund commitment tracker")) {
      return {
        title: "Commitment Tracker Summary",
        type: "data" as const,
        explanation: "AI compiled a summary of total fund commitments, showing how much has been called versus remaining uncalled capital.",
        content: (
          <div className="space-y-3">
            <div>
              <p className="font-medium">Fund: Growth Fund III</p>
              <p className="text-sm">Total Commitments: $100,000,000</p>
              <p className="text-sm">Called to Date: $10,000,000 (10%)</p>
              <p className="text-sm">Remaining Uncalled: $90,000,000 (90%)</p>
            </div>
            
            <div className="border-t pt-3">
              <p className="font-medium mb-2">Call History:</p>
              <p className="text-sm pl-2">• Call #1: $10,000,000 (Current)</p>
            </div>
            
            <div className="border-t pt-3">
              <p className="text-sm">Next Anticipated Call: Q2 2024</p>
              <p className="text-sm">Estimated Amount: $15,000,000</p>
            </div>
          </div>
        )
      }
    } else if (taskTitle.includes("Reconcile capital schedule")) {
      return {
        title: "Reconciliation Summary",
        type: "calculation" as const,
        explanation: "AI performed a line-by-line reconciliation between your capital schedule and accounting records to verify all LP amounts match.",
        content: (
          <div className="space-y-3">
            <div>
              <p className="font-medium mb-2">Capital Schedule Reconciliation:</p>
              <div className="space-y-1">
                <p className="text-sm">✓ Total Called per Schedule: $10,000,000</p>
                <p className="text-sm">✓ Total per Accounting Records: $10,000,000</p>
                <p className="text-sm">✓ Variance: $0</p>
              </div>
            </div>
            
            <div className="border-t pt-3">
              <p className="font-medium mb-2">LP-by-LP Reconciliation:</p>
              <div className="space-y-1">
                <p className="text-sm">✓ Apex Capital: Schedule $2,500,000 = Accounting $2,500,000</p>
                <p className="text-sm">✓ Summit Ventures: Schedule $2,000,000 = Accounting $2,000,000</p>
                <p className="text-sm">✓ Ridge Family: Schedule $1,500,000 = Accounting $1,500,000</p>
                <p className="text-sm">✓ Meridian: Schedule $4,000,000 = Accounting $4,000,000</p>
              </div>
            </div>
            
            <div className="border-t pt-3">
              <p className="font-medium text-green-600">Status: RECONCILED</p>
            </div>
          </div>
        )
      }
    }
    
    return null
  }

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
          value: <span className={`text-sm ${
            fieldValues.priority.toLowerCase() === "high" ? "text-red-600" : 
            fieldValues.priority.toLowerCase() === "medium" ? "text-yellow-600" : 
            "text-green-600"
          }`}>{fieldValues.priority}</span>
        },
        {
          label: "Status",
          value: <span className={`text-sm ${
            fieldValues.status.toLowerCase() === "completed" ? "text-green-600" : 
            "text-muted-foreground"
          }`}>{fieldValues.status}</span>
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
      // Get contextual notes
      const notes = getContextualNotes(task.title || taskTitle);
      
      // Transform notes to match TabContentRenderer format
      const transformedNotes = notes.map(note => ({
        ...note,
        author: note.author || "Unknown",
        date: note.date || note.lastModified || (note.updatedAt ? new Date(note.updatedAt).toLocaleDateString() : "Unknown"),
      }));
      
      return (
        <>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Notes</h3>
            <div className="flex items-center gap-2">
              <ViewModeSelector viewMode={notesViewMode} onViewModeChange={setNotesViewMode} />
              <Button variant="outline" size="sm" onClick={() => console.log("Add note")}>
                <PlusIcon className="h-4 w-4" />
                Add note
              </Button>
            </div>
          </div>
          <TabContentRenderer
            activeTab="notes"
            viewMode={notesViewMode}
            data={transformedNotes}
            onNoteClick={(note) => console.log("Note clicked:", note)}
          />
        </>
      );
    } else if (activeTab === "files") {
      // Get contextual files
      const files = getContextualFiles(task.title || taskTitle);
      
      // Transform files to match TabContentRenderer format
      const transformedFiles = files.map(file => ({
        ...file,
        name: file.name || file.fileName || file.title,
        uploadedBy: file.uploadedBy || "Unknown",
        uploadedDate: file.uploadedDate || (file.uploadedAt ? new Date(file.uploadedAt).toLocaleDateString() : "Unknown"),
        size: file.size || file.fileSize || "Unknown",
      }));
      
      return (
        <>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Files</h3>
            <div className="flex items-center gap-2">
              <ViewModeSelector viewMode={filesViewMode} onViewModeChange={setFilesViewMode} />
              <Button variant="outline" size="sm" onClick={() => console.log("Add file")}>
                <PlusIcon className="h-4 w-4" />
                Add file
              </Button>
            </div>
          </div>
          <TabContentRenderer
            activeTab="files"
            viewMode={filesViewMode}
            data={transformedFiles}
          />
        </>
      );
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
          additionalContent={(() => {
            // Only show AI output for subtasks (tasks that have a parent)
            if (parentTask && task.title) {
              const aiOutput = generateAIOutput(task.title)
              if (aiOutput) {
                return (
                  <AIAssistantSection
                    outputs={[aiOutput]}
                  />
                )
              }
            }
            return null
          })()}
        />
      ) : (
        <div className={`${isFullScreen ? 'px-6 py-6' : 'p-6'}`}>
          {getTabContent()}
        </div>
      )}
    </div>
  )
}
