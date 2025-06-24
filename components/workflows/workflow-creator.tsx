"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowRight, Check, Plus, X, ChevronLeftIcon, FileTextIcon, LayoutIcon, ListIcon, Settings2Icon, MoreHorizontalIcon } from "lucide-react"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Define the object types that can be tracked in workflows
const objectTypes = [
  { id: "task", name: "Task", description: "Track tasks and their progress" },
  { id: "opportunity", name: "Opportunity", description: "Track investment opportunities" },
  { id: "capital-call", name: "Capital Call", description: "Track capital call processes" },
  { id: "document", name: "Document", description: "Track document reviews and approvals" },
  { id: "entity", name: "Entity", description: "Track entity compliance and filings" },
]

// Define available attributes by object type
const availableAttributes: Record<string, Array<{ id: string; name: string; type: string }>> = {
  task: [
    { id: "title", name: "Title", type: "text" },
    { id: "description", name: "Description", type: "text" },
    { id: "assignee", name: "Assignee", type: "user" },
    { id: "dueDate", name: "Due Date", type: "date" },
    { id: "priority", name: "Priority", type: "select" },
    { id: "status", name: "Status", type: "select" },
    { id: "progress", name: "Progress", type: "number" },
    { id: "tags", name: "Tags", type: "tags" },
    { id: "relatedEntity", name: "Related Entity", type: "relation" },
    { id: "relatedOpportunity", name: "Related Opportunity", type: "relation" },
  ],
  opportunity: [
    { id: "name", name: "Name", type: "text" },
    { id: "company", name: "Company", type: "relation" },
    { id: "amount", name: "Amount", type: "currency" },
    { id: "stage", name: "Stage", type: "select" },
    { id: "probability", name: "Probability", type: "number" },
    { id: "expectedClose", name: "Expected Close", type: "date" },
    { id: "owner", name: "Owner", type: "user" },
    { id: "fundingRound", name: "Funding Round", type: "select" },
    { id: "sector", name: "Sector", type: "select" },
    { id: "location", name: "Location", type: "text" },
  ],
  "capital-call": [
    { id: "fund", name: "Fund", type: "relation" },
    { id: "amount", name: "Amount", type: "currency" },
    { id: "dueDate", name: "Due Date", type: "date" },
    { id: "status", name: "Status", type: "select" },
    { id: "investor", name: "Investor", type: "relation" },
    { id: "callNumber", name: "Call Number", type: "number" },
    { id: "percentOfCommitment", name: "% of Commitment", type: "number" },
    { id: "noticeDate", name: "Notice Date", type: "date" },
    { id: "wireDate", name: "Wire Date", type: "date" },
    { id: "purpose", name: "Purpose", type: "text" },
  ],
  document: [
    { id: "title", name: "Title", type: "text" },
    { id: "type", name: "Document Type", type: "select" },
    { id: "status", name: "Status", type: "select" },
    { id: "reviewer", name: "Reviewer", type: "user" },
    { id: "dueDate", name: "Due Date", type: "date" },
    { id: "entity", name: "Related Entity", type: "relation" },
    { id: "tags", name: "Tags", type: "tags" },
    { id: "version", name: "Version", type: "text" },
    { id: "confidentiality", name: "Confidentiality", type: "select" },
    { id: "expirationDate", name: "Expiration Date", type: "date" },
  ],
  entity: [
    { id: "name", name: "Entity Name", type: "text" },
    { id: "type", name: "Entity Type", type: "select" },
    { id: "jurisdiction", name: "Jurisdiction", type: "text" },
    { id: "status", name: "Status", type: "select" },
    { id: "formationDate", name: "Formation Date", type: "date" },
    { id: "annualFilingDate", name: "Annual Filing Date", type: "date" },
    { id: "registeredAgent", name: "Registered Agent", type: "text" },
    { id: "taxId", name: "Tax ID", type: "text" },
    { id: "parentEntity", name: "Parent Entity", type: "relation" },
    { id: "complianceStatus", name: "Compliance Status", type: "select" },
  ],
}

