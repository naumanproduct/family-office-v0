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
  ActivityIcon,
  CheckSquareIcon,
  CheckCircleIcon,
  CircleIcon,
  ClockIcon,
  FileTextIcon,
  UserIcon,
  CalendarIcon,
} from "lucide-react"
import { createPortal } from "react-dom"
import { useState, createContext, useContext } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { TaskDetailsView } from "./task-details-view"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { TaskTemplateDialog } from "./task-template-dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { UnifiedTaskTable } from "./shared/unified-task-table"
import { NoteContent } from "@/components/shared/note-content"
import { FileContent } from "@/components/shared/file-content"
import { TypableArea } from "@/components/typable-area"

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
  },
]

// Define the Task type
type Task = {
  id: number
  title: string
  priority: string
  status: string
  assignee: string
  dueDate: string
  description: string
  relatedTo?: { type: string; name: string }
}

// Create a context for tasks
type TasksContextType = {
  tasks: Task[]
  updateTaskStatus: (taskId: number | string, newStatus: string) => void
}

const TasksContext = createContext<TasksContextType>({
  tasks: [],
  updateTaskStatus: () => {},
})

// Provider component for tasks
export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = React.useState<Task[]>(tasksData)

  const updateTaskStatus = (taskId: number | string, newStatus: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === Number(taskId) ? { ...task, status: newStatus } : task
      )
    )
  }

  return (
    <TasksContext.Provider value={{ tasks, updateTaskStatus }}>
      {children}
    </TasksContext.Provider>
  )
}

// Create a hook to use the tasks context
export function useTasks() {
  const context = useContext(TasksContext)
  if (context === undefined) {
    throw new Error("useTasks must be used within a TasksProvider")
  }
  return context
}

