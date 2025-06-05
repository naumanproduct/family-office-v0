"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowRight, Plus, X, User, AlertTriangle, ChevronDown, ChevronRight, Bookmark } from "lucide-react"

const priorityOptions = [
  { value: "low", label: "Low", color: "bg-green-100 text-green-800" },
  { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { value: "high", label: "High", color: "bg-red-100 text-red-800" },
]

const statusOptions = [
  { value: "todo", label: "To Do" },
  { value: "in-progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "completed", label: "Completed" },
]

const assigneeOptions = [
  { value: "you", label: "You" },
  { value: "john-smith", label: "John Smith" },
  { value: "sarah-johnson", label: "Sarah Johnson" },
  { value: "michael-brown", label: "Michael Brown" },
  { value: "legal-team", label: "Legal Team" },
  { value: "compliance-team", label: "Compliance Team" },
]

interface TaskCreatorProps {
  isOpen: boolean
  onClose: () => void
  onSave: (task: any) => void
  existingTemplate?: any
  isEditingTemplate?: boolean
}

export function TaskCreator({
  isOpen,
  onClose,
  onSave,
  existingTemplate,
  isEditingTemplate = false,
}: TaskCreatorProps) {
  const [activeTab, setActiveTab] = useState("basic")
  const [expandedSubtasks, setExpandedSubtasks] = useState<Set<number>>(new Set())
  const [showSaveAsTemplate, setShowSaveAsTemplate] = useState(false)
  const [templateName, setTemplateName] = useState("")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const [task, setTask] = useState(() => {
    if (existingTemplate) {
      return {
        title: existingTemplate.name || "",
        description: existingTemplate.description || "",
        priority: existingTemplate.priority?.toLowerCase() || "medium",
        status: "todo",
        assignee: "you",
        dueDate: "",
        subtasks: existingTemplate.subtasks?.map((st: any) => ({ ...st, included: true })) || [],
      }
    }
    return {
      title: "",
      description: "",
      priority: "medium",
      status: "todo",
      assignee: "you",
      dueDate: "",
      subtasks: [],
    }
  })

  const [originalTask, setOriginalTask] = useState(task)

  useEffect(() => {
    if (existingTemplate) {
      const newTask = {
        title: existingTemplate.name || "",
        description: existingTemplate.description || "",
        priority: existingTemplate.priority?.toLowerCase() || "medium",
        status: "todo",
        assignee: "you",
        dueDate: "",
        subtasks: existingTemplate.subtasks?.map((st: any) => ({ ...st, included: true })) || [],
      }
      setTask(newTask)
      setOriginalTask(newTask)
      setExpandedSubtasks(new Set())
      setHasUnsavedChanges(false)
    }
  }, [existingTemplate])

  // Track changes for unsaved state
  useEffect(() => {
    const hasChanges = JSON.stringify(task) !== JSON.stringify(originalTask)
    setHasUnsavedChanges(hasChanges)
  }, [task, originalTask])

  const handleSave = () => {
    if (isEditingTemplate) {
      console.log("Updating template:", existingTemplate.id, task)
    } else {
      onSave(task)
    }
    onClose()
    resetForm()
  }

  const handleCancel = () => {
    if (hasUnsavedChanges && !isEditingTemplate) {
      // For task creation, just close - they can start over
      onClose()
      resetForm()
    } else if (hasUnsavedChanges && isEditingTemplate) {
      // For template editing, revert to original
      setTask(originalTask)
      setHasUnsavedChanges(false)
      onClose()
      resetForm()
    } else {
      // No changes, just close
      onClose()
      resetForm()
    }
  }

  const handleSaveAsTemplate = () => {
    if (!templateName.trim()) return
    console.log("Saving as template:", {
      name: templateName,
      description: task.description,
      subtasks: task.subtasks.filter((st: any) => st.included !== false),
    })
    handleSave()
  }

  const resetForm = () => {
    setTask({
      title: "",
      description: "",
      priority: "medium",
      status: "todo",
      assignee: "you",
      dueDate: "",
      subtasks: [],
    })
    setActiveTab("basic")
    setExpandedSubtasks(new Set())
    setShowSaveAsTemplate(false)
    setTemplateName("")
    setHasUnsavedChanges(false)
  }

  const updateTask = (updates: any) => {
    setTask((prev) => ({ ...prev, ...updates }))
  }

  const toggleSubtask = (subtaskIndex: number) => {
    const updatedSubtasks = [...task.subtasks]
    updatedSubtasks[subtaskIndex] = {
      ...updatedSubtasks[subtaskIndex],
      included: !updatedSubtasks[subtaskIndex].included,
    }
    updateTask({ subtasks: updatedSubtasks })
  }

  const toggleSubtaskExpansion = (index: number) => {
    const newExpanded = new Set<number>()
    if (!expandedSubtasks.has(index)) {
      newExpanded.add(index)
    }
    setExpandedSubtasks(newExpanded)
  }

  const addCustomSubtask = () => {
    const newSubtask = {
      title: "",
      description: "",
      priority: "medium",
      included: true,
      isCustom: true,
    }
    const newIndex = task.subtasks.length
    updateTask({ subtasks: [...task.subtasks, newSubtask] })
    setExpandedSubtasks(new Set([newIndex]))
  }

  const updateSubtask = (index: number, field: string, value: string) => {
    const updatedSubtasks = [...task.subtasks]
    updatedSubtasks[index] = { ...updatedSubtasks[index], [field]: value }
    updateTask({ subtasks: updatedSubtasks })
  }

  const removeSubtask = (index: number) => {
    const updatedSubtasks = task.subtasks.filter((_: any, i: number) => i !== index)
    updateTask({ subtasks: updatedSubtasks })
    const newExpanded = new Set<number>()
    expandedSubtasks.forEach((expandedIndex) => {
      if (expandedIndex < index) {
        newExpanded.add(expandedIndex)
      } else if (expandedIndex > index) {
        newExpanded.add(expandedIndex - 1)
      }
    })
    setExpandedSubtasks(newExpanded)
  }

  const canProceedToSubtasks = task.title && task.description
  const canSave = task.title && task.description
  const isFromScratch = !existingTemplate
  const hasSubtasks = task.subtasks.length > 0

  // Set default due date only for new tasks
  useEffect(() => {
    if (!isEditingTemplate && !task.dueDate) {
      const defaultDate = new Date()
      defaultDate.setDate(defaultDate.getDate() + 7)
      updateTask({ dueDate: defaultDate.toISOString().split("T")[0] })
    }
  }, [task.dueDate, isEditingTemplate])

  // For template editing, use simplified single-screen approach
  if (isEditingTemplate) {
    return (
      <Dialog open={isOpen} onOpenChange={handleCancel}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Edit Template</DialogTitle>
            <DialogDescription>
              Update this template. Changes will apply to future tasks created from this template.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-6">
            {/* Template Basics */}
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Template Name</Label>
                <Input
                  id="title"
                  value={task.title}
                  onChange={(e) => updateTask({ title: e.target.value })}
                  placeholder="e.g., Quarterly Review Process"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={task.description}
                  onChange={(e) => updateTask({ description: e.target.value })}
                  placeholder="Describe what this template is for..."
                  rows={3}
                />
              </div>
            </div>

            {/* Subtasks */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Subtasks</h3>
                  <p className="text-xs text-muted-foreground">Define the steps included in this template</p>
                </div>
                <Button variant="outline" size="sm" onClick={addCustomSubtask}>
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>

              {task.subtasks.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                  <p className="text-sm">No subtasks yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {task.subtasks.map((subtask: any, index: number) => (
                    <div key={index} className="group border rounded-lg">
                      <div className="flex items-center gap-3 p-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSubtaskExpansion(index)}
                          className="p-0 h-auto"
                        >
                          {expandedSubtasks.has(index) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{subtask.title || "Untitled subtask"}</div>
                          {subtask.description && !expandedSubtasks.has(index) && (
                            <div className="text-xs text-muted-foreground truncate">{subtask.description}</div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSubtask(index)}
                          className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive p-1"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>

                      {expandedSubtasks.has(index) && (
                        <div className="px-3 pb-3 space-y-2 border-t bg-muted/20">
                          <div className="pt-3 space-y-2">
                            <Input
                              value={subtask.title}
                              onChange={(e) => updateSubtask(index, "title", e.target.value)}
                              placeholder="Subtask title..."
                              className="text-sm"
                            />
                            <Textarea
                              value={subtask.description}
                              onChange={(e) => updateSubtask(index, "description", e.target.value)}
                              placeholder="Subtask description..."
                              rows={2}
                              className="text-xs"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="flex-shrink-0">
            <Button variant="outline" onClick={handleCancel}>
              {hasUnsavedChanges ? "Cancel" : "Close"}
            </Button>
            <Button onClick={handleSave} disabled={!canSave}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  // Original task creation flow with improved consistency
  const dialogTitle = existingTemplate ? `Create Task: ${existingTemplate.name}` : "Create New Task"
  const dialogDescription = existingTemplate
    ? "Customize the task details and select which subtasks to include."
    : "Create a new task to track and manage your work."

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid grid-cols-2 mb-4 flex-shrink-0">
            <TabsTrigger value="basic">Task Details</TabsTrigger>
            <TabsTrigger value="subtasks" disabled={!canProceedToSubtasks}>
              Subtasks{" "}
              {task.subtasks.length > 0 && `(${task.subtasks.filter((st: any) => st.included !== false).length})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 flex-shrink-0">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  value={task.title}
                  onChange={(e) => updateTask({ title: e.target.value })}
                  placeholder="e.g., Review quarterly performance"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={task.description}
                  onChange={(e) => updateTask({ description: e.target.value })}
                  placeholder="Describe what needs to be done..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={task.priority} onValueChange={(value) => updateTask({ priority: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value}>
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-3 w-3" />
                            {priority.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={task.status} onValueChange={(value) => updateTask({ status: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="assignee">Assignee</Label>
                  <Select value={task.assignee} onValueChange={(value) => updateTask({ assignee: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      {assigneeOptions.map((assignee) => (
                        <SelectItem key={assignee.value} value={assignee.value}>
                          <div className="flex items-center gap-2">
                            <User className="h-3 w-3" />
                            {assignee.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={task.dueDate}
                    onChange={(e) => updateTask({ dueDate: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                onClick={() => setActiveTab("subtasks")}
                disabled={!canProceedToSubtasks}
                className="flex items-center gap-2"
              >
                Next <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="subtasks" className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-medium">Configure Subtasks</h3>
                    <p className="text-xs text-muted-foreground">
                      {existingTemplate
                        ? "Select which subtasks to include and customize them as needed."
                        : "Break down your task into smaller, manageable subtasks."}
                    </p>
                  </div>
                  {task.subtasks.length > 0 && (
                    <Button variant="outline" size="sm" onClick={addCustomSubtask}>
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  {task.subtasks.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                      <p className="text-sm mb-4">No subtasks yet</p>
                      <Button variant="outline" onClick={addCustomSubtask}>
                        <Plus className="h-4 w-4 mr-2" /> Add First Subtask
                      </Button>
                    </div>
                  ) : (
                    <>
                      {task.subtasks.map((subtask: any, index: number) => (
                        <div key={index} className="group border rounded-lg">
                          <div className="flex items-center gap-3 p-3">
                            <Checkbox
                              checked={subtask.included !== false}
                              onCheckedChange={() => toggleSubtask(index)}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleSubtaskExpansion(index)}
                              className="p-0 h-auto"
                            >
                              {expandedSubtasks.has(index) ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </Button>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">{subtask.title || "Untitled subtask"}</div>
                              {subtask.description && !expandedSubtasks.has(index) && (
                                <div className="text-xs text-muted-foreground truncate">{subtask.description}</div>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSubtask(index)}
                              className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive p-1"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>

                          {expandedSubtasks.has(index) && (
                            <div className="px-3 pb-3 space-y-2 border-t bg-muted/20">
                              <div className="pt-3 space-y-2">
                                <Input
                                  value={subtask.title}
                                  onChange={(e) => updateSubtask(index, "title", e.target.value)}
                                  placeholder="Subtask title..."
                                  className="text-sm"
                                />
                                <Textarea
                                  value={subtask.description}
                                  onChange={(e) => updateSubtask(index, "description", e.target.value)}
                                  placeholder="Subtask description..."
                                  rows={2}
                                  className="text-xs"
                                />
                                <Select
                                  value={subtask.priority}
                                  onValueChange={(value) => updateSubtask(index, "priority", value)}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {priorityOptions.map((priority) => (
                                      <SelectItem key={priority.value} value={priority.value}>
                                        {priority.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t flex-shrink-0">
            <Button variant="outline" onClick={() => setActiveTab("basic")}>
              Back
            </Button>
            <div className="flex gap-2">
              {isFromScratch && hasSubtasks && !showSaveAsTemplate && (
                <Button
                  variant="outline"
                  onClick={() => setShowSaveAsTemplate(true)}
                  className="flex items-center gap-2"
                >
                  <Bookmark className="h-4 w-4" />
                  Save as Template
                </Button>
              )}
              <Button onClick={handleSave} disabled={!canSave}>
                Create Task
              </Button>
            </div>
          </div>

          {showSaveAsTemplate && (
            <div className="border-t pt-4 space-y-3 flex-shrink-0 bg-muted/20">
              <div className="space-y-2">
                <Label htmlFor="templateName" className="text-sm font-medium">
                  Template Name
                </Label>
                <Input
                  id="templateName"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="e.g., My Custom Workflow"
                  className="text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Save this task structure as a reusable template for future tasks.
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowSaveAsTemplate(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSaveAsTemplate} disabled={!templateName.trim()}>
                  Save Template & Create Task
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </DialogContent>
  </Dialog>
)
