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

// Create the tasks context
type TasksContextType = {
  tasks: Task[]
  updateTaskStatus: (taskId: number, newStatus: string) => void
}

const TasksContext = createContext<TasksContextType | undefined>(undefined)

// Create a provider component
export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(tasksData)

  const updateTaskStatus = (taskId: number, newStatus: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, status: newStatus }
          : task
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

function TaskTableView({
  data,
  onTaskClick,
}: {
  data: any[]
  onTaskClick?: (task: any) => void
}) {
  const { updateTaskStatus } = useTasks()

  // Updated function to handle task completion status toggle
  const handleTaskStatusToggle = (e: React.MouseEvent, taskId: number) => {
    e.stopPropagation()
    // Find the task by ID
    const task = data.find(task => task.id === taskId)
    if (task) {
      // Toggle the status between "completed" and "pending"
      const newStatus = task.status.toLowerCase() === "completed" ? "pending" : "completed"
      // Update the task status using the context
      updateTaskStatus(taskId, newStatus)
    }
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
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
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox 
                  checked={item.status.toLowerCase() === "completed"} 
                  onCheckedChange={() => handleTaskStatusToggle(window.event as unknown as React.MouseEvent, item.id)}
                />
              </TableCell>
              <TableCell className={`font-medium ${item.status.toLowerCase() === "completed" ? "line-through text-muted-foreground" : ""}`}>
                {item.title}
              </TableCell>
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
                <Badge variant={item.status.toLowerCase() === "completed" ? "secondary" : "outline"}>
                  {item.status}
                </Badge>
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
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTaskStatusToggle(e, item.id);
                      }}
                    >
                      {item.status.toLowerCase() === "completed" ? "Mark as Pending" : "Mark as Completed"}
                    </DropdownMenuItem>
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

export function TasksTable() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [selectedSubtask, setSelectedSubtask] = useState<any>(null)
  const [viewMode, setViewMode] = useState<"table" | "card" | "list">("table")
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [globalFilter, setGlobalFilter] = useState("")
  const [isTaskTemplateOpen, setIsTaskTemplateOpen] = useState(false)
  
  // Use the tasks context
  const { tasks } = useTasks()

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

  const renderTaskContent = () => {
    if (viewMode === "table") {
      return <TaskTableView data={tasks} onTaskClick={setSelectedTask} />
    }
    if (viewMode === "card") {
      return <TaskCardView data={tasks} onTaskClick={setSelectedTask} />
    }
    return <TaskListView data={tasks} onTaskClick={setSelectedTask} />
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
              }}
            >
              <XIcon className="h-4 w-4" />
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
        {renderTaskContent()}
      </div>

      {/* Render full screen content if in full screen mode */}
      {isFullScreen && selectedTask && <FullScreenContent />}

      {/* Task Details Sheet/Drawer */}
      {selectedTask && !isFullScreen && (
        <Sheet open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
          <SheetContent side="right" className="flex w-full max-w-4xl flex-col p-0 sm:max-w-4xl [&>button]:hidden">
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
