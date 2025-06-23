"use client"

import { useState } from "react"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Zap, Upload, Mail, Calendar, FileText, MoreHorizontal, Edit, Trash2, Play, Pause } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AutomationItem {
  id: string
  name: string
  description: string
  trigger: "file_upload" | "email_received" | "date_reached" | "record_created" | "integration_sync"
  conditions: string[]
  action: "create_task" | "launch_workflow" | "send_notification" | "update_record"
  targetWorkflow?: string
  status: "active" | "inactive" | "draft"
  executionCount: number
  lastExecuted?: string
  createdAt: string
}

const sampleAutomations: AutomationItem[] = [
  {
    id: "1",
    name: "Capital Call - Auto Task Creation",
    description: "Automatically create tasks when capital call documents are uploaded",
    trigger: "file_upload",
    conditions: ["File name contains 'Capital Call'", "File linked to Investment"],
    action: "create_task",
    targetWorkflow: "Capital Call Processing",
    status: "active",
    executionCount: 47,
    lastExecuted: "2024-01-20T10:30:00Z",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "K-1 Document Processing",
    description: "Launch K-1 processing workflow when tax documents are received",
    trigger: "file_upload",
    conditions: ["File type is PDF", "File name contains 'K-1'", "File size > 100KB"],
    action: "launch_workflow",
    targetWorkflow: "K-1 Processing",
    status: "active",
    executionCount: 23,
    lastExecuted: "2024-01-19T14:15:00Z",
    createdAt: "2024-01-10",
  },
  {
    id: "3",
    name: "Quarterly Report Reminder",
    description: "Create tasks for quarterly reporting 30 days before due date",
    trigger: "date_reached",
    conditions: ["30 days before quarter end", "Entity has active investments"],
    action: "create_task",
    targetWorkflow: "Quarterly Reporting Review",
    status: "active",
    executionCount: 12,
    lastExecuted: "2024-01-01T09:00:00Z",
    createdAt: "2024-01-05",
  },
  {
    id: "4",
    name: "Due Diligence Document Review",
    description: "Auto-assign document review tasks when due diligence files are uploaded",
    trigger: "file_upload",
    conditions: ["File uploaded to 'Due Diligence' folder", "File type is PDF or DOCX"],
    action: "create_task",
    targetWorkflow: "Document Review Queue",
    status: "draft",
    executionCount: 0,
    createdAt: "2024-01-18",
  },
]

const triggerOptions = [
  { value: "file_upload", label: "File Upload", icon: Upload },
  { value: "email_received", label: "Email Received", icon: Mail },
  { value: "date_reached", label: "Date Reached", icon: Calendar },
  { value: "record_created", label: "Record Created", icon: FileText },
  { value: "integration_sync", label: "Integration Sync", icon: Zap },
]

const actionOptions = [
  { value: "create_task", label: "Create Task" },
  { value: "launch_workflow", label: "Launch Workflow" },
  { value: "send_notification", label: "Send Notification" },
  { value: "update_record", label: "Update Record" },
]

const workflowOptions = [
  "Capital Call Processing",
  "K-1 Processing",
  "Deal Pipeline",
  "Document Review Queue",
  "Quarterly Reporting Review",
  "Entity Compliance & Legal",
  "Tax Document Collection",
]

interface AutomationsManagementProps {
  hideTitle?: boolean
  hideButton?: boolean
  isDialogOpen?: boolean
  onDialogOpenChange?: (open: boolean) => void
}

