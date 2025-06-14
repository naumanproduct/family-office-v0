"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVerticalIcon } from "lucide-react"

// Define the Task type
export type Task = {
  id: number | string
  title: string
  priority: string
  status: string
  assignee: string
  dueDate: string
  description?: string
  relatedTo?: { type: string; name: string }
}

export interface TaskTableProps {
  data: Task[]
  onTaskClick?: (task: Task) => void
  onStatusChange?: (taskId: number | string, newStatus: string) => void
  viewMode?: "table" | "card" | "list"
}

/**
 * A unified task table component that can be used across the application.
 * Supports three view modes: table, card, and list.
 */
export function UnifiedTaskTable({
  data,
  onTaskClick,
  onStatusChange,
  viewMode = "table",
}: TaskTableProps) {
  // Function to handle task status toggle
  const handleTaskStatusToggle = (e: React.MouseEvent, task: Task) => {
    e.stopPropagation()
    // Toggle the status between "completed" and "pending"
    const newStatus = task.status.toLowerCase() === "completed" ? "pending" : "completed"
    
    // If onStatusChange is provided, call it
    if (onStatusChange) {
      onStatusChange(task.id, newStatus)
    } else {
      // Fallback to direct mutation if no callback is provided
      // This is not ideal for production, but works for the demo
      task.status = newStatus
    }
  }

  // Different view modes
  if (viewMode === "table") {
    return (
      <TableView 
        data={data} 
        onTaskClick={onTaskClick} 
        handleTaskStatusToggle={handleTaskStatusToggle} 
      />
    )
  }

  if (viewMode === "card") {
    return (
      <CardView 
        data={data} 
        onTaskClick={onTaskClick} 
        handleTaskStatusToggle={handleTaskStatusToggle} 
      />
    )
  }

  return (
    <ListView 
      data={data} 
      onTaskClick={onTaskClick} 
      handleTaskStatusToggle={handleTaskStatusToggle} 
    />
  )
}

// Table view component
function TableView({
  data,
  onTaskClick,
  handleTaskStatusToggle,
}: {
  data: Task[]
  onTaskClick?: (task: Task) => void
  handleTaskStatusToggle: (e: React.MouseEvent, task: Task) => void
}) {
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
            <TableRow 
              key={item.id} 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onTaskClick?.(item)}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <div className="group relative flex items-center justify-center">
                  <Checkbox 
                    className="h-4 w-4 rounded-full border-2 group-hover:border-primary/70 transition-colors"
                    checked={item.status.toLowerCase() === "completed"} 
                    onCheckedChange={() => handleTaskStatusToggle(window.event as unknown as React.MouseEvent, item)}
                  />
                </div>
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
                        handleTaskStatusToggle(e, item);
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

// Card view component
function CardView({
  data,
  onTaskClick,
  handleTaskStatusToggle,
}: {
  data: Task[]
  onTaskClick?: (task: Task) => void
  handleTaskStatusToggle: (e: React.MouseEvent, task: Task) => void
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
            <div className="flex gap-4">
              <div onClick={(e) => e.stopPropagation()} className="mt-1">
                <div className="group relative flex items-center justify-center">
                  <Checkbox 
                    className="h-4 w-4 rounded-full border-2 group-hover:border-primary/70 transition-colors"
                    checked={item.status.toLowerCase() === "completed"} 
                    onCheckedChange={() => handleTaskStatusToggle(window.event as unknown as React.MouseEvent, item)}
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <h3 className={`font-medium ${item.status.toLowerCase() === "completed" ? "line-through text-muted-foreground" : ""}`}>
                    {item.title}
                  </h3>
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
                          handleTaskStatusToggle(e, item);
                        }}
                      >
                        {item.status.toLowerCase() === "completed" ? "Mark as Pending" : "Mark as Completed"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant={
                      item.priority === "High" ? "destructive" : item.priority === "Medium" ? "default" : "secondary"
                    }
                    className="mr-1"
                  >
                    {item.priority}
                  </Badge>
                  <Badge variant={item.status.toLowerCase() === "completed" ? "secondary" : "outline"}>
                    {item.status}
                  </Badge>
                </div>
                <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
                  <span>{item.assignee}</span>
                  <span>{item.dueDate}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// List view component
function ListView({
  data,
  onTaskClick,
  handleTaskStatusToggle,
}: {
  data: Task[]
  onTaskClick?: (task: Task) => void
  handleTaskStatusToggle: (e: React.MouseEvent, task: Task) => void
}) {
  return (
    <div className="divide-y">
      {data.map((item) => (
        <div
          key={item.id}
          className="py-4 cursor-pointer hover:bg-muted/50"
          onClick={() => onTaskClick?.(item)}
        >
          <div className="flex items-start">
            <div onClick={(e) => e.stopPropagation()} className="mt-1 mr-4">
              <div className="group relative flex items-center justify-center">
                <Checkbox 
                  className="h-4 w-4 rounded-full border-2 group-hover:border-primary/70 transition-colors"
                  checked={item.status.toLowerCase() === "completed"} 
                  onCheckedChange={() => handleTaskStatusToggle(window.event as unknown as React.MouseEvent, item)}
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <h3 className={`font-medium ${item.status.toLowerCase() === "completed" ? "line-through text-muted-foreground" : ""}`}>
                  {item.title}
                </h3>
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
                        handleTaskStatusToggle(e, item);
                      }}
                    >
                      {item.status.toLowerCase() === "completed" ? "Mark as Pending" : "Mark as Completed"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant={
                    item.priority === "High" ? "destructive" : item.priority === "Medium" ? "default" : "secondary"
                  }
                  className="mr-1"
                >
                  {item.priority}
                </Badge>
                <Badge variant={item.status.toLowerCase() === "completed" ? "secondary" : "outline"}>
                  {item.status}
                </Badge>
              </div>
              <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
                <span>{item.assignee}</span>
                <span>{item.dueDate}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