// Define default stages by object type
const defaultStages: Record<string, Array<{ id: string; name: string; color: string }>> = {
  task: [
    { id: "todo", name: "To Do", color: "bg-gray-100" },
    { id: "in-progress", name: "In Progress", color: "bg-blue-100" },
    { id: "review", name: "Review", color: "bg-yellow-100" },
    { id: "done", name: "Done", color: "bg-green-100" },
  ],
  opportunity: [
    { id: "initial-contact", name: "Initial Contact", color: "bg-gray-100" },
    { id: "proposal", name: "Proposal", color: "bg-blue-100" },
    { id: "due-diligence", name: "Due Diligence", color: "bg-yellow-100" },
    { id: "term-sheet", name: "Term Sheet", color: "bg-purple-100" },
    { id: "closed-won", name: "Closed Won", color: "bg-green-100" },
    { id: "closed-lost", name: "Closed Lost", color: "bg-red-100" },
  ],
  "capital-call": [
    { id: "new", name: "New", color: "bg-gray-100" },
    { id: "in-progress", name: "In Progress", color: "bg-blue-100" },
    { id: "done", name: "Done", color: "bg-green-100" },
  ],
  document: [
    { id: "draft", name: "Draft", color: "bg-gray-100" },
    { id: "review", name: "Review", color: "bg-yellow-100" },
    { id: "approved", name: "Approved", color: "bg-green-100" },
    { id: "rejected", name: "Rejected", color: "bg-red-100" },
  ],
  entity: [
    { id: "active", name: "Active", color: "bg-green-100" },
    { id: "pending", name: "Pending", color: "bg-yellow-100" },
    { id: "inactive", name: "Inactive", color: "bg-gray-100" },
    { id: "dissolved", name: "Dissolved", color: "bg-red-100" },
  ],
}

// Define default automation rules by object type
const defaultAutomationRules: Record<string, Array<any>> = {
  task: [],
  opportunity: [
    {
      name: "New Pitch Deck",
      description: "Create a new opportunity when a pitch deck is uploaded",
      trigger: "file_upload",
      conditionSummary: "document_type = Pitch Deck",
      actionSummary: "Create opportunity, link to company, add to pipeline",
      conditions: [{ field: "document_type", value: "Pitch Deck" }],
      actions: {
        template: "template_1",
        linkTo: "company",
      },
      status: "enabled",
    }
  ],
  "capital-call": [
    {
      name: "Capital Call Email",
      description: "Create a new capital call task when an email with 'Capital Call' in subject is received",
      trigger: "email_ingestion",
      conditionSummary: "subject contains 'Capital Call'",
      actionSummary: "Create task, auto-classify, notify reviewer",
      conditions: [{ field: "subject", value: "Capital Call" }],
      actions: {
        template: "template_1",
        linkTo: "investment",
      },
      status: "enabled",
    },
    {
      name: "Capital Call Document",
      description: "Create a new capital call task when a capital call document is uploaded",
      trigger: "file_upload", 
      conditionSummary: "tag = Capital Call",
      actionSummary: "Create task, link to investment, add to board",
      conditions: [{ field: "tag", value: "Capital Call" }],
      actions: {
        template: "template_2",
        linkTo: "investment",
      },
      status: "enabled",
    }
  ],
  "distribution": [
    {
      name: "Distribution Notice",
      description: "Create a new distribution task when a distribution notice is received",
      trigger: "integration",
      conditionSummary: "document_type = Distribution Notice",
      actionSummary: "Create task, link to investment, tag as distribution",
      conditions: [{ field: "document_type", value: "Distribution Notice" }],
      actions: {
        template: "template_3", 
        linkTo: "investment",
      },
      status: "enabled",
    },
    {
      name: "Distribution Email",
      description: "Create a new distribution task when an email with 'Distribution' in subject is received",
      trigger: "email_ingestion",
      conditionSummary: "subject contains 'Distribution'",
      actionSummary: "Create task, auto-classify as distribution, notify reviewer",
      conditions: [{ field: "subject", value: "Distribution" }],
      actions: {
        template: "template_3",
        linkTo: "investment",
      },
      status: "enabled",
    }
  ],
  document: [],
  entity: [],
}

