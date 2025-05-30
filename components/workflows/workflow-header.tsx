"use client"

import * as React from "react"
import { Settings2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface WorkflowAttribute {
  id: string
  name: string
  type: string
}

interface WorkflowStage {
  id: string
  name: string
  color: string
}

interface WorkflowConfig {
  name: string
  description: string
  objectType: string
  attributes: WorkflowAttribute[]
  stages: WorkflowStage[]
}

interface WorkflowHeaderProps {
  workflowName: string
  workflowConfig: WorkflowConfig
  onSave: (config: WorkflowConfig) => void
}

export function WorkflowHeader({ workflowName, workflowConfig, onSave }: WorkflowHeaderProps) {
  const [open, setOpen] = React.useState(false)
  const [config, setConfig] = React.useState<WorkflowConfig>(workflowConfig)

  const handleSave = () => {
    onSave(config)
    setOpen(false)
  }

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)} className="h-8 w-8" title="Configure Workflow">
        <Settings2Icon className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Configure Workflow: {workflowName}</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="attributes">Card Attributes</TabsTrigger>
              <TabsTrigger value="stages">Stages</TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Workflow Name</Label>
                <Input id="name" value={config.name} onChange={(e) => setConfig({ ...config, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={config.description}
                  onChange={(e) => setConfig({ ...config, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="objectType">Object Type</Label>
                <select
                  id="objectType"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={config.objectType}
                  onChange={(e) => setConfig({ ...config, objectType: e.target.value })}
                >
                  <option value="task">Task</option>
                  <option value="opportunity">Opportunity</option>
                  <option value="capital-call">Capital Call</option>
                  <option value="document">Document</option>
                </select>
              </div>
            </TabsContent>
            <TabsContent value="attributes" className="space-y-4 pt-4">
              <div className="space-y-4">
                <Label>Select Attributes to Display on Cards</Label>
                <ScrollArea className="h-[300px] rounded-md border p-4">
                  <div className="space-y-4">
                    {getAttributesForObjectType(config.objectType).map((attr) => {
                      const isSelected = config.attributes.some((a) => a.id === attr.id)
                      return (
                        <div key={attr.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`attr-${attr.id}`}
                            checked={isSelected}
                            onChange={() => {
                              if (isSelected) {
                                setConfig({
                                  ...config,
                                  attributes: config.attributes.filter((a) => a.id !== attr.id),
                                })
                              } else {
                                setConfig({
                                  ...config,
                                  attributes: [...config.attributes, attr],
                                })
                              }
                            }}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label htmlFor={`attr-${attr.id}`} className="text-sm font-normal">
                            {attr.name}
                          </Label>
                          <Badge variant="outline" className="ml-2">
                            {attr.type}
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                </ScrollArea>
              </div>
              <div className="pt-2">
                <Label className="mb-2 block">Selected Attributes</Label>
                <div className="flex flex-wrap gap-2">
                  {config.attributes.map((attr) => (
                    <Badge key={attr.id} variant="secondary">
                      {attr.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="stages" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Workflow Stages</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setConfig({
                        ...config,
                        stages: [
                          ...config.stages,
                          {
                            id: `stage-${Date.now()}`,
                            name: "New Stage",
                            color: "bg-gray-100",
                          },
                        ],
                      })
                    }}
                  >
                    Add Stage
                  </Button>
                </div>
                <div className="space-y-2">
                  {config.stages.map((stage, index) => (
                    <div key={stage.id} className="flex items-center space-x-2">
                      <div className={`h-4 w-4 rounded ${stage.color}`}></div>
                      <Input
                        value={stage.name}
                        onChange={(e) => {
                          const newStages = [...config.stages]
                          newStages[index] = { ...stage, name: e.target.value }
                          setConfig({ ...config, stages: newStages })
                        }}
                        className="flex-1"
                      />
                      <select
                        value={stage.color}
                        onChange={(e) => {
                          const newStages = [...config.stages]
                          newStages[index] = { ...stage, color: e.target.value }
                          setConfig({ ...config, stages: newStages })
                        }}
                        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="bg-gray-100">Gray</option>
                        <option value="bg-blue-100">Blue</option>
                        <option value="bg-green-100">Green</option>
                        <option value="bg-yellow-100">Yellow</option>
                        <option value="bg-purple-100">Purple</option>
                        <option value="bg-red-100">Red</option>
                        <option value="bg-orange-100">Orange</option>
                      </select>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setConfig({
                            ...config,
                            stages: config.stages.filter((_, i) => i !== index),
                          })
                        }}
                        disabled={config.stages.length <= 1}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Helper function to get attributes based on object type
function getAttributesForObjectType(objectType: string): WorkflowAttribute[] {
  switch (objectType) {
    case "task":
      return [
        { id: "title", name: "Title", type: "text" },
        { id: "description", name: "Description", type: "text" },
        { id: "status", name: "Status", type: "select" },
        { id: "priority", name: "Priority", type: "select" },
        { id: "assignee", name: "Assignee", type: "user" },
        { id: "dueDate", name: "Due Date", type: "date" },
        { id: "createdAt", name: "Created At", type: "date" },
        { id: "updatedAt", name: "Updated At", type: "date" },
        { id: "tags", name: "Tags", type: "tags" },
      ]
    case "opportunity":
      return [
        { id: "name", name: "Name", type: "text" },
        { id: "company", name: "Company", type: "relation" },
        { id: "amount", name: "Amount", type: "currency" },
        { id: "stage", name: "Stage", type: "select" },
        { id: "owner", name: "Owner", type: "user" },
        { id: "probability", name: "Probability", type: "number" },
        { id: "expectedClose", name: "Expected Close", type: "date" },
        { id: "source", name: "Source", type: "select" },
        { id: "description", name: "Description", type: "text" },
        { id: "lastContact", name: "Last Contact", type: "date" },
        { id: "nextStep", name: "Next Step", type: "text" },
      ]
    case "capital-call":
      return [
        { id: "fundName", name: "Fund Name", type: "text" },
        { id: "callNumber", name: "Call Number", type: "text" },
        { id: "callAmount", name: "Call Amount", type: "currency" },
        { id: "commitmentAmount", name: "Commitment Amount", type: "currency" },
        { id: "dueDate", name: "Due Date", type: "date" },
        { id: "noticeDate", name: "Notice Date", type: "date" },
        { id: "investor", name: "Investor", type: "relation" },
        { id: "fundManager", name: "Fund Manager", type: "text" },
        { id: "purpose", name: "Purpose", type: "text" },
        { id: "remainingCommitment", name: "Remaining Commitment", type: "currency" },
      ]
    case "document":
      return [
        { id: "name", name: "Name", type: "text" },
        { id: "type", name: "Type", type: "select" },
        { id: "status", name: "Status", type: "select" },
        { id: "owner", name: "Owner", type: "user" },
        { id: "createdAt", name: "Created At", type: "date" },
        { id: "updatedAt", name: "Updated At", type: "date" },
        { id: "size", name: "Size", type: "number" },
        { id: "tags", name: "Tags", type: "tags" },
      ]
    default:
      return []
  }
}
