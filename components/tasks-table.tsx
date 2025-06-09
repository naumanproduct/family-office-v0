"use client"

import * as React from "react"
import { useState } from "react"
import { createPortal } from "react-dom"
import {
  CheckCircleIcon,
  CheckSquareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  CircleIcon,
  ClockIcon,
  MoreHorizontalIcon,
  FilterIcon,
  PlusIcon,
  SearchIcon,
  XIcon,
  CalendarIcon,
  AlertTriangleIcon,
  FileTextIcon,
  UserIcon,
  ExpandIcon,
  MailIcon,
  MessageSquareIcon,
  PhoneIcon,
  LayoutGridIcon,
  ListIcon,
  TableIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { NoteContent } from "@/components/shared/note-content"
import { FileContent } from "@/components/shared/file-content"
import { MasterDrawer } from "./master-drawer"
import { MasterDetailsPanel } from "./shared/master-details-panel"
import { ActivitySection } from "./shared/activity-section"
import { type ActivityItem } from "./shared/activity-content"
import { TypableArea } from "./typable-area"
import { TaskTemplateDialog } from "./task-template-dialog"

// Define Task type
interface Task {
  id: number | string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
  dueDate: string;
  relatedTo?: {
    name: string;
    type: string;
  };
  subtasks?: any[];
}

// Task data - extended from investment tab but across all objects
const tasksData = [
  {
    id: 1,
    title: "Review quarterly performance",
    priority: "High",
    status: "pending",
    assignee: "You",
    dueDate: "Tomorrow",
    description: "Review Q3 performance metrics and prepare summary report.",
    relatedTo: { type: "Investment", name: "TechFlow Ventures Series C" },
    subtasks: [
      {
        id: "1.1",
        title: "Analyze revenue growth",
        description: "Compare revenue growth against previous quarters and projections",
        status: "Completed",
        priority: "High",
        assignee: "You",
        dueDate: "Yesterday",
      },
      {
        id: "1.2",
        title: "Review expense trends",
        description: "Analyze expense patterns and identify areas for optimization",
        status: "In Progress",
        priority: "Medium",
        assignee: "You",
        dueDate: "Today",
      },
      {
        id: "1.3",
        title: "Prepare executive summary",
        description: "Create a concise summary for executive review",
        status: "To Do",
        priority: "High",
        assignee: "You",
        dueDate: "Tomorrow",
      },
    ],
  },
  {
    id: 2,
    title: "Update valuation model",
    priority: "Medium",
    status: "completed",
    assignee: "You",
    dueDate: "2 days ago",
    description: "Updated valuation model with latest market data.",
    relatedTo: { type: "Investment", name: "MedInnovate Seed Round" },
    subtasks: [],
  },
  {
    id: 3,
    title: "Capital Call Processing",
    priority: "High",
    status: "In Progress",
    assignee: "Sarah Johnson",
    dueDate: "2024-01-15",
    description: "Process capital call for TechFlow Ventures Series C investment",
    relatedTo: { type: "Investment", name: "TechFlow Ventures Series C" },
    subtasks: [
      {
        id: "3.1",
        title: "Verify capital call notice",
        description: "Ensure all documentation is accurate and complete",
        status: "Completed",
        priority: "High",
        assignee: "Sarah Johnson",
        dueDate: "2024-01-10",
      },
      {
        id: "3.2",
        title: "Prepare wire transfer",
        description: "Set up the transfer in the banking system",
        status: "In Progress",
        priority: "High",
        assignee: "Finance Team",
        dueDate: "2024-01-14",
      },
    ],
  },
  {
    id: 4,
    title: "Legal Document Review",
    priority: "Medium",
    status: "pending",
    assignee: "Legal Team",
    dueDate: "Next week",
    description: "Review partnership agreement for Global Ventures",
    relatedTo: { type: "Entity", name: "Global Ventures LLC" },
    subtasks: [],
  },
  {
    id: 5,
    title: "Compliance Check",
    priority: "Low",
    status: "pending",
    assignee: "Compliance Team",
    dueDate: "End of month",
    description: "Annual compliance review for Meridian Capital Fund III",
    relatedTo: { type: "Entity", name: "Meridian Capital Fund III" },
    subtasks: [],
  },
]

function TaskTableView({
  data,
  onTaskClick,
}: {
  data: Task[]
  onTaskClick?: (task: Task) => void
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Assignee</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Related To</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((task) => (
          <TableRow key={task.id}>
            <TableCell>
              <TaskNameCell task={task} />
            </TableCell>
            <TableCell>
              <Badge className={`text-xs ${getStatusColor(task.status)}`}>{task.status}</Badge>
            </TableCell>
            <TableCell>
              <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>{task.priority}</Badge>
            </TableCell>
            <TableCell>{task.assignee}</TableCell>
            <TableCell>{task.dueDate}</TableCell>
            <TableCell>
              {task.relatedTo ? (
                <span className="text-blue-600">{task.relatedTo.name}</span>
              ) : (
                "All Tasks"
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function TaskCardView({
  data,
  onTaskClick,
}: {
  data: any[]
  onTaskClick?: (task: any) => void
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {data.map((item) => (
        <Card key={item.id} className="cursor-pointer hover:bg-muted/50" onClick={() => onTaskClick?.(item)}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium">{item.title}</h4>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Due:</span>
                    <span>{item.dueDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Assignee:</span>
                    <span>{item.assignee}</span>
                  </div>
                  {item.relatedTo && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Related to:</span>
                      <span className="text-blue-600">{item.relatedTo.name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        item.priority === "High" ? "destructive" : item.priority === "Medium" ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {item.priority}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {item.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                    <MoreHorizontalIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View</DropdownMenuItem>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function TaskListView({
  data,
  onTaskClick,
}: {
  data: any[]
  onTaskClick?: (task: any) => void
}) {
  return (
    <div className="space-y-4">
      {data.map((item) => (
        <div
          key={item.id}
          className="rounded-lg border p-4 cursor-pointer hover:bg-muted/50"
          onClick={() => onTaskClick?.(item)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">Assigned to: {item.assignee}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Due: {item.dueDate}</p>
                  <div className="mt-1 flex items-center gap-1">
                    <Badge
                      variant={
                        item.priority === "High" ? "destructive" : item.priority === "Medium" ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {item.priority}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {item.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{item.description}</p>
              {item.relatedTo && <p className="mt-2 text-xs text-blue-600">Related to: {item.relatedTo.name}</p>}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                  <MoreHorizontalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View</DropdownMenuItem>
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  )
}

// Helper functions for styling
const getPriorityColor = (priority: string = "Medium") => {
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

const getStatusColor = (status: string = "pending") => {
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

export function TasksTable() {
  const [viewMode, setViewMode] = React.useState<"card" | "list" | "table">("table")
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [selectedTask, setSelectedTask] = React.useState<any>(null)
  const [selectedSubtask, setSelectedSubtask] = React.useState<any>(null)
  const [isFullScreen, setIsFullScreen] = React.useState(false)
  const [isTaskTemplateOpen, setIsTaskTemplateOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("subtasks")
  const [isAddingSubtask, setIsAddingSubtask] = useState(false)
  const [isSubtaskDrawerOpen, setIsSubtaskDrawerOpen] = useState(false)

  // React hook to handle task selection
  React.useEffect(() => {
    // Reset subtask state when selected task changes
    setSelectedSubtask(null);
    setIsSubtaskDrawerOpen(false);
    
    // If we're in full screen mode and a task is selected, set the active tab to subtasks
    if (isFullScreen && selectedTask) {
      setActiveTab("subtasks");
    }
  }, [selectedTask, isFullScreen]);

  // Handle back navigation in the drawer
  const handleDrawerBackClick = () => {
    if (selectedSubtask) {
      // If in a subtask view, return to parent task
      setSelectedSubtask(null)
      setIsSubtaskDrawerOpen(false)
    } else {
      // If in main task view, close the drawer
      setSelectedTask(null)
    }
  }

  // Handle a subtask selection in full screen mode
  const handleSubtaskClick = (subtask: any) => {
    console.log("Subtask clicked:", subtask);
    setSelectedSubtask(subtask);
    
    if (isFullScreen) {
      // In full screen mode, open the subtask drawer
      setIsSubtaskDrawerOpen(true);
      console.log("Setting subtask drawer to open, isFullScreen:", isFullScreen);
    }
  }

  // Handle subtask status change
  const handleSubtaskStatusChange = (subtaskId: string, newStatus: string) => {
    if (selectedTask && selectedTask.subtasks) {
      const updatedSubtasks = selectedTask.subtasks.map((subtask: any) => 
        subtask.id === subtaskId ? { ...subtask, status: newStatus } : subtask
      );
      setSelectedTask({
        ...selectedTask,
        subtasks: updatedSubtasks
      });
    }
  }

  // Handle subtask deletion
  const handleDeleteSubtask = (subtaskId: string) => {
    if (selectedTask && selectedTask.subtasks) {
      const updatedSubtasks = selectedTask.subtasks.filter((subtask: any) => 
        subtask.id !== subtaskId
      );
      setSelectedTask({
        ...selectedTask,
        subtasks: updatedSubtasks
      });
    }
  }

  // ESC key handler for full screen mode
  React.useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isFullScreen) {
        setIsFullScreen(false)
      }
    }

    if (isFullScreen) {
      // When entering full screen mode, set the active tab to something other than "details"
      setActiveTab("subtasks")
      document.addEventListener("keydown", handleEscKey)
      return () => {
        document.removeEventListener("keydown", handleEscKey)
      }
    }
  }, [isFullScreen])

  const ViewModeSelector = () => (
    <div className="flex items-center gap-1 rounded-lg border p-1">
      <Button
        variant={viewMode === "card" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => setViewMode("card")}
        className="h-7 px-2"
      >
        <LayoutGridIcon className="h-3 w-3" />
      </Button>
      <Button
        variant={viewMode === "list" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => setViewMode("list")}
        className="h-7 px-2"
      >
        <ListIcon className="h-3 w-3" />
      </Button>
      <Button
        variant={viewMode === "table" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => setViewMode("table")}
        className="h-7 px-2"
      >
        <TableIcon className="h-3 w-3" />
      </Button>
    </div>
  )

  const renderTaskContent = () => {
    if (viewMode === "table") {
      return <TaskTableView data={tasksData} onTaskClick={setSelectedTask} />
    }
    if (viewMode === "card") {
      return <TaskCardView data={tasksData} onTaskClick={setSelectedTask} />
    }
    return <TaskListView data={tasksData} onTaskClick={setSelectedTask} />
  }

  const FullScreenContent = () => {
    if (typeof document === "undefined") return null

    return createPortal(
      <div className="fixed inset-0 z-[9999] bg-background">
        {/* Full Screen Header */}
        <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsFullScreen(false)
                // Clear selected tasks when exiting fullscreen
                setSelectedTask(null)
                setSelectedSubtask(null)
                setIsSubtaskDrawerOpen(false)
              }}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Badge variant="outline" className="bg-background">
              Task
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setIsFullScreen(false)
                // Clear selected tasks when exiting fullscreen
                setSelectedTask(null)
                setSelectedSubtask(null)
                setIsSubtaskDrawerOpen(false)
              }}
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Full Screen Content - Two Column Layout */}
        <div className="flex h-[calc(100vh-73px)]">
          {/* Left Panel - Details (Persistent) - Always shows the main task */}
          <div className="w-96 border-r bg-background overflow-y-auto">
            {/* Record Header */}
            <div className="border-b bg-background px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <CheckSquareIcon className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{selectedTask?.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    Task in All Tasks
                  </p>
                </div>
              </div>
            </div>
            
            {/* Details Panel Content - Always shows the main task details */}
            <div className="px-6 pt-4 pb-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Task Details</h4>
                <div className="rounded-lg border border-muted bg-muted/10 p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground">Description</Label>
                        <p className="text-sm">{selectedTask?.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <AlertTriangleIcon className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground">Priority</Label>
                        <Badge className={`text-xs ${getPriorityColor(selectedTask?.priority)}`}>
                          {selectedTask?.priority}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground">Status</Label>
                        <Badge className={`text-xs ${getStatusColor(selectedTask?.status)}`}>
                          {selectedTask?.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground">Assignee</Label>
                        <p className="text-sm">{selectedTask?.assignee}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground">Due Date</Label>
                        <p className="text-sm">{selectedTask?.dueDate}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground">Related to</Label>
                        <p className="text-sm">{selectedTask?.relatedTo?.name || "All Tasks"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Main Content with Tabs */}
          <div className="flex-1 overflow-y-auto">
            {/* Tabs */}
            <div className="border-b bg-background px-6">
              <div className="flex gap-8 overflow-x-auto">
                {/* Tabs order: Subtasks, Notes, Files */}
                {[
                  { id: "subtasks", label: "Subtasks", icon: CheckSquareIcon },
                  { id: "notes", label: "Notes", icon: FileTextIcon },
                  { id: "files", label: "Files", icon: FileTextIcon }
                ].map((tab) => {
                  const TabIcon = tab.icon;
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
                      <TabIcon className="h-4 w-4" />
                      {tab.label}
                      {tab.id === "subtasks" && selectedTask?.subtasks?.length > 0 && (
                        <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                          {selectedTask.subtasks.length}
                        </Badge>
                      )}
                      {activeTab === tab.id && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"></span>}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "notes" && <NoteContent title={`Notes for Task: ${selectedTask?.title}`} />}
              {activeTab === "files" && <FileContent title={`Files for Task: ${selectedTask?.title}`} />}
              {activeTab === "subtasks" && selectedTask && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold">Subtasks ({selectedTask.subtasks?.length || 0})</h4>
                    <Button variant="outline" size="sm" onClick={() => setIsAddingSubtask(true)}>
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Add Subtask
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {(selectedTask.subtasks || []).map((subtask: any) => (
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
                                <MoreHorizontalIcon className="h-3 w-3" />
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

                    {(selectedTask.subtasks || []).length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <CheckSquareIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No subtasks yet</p>
                        <p className="text-xs">Break down this task into smaller steps</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Subtask Drawer */}
        {selectedSubtask && isFullScreen && (
          <Sheet 
            open={isSubtaskDrawerOpen} 
            onOpenChange={(open) => {
              console.log("Drawer open state changed to:", open);
              setIsSubtaskDrawerOpen(open);
              if (!open) {
                setSelectedSubtask(null);
              }
            }}
          >
            <SheetContent side="right" className="flex w-full max-w-4xl flex-col p-0 sm:max-w-4xl [&>button]:hidden z-[99999]">
              {/* Header */}
              <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
                <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => {
                      setIsSubtaskDrawerOpen(false);
                      setSelectedSubtask(null);
                    }}
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </Button>
                  <Badge variant="outline" className="bg-background">
                    Subtask
                  </Badge>
                </div>
              </div>
              
              {/* Subtask Details Content */}
        <div className="flex-1 overflow-auto">
          <TaskDetailsView
                  task={selectedSubtask}
                  onBack={() => setSelectedSubtask(null)}
            recordName="All Tasks"
            isInDrawer={true}
                  parentTask={selectedTask}
            onBackToParent={() => setSelectedSubtask(null)}
          />
        </div>
            </SheetContent>
          </Sheet>
        )}
      </div>,
      document.body,
    )
  }

  return (
    <>
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-8 w-[300px]"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <FilterIcon className="mr-2 h-4 w-4" />
                  Filter
                  <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[200px]">
                <DropdownMenuCheckboxItem>High priority</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>In progress</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Overdue</DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem>Investment related</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Entity related</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center space-x-2">
            <ViewModeSelector />
            <Button size="sm" onClick={() => setIsTaskTemplateOpen(true)}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>
        </div>

        {/* Task Content */}
        <div className="relative">
        {renderTaskContent()}
        </div>
      </div>

      {/* Task drawer */}
      <Sheet open={!!selectedTask && !isFullScreen} onOpenChange={(open) => !open && setSelectedTask(null)}>
        <SheetContent className="flex w-full max-w-4xl flex-col p-0 sm:max-w-4xl [&>button]:hidden">
            <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={handleDrawerBackClick}>
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <Badge variant="outline" className="bg-background">
                  Task
                </Badge>
              </div>
              <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsFullScreen(true)
                  document.body.style.overflow = "hidden"
                }}
              >
                Enter Full Screen
                <svg
                  className="ml-2 h-4 w-4"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M3 7.5V5a2 2 0 0 1 2-2h2.5" />
                  <path d="M16.5 3H19a2 2 0 0 1 2 2v2.5" />
                  <path d="M21 16.5V19a2 2 0 0 1-2 2h-2.5" />
                  <path d="M7.5 21H5a2 2 0 0 1-2-2v-2.5" />
                </svg>
                </Button>
              </div>
            </div>
              <TaskDetailsView
            task={selectedTask} 
                onBack={handleDrawerBackClick}
                recordName="All Tasks"
                isInDrawer={true}
              />
          </SheetContent>
        </Sheet>

      {isFullScreen && <FullScreenContent />}
      
      {/* Task template dialog */}
      <TaskTemplateDialog isOpen={isTaskTemplateOpen} onClose={() => setIsTaskTemplateOpen(false)} />
    </>
  )
}

// This component displays task details with tabs
function TaskDetailsView({
  task,
  onBack,
  recordName,
  isInDrawer = false,
  parentTask = null,
  onBackToParent = null,
}: {
  task: any;
  onBack: () => void;
  recordName: string;
  isInDrawer?: boolean;
  parentTask?: any;
  onBackToParent?: (() => void) | null;
}) {
  const [activeTab, setActiveTab] = React.useState("details")
  const isSubtask = !!parentTask

  // Date formatting utility function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // Format priority for display
  const getPriorityBadge = (priority: string) => {
    const className = {
      high: "bg-red-100 text-red-600",
      medium: "bg-yellow-100 text-yellow-600",
      low: "bg-green-100 text-green-600",
    }[priority.toLowerCase()] || "bg-slate-100 text-slate-600"

    return <Badge className={`${className} text-xs`}>{priority}</Badge>
  }

  // Get status badge with color
  const getStatusBadge = (status: string) => {
    const className = {
      "not started": "bg-slate-100 text-slate-600",
      "in progress": "bg-blue-100 text-blue-600",
      completed: "bg-green-100 text-green-600",
      blocked: "bg-red-100 text-red-600",
      deferred: "bg-purple-100 text-purple-600",
    }[status.toLowerCase()] || "bg-slate-100 text-slate-600"

    return <Badge className={`${className} text-xs`}>{status}</Badge>
  }

  return (
    <div className={`flex h-full flex-col overflow-hidden ${isInDrawer ? "" : "bg-background"}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-background p-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <h2 className="text-sm font-medium">{recordName}</h2>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ExpandIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b bg-background">
        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
          <div className="px-6">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
              <TabsTrigger
                value="details"
                className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Details
              </TabsTrigger>
              <TabsTrigger
                value="notes"
                className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Notes
              </TabsTrigger>
              <TabsTrigger
                value="files"
                className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Files
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {activeTab === "details" && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">{task.title}</h3>
                <p className="text-sm text-muted-foreground">{task.description}</p>
              </div>

              <div className="rounded-lg border border-muted bg-muted/10 p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Status</Label>
                      <p className="text-sm">{getStatusBadge(task.status)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Priority</Label>
                      <p className="text-sm">{getPriorityBadge(task.priority)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Assignee</Label>
                      <p className="text-sm">{task.assignee}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Due Date</Label>
                      <p className="text-sm">{task.dueDate}</p>
                    </div>
                  </div>
                </div>
              </div>

              {isSubtask && onBackToParent && (
                <div className="mt-6">
                  <Button variant="outline" onClick={onBackToParent}>
                    <ChevronLeftIcon className="h-4 w-4 mr-2" />
                    Back to Parent Task
                  </Button>
                </div>
              )}
              
              {/* Activity Section */}
              <div className="mt-8">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-sm font-medium">Activity</h4>
                  <Button variant="outline" size="sm">
                    <PlusIcon className="h-4 w-4" />
                    Add activity
                  </Button>
                </div>
                <TaskActivityContent task={task} />
              </div>
            </div>
          )}
          
          {activeTab === "notes" && <NoteContent title={`Notes for Task: ${task.title}`} />}
          {activeTab === "files" && <FileContent title={`Files for Task: ${task.title}`} />}
        </div>
      </div>
    </div>
  );
}

// Task Activity Component
function TaskActivityContent({ task }: { task: any }) {
  const [expandedActivity, setExpandedActivity] = React.useState<number | null>(null);

  const activities = [
    {
      id: 1,
      type: "status-change",
      actor: "Alex Johnson",
      action: "changed status from 'Not Started' to",
      target: "'In Progress'",
      timestamp: "2 days ago",
      date: "2023-01-15",
      details: {
        previousStatus: "Not Started",
        newStatus: "In Progress",
        reason: "Starting implementation phase",
        timeSpent: "N/A",
      },
    },
    {
      id: 2,
      type: "assignment",
      actor: "Maria Garcia",
      action: "assigned",
      target: task.title,
      timestamp: "1 week ago",
      date: "2023-01-10",
      details: {
        previousAssignee: "Unassigned",
        newAssignee: task.assignee,
        reason: "Taking over from previous team member",
      },
    },
    {
      id: 3,
      type: "comment",
      actor: "David Lee",
      action: "commented on",
      target: task.title,
      timestamp: "2 weeks ago",
      date: "2023-01-03",
      details: {
        comment: "I've started working on this task and identified some potential challenges with the integration. Let's discuss this in our next team meeting.",
        mentions: ["@Alex", "@Maria"],
      },
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "status-change":
        return <div className="h-2 w-2 rounded-full bg-blue-500"></div>;
      case "assignment":
        return <div className="h-2 w-2 rounded-full bg-green-500"></div>;
      case "comment":
        return <div className="h-2 w-2 rounded-full bg-purple-500"></div>;
      case "deadline-change":
        return <div className="h-2 w-2 rounded-full bg-amber-500"></div>;
      default:
        return <div className="h-2 w-2 rounded-full bg-gray-500"></div>;
    }
  };

  const formatActivityText = (activity: any) => {
    return (
      <span>
        <span className="font-medium">{activity.actor}</span> {activity.action}{" "}
        <span className="font-medium">{activity.target}</span>
      </span>
    );
  };

  const renderExpandedDetails = (activity: any) => {
    switch (activity.type) {
      case "status-change":
        return (
          <div className="mt-4 space-y-3">
            <div>
              <h5 className="text-sm font-medium mb-2">Status Change Details</h5>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Previous Status:</span>{" "}
                  <span>{activity.details.previousStatus}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">New Status:</span>{" "}
                  <span>{activity.details.newStatus}</span>
                </div>
              </div>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-1">Reason</h5>
              <p className="text-sm text-muted-foreground">{activity.details.reason}</p>
            </div>
          </div>
        );
      case "assignment":
        return (
          <div className="mt-4 space-y-3">
            <div>
              <h5 className="text-sm font-medium mb-2">Assignment Details</h5>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Previous Assignee:</span>{" "}
                  <span>{activity.details.previousAssignee}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">New Assignee:</span>{" "}
                  <span>{activity.details.newAssignee}</span>
                </div>
              </div>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-1">Reason</h5>
              <p className="text-sm text-muted-foreground">{activity.details.reason}</p>
            </div>
          </div>
        );
      case "comment":
        return (
          <div className="mt-4 space-y-3">
            <div>
              <h5 className="text-sm font-medium mb-1">Comment</h5>
              <p className="text-sm text-muted-foreground">{activity.details.comment}</p>
            </div>
            {activity.details.mentions.length > 0 && (
              <div>
                <h5 className="text-sm font-medium mb-1">Mentions</h5>
                <div className="flex flex-wrap gap-1">
                  {activity.details.mentions.map((mention: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {mention}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id}>
          <button
            onClick={() => setExpandedActivity(expandedActivity === activity.id ? null : activity.id)}
            className="flex items-start gap-3 w-full text-left p-3 rounded-lg border hover:bg-muted/50 transition-colors"
          >
            <div className="mt-1">{getActivityIcon(activity.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm">{formatActivityText(activity)}</div>
              <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
            </div>
            <ChevronDownIcon
              className={`h-4 w-4 text-muted-foreground transition-transform ${
                expandedActivity === activity.id ? "rotate-180" : ""
              }`}
            />
          </button>
          {expandedActivity === activity.id && (
            <div className="ml-6 pl-3 border-l-2 border-muted">{renderExpandedDetails(activity)}</div>
          )}
        </div>
      ))}
    </div>
  );
}

// Update the TaskNameCell component 
function TaskNameCell({ task }: { task: Task }) {
  // Define the tabs for the drawer
  const tabs = [
    { id: "details", label: "Details", count: null, icon: FileTextIcon },
    { id: "subtasks", label: "Subtasks", count: task.subtasks?.length || 0, icon: CheckSquareIcon },
    { id: "notes", label: "Notes", count: null, icon: FileTextIcon },
    { id: "files", label: "Files", count: null, icon: FileTextIcon },
    { id: "activity", label: "Activity", count: null, icon: ClockIcon },
  ]

  // Define the renderer for tab content
  const renderTabContent = (activeTab: string, viewMode: "card" | "list" | "table") => {
    switch (activeTab) {
      case "details":
        return <TaskDetailsPanel task={task} />
      case "subtasks":
        return <TaskSubtasksContent task={task} />
      case "notes":
        return <NoteContent title={`Notes for Task: ${task.title}`} />
      case "files":
        return <FileContent title={`Files for Task: ${task.title}`} />
      case "activity":
        return <TaskActivityContent task={task} />
      default:
        return null
    }
  }

  // Define the renderer for the details panel
  const renderDetailsPanel = (isFullScreen = false) => {
    return <TaskDetailsPanel task={task} isFullScreen={isFullScreen} />
  }

  return (
    <MasterDrawer
      trigger={
        <Button variant="link" className="w-fit px-0 text-left text-foreground h-auto">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground text-xs font-medium">
              <CheckSquareIcon className="h-3 w-3" />
            </div>
            <span className="font-medium">{task.title}</span>
          </div>
        </Button>
      }
      title={task.title}
      recordType="Task"
      subtitle={`${task.status} • ${task.priority}`}
      tabs={tabs}
      detailsPanel={renderDetailsPanel}
    >
      {renderTabContent}
    </MasterDrawer>
  )
}

// Create a consistent TaskDetailsPanel component that uses MasterDetailsPanel
function TaskDetailsPanel({ task, isFullScreen = false }: { task: Task; isFullScreen?: boolean }) {
  // Define field groups for the MasterDetailsPanel
  const fieldGroups = [
    {
      id: "task-info",
      label: "Task Information",
      icon: CheckSquareIcon,
      fields: [
        { label: "Description", value: task.description || "No description provided" },
        { label: "Priority", value: <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>{task.priority}</Badge> },
        { label: "Status", value: <Badge className={`text-xs ${getStatusColor(task.status)}`}>{task.status}</Badge> },
        { label: "Assignee", value: task.assignee },
        { label: "Due Date", value: task.dueDate },
        { label: "Related to", value: task.relatedTo?.name || "All Tasks", isLink: !!task.relatedTo },
      ],
    },
  ]

  // Define activities for this task
  const activities: ActivityItem[] = [
    {
      id: 1,
      type: "change",
      actor: "John Smith",
      action: "changed status of",
      target: task.title,
      timestamp: "2 days ago",
      date: "2023-05-18",
      details: {
        previousStatus: "To Do",
        newStatus: task.status,
        reason: "Task is now being worked on",
        comments: "Starting work on this task today",
      },
    },
    {
      id: 2,
      type: "assignment",
      actor: "Sarah Johnson",
      action: "assigned",
      target: task.title,
      timestamp: "1 week ago",
      date: "2023-05-13",
      details: {
        previousAssignee: "Unassigned",
        newAssignee: task.assignee,
        priority: task.priority,
        notes: "Please complete this by the end of the week",
      },
    },
    {
      id: 3,
      type: "comment",
      actor: "David Kim",
      action: "commented on",
      target: task.title,
      timestamp: "2 weeks ago",
      date: "2023-05-06",
      details: {
        commentText: "I've gathered all the necessary information to begin this task. Will start working on it soon.",
        attachments: [],
        mentions: ["Sarah Johnson"],
      },
    },
  ]

  // Define additional content with Activity section
  const additionalContent = (
    <>
      {/* Show all values button */}
      <Button variant="link" className="h-auto p-0 text-xs text-blue-600">
        Show all values
      </Button>

      {/* Activity Section */}
      <ActivitySection activities={activities} />
    </>
  )

  return (
    <MasterDetailsPanel 
      fieldGroups={fieldGroups} 
      isFullScreen={isFullScreen} 
      additionalContent={additionalContent} 
    />
  )
}

// Create a TaskSubtasksContent component for the subtasks tab
function TaskSubtasksContent({ task }: { task: Task }) {
  const [subtasks, setSubtasks] = React.useState(task.subtasks || [])
  const [isAddingSubtask, setIsAddingSubtask] = React.useState(false)
  const [newSubtaskTitle, setNewSubtaskTitle] = React.useState("")

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Subtasks ({subtasks.length})</h4>
        <Button variant="outline" size="sm" onClick={() => setIsAddingSubtask(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Subtask
        </Button>
      </div>
      
      <div className="space-y-2">
        {subtasks.map((subtask: any) => (
          <div
            key={subtask.id}
            className="rounded-lg border border-muted bg-muted/10 p-3 hover:bg-muted/20 transition-colors"
          >
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
                  >
                    <MoreHorizontalIcon className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Open Details</DropdownMenuItem>
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

        {isAddingSubtask && (
          <div className="rounded-lg border border-muted bg-muted/10 p-3">
            <div className="flex gap-2">
              <Input
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="Enter subtask title..."
                className="flex-1"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddSubtask()
                  if (e.key === "Escape") setIsAddingSubtask(false)
                }}
              />
              <Button size="sm" onClick={handleAddSubtask}>Add</Button>
              <Button size="sm" variant="ghost" onClick={() => setIsAddingSubtask(false)}>Cancel</Button>
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
  )
}
