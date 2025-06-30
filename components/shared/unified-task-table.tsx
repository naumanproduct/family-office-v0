"use client"

import * as React from "react"
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
import { MoreVerticalIcon, Zap } from "lucide-react"
import { RecordCard } from "./record-card"
import { RecordListItem } from "./record-list-item"

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
  isInDrawer?: boolean
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
  isInDrawer = false,
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
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow 
              key={item.id} 
              className="group cursor-pointer hover:bg-muted/50"
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
              <TableCell className={`font-medium text-sm ${item.status.toLowerCase() === "completed" ? "line-through text-muted-foreground" : ""}`}>
                {item.title.includes("Update capital schedule") ? (
                  <span className="flex items-center gap-1">
                    {item.title}
                    <Zap className="h-3 w-3 text-yellow-500" />
                  </span>
                ) : (
                  item.title
                )}
              </TableCell>
              <TableCell>
                <span className={`text-sm ${
                  item.status.toLowerCase() === "completed" ? "text-green-600" : 
                  "text-muted-foreground"
                }`}>
                  {item.status}
                </span>
              </TableCell>
              <TableCell>
                <span className={`text-sm ${
                  item.priority === "High" ? "text-red-600" : 
                  item.priority === "Medium" ? "text-yellow-600" : 
                  "text-green-600"
                }`}>
                  {item.priority}
                </span>
              </TableCell>
              <TableCell className="text-sm">{item.dueDate}</TableCell>
              <TableCell className="text-sm">{item.assignee}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
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
      {data.map((item) => {
        // Create checkbox element for tasks
        const taskCheckbox = (
          <div className="group relative flex items-center justify-center">
            <Checkbox 
              className="h-4 w-4 rounded-full border-2 group-hover:border-primary/70 transition-colors"
              checked={item.status.toLowerCase() === "completed"} 
              onCheckedChange={() => handleTaskStatusToggle(window.event as unknown as React.MouseEvent, item)}
            />
          </div>
        );
        
        // Define task actions
        const taskActions = [
          { label: "View", onClick: () => {} },
          { label: "Edit", onClick: () => {} },
          { 
            label: item.status.toLowerCase() === "completed" ? "Mark as Pending" : "Mark as Completed", 
            onClick: (e: React.MouseEvent) => handleTaskStatusToggle(e, item)
          },
          { label: "Delete", onClick: () => {}, variant: "destructive" as const },
        ];
        
        // Define secondary metadata (plain text info)
        const secondaryMetadata = {
          left: (
            <div className="flex items-center gap-2">
              <span>{item.assignee}</span>
              <span className="text-muted-foreground">•</span>
              <span>{item.status}</span>
              <span className="text-muted-foreground">•</span>
              <span>{item.priority}</span>
            </div>
          ),
          right: item.dueDate
        };
        
        return (
          <RecordCard
            key={item.id}
            title={
              item.title.includes("Update capital schedule") ? (
                <span className="flex items-center gap-1">
                  {item.title}
                  <Zap className="h-3 w-3 text-yellow-500" />
                </span>
              ) : (
                item.title
              )
            }
            titleStatus={item.status.toLowerCase() === "completed" ? "completed" : "normal"}
            primaryMetadata={[]}
            secondaryMetadata={secondaryMetadata}
            onClick={() => onTaskClick?.(item)}
            actions={taskActions}
            leadingElement={taskCheckbox}
          />
        );
      })}
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
      {data.map((item) => {
        // Create checkbox element for tasks
        const taskCheckbox = (
          <div className="group relative flex items-center justify-center">
            <Checkbox 
              className="h-4 w-4 rounded-full border-2 group-hover:border-primary/70 transition-colors"
              checked={item.status.toLowerCase() === "completed"} 
              onCheckedChange={() => handleTaskStatusToggle(window.event as unknown as React.MouseEvent, item)}
            />
          </div>
        );
        
        // Define task actions
        const taskActions = [
          { label: "View", onClick: () => {} },
          { label: "Edit", onClick: () => {} },
          { 
            label: item.status.toLowerCase() === "completed" ? "Mark as Pending" : "Mark as Completed", 
            onClick: (e: React.MouseEvent) => handleTaskStatusToggle(e, item)
          },
          { label: "Delete", onClick: () => {}, variant: "destructive" as const },
        ];
        
        // Define secondary metadata (plain text info)
        const secondaryMetadata = {
          left: (
            <div className="flex items-center gap-2">
              <span>{item.assignee}</span>
              <span className="text-muted-foreground">•</span>
              <span>{item.status}</span>
              <span className="text-muted-foreground">•</span>
              <span>{item.priority}</span>
            </div>
          ),
          right: item.dueDate
        };
        
        return (
          <RecordListItem
            key={item.id}
            title={
              item.title.includes("Update capital schedule") ? (
                <span className="flex items-center gap-1">
                  {item.title}
                  <Zap className="h-3 w-3 text-yellow-500" />
                </span>
              ) : (
                item.title
              )
            }
            titleStatus={item.status.toLowerCase() === "completed" ? "completed" : "normal"}
            primaryMetadata={[]}
            secondaryMetadata={secondaryMetadata}
            onClick={() => onTaskClick?.(item)}
            actions={taskActions}
            leadingElement={taskCheckbox}
          />
        );
      })}
    </div>
  )
}
