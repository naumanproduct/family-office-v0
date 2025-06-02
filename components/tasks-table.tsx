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
  FileTextIcon,
  CalendarIcon,
  UsersIcon,
} from "lucide-react"

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
            <TableRow
              key={item.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onTaskClick?.(item)}
            >
              <TableCell className="font-medium">{item.title}</TableCell>
              <TableCell>{item.dueDate}</TableCell>
              <TableCell>
                <Badge 
                  variant={item.priority === 'High' ? 'destructive' : item.priority === 'Medium' ? 'default' : 'secondary'}
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
        <Card
          key={item.id}
          className="cursor-pointer hover:bg-muted/50"
          onClick={() => onTaskClick?.(item)}
        >
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
                      variant={item.priority === 'High' ? 'destructive' : item.priority === 'Medium' ? 'default' : 'secondary'}
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
                      variant={item.priority === 'High' ? 'destructive' : item.priority === 'Medium' ? 'default' : 'secondary'}
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
              {item.relatedTo && (
                <p className="mt-2 text-xs text-blue-600">Related to: {item.relatedTo.name}</p>
              )}
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
  const [viewMode, setViewMode] = React.useState<"card" | "list" | "table">("list")
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [selectedTask, setSelectedTask] = React.useState<any>(null)

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

  if (selectedTask) {
    return <TaskDetailsView task={selectedTask} onBack={() => setSelectedTask(null)} recordName="All Tasks" />
  }

  return (
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
          <Button size="sm">
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Task Content */}
      {renderTaskContent()}
    </div>
  )
}