interface WorkflowCreatorProps {
  isOpen: boolean
  onClose: () => void
  onSave: (workflow: any) => void
  existingWorkflow?: any
}

interface AutomationRule {
  name: string;
  description: string;
  trigger: string;
  triggers: string[];
  triggersLogic: string;
  conditions: { field: string; value: string }[];
  conditionsLogic: string;
  actions: {
    type: string;
    template: string;
  }[];
  status: string;
}

export function WorkflowCreator({ isOpen, onClose, onSave, existingWorkflow }: WorkflowCreatorProps) {
  const [activeTab, setActiveTab] = useState("basic")
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false)
  const [selectedRule, setSelectedRule] = useState<any>(null)
  const [isEditingRule, setIsEditingRule] = useState(false)
  const [newRule, setNewRule] = useState<AutomationRule>({
    name: "",
    description: "",
    trigger: "",
    triggers: [],
    triggersLogic: "OR",
    conditions: [{ field: "tag", value: "" }],
    conditionsLogic: "AND",
    actions: [{
      template: "",
      type: "add_to_workflow"
    }],
    status: "enabled"
  })
  const [workflow, setWorkflow] = useState(() => {
    if (existingWorkflow) {
      return {
        name: existingWorkflow.name || "",
        description: existingWorkflow.description || "",
        objectType: existingWorkflow.objectType || "",
        attributes: existingWorkflow.attributes || [],
        stages: existingWorkflow.stages || [],
        automationRules: existingWorkflow.automationRules || [],
      }
    }
    return {
      name: "",
      description: "",
      objectType: "",
      attributes: [],
      stages: [],
      automationRules: [],
    }
  })

  useEffect(() => {
    if (existingWorkflow) {
      setWorkflow({
        name: existingWorkflow.name || "",
        description: existingWorkflow.description || "",
        objectType: existingWorkflow.objectType || "",
        attributes: existingWorkflow.attributes || [],
        stages: existingWorkflow.stages || [],
        automationRules: existingWorkflow.automationRules || [],
      })
    }
  }, [existingWorkflow])

  const handleObjectTypeChange = (type: string) => {
    setWorkflow({
      ...workflow,
      objectType: type,
      attributes: [],
      stages: defaultStages[type] || [],
      automationRules: defaultAutomationRules[type] || [],
    })
  }

  const toggleAttribute = (attributeId: string) => {
    const isSelected = workflow.attributes.some((attr: any) => attr.id === attributeId)

    if (isSelected) {
      setWorkflow({
        ...workflow,
        attributes: workflow.attributes.filter((attr: any) => attr.id !== attributeId),
      })
    } else {
      const attribute = availableAttributes[workflow.objectType].find((attr) => attr.id === attributeId)
      if (attribute) {
        setWorkflow({
          ...workflow,
          attributes: [...workflow.attributes, { ...attribute }],
        })
      }
    }
  }

  const handleSave = () => {
    onSave(workflow)
    onClose()
  }

  const isAttributeSelected = (attributeId: string) => {
    return workflow.attributes.some((attr: any) => attr.id === attributeId)
  }

  const canProceedToAttributes = workflow.name && workflow.objectType
  const canProceedToStages = canProceedToAttributes && workflow.attributes.length > 0
  const canSave = canProceedToStages && workflow.stages.length > 0

  // Add these functions to handle automation rule form
  const handleRuleChange = (field: string, value: string) => {
    setNewRule(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleActionChange = (index: number, field: string, value: string) => {
    setNewRule(prev => {
      const updatedActions = [...prev.actions];
      updatedActions[index] = { 
        ...updatedActions[index], 
        [field]: value 
      };
      return {
        ...prev,
        actions: updatedActions
      };
    });
  };

  const handleAddAction = () => {
    setNewRule(prev => ({
      ...prev,
      actions: [...prev.actions, { type: "add_to_workflow", template: "" }]
    }));
  };

  const handleRemoveAction = (index: number) => {
    setNewRule(prev => {
      if (prev.actions.length <= 1) return prev;
      
      const updatedActions = [...prev.actions];
      updatedActions.splice(index, 1);
      return {
        ...prev,
        actions: updatedActions
      };
    });
  };

  const handleAddCondition = () => {
    setNewRule(prev => ({
      ...prev,
      conditions: [...prev.conditions, { field: "tag", value: "" }]
    }))
  }

  const handleConditionChange = (index: number, field: "field" | "value", value: string) => {
    setNewRule(prev => {
      const updatedConditions = [...prev.conditions]
      updatedConditions[index] = { 
        ...updatedConditions[index], 
        [field]: value 
      }
      return {
        ...prev,
        conditions: updatedConditions
      }
    })
  }

  const handleRemoveCondition = (index: number) => {
    setNewRule(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }))
  }

  const handleRuleClick = (rule: any, index: number) => {
    setSelectedRule({ ...rule, index });
    setNewRule({
      name: rule.name,
      description: rule.description,
      trigger: rule.triggers?.[0] || rule.trigger || "",
      triggers: rule.triggers || [],
      triggersLogic: rule.triggersLogic || "OR",
      conditionsLogic: rule.conditionsLogic || "AND",
      conditions: rule.conditions || [],
      actions: rule.actions || { template: "" },
      status: rule.status || "enabled",
    });
    setIsRuleModalOpen(true);
    setIsEditingRule(false);
  }

  const handleEditRule = () => {
    setIsEditingRule(true);
  }

  const handleCancelEdit = () => {
    if (selectedRule) {
      handleRuleClick(selectedRule, selectedRule.index);
    } else {
      setIsRuleModalOpen(false);
    }
  }

  const handleSaveRule = () => {
    // Format the rule for display in the table
    const conditionSummary = newRule.conditions.map(c => `${c.field} = ${c.value}`).join(newRule.conditionsLogic === "AND" ? " AND " : " OR ");
    
    // Build a list of all triggers
    const allTriggers = [...(newRule.triggers || [])];
    if (newRule.trigger) allTriggers.push(newRule.trigger);
    
    const triggerSummary = allTriggers.length > 1 
      ? `Multiple (${allTriggers.join(" OR ")})` 
      : newRule.trigger;
      
    const actionSummary = `Add to workflow: ${newRule.actions.map(a => a.template || 'default').join(", ")}`
    
    const formattedRule = {
      name: newRule.name,
      description: newRule.description,
      trigger: triggerSummary,
      conditionSummary,
      actionSummary,
      conditions: newRule.conditions,
      conditionsLogic: newRule.conditionsLogic,
      triggers: allTriggers,
      triggersLogic: newRule.triggersLogic,
      actions: newRule.actions,
      status: newRule.status
    }

    if (selectedRule) {
      // Update existing rule
      setWorkflow(prev => {
        const updatedRules = [...prev.automationRules];
        updatedRules[selectedRule.index] = formattedRule;
        return {
          ...prev,
          automationRules: updatedRules
        };
      });
    } else {
      // Add new rule
      setWorkflow(prev => ({
        ...prev,
        automationRules: [...prev.automationRules, formattedRule]
      }))
    }

    // Reset the form and close the modal
    setNewRule({
      name: "",
      description: "",
      trigger: "",
      triggers: [],
      triggersLogic: "OR",
      conditionsLogic: "AND",
      conditions: [{ field: "tag", value: "" }],
      actions: [{
        template: "",
        type: "add_to_workflow"
      }],
      status: "enabled",
    })
    setSelectedRule(null)
    setIsEditingRule(false)
    setIsRuleModalOpen(false)
  }

  // Add these functions to handle automation rule operations
  const handleToggleRuleStatus = (index: number) => {
    setWorkflow(prev => {
      const updatedRules = [...prev.automationRules]
      updatedRules[index] = {
        ...updatedRules[index],
        status: updatedRules[index].status === "enabled" ? "disabled" : "enabled"
      }
      return {
        ...prev,
        automationRules: updatedRules
      }
    })
  }

  const handleDeleteRule = (index: number) => {
    setWorkflow(prev => ({
      ...prev,
      automationRules: prev.automationRules.filter((_: any, i: number) => i !== index)
    }))
  }

  const handleAddTrigger = () => {
    if (!newRule.trigger) return;
    setNewRule(prev => ({
      ...prev,
      triggers: [...prev.triggers, prev.trigger],
      trigger: ""
    }));
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="flex w-full max-w-2xl flex-col p-0 sm:max-w-2xl [&>button]:hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Badge variant="outline" className="bg-background">
              Workflow
            </Badge>
          </div>
        </div>

        {/* Record Header */}
        <div className="border-b bg-background px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500 text-white text-sm font-medium">
              W
            </div>
            <div>
              <h2 className="text-lg font-semibold">{existingWorkflow ? "Edit Workflow" : "Create New Workflow"}</h2>
              <p className="text-sm text-muted-foreground">
                {existingWorkflow
                  ? "Update your workflow settings and configuration."
                  : "Create a new workflow to track and manage your business processes."}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
            <div className="border-b bg-background px-6">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="basic">
                  <FileTextIcon className="h-4 w-4 mr-2" />
                  Basic Info
                </TabsTrigger>
                <TabsTrigger value="attributes" disabled={!canProceedToAttributes}>
                  <LayoutIcon className="h-4 w-4 mr-2" />
                  Card Attributes
                </TabsTrigger>
                <TabsTrigger value="stages" disabled={!canProceedToStages}>
                  <ListIcon className="h-4 w-4 mr-2" />
                  Stages
                </TabsTrigger>
                <TabsTrigger value="automation" disabled={!canProceedToStages}>
                  <Settings2Icon className="h-4 w-4 mr-2" />
                  Automation
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="basic" className="flex-1 p-6 space-y-4 m-0">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Workflow Name</Label>
                  <Input
                    id="name"
                    value={workflow.name}
                    onChange={(e) => setWorkflow({ ...workflow, name: e.target.value })}
                    placeholder="e.g., Deal Pipeline, Task Management"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={workflow.description}
                    onChange={(e) => setWorkflow({ ...workflow, description: e.target.value })}
                    placeholder="Describe what this workflow is used for..."
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="objectType">Object Type</Label>
                  <Select
                    value={workflow.objectType}
                    onValueChange={handleObjectTypeChange}
                    disabled={!!existingWorkflow}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select object type" />
                    </SelectTrigger>
                    <SelectContent>
                      {objectTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    {workflow.objectType
                      ? objectTypes.find((t) => t.id === workflow.objectType)?.description
                      : "Select the type of object this workflow will track."}
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="attributes" className="flex-1 p-6 m-0">
              <div className="grid gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Select Card Attributes</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Choose which attributes will appear on cards in your workflow. These attributes will be visible at a
                    glance on the kanban board.
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    {workflow.objectType &&
                      availableAttributes[workflow.objectType].map((attribute) => (
                        <div
                          key={attribute.id}
                          className={`flex items-center space-x-2 rounded-md border p-3 cursor-pointer ${
                            isAttributeSelected(attribute.id) ? "border-primary bg-primary/5" : ""
                          }`}
                          onClick={() => toggleAttribute(attribute.id)}
                        >
                          <Checkbox
                            id={`attribute-${attribute.id}`}
                            checked={isAttributeSelected(attribute.id)}
                            onCheckedChange={() => toggleAttribute(attribute.id)}
                          />
                          <div className="flex-1">
                            <Label htmlFor={`attribute-${attribute.id}`} className="text-sm font-medium cursor-pointer">
                              {attribute.name}
                            </Label>
                            <p className="text-xs text-muted-foreground">{attribute.type}</p>
                          </div>
                          {isAttributeSelected(attribute.id) && <Check className="h-4 w-4 text-primary" />}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="stages" className="flex-1 p-6 m-0">
              <div className="grid gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Configure Workflow Stages</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Define the stages that items will move through in your workflow. These will appear as columns on
                    your kanban board.
                  </p>

                  <div className="space-y-2">
                    {workflow.stages.map((stage: any, index: number) => (
                      <div key={stage.id} className="flex items-center gap-2 p-2 border rounded-md">
                        <div className={`w-4 h-4 rounded-full ${stage.color}`}></div>
                        <div className="flex-1">
                          <Input
                            value={stage.name}
                            onChange={(e) => {
                              const updatedStages = [...workflow.stages]
                              updatedStages[index] = { ...stage, name: e.target.value }
                              setWorkflow({ ...workflow, stages: updatedStages })
                            }}
                            className="h-8"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const updatedStages = workflow.stages.filter((_: any, i: number) => i !== index)
                            setWorkflow({ ...workflow, stages: updatedStages })
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                    <Button
                      variant="outline"
                      className="w-full mt-2"
                      onClick={() => {
                        const newStage = {
                          id: `stage-${Date.now()}`,
                          name: `New Stage`,
                          color: "bg-gray-100",
                        }
                        setWorkflow({ ...workflow, stages: [...workflow.stages, newStage] })
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Stage
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="automation" className="p-6 flex-1 overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Automations for This Workflow</h3>
                  <p className="text-sm text-muted-foreground">
                    Records can be automatically created and added to this workflow based on incoming files, emails, or integrations. Below are the rules that define how this automation works.
                  </p>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    {/* You can add search/filter controls here if needed */}
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => {
                      setSelectedRule(null);
                      setIsEditingRule(true);
                      setIsRuleModalOpen(true);
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Rule
                  </Button>
                </div>

                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableCell className="font-medium">Rule Name</TableCell>
                        <TableCell className="font-medium">Description</TableCell>
                        <TableCell className="font-medium">Status</TableCell>
                        <TableCell className="w-[70px]"></TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(workflow.automationRules || []).length > 0 ? (
                        (workflow.automationRules || []).map((rule: any, index: number) => (
                          <TableRow 
                            key={index} 
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => handleRuleClick(rule, index)}
                          >
                            <TableCell className="font-medium">{rule.name}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{rule.description}</TableCell>
                            <TableCell>
                              <Badge variant={rule.status === "enabled" ? "default" : "secondary"}>
                                {rule.status === "enabled" ? "Enabled" : "Disabled"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontalIcon className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation();
                                    handleRuleClick(rule, index);
                                    setIsEditingRule(true);
                                  }}>Edit</DropdownMenuItem>
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleRuleStatus(index);
                                  }}>
                                    {rule.status === "enabled" ? "Disable" : "Enable"}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600" onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteRule(index);
                                  }}>Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                            No automation rules yet. Add your first rule to automate this workflow.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="border-t bg-background px-6 py-4">
          <div className="flex justify-between">
            {activeTab === "basic" ? (
              <Button
                onClick={() => setActiveTab("attributes")}
                disabled={!canProceedToAttributes}
                className="flex items-center gap-2 ml-auto"
              >
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            ) : activeTab === "attributes" ? (
              <>
                <Button variant="outline" onClick={() => setActiveTab("basic")}>
                  Back
                </Button>
                <Button
                  onClick={() => setActiveTab("stages")}
                  disabled={!canProceedToStages}
                  className="flex items-center gap-2"
                >
                  Next <ArrowRight className="h-4 w-4" />
                </Button>
              </>
            ) : activeTab === "stages" ? (
              <>
                <Button variant="outline" onClick={() => setActiveTab("attributes")}>
                  Back
                </Button>
                <Button
                  onClick={() => setActiveTab("automation")}
                  disabled={!canProceedToStages}
                  className="flex items-center gap-2"
                >
                  Next <ArrowRight className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setActiveTab("stages")}>
                  Back
                </Button>
                <Button onClick={handleSave} disabled={!canSave}>
                  {existingWorkflow ? "Save Changes" : "Create Workflow"}
                </Button>
              </>
            )}
          </div>
        </div>
      </SheetContent>

      {/* Add Automation Rule Dialog */}
      <Sheet open={isRuleModalOpen} onOpenChange={setIsRuleModalOpen}>
        <SheetContent side="right" className="flex w-full max-w-2xl flex-col p-0 sm:max-w-2xl [&>button]:hidden">
          <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => setIsRuleModalOpen(false)}>
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <Badge variant="outline" className="bg-background">
                Automation Rule
              </Badge>
            </div>
            {selectedRule && !isEditingRule && (
              <Button variant="outline" size="sm" onClick={handleEditRule}>
                Edit Rule
              </Button>
            )}
          </div>

          <div className="border-b bg-background px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white text-sm font-medium">
                A
              </div>
              <div>
                <h2 className="text-lg font-semibold">
                  {selectedRule && !isEditingRule ? "View Automation Rule" : selectedRule ? "Edit Automation Rule" : "Add Automation Rule"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {selectedRule && !isEditingRule 
                    ? "Review the automation rule configuration." 
                    : "Create a rule to automatically generate records for this workflow when certain conditions are met."}
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {selectedRule && !isEditingRule ? (
              // View Mode
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Rule Name</h3>
                    <p className="mt-1 text-sm">{newRule.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                    <p className="mt-1 text-sm">{newRule.description}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                    <Badge variant={newRule.status === "enabled" ? "default" : "secondary"} className="mt-1">
                      {newRule.status === "enabled" ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">When should this run?</h3>
                  <div className="space-y-2">
                    {newRule.triggers.map((trigger, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Badge variant="outline">
                          {trigger === "file_upload" ? "File Upload" : 
                           trigger === "email_ingestion" ? "Email Ingestion" : 
                           trigger}
                        </Badge>
                        {index < newRule.triggers.length - 1 && <span className="text-xs text-muted-foreground">{newRule.triggersLogic}</span>}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Only run if this is true</h3>
                  <div className="space-y-2">
                    {newRule.conditions.map((condition, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium">{condition.field}</span>
                        <span className="text-muted-foreground mx-2">=</span>
                        <span>{condition.value}</span>
                        {index < newRule.conditions.length - 1 && (
                          <span className="text-muted-foreground ml-2">{newRule.conditionsLogic}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">What should happen?</h3>
                  <div className="space-y-2">
                    {newRule.actions.map((action, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium">
                          {action.type === "add_to_workflow" ? "Add to workflow" : "Create task from template"}:
                        </span>
                        <span className="ml-2">{action.template || 'Not specified'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // Edit/Create Mode
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Rule Name</h3>
                    <Input 
                      id="rule-name" 
                      placeholder="E.g., New Capital Call Detection"
                      value={newRule.name}
                      onChange={(e) => handleRuleChange('name', e.target.value)}
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                    <Textarea 
                      id="rule-description" 
                      placeholder="Describe what this rule does..." 
                      value={newRule.description}
                      onChange={(e) => handleRuleChange('description', e.target.value)}
                    />
                  </div>
                </div>

                {/* Trigger Type */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-md font-medium">When should this run?</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="triggers-logic" className="text-xs">Logic:</Label>
                        <Select 
                          value={newRule.triggersLogic} 
                          onValueChange={(value) => setNewRule(prev => ({...prev, triggersLogic: value}))}
                        >
                          <SelectTrigger id="triggers-logic" className="h-7 w-[80px] text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AND">AND</SelectItem>
                            <SelectItem value="OR">OR</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button variant="outline" size="sm" onClick={handleAddTrigger}>
                        <Plus className="mr-2 h-3 w-3" />
                        Add Trigger
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    This is the event that kicks off the automation — like uploading a file or receiving an email.
                  </p>
                  
                  <div className="border rounded-md divide-y">
                    {(newRule.triggers || []).length > 0 && (
                      <div className="p-4 bg-muted/50 border-b">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{newRule.triggersLogic}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {newRule.triggersLogic === "OR" 
                              ? "Multiple triggers will activate this rule" 
                              : "All triggers must occur to activate this rule"}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {newRule.triggers.map((trigger, index) => (
                            <div key={index} className="flex items-center justify-between bg-background rounded-md p-2 border">
                              <span>{trigger === "file_upload" ? "File Upload" : 
                                     trigger === "email_ingestion" ? "Email Ingestion" : 
                                     trigger}</span>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => {
                                  setNewRule(prev => ({
                                    ...prev,
                                    triggers: prev.triggers.filter((_, i) => i !== index)
                                  }))
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="p-4 flex items-center gap-2">
                      <Select 
                        value="source" 
                        disabled
                        onValueChange={() => {}}
                      >
                        <SelectTrigger className="w-[180px] bg-muted">
                          <SelectValue placeholder="Source" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="source">Source</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <span className="text-muted-foreground">=</span>
                      
                      <Select 
                        value={newRule.trigger} 
                        onValueChange={(value) => handleRuleChange('trigger', value)}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select source type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="file_upload">File Upload</SelectItem>
                          <SelectItem value="email_ingestion">Email Ingestion</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-muted-foreground hover:text-foreground"
                        onClick={handleAddTrigger}
                        disabled={!newRule.trigger}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Conditions */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-md font-medium">Only run if this is true</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="conditions-logic" className="text-xs">Logic:</Label>
                        <Select 
                          value={newRule.conditionsLogic} 
                          onValueChange={(value) => setNewRule(prev => ({...prev, conditionsLogic: value}))}
                        >
                          <SelectTrigger id="conditions-logic" className="h-7 w-[80px] text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AND">AND</SelectItem>
                            <SelectItem value="OR">OR</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button variant="outline" size="sm" onClick={handleAddCondition}>
                        <Plus className="mr-2 h-3 w-3" />
                        Add Condition
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Add filters to make sure this only runs when it's relevant — like if the file name includes "Capital Call".
                  </p>
                  
                  <div className="border rounded-md divide-y">
                    {newRule.conditions.map((condition, index) => (
                      <div key={index} className="p-4 flex items-center gap-2">
                        <Select 
                          value={condition.field} 
                          onValueChange={(value) => handleConditionChange(index, "field", value)}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tag">Tag</SelectItem>
                            <SelectItem value="filename">Filename contains</SelectItem>
                            <SelectItem value="document_type">Document type</SelectItem>
                            <SelectItem value="subject">Subject contains</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <span className="text-muted-foreground">=</span>
                        
                        <Input 
                          className="flex-1" 
                          placeholder="Value" 
                          value={condition.value}
                          onChange={(e) => handleConditionChange(index, "value", e.target.value)}
                        />
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-muted-foreground hover:text-foreground"
                          onClick={() => handleRemoveCondition(index)}
                          disabled={newRule.conditions.length <= 1}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  {newRule.conditions.length > 1 && (
                    <div className="flex justify-end">
                      <Badge variant="outline" className="text-xs">{newRule.conditionsLogic === "AND" ? "All" : "Any"} conditions must be true</Badge>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-md font-medium">What should happen?</h3>
                    <Button variant="outline" size="sm" onClick={handleAddAction}>
                      <Plus className="mr-2 h-3 w-3" />
                      Add Action
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Tell the system what to do — like create a task, start a workflow, or assign it to someone.
                  </p>
                  
                  <div className="border rounded-md divide-y">
                    {newRule.actions.map((action, index) => (
                      <div key={index} className="p-4 flex items-center gap-2">
                        <Select 
                          value={action.type} 
                          onValueChange={(value) => handleActionChange(index, 'type', value)}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Action type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="add_to_workflow">Add to workflow</SelectItem>
                            <SelectItem value="create_task_from_template">Create task from template</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <span className="text-muted-foreground">=</span>
                        
                        <Select 
                          value={action.template} 
                          onValueChange={(value) => handleActionChange(index, 'template', value)}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder={action.type === "create_task_from_template" ? "Select task template" : "Select a workflow"} />
                          </SelectTrigger>
                          <SelectContent>
                            {action.type === "create_task_from_template" ? (
                              <>
                                <SelectItem value="capital_call_processing">Capital Call Processing</SelectItem>
                                <SelectItem value="k1_processing">K-1 Processing</SelectItem>
                                <SelectItem value="quarterly_report_processing">Quarterly Report Processing</SelectItem>
                              </>
                            ) : (
                              <>
                                <SelectItem value="deal_pipeline">Deal Pipeline</SelectItem>
                                <SelectItem value="capital_calls">Capital Calls</SelectItem>
                                <SelectItem value="distributions_tracking">Distributions Tracking</SelectItem>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-muted-foreground hover:text-foreground"
                          onClick={() => handleRemoveAction(index)}
                          disabled={newRule.actions.length <= 1}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t bg-muted px-6 py-4">
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
            {(selectedRule && !isEditingRule) ? null : (
              <Button onClick={handleSaveRule}>
                Save Rule
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </Sheet>
  )
}
