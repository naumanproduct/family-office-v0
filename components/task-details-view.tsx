"use client"

import * as React from "react"
import { CheckCircleIcon, CalendarIcon, UserIcon, AlertTriangleIcon, FileTextIcon, CheckSquareIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface TaskDetailsViewProps {
  task: any
  onBack: () => void
  recordName: string
}

export function TaskDetailsView({ task, onBack, recordName }: TaskDetailsViewProps) {
  const [commentText, setCommentText] = React.useState("")
  const [isFocused, setIsFocused] = React.useState(false)
  const [taskTitle, setTaskTitle] = React.useState(task.title || "")

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
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex flex-col flex-1">
      {/* Task Header - Exact same placement as main drawer record header */}
      <div className="border-b bg-background px-6 py-2">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <CheckSquareIcon className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <Input
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="Untitled"
              className="text-lg font-semibold border-none p-0 h-auto bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <p className="text-sm text-muted-foreground">Task in {recordName}</p>
          </div>
        </div>
      </div>

      {/* Task Content - With proper padding */}
      <div className="p-6 space-y-6">
        {/* Task Details */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Task Details</h4>

          <div className="rounded-lg border border-muted bg-muted/10 p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Description</Label>
                  <p className="text-sm">{task.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <AlertTriangleIcon className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Priority</Label>
                  <Badge className={`text-xs mt-1 ${getPriorityColor(task.priority)}`}>{task.priority}</Badge>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  <Badge className={`text-xs mt-1 ${getStatusColor(task.status)}`}>{task.status}</Badge>
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

              <div className="flex items-center gap-2">
                <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Related to</Label>
                  <p className="text-sm">{recordName}</p>
                </div>
              </div>
            </div>
          </div>

          <Button variant="link" className="h-auto p-0 text-xs text-blue-600">
            Show all values
          </Button>
        </div>

        {/* Comments Section */}
        <div className="space-y-4">
          {/* Comment Input */}
          <div className="space-y-3">
            <div
              className={`min-h-[100px] p-3 rounded-lg transition-all ${
                isFocused ? "border border-input bg-background" : "bg-muted/30"
              }`}
            >
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                  if (!commentText.trim()) {
                    setIsFocused(false)
                  }
                }}
                placeholder="Enter text or type '/' for commands"
                className="w-full h-full bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground text-sm"
              />
            </div>

            {isFocused && (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    // Handle comment submission here
                    console.log("Adding comment:", commentText)
                    setCommentText("")
                    setIsFocused(false)
                  }}
                  disabled={!commentText.trim()}
                >
                  Add comment
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCommentText("")
                    setIsFocused(false)
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
