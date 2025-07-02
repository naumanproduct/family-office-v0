"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Eye, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { WorkflowTemplateDialog } from "./workflow-template-dialog"
import { useRouter } from "next/navigation"

// Sample workflows data
const initialWorkflows = [
  {
    id: "1",
    name: "Deal Pipeline",
    description: "Track investment opportunities through the pipeline",
    objectType: "opportunity",
    attributes: [
      { id: "name", name: "Name", type: "text" },
      { id: "company", name: "Company", type: "relation" },
      { id: "amount", name: "Amount", type: "currency" },
      { id: "stage", name: "Stage", type: "select" },
      { id: "owner", name: "Owner", type: "user" },
    ],
    stages: [
      { id: "initial-contact", name: "Initial Contact", color: "bg-gray-100" },
      { id: "proposal", name: "Proposal", color: "bg-blue-100" },
      { id: "due-diligence", name: "Due Diligence", color: "bg-yellow-100" },
      { id: "term-sheet", name: "Term Sheet", color: "bg-purple-100" },
      { id: "closed-won", name: "Closed Won", color: "bg-green-100" },
      { id: "closed-lost", name: "Closed Lost", color: "bg-red-100" },
    ],
    createdAt: "2024-01-15",
    lastModified: "2024-01-20",
    status: "active",
  },
  {
    id: "2",
    name: "Capital Call Tracking",
    description: "Track capital call processes with automated notifications",
    objectType: "capital-call",
    attributes: [
      { id: "fund", name: "Fund", type: "relation" },
      { id: "amount", name: "Amount", type: "currency" },
      { id: "dueDate", name: "Due Date", type: "date" },
      { id: "status", name: "Status", type: "select" },
      { id: "percentOfCommitment", name: "% of Commitment", type: "number" },
    ],
    stages: [
      { id: "new", name: "New", color: "bg-gray-100" },
      { id: "in-progress", name: "In Progress", color: "bg-blue-100" },
      { id: "done", name: "Done", color: "bg-green-100" },
    ],
    createdAt: "2024-01-10",
    lastModified: "2024-01-18",
    status: "active",
  },
  {
    id: "3",
    name: "Document Review",
    description: "Track document reviews and approvals",
    objectType: "document",
    attributes: [
      { id: "title", name: "Title", type: "text" },
      { id: "type", name: "Document Type", type: "select" },
      { id: "reviewer", name: "Reviewer", type: "user" },
      { id: "dueDate", name: "Due Date", type: "date" },
      { id: "confidentiality", name: "Confidentiality", type: "select" },
    ],
    stages: [
      { id: "draft", name: "Draft", color: "bg-gray-100" },
      { id: "review", name: "Review", color: "bg-yellow-100" },
      { id: "approved", name: "Approved", color: "bg-green-100" },
      { id: "rejected", name: "Rejected", color: "bg-red-100" },
    ],
    createdAt: "2024-01-05",
    lastModified: "2024-01-12",
    status: "inactive",
  },
]

export function WorkflowManagement() {
  const [workflows, setWorkflows] = useState(initialWorkflows)
  const [isCreatorOpen, setIsCreatorOpen] = useState(false)
  const [editingWorkflow, setEditingWorkflow] = useState<any>(null)
  const router = useRouter()

  const handleSaveWorkflow = (workflow: any) => {
    if (editingWorkflow) {
      // Update existing workflow
      setWorkflows(workflows.map((w) => (w.id === editingWorkflow.id ? { ...workflow, id: editingWorkflow.id } : w)))
      setEditingWorkflow(null)
    } else {
      // Create new workflow
      const newWorkflow = {
        ...workflow,
        id: `${workflows.length + 1}`,
        createdAt: new Date().toISOString().split("T")[0],
        lastModified: new Date().toISOString().split("T")[0],
        status: "active",
      }
      setWorkflows([...workflows, newWorkflow])
    }
  }

  const handleEditWorkflow = (workflow: any) => {
    setEditingWorkflow(workflow)
    setIsCreatorOpen(true)
  }

  const handleDeleteWorkflow = (id: string) => {
    setWorkflows(workflows.filter((w) => w.id !== id))
  }

  const handleViewWorkflow = (workflow: any) => {
    // Navigate to the workflow page
    const path = workflow.name.toLowerCase().replace(/\s+/g, "-")
    router.push(`/${path}`)
  }

  const getObjectTypeName = (type: string) => {
    const objectTypeMap: Record<string, string> = {
      task: "Task",
      opportunity: "Opportunity",
      "capital-call": "Capital Call",
      document: "Document",
      entity: "Entity",
    }
    return objectTypeMap[type] || type
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Workflows</CardTitle>
            <CardDescription>
              Create and manage workflows to track your business processes. Workflows help streamline operations and
              ensure consistency.
            </CardDescription>
          </div>
          <Button onClick={() => setIsCreatorOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Workflow
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Workflow Name</TableHead>
                <TableHead className="min-w-[300px]">Description</TableHead>
                <TableHead className="w-[120px]">Object Type</TableHead>
                <TableHead className="w-[120px]">Stages</TableHead>
                <TableHead className="w-[120px]">Attributes</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workflows.map((workflow) => (
                <TableRow key={workflow.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{workflow.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{workflow.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{getObjectTypeName(workflow.objectType)}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{workflow.stages.length}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{workflow.attributes.length}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={workflow.status === "active" ? "default" : "secondary"} className="capitalize">
                      {workflow.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewWorkflow(workflow)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditWorkflow(workflow)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeleteWorkflow(workflow.id)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Add Workflow Dialog */}
      <WorkflowTemplateDialog isOpen={isCreatorOpen} onClose={() => {
        setIsCreatorOpen(false)
        setEditingWorkflow(null)
      }} />
    </Card>
  )
}
