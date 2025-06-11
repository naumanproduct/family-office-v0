"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Plus, Workflow, GitBranch, Clock, Zap } from "lucide-react"
import { FieldManagement } from "./field-management"

interface WorkflowItem {
  id: string
  name: string
  description: string
  status: "active" | "inactive" | "draft"
  fieldCount: number
  triggerType: string
  executionCount: number
  icon: any
  createdAt: string
}

const sampleWorkflows: WorkflowItem[] = [
  {
    id: "1",
    name: "Deal Pipeline Automation",
    description: "Automatically move deals through pipeline stages based on criteria and update stakeholders",
    status: "active",
    fieldCount: 8,
    triggerType: "Record Update",
    executionCount: 1247,
    icon: GitBranch,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Capital Call Tracking",
    description: "Track and manage capital call processes with automated notifications and document generation",
    status: "active",
    fieldCount: 12,
    triggerType: "Record Create",
    executionCount: 89,
    icon: Zap,
    createdAt: "2024-01-10",
  },
  {
    id: "3",
    name: "Tax Document Collection & Filing",
    description: "Automate tax document collection, validation, and filing processes with compliance tracking",
    status: "inactive",
    fieldCount: 15,
    triggerType: "Time-based",
    executionCount: 234,
    icon: Clock,
    createdAt: "2024-01-05",
  },
  {
    id: "4",
    name: "Entity Compliance & Legal Tasks",
    description: "Monitor compliance requirements and automatically create legal tasks with deadline tracking",
    status: "draft",
    fieldCount: 10,
    triggerType: "Scheduled",
    executionCount: 0,
    icon: Workflow,
    createdAt: "2024-01-20",
  },
]

export function WorkflowsManagement() {
  const [workflows, setWorkflows] = useState<WorkflowItem[]>(sampleWorkflows)
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowItem | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newWorkflow, setNewWorkflow] = useState({
    name: "",
    description: "",
    triggerType: "Record Create",
  })

  const handleCreateWorkflow = () => {
    const workflow: WorkflowItem = {
      id: Date.now().toString(),
      name: newWorkflow.name,
      description: newWorkflow.description,
      status: "draft",
      fieldCount: 0,
      triggerType: newWorkflow.triggerType,
      executionCount: 0,
      icon: Workflow,
      createdAt: new Date().toISOString().split("T")[0],
    }
    setWorkflows([...workflows, workflow])
    setNewWorkflow({ name: "", description: "", triggerType: "Record Create" })
    setIsCreateDialogOpen(false)
  }

  const handleWorkflowClick = (workflow: WorkflowItem) => {
    setSelectedWorkflow(workflow)
  }

  const handleBackToList = () => {
    setSelectedWorkflow(null)
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

  if (selectedWorkflow) {
    return <FieldManagement objectType="workflow" objectName={selectedWorkflow.name} onBack={handleBackToList} />
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            {/* Title and description removed to avoid redundancy with settings header */}
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Workflow
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create Workflow</DialogTitle>
                <DialogDescription>Add a new workflow to automate your business processes.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Workflow Name</Label>
                  <Input
                    id="name"
                    value={newWorkflow.name}
                    onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
                    placeholder="e.g., Deal Pipeline Automation"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newWorkflow.description}
                    onChange={(e) => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
                    placeholder="Describe what this workflow does..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleCreateWorkflow}>
                  Create Workflow
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[320px]">Workflow Name</TableHead>
                <TableHead className="min-w-[500px]">Description</TableHead>
                <TableHead className="w-[120px] text-center">Status</TableHead>
                <TableHead className="w-[100px] text-center">Fields</TableHead>
                <TableHead className="w-[160px]">Trigger</TableHead>
                <TableHead className="w-[120px] text-center">Executions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workflows.map((workflow) => (
                <TableRow key={workflow.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell onClick={() => handleWorkflowClick(workflow)}>
                    <div className="flex items-center gap-3">
                      <workflow.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{workflow.name}</span>
                    </div>
                  </TableCell>
                  <TableCell onClick={() => handleWorkflowClick(workflow)}>
                    <span className="text-sm text-muted-foreground leading-relaxed">{workflow.description}</span>
                  </TableCell>
                  <TableCell onClick={() => handleWorkflowClick(workflow)} className="text-center">
                    <Badge variant={getStatusColor(workflow.status)} className="capitalize">
                      {workflow.status}
                    </Badge>
                  </TableCell>
                  <TableCell onClick={() => handleWorkflowClick(workflow)} className="text-center">
                    <Badge variant="secondary" className="font-mono text-xs">
                      {workflow.fieldCount}
                    </Badge>
                  </TableCell>
                  <TableCell onClick={() => handleWorkflowClick(workflow)}>
                    <span className="text-sm">{workflow.triggerType}</span>
                  </TableCell>
                  <TableCell onClick={() => handleWorkflowClick(workflow)} className="text-center">
                    <Badge variant="outline" className="font-mono text-xs">
                      {workflow.executionCount.toLocaleString()}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