export function TasksTable() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [selectedSubtask, setSelectedSubtask] = useState<any>(null)
  const [viewMode, setViewMode] = useState<"table" | "card" | "list">("table")
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [globalFilter, setGlobalFilter] = useState("")
  const [isTaskTemplateOpen, setIsTaskTemplateOpen] = useState(false)
  
  // Use the tasks context
  const { tasks, updateTaskStatus } = useTasks()

  // Handle back navigation in the drawer
  const handleDrawerBackClick = () => {
    if (selectedSubtask) {
      // If in a subtask view, return to parent task
      setSelectedSubtask(null)
    } else {
      // If in main task view, close the drawer
      setSelectedTask(null)
    }
  }

  // Handle a subtask selection
  const handleSubtaskClick = (subtask: any) => {
    setSelectedSubtask(subtask)
  }

  // ESC key handler for full screen mode
  React.useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isFullScreen) {
        setIsFullScreen(false)
      }
    }

    if (isFullScreen) {
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

  const FullScreenContent = () => {
    if (typeof document === "undefined") return null

    // Local state for tabs in fullscreen right pane
    const [activeTab, setActiveTab] = useState<"activity" | "subtasks" | "notes" | "files">("activity")

    const [noteText, setNoteText] = useState("")

    // Manage subtasks locally for the right-hand pane (fallback to sample data if none)
    const defaultSubtasks = [
      {
        id: "SUBTASK-1",
        title: "Review financial statements",
        status: "Completed",
        priority: "High",
        assignee: "John Smith",
        dueDate: "2023-05-18",
      },
      {
        id: "SUBTASK-2",
        title: "Analyze market conditions",
        status: "In Progress",
        priority: "Medium",
        assignee: "Sarah Johnson",
        dueDate: "2023-05-20",
      },
      {
        id: "SUBTASK-3",
        title: "Prepare investment memo",
        status: "To Do",
        priority: "High",
        assignee: "Michael Brown",
        dueDate: "2023-05-22",
      },
    ]

    const { updateTaskStatus } = useTasks()

    const [subtasksState, setSubtasksState] = useState<any[]>(
      (selectedTask && (selectedTask as any).subtasks) || defaultSubtasks,
    )

    const handleSubtaskStatusChange = (subtaskId: string, newStatus: string) => {
      setSubtasksState((prev) =>
        prev.map((st) => (st.id === subtaskId ? { ...st, status: newStatus } : st)),
      )

      // Update global context if numeric id
      if (!isNaN(Number(subtaskId))) {
        updateTaskStatus(Number(subtaskId), newStatus)
      }
    }

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
                setSelectedTask(null)
                setSelectedSubtask(null)
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
                setSelectedTask(null)
                setSelectedSubtask(null)
              }}
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Split Pane Content */}
        <div className="flex h-[calc(100vh-73px)]">
          {/* Left Panel */}
          <div className="w-[672px] border-r bg-background flex flex-col">
            {/* Record Header */}
            <div className="border-b bg-background px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <CheckSquareIcon className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{selectedTask?.title || "Untitled"}</h2>
                  <p className="text-sm text-muted-foreground">Task • {selectedTask?.id}</p>
                </div>
              </div>
            </div>

            {/* Details Panel Content */}
            <TaskDetailsView
              task={selectedSubtask || selectedTask}
              onBack={handleDrawerBackClick}
              recordName="All Tasks"
              isInDrawer={true}
              parentTask={selectedSubtask ? selectedTask : undefined}
              onBackToParent={() => setSelectedSubtask(null)}
              onSubtaskClick={handleSubtaskClick}
              isFullScreen={true}
              hideSubtasks={true}
            />
          </div>

          {/* Right Panel */}
          <div className="flex-1 overflow-y-auto flex flex-col">
            {/* Tabs */}
            <div className="border-b bg-background px-6">
              <div className="flex relative overflow-x-auto">
                <button
                  onClick={() => setActiveTab("activity")}
                  className={`relative whitespace-nowrap py-3 px-2 text-sm font-medium flex items-center gap-1 min-w-0 ${
                    activeTab === "activity"
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <ActivityIcon className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">Activity</span>
                  {activeTab === "activity" && (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"></span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("subtasks")}
                  className={`relative whitespace-nowrap py-3 px-2 text-sm font-medium flex items-center gap-1 min-w-0 ${
                    activeTab === "subtasks"
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <ListIcon className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">Subtasks</span>
                  {activeTab === "subtasks" && (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"></span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("notes")}
                  className={`relative whitespace-nowrap py-3 px-2 text-sm font-medium flex items-center gap-1 min-w-0 ${
                    activeTab === "notes"
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <FileTextIcon className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">Notes</span>
                  {activeTab === "notes" && (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"></span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("files")}
                  className={`relative whitespace-nowrap py-3 px-2 text-sm font-medium flex items-center gap-1 min-w-0 ${
                    activeTab === "files"
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <FileTextIcon className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">Files</span>
                  {activeTab === "files" && (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"></span>
                  )}
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6 flex-1 space-y-4">
              {activeTab === "activity" && (
                <p className="text-muted-foreground">No recent activity for this task.</p>
              )}

              {activeTab === "subtasks" && (
                <div className="space-y-2">
                  {subtasksState.map((st) => (
                    <div
                      key={st.id}
                      className="rounded-lg border border-muted bg-muted/10 p-3 hover:bg-muted/20 transition-colors"
                      onClick={() => handleSubtaskClick(st)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation()
                              const newStatus = st.status === "Completed" ? "To Do" : "Completed"
                              handleSubtaskStatusChange(st.id, newStatus)
                            }}
                          >
                            {st.status === "Completed" ? (
                              <CheckCircleIcon className="h-4 w-4 text-green-500" />
                            ) : st.status === "In Progress" ? (
                              <ClockIcon className="h-4 w-4 text-blue-500" />
                            ) : (
                              <CircleIcon className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                          <div className="flex-1">
                            <p
                              className={`text-sm font-medium ${
                                st.status === "Completed" ? "line-through text-muted-foreground" : ""
                              }`}
                            >
                              {st.title}
                            </p>
                            <div className="flex items-center gap-4 mt-1">
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <UserIcon className="h-3 w-3" />
                                {st.assignee}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <CalendarIcon className="h-3 w-3" />
                                {new Date(st.dueDate).toLocaleDateString()}
                              </div>
                              <Badge className="text-xs" variant="secondary">
                                {st.priority}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {st.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {subtasksState.length === 0 && (
                    <p className="text-sm text-muted-foreground">No subtasks yet</p>
                  )}
                </div>
              )}

              {activeTab === "notes" && (
                <div className="space-y-4">
                  <NoteContent />
                  <TypableArea
                    value={noteText}
                    onChange={setNoteText}
                    placeholder="Add a note..."
                    showButtons={true}
                    submitLabel="Add note"
                  />
                </div>
              )}

              {activeTab === "files" && <FileContent />}
            </div>
          </div>
        </div>
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

        {/* Task Content using the UnifiedTaskTable component */}
        <UnifiedTaskTable 
          data={tasks} 
          onTaskClick={setSelectedTask} 
          onStatusChange={updateTaskStatus}
          viewMode={viewMode}
        />
      </div>

      {/* Render full screen content if in full screen mode */}
      {isFullScreen && selectedTask && <FullScreenContent />}

      {/* Task Details Sheet/Drawer */}
      {selectedTask && !isFullScreen && (
        <Sheet open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
          <SheetContent side="right" className="flex w-full max-w-2xl flex-col p-0 sm:max-w-2xl [&>button]:hidden">
            {/* Header */}
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
                <Button variant="outline" size="icon" onClick={() => setIsFullScreen(true)}>
                  <ExpandIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {/* Task Details Content */}
            <div className="flex-1 overflow-auto">
              <TaskDetailsView
                task={selectedSubtask || selectedTask}
                onBack={handleDrawerBackClick}
                recordName="All Tasks"
                isInDrawer={true}
                parentTask={selectedSubtask ? selectedTask : undefined}
                onBackToParent={() => setSelectedSubtask(null)}
                onSubtaskClick={handleSubtaskClick}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
      {/* Task Template Dialog */}
      <TaskTemplateDialog isOpen={isTaskTemplateOpen} onClose={() => setIsTaskTemplateOpen(false)} />
    </>
  )
}

// Wrap the component export to include the provider
export default function TasksTableWithProvider() {
  return (
    <TasksProvider>
      <TasksTable />
    </TasksProvider>
  )
}
