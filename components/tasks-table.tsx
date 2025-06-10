"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  FilterIcon,
  MoreVerticalIcon,
  PlusIcon,
  SearchIcon,
  LayoutGridIcon,
  ListIcon,
  TableIcon,
  ChevronLeftIcon,
  XIcon,
  ExpandIcon,
  CheckSquareIcon,
  FileTextIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  UserIcon,
  CalendarIcon,
  CircleIcon,
  ClockIcon,
  DotIcon as DotsHorizontalIcon,
} from "lucide-react"
import { createPortal } from "react-dom"
import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { TaskTemplateDialog } from "./task-template-dialog"
import { Label } from "@/components/ui/label"
import { NoteContent } from "@/components/shared/note-content"
import { FileContent } from "@/components/shared/file-content"
import { TaskDetailsView } from "@/components/task-details-view"

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
    title: "Capital Call",
    priority: "High",
    status: "In Progress",
    assignee: "You",
    dueDate: "2024-01-15",
    description: "Process capital call for TechFlow Ventures Series C investment",
    relatedTo: { type: "Investment", name: "TechFlow Ventures Series C" },
    subtasks: [
      {
        id: "CC-1",
        title: "Review Capital Call Notice PDF",
        description: "Open and understand key terms (amount, due date)",
        status: "Completed",
        priority: "High",
        assignee: "You",
        dueDate: "2024-01-10",
        subtasks: [],
      },
      {
        id: "CC-2",
        title: "Validate with Principal",
        description: "Confirm LP or internal commitment matches",
        status: "Completed",
        priority: "High",
        assignee: "You",
        dueDate: "2024-01-11",
        subtasks: [],
      },
      {
        id: "CC-3",
        title: "Record in System",
        description: "Log in accounting system or ledger",
        status: "In Progress",
        priority: "Medium",
        assignee: "You",
        dueDate: "2024-01-12",
        subtasks: [],
      },
      {
        id: "CC-4",
        title: "Notify Accountant",
        description: "Forward or tag accountant for payment setup",
        status: "To Do",
        priority: "Medium",
        assignee: "Sarah Johnson",
        dueDate: "2024-01-13",
        subtasks: [],
      },
      {
        id: "CC-5",
        title: "Confirm Wire Date",
        description: "Align on when funds will be sent",
        status: "To Do",
        priority: "High",
        assignee: "You",
        dueDate: "2024-01-14",
        subtasks: [],
      },
      {
        id: "CC-6",
        title: "Follow-Up if Not Funded",
        description: "If deadline passes, notify appropriate party",
        status: "To Do",
        priority: "Medium",
        assignee: "You",
        dueDate: "2024-01-16",
        subtasks: [],
      },
      {
        id: "CC-7",
        title: "Mark as Complete",
        description: "Close the call internally",
        status: "To Do",
        priority: "Low",
        assignee: "You",
        dueDate: "2024-01-17",
        subtasks: [],
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
  data: any[]
  onTaskClick?: (task: any) => void
}) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50" onClick={() => onTaskClick?.(item)}>
              <TableCell className="font-medium">{item.title}</TableCell>
              <TableCell>{item.dueDate}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    item.priority === "High" ? "destructive" : item.priority === "Medium" ? "default" : "secondary"
                  }
                >
                  {item.priority}
                </Badge>
              </TableCell>
              <TableCell>{item.assignee}</TableCell>
              <TableCell>
                <Badge variant="outline">{item.status}</Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                      <MoreVerticalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View</DropdownMenuItem>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
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
                    <MoreVerticalIcon className="h-4 w-4" />
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
                  <MoreVerticalIcon className="h-4 w-4" />
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
  const [drawerOpen, setDrawerOpen] = useState(false)

  // React hook to handle task selection
  React.useEffect(() => {
    // When a task is selected, open the drawer
    if (selectedTask && !isFullScreen) {
      setDrawerOpen(true);
    }
    
    // Reset subtask state when selected task changes
    setSelectedSubtask(null);
    setIsSubtaskDrawerOpen(false);
    
    // If we're in full screen mode and a task is selected, set the active tab to subtasks
    if (isFullScreen && selectedTask) {
      setActiveTab("subtasks");
    }
  }, [selectedTask, isFullScreen]);

  // Handle closing of the main drawer
  React.useEffect(() => {
    if (!drawerOpen) {
      // Only clear the task after the drawer animation is complete
      const timer = setTimeout(() => {
        setSelectedTask(null);
      }, 300); // Match the animation duration
      
      return () => clearTimeout(timer);
    }
  }, [drawerOpen]);

  // Handle back navigation in the drawer
  const handleDrawerBackClick = () => {
    if (selectedSubtask) {
      // If in a subtask view, return to parent task view
      // but don't close the drawer, just clear the subtask
      setSelectedSubtask(null);
    } else {
      // If in main task view, close the drawer
      setDrawerOpen(false);
      
      // Use setTimeout to prevent React errors during animation
      setTimeout(() => {
        setSelectedTask(null);
      }, 300);
    }
  }

  // Handle a subtask selection 
  const handleSubtaskClick = (subtask: any) => {
    // Create a deep copy of the subtask to ensure all properties are preserved
    const subtaskCopy = {
      ...subtask,
      // Ensure all properties are properly copied
      id: subtask.id,
      title: subtask.title,
      description: subtask.description,
      status: subtask.status,
      priority: subtask.priority,
      assignee: subtask.assignee,
      dueDate: subtask.dueDate,
      subtasks: subtask.subtasks || [] // Ensure subtasks are preserved if any
    };
    
    // Set the selected subtask
    setSelectedSubtask(subtaskCopy);
    
    if (isFullScreen) {
      // In full screen mode, open the subtask drawer
      setIsSubtaskDrawerOpen(true);
    }
    // In drawer mode, the subtask will be shown automatically due to conditional rendering
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
        setIsFullScreen(false);
        // Reset selected states when exiting full screen
        setTimeout(() => {
          setSelectedSubtask(null);
          setIsSubtaskDrawerOpen(false);
        }, 100);
      }
    }

    if (isFullScreen) {
      // When entering full screen mode, set the active tab to something other than "details"
      setActiveTab("subtasks");
      document.addEventListener("keydown", handleEscKey);
      return () => {
        document.removeEventListener("keydown", handleEscKey);
      }
    }
  }, [isFullScreen]);

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
                setIsFullScreen(false);
                // Clear selected subtask first
                setSelectedSubtask(null);
                setIsSubtaskDrawerOpen(false);
                // Then clear selected task after a delay
                setTimeout(() => {
                  setSelectedTask(null);
                }, 100);
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
                setIsFullScreen(false);
                // Clear selected subtask first
                setSelectedSubtask(null);
                setIsSubtaskDrawerOpen(false);
                // Then clear selected task after a delay
                setTimeout(() => {
                  setSelectedTask(null);
                }, 100);
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
              setIsSubtaskDrawerOpen(open);
              if (!open) {
                // Use setTimeout to prevent React errors during animation
                setTimeout(() => {
                  setSelectedSubtask(null);
                  // We no longer want to clear the selectedTask here
                  // This ensures we go back to the parent task view
                }, 300);
              }
            }}
          >
            <SheetTitle className="sr-only">Subtask Details</SheetTitle>
            <SheetContent side="right" className="flex w-full max-w-4xl flex-col p-0 sm:max-w-4xl [&>button]:hidden z-[99999]">
              {/* Header */}
              <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
                <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => {
                      // Close the subtask drawer but keep the parent task open
                      setIsSubtaskDrawerOpen(false);
                      
                      // Use setTimeout to prevent React errors during animation
                      setTimeout(() => {
                        setSelectedSubtask(null);
                      }, 300);
                    }}
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </Button>
                  <Badge variant="outline" className="bg-background">
                    Subtask
                  </Badge>
                  <div className="ml-2 text-sm font-medium">
                    {selectedSubtask?.title}
                  </div>
                </div>
              </div>
              {/* Subtask Details Content */}
              <div className="flex-1 overflow-auto">
                <TaskDetailsView
                  task={selectedSubtask}
                  onBack={() => {
                    // Close the subtask drawer but keep the parent task open
                    setIsSubtaskDrawerOpen(false);
                    
                    // Use setTimeout to prevent React errors during animation
                    setTimeout(() => {
                      setSelectedSubtask(null);
                    }, 300);
                  }}
                  recordName={selectedTask?.relatedTo?.name || "All Tasks"}
                  parentTask={selectedTask}
                  onBackToParent={() => {
                    // Close the subtask drawer but keep the parent task open
                    setIsSubtaskDrawerOpen(false);
                    
                    // Use setTimeout to prevent React errors during animation
                    setTimeout(() => {
                      setSelectedSubtask(null);
                    }, 300);
                  }}
                  isInDrawer={true}
                  onNavigateBack={() => setSelectedSubtask(null)}
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
      <Sheet 
        open={drawerOpen && !!selectedTask && !isFullScreen} 
        onOpenChange={setDrawerOpen}
      >
        <SheetTitle className="sr-only">Task Details</SheetTitle>
        <SheetContent className="flex w-full max-w-4xl flex-col p-0 sm:max-w-4xl [&>button]:hidden">
          <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={handleDrawerBackClick}>
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <Badge variant="outline" className="bg-background">
                {selectedSubtask ? "Subtask" : "Task"}
              </Badge>
              <div className="ml-2 text-sm font-medium">
                {selectedSubtask ? selectedSubtask.title : selectedTask?.title}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setIsFullScreen(true)}>
                <ExpandIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            {selectedSubtask ? (
              <TaskDetailsView
                task={selectedSubtask}
                onBack={() => setSelectedSubtask(null)} 
                recordName={selectedTask?.relatedTo?.name || "All Tasks"}
                parentTask={selectedTask}
                onBackToParent={() => setSelectedSubtask(null)}
                isInDrawer={true}
                onNavigateBack={() => setSelectedSubtask(null)}
              />
            ) : (
              <TaskDetailsView
                task={selectedTask}
                onBack={handleDrawerBackClick}
                recordName={selectedTask?.relatedTo?.name || "All Tasks"}
                isInDrawer={true}
                onSubtaskClick={(subtask) => handleSubtaskClick(subtask)}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>

      {isFullScreen && <FullScreenContent />}
      
      {/* Task template dialog */}
      <TaskTemplateDialog isOpen={isTaskTemplateOpen} onClose={() => setIsTaskTemplateOpen(false)} />
    </>
  )
}