export function AutomationsManagement({
  hideTitle = false,
  hideButton = false,
  isDialogOpen,
  onDialogOpenChange,
}: AutomationsManagementProps = {}) {
  const [automations, setAutomations] = useState<AutomationItem[]>(sampleAutomations)
  const [localIsCreateDialogOpen, setLocalIsCreateDialogOpen] = useState(false)
  const [newAutomation, setNewAutomation] = useState({
    name: "",
    description: "",
    trigger: "file_upload",
    conditions: [""],
    action: "create_task",
    targetWorkflow: "",
  })

  // Use either external or local dialog state
  const isCreateDialogOpen = isDialogOpen !== undefined ? isDialogOpen : localIsCreateDialogOpen
  const setIsCreateDialogOpen = onDialogOpenChange || setLocalIsCreateDialogOpen

  const handleCreateAutomation = () => {
    const automation: AutomationItem = {
      id: Date.now().toString(),
      name: newAutomation.name,
      description: newAutomation.description,
      trigger: newAutomation.trigger as any,
      conditions: newAutomation.conditions.filter((c) => c.trim() !== ""),
      action: newAutomation.action as any,
      targetWorkflow: newAutomation.targetWorkflow,
      status: "draft",
      executionCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
    }
    setAutomations([...automations, automation])
    setNewAutomation({
      name: "",
      description: "",
      trigger: "file_upload",
      conditions: [""],
      action: "create_task",
      targetWorkflow: "",
    })
    setIsCreateDialogOpen(false)
  }

  const toggleAutomationStatus = (id: string) => {
    setAutomations(
      automations.map((automation) =>
        automation.id === id
          ? { ...automation, status: automation.status === "active" ? "inactive" : ("active" as any) }
          : automation,
      ),
    )
  }

  const deleteAutomation = (id: string) => {
    setAutomations(automations.filter((automation) => automation.id !== id))
  }

  const addCondition = () => {
    setNewAutomation({
      ...newAutomation,
      conditions: [...newAutomation.conditions, ""],
    })
  }

  const updateCondition = (index: number, value: string) => {
    const updatedConditions = [...newAutomation.conditions]
    updatedConditions[index] = value
    setNewAutomation({
      ...newAutomation,
      conditions: updatedConditions,
    })
  }

  const removeCondition = (index: number) => {
    setNewAutomation({
      ...newAutomation,
      conditions: newAutomation.conditions.filter((_, i) => i !== index),
    })
  }

  const getTriggerIcon = (trigger: string) => {
    const option = triggerOptions.find((opt) => opt.value === trigger)
    return option?.icon || Zap
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "inactive":
        return "secondary"
      case "draft":
        return "outline"
      default:
        return "secondary"
    }
  }

  const formatLastExecuted = (dateString?: string) => {
    if (!dateString) return "Never"
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Card className={!hideTitle ? undefined : "border-0 shadow-none"}>
      {!hideTitle && (
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Automations</CardTitle>
              <CardDescription>
                Create automated rules that trigger workflows and tasks based on events like file uploads, integrations,
                or email ingestions. Streamline your processes without manual intervention.
              </CardDescription>
            </div>
            {!hideButton && (
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Automation
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create Automation</DialogTitle>
                    <DialogDescription>
                      Set up an automated rule to trigger workflows and create tasks based on specific events.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-6 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Automation Name</Label>
                      <Input
                        id="name"
                        value={newAutomation.name}
                        onChange={(e) => setNewAutomation({ ...newAutomation, name: e.target.value })}
                        placeholder="e.g., Capital Call - Auto Task Creation"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newAutomation.description}
                        onChange={(e) => setNewAutomation({ ...newAutomation, description: e.target.value })}
                        placeholder="Describe what this automation does..."
                        rows={2}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="trigger">Trigger Event</Label>
                      <Select
                        value={newAutomation.trigger}
                        onValueChange={(value) => setNewAutomation({ ...newAutomation, trigger: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {triggerOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-2">
                                <option.icon className="h-4 w-4" />
                                {option.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label>Conditions</Label>
                      <div className="space-y-2">
                        {newAutomation.conditions.map((condition, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={condition}
                              onChange={(e) => updateCondition(index, e.target.value)}
                              placeholder="e.g., File name contains 'Capital Call'"
                              className="flex-1"
                            />
                            {newAutomation.conditions.length > 1 && (
                              <Button variant="outline" size="icon" onClick={() => removeCondition(index)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button variant="outline" size="sm" onClick={addCondition} className="w-full">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Condition
                        </Button>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="action">Action</Label>
                      <Select
                        value={newAutomation.action}
                        onValueChange={(value) => setNewAutomation({ ...newAutomation, action: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {actionOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {(newAutomation.action === "create_task" || newAutomation.action === "launch_workflow") && (
                      <div className="grid gap-2">
                        <Label htmlFor="workflow">Target Workflow</Label>
                        <Select
                          value={newAutomation.targetWorkflow}
                          onValueChange={(value) => setNewAutomation({ ...newAutomation, targetWorkflow: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a workflow" />
                          </SelectTrigger>
                          <SelectContent>
                            {workflowOptions.map((workflow) => (
                              <SelectItem key={workflow} value={workflow}>
                                {workflow}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleCreateAutomation}>
                      Create Automation
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
      )}
      <CardContent className={hideTitle ? "p-0" : undefined}>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[280px]">Automation Name</TableHead>
                <TableHead className="min-w-[300px]">Description</TableHead>
                <TableHead className="w-[120px]">Trigger</TableHead>
                <TableHead className="w-[120px]">Action</TableHead>
                <TableHead className="w-[100px] text-center">Status</TableHead>
                <TableHead className="w-[100px] text-center">Runs</TableHead>
                <TableHead className="w-[140px]">Last Executed</TableHead>
                <TableHead className="w-[80px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {automations.map((automation) => {
                const TriggerIcon = getTriggerIcon(automation.trigger)
                return (
                  <TableRow key={automation.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <TriggerIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{automation.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground leading-relaxed">{automation.description}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {automation.trigger.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {automation.action.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getStatusColor(automation.status)} className="capitalize">
                        {automation.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="font-mono text-xs">
                        {automation.executionCount}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatLastExecuted(automation.lastExecuted)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toggleAutomationStatus(automation.id)}>
                            {automation.status === "active" ? (
                              <>
                                <Pause className="mr-2 h-4 w-4" />
                                Pause
                              </>
                            ) : (
                              <>
                                <Play className="mr-2 h-4 w-4" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => deleteAutomation(automation.id)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
