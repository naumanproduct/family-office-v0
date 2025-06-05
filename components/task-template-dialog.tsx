"use client"

import type React from "react"

import { useState } from "react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronLeftIcon, MoreHorizontal, Edit, Copy, Trash2 } from "lucide-react"
import { TaskCreator } from "./task-creator"

const taskTemplates = [
  {
    id: "capital-call-processing",
    name: "Capital Call Processing",
    description:
      "Complete capital call workflow including investor notifications, document preparation, and fund collection",
    subtasks: [
      {
        title: "Prepare capital call notice",
        description: "Draft and review capital call documentation",
        priority: "High",
      },
      {
        title: "Send investor notifications",
        description: "Distribute capital call notices to all investors",
        priority: "High",
      },
      {
        title: "Track investor responses",
        description: "Monitor and follow up on investor commitments",
        priority: "Medium",
      },
      {
        title: "Process wire transfers",
        description: "Coordinate and verify incoming fund transfers",
        priority: "High",
      },
      {
        title: "Update fund records",
        description: "Record capital contributions in fund accounting system",
        priority: "Medium",
      },
    ],
  },
  {
    id: "k1-processing",
    name: "K-1 Processing",
    description: "Annual K-1 tax document preparation and distribution workflow for fund investors",
    subtasks: [
      {
        title: "Gather tax information",
        description: "Collect all necessary tax documents and data",
        priority: "High",
      },
      { title: "Prepare draft K-1s", description: "Generate initial K-1 documents for review", priority: "High" },
      {
        title: "Review with tax advisor",
        description: "Have tax professional review all K-1 documents",
        priority: "High",
      },
      { title: "Finalize K-1 documents", description: "Make final revisions and approve K-1s", priority: "Medium" },
      { title: "Distribute to investors", description: "Send K-1s to all fund investors", priority: "Medium" },
      { title: "Handle investor questions", description: "Respond to investor inquiries about K-1s", priority: "Low" },
    ],
  },
  {
    id: "quarterly-report-processing",
    name: "Quarterly Report Processing",
    description:
      "Comprehensive quarterly reporting workflow including performance analysis and investor communications",
    subtasks: [
      {
        title: "Collect portfolio data",
        description: "Gather performance data from all portfolio companies",
        priority: "High",
      },
      { title: "Analyze fund performance", description: "Calculate returns and performance metrics", priority: "High" },
      {
        title: "Prepare financial statements",
        description: "Generate quarterly financial statements",
        priority: "High",
      },
      { title: "Draft investor letter", description: "Write quarterly letter to investors", priority: "Medium" },
      {
        title: "Review and approve report",
        description: "Final review of all quarterly materials",
        priority: "Medium",
      },
      { title: "Distribute to investors", description: "Send quarterly report to all investors", priority: "Medium" },
    ],
  },
]

interface TaskTemplateDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function TaskTemplateDialog({ isOpen, onClose }: TaskTemplateDialogProps) {
  const [isCreatorOpen, setIsCreatorOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [editingTemplate, setEditingTemplate] = useState<any>(null)

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template)
    setEditingTemplate(null)
    setIsCreatorOpen(true)
    onClose()
  }

  const handleStartFromScratch = () => {
    setSelectedTemplate(null)
    setEditingTemplate(null)
    setIsCreatorOpen(true)
    onClose()
  }

  const handleEditTemplate = (template: any, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingTemplate(template)
    setSelectedTemplate(template)
    setIsCreatorOpen(true)
    onClose()
  }

  const handleDuplicateTemplate = (template: any, e: React.MouseEvent) => {
    e.stopPropagation()
    // Create a copy with a new ID and modified name
    const duplicatedTemplate = {
      ...template,
      id: `${template.id}-copy-${Date.now()}`,
      name: `${template.name} (Copy)`,
    }
    setSelectedTemplate(duplicatedTemplate)
    setEditingTemplate(null)
    setIsCreatorOpen(true)
    onClose()
  }

  const handleDeleteTemplate = (template: any, e: React.MouseEvent) => {
    e.stopPropagation()
    // This would typically show a confirmation dialog and then delete
    console.log("Delete template:", template.id)
  }

  const handleSaveTask = (task: any) => {
    // This would typically save to your backend
    console.log("Saving task:", task)
    // You could add the task to your tasks list or refresh the data
  }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="right" className="flex w-full max-w-2xl flex-col p-0 sm:max-w-2xl [&>button]:hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={onClose}>
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <Badge variant="outline" className="bg-background">
                Task Template
              </Badge>
            </div>
          </div>

          {/* Record Header */}
          <div className="border-b bg-background px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                T
              </div>
              <div>
                <h2 className="text-lg font-semibold">Choose a Task Template</h2>
                <p className="text-sm text-muted-foreground">
                  Select a pre-built template to get started quickly, or create a task from scratch.
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              {/* Start from Scratch Option */}
              <Card
                className="cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.01]"
                onClick={handleStartFromScratch}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <CardTitle className="text-base font-medium">Start from Scratch</CardTitle>
                      <CardDescription className="text-sm">
                        Create a custom task tailored to your specific needs
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Template Options */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Templates</h3>
                {taskTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.01] relative"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base font-medium">{template.name}</CardTitle>
                          <CardDescription className="text-sm mt-1">{template.description}</CardDescription>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => handleEditTemplate(template, e)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Template
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => handleDuplicateTemplate(template, e)}>
                                <Copy className="mr-2 h-4 w-4" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => handleDeleteTemplate(template, e)}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex justify-end text-xs text-muted-foreground">
                        <span>{template.subtasks.length} subtasks</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <TaskCreator
        isOpen={isCreatorOpen}
        onClose={() => {
          setIsCreatorOpen(false)
          setSelectedTemplate(null)
          setEditingTemplate(null)
        }}
        onSave={handleSaveTask}
        existingTemplate={selectedTemplate}
        isEditingTemplate={!!editingTemplate}
      />
    </>
  )
}
