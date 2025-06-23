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
import { 
  Plus, 
  Zap, 
  FileUp, 
  Mail, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  Pencil, 
  Trash2, 
  PlayCircle,
  PauseCircle,
  MoreHorizontal,
  ChevronLeft
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import React from "react"

interface AutomationRule {
  id: string
  name: string
  description: string
  status: "active" | "inactive" | "draft"
  triggerType: string
  triggerIcon: any
  conditions: string[]
  actions: string[]
  workflowType?: string
  lastExecuted?: string
  executionCount: number
  createdAt: string
}

const sampleAutomations: AutomationRule[] = [
  {
    id: "1",
    name: "Capital Call - Auto Task Creation",
    description: "Automatically create tasks when capital call files are uploaded",
    status: "active",
    triggerType: "File Upload",
    triggerIcon: FileUp,
    conditions: [
      "File name or content includes \"Capital Call\"",
      "File is linked to an Investment"
    ],
    actions: [
      "Create a Task titled \"Review Capital Call – [Fund Name]\"",
      "Apply the \"Capital Call Processing\" workflow template",
      "Link the Task to the associated Investment",
      "Move Task to the first stage of the Capital Call board"
    ],
    workflowType: "Capital Call Processing",
    lastExecuted: "2024-06-10T14:30:00Z",
    executionCount: 28,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "K-1 Processing Workflow",
    description: "Start K-1 processing workflow when tax documents are received",
    status: "active",
    triggerType: "Email Received",
    triggerIcon: Mail,
    conditions: [
      "Email subject or body contains \"K-1\" or \"Schedule K-1\"",
      "Email has PDF attachment"
    ],
    actions: [
      "Extract entity name from email or attachment",
      "Create K-1 Processing task for the entity",
      "Save attachment to entity's tax documents folder",
      "Notify tax team members"
    ],
    workflowType: "Tax Document Processing",
    lastExecuted: "2024-06-08T09:15:00Z",
    executionCount: 45,
    createdAt: "2024-01-20",
  },
  {
    id: "3",
    name: "Quarterly Report Review",
    description: "Schedule quarterly report reviews for portfolio companies",
    status: "inactive",
    triggerType: "Scheduled",
    triggerIcon: Clock,
    conditions: [
      "End of quarter (Mar 31, Jun 30, Sep 30, Dec 31)",
      "Company is in active portfolio"
    ],
    actions: [
      "Create Quarterly Report Review task for each portfolio company",
      "Assign to primary investment manager",
      "Set due date 15 days after quarter end",
      "Add checklist of review items"
    ],
    workflowType: "Portfolio Monitoring",
    lastExecuted: "2024-03-31T00:00:00Z",
    executionCount: 12,
    createdAt: "2024-02-05",
  },
  {
    id: "4",
    name: "Deal Pipeline Alert",
    description: "Alert team when high-priority opportunities are inactive",
    status: "draft",
    triggerType: "Condition Met",
    triggerIcon: AlertCircle,
    conditions: [
      "Deal opportunity marked as \"High Priority\"",
      "No activity for more than 14 days"
    ],
    actions: [
      "Send notification to deal team",
      "Create follow-up task",
      "Log event in deal history"
    ],
    workflowType: "Deal Pipeline",
    executionCount: 0,
    createdAt: "2024-06-01",
  },
]

interface AutomationsManagementProps {
  hideTitle?: boolean;
  hideButton?: boolean;
  isDialogOpen?: boolean;
  onDialogOpenChange?: (open: boolean) => void;
}

export function AutomationsManagement({ 
  hideTitle = false, 
  hideButton = false,
  isDialogOpen,
  onDialogOpenChange
}: AutomationsManagementProps = {}) {
  const [automations, setAutomations] = useState<AutomationRule[]>(sampleAutomations)
  const [localIsCreateDialogOpen, setLocalIsCreateDialogOpen] = useState(false)
  const [editingAutomation, setEditingAutomation] = useState<AutomationRule | null>(null)
  const [activeTab, setActiveTab] = useState<string>("trigger")
  const [selectedAutomation, setSelectedAutomation] = useState<AutomationRule | null>(null)
  const [detailView, setDetailView] = useState<"overview" | "conditions" | "actions" | "history">("overview")
  
  // Use either external or local dialog state
  const isCreateDialogOpen = isDialogOpen !== undefined ? isDialogOpen : localIsCreateDialogOpen;
  const setIsCreateDialogOpen = onDialogOpenChange || setLocalIsCreateDialogOpen;

  // New automation state
  const [newAutomation, setNewAutomation] = useState<Partial<AutomationRule>>({
    name: "",
    description: "",
    triggerType: "",
    conditions: [],
    actions: [],
    status: "draft"
  })
  
  // For editing condition/action in dialog
  const [currentCondition, setCurrentCondition] = useState("")
  const [currentAction, setCurrentAction] = useState("")
  
  const handleCreateAutomation = () => {
    if (!newAutomation.name || !newAutomation.triggerType) return;
    
    const automation: AutomationRule = {
      id: Date.now().toString(),
      name: newAutomation.name || "",
      description: newAutomation.description || "",
      status: "draft",
      triggerType: newAutomation.triggerType || "File Upload",
      triggerIcon: getTriggerIcon(newAutomation.triggerType || "File Upload"),
      conditions: newAutomation.conditions || [],
      actions: newAutomation.actions || [],
      workflowType: newAutomation.workflowType,
      executionCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
    }
    
    setAutomations([...automations, automation])
    setNewAutomation({
      name: "",
      description: "",
      triggerType: "",
      conditions: [],
      actions: [],
      status: "draft"
    })
    setActiveTab("trigger")
    setIsCreateDialogOpen(false)
  }
  
  const handleEditAutomation = () => {
    if (!editingAutomation) return;
    
    const updatedAutomations = automations.map(automation => 
      automation.id === editingAutomation.id ? editingAutomation : automation
    );
    
    setAutomations(updatedAutomations);
    setEditingAutomation(null);
    setIsCreateDialogOpen(false);
  }
  
  const handleAddCondition = () => {
    if (!currentCondition) return;
    
    if (editingAutomation) {
      setEditingAutomation({
        ...editingAutomation,
        conditions: [...editingAutomation.conditions, currentCondition]
      });
    } else {
      setNewAutomation({
        ...newAutomation,
        conditions: [...(newAutomation.conditions || []), currentCondition]
      });
    }
    
    setCurrentCondition("");
  }
  
  const handleAddAction = () => {
    if (!currentAction) return;
    
    if (editingAutomation) {
      setEditingAutomation({
        ...editingAutomation,
        actions: [...editingAutomation.actions, currentAction]
      });
    } else {
      setNewAutomation({
        ...newAutomation,
        actions: [...(newAutomation.actions || []), currentAction]
      });
    }
    
    setCurrentAction("");
  }
  
  const handleRemoveCondition = (index: number) => {
    if (editingAutomation) {
      const newConditions = [...editingAutomation.conditions];
      newConditions.splice(index, 1);
      setEditingAutomation({...editingAutomation, conditions: newConditions});
    } else {
      const newConditions = [...(newAutomation.conditions || [])];
      newConditions.splice(index, 1);
      setNewAutomation({...newAutomation, conditions: newConditions});
    }
  }
  
  const handleRemoveAction = (index: number) => {
    if (editingAutomation) {
      const newActions = [...editingAutomation.actions];
      newActions.splice(index, 1);
      setEditingAutomation({...editingAutomation, actions: newActions});
    } else {
      const newActions = [...(newAutomation.actions || [])];
      newActions.splice(index, 1);
      setNewAutomation({...newAutomation, actions: newActions});
    }
  }
  
  const handleDeleteAutomation = (id: string) => {
    setAutomations(automations.filter(automation => automation.id !== id));
  }
  
  const handleToggleStatus = (id: string) => {
    setAutomations(automations.map(automation => {
      if (automation.id === id) {
        const newStatus = automation.status === 'active' ? 'inactive' : 'active';
        return {...automation, status: newStatus};
      }
      return automation;
    }));
  }
  
  const handleEditClick = (automation: AutomationRule) => {
    setEditingAutomation({...automation});
    setActiveTab("trigger");
    setIsCreateDialogOpen(true);
  }
  
  const getTriggerIcon = (triggerType: string) => {
    switch (triggerType) {
      case "File Upload": return FileUp;
      case "Email Received": return Mail;
      case "Scheduled": return Clock;
      case "Condition Met": return AlertCircle;
      default: return Zap;
    }
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
  
  const handleRowClick = (automation: AutomationRule) => {
    setSelectedAutomation(automation);
    setDetailView("overview");
  };
  
  const handleBackToList = () => {
    setSelectedAutomation(null);
  };
  
  // Current automation being created or edited
  const currentAutomation = editingAutomation || newAutomation;
  
  // If an automation is selected, show the detail view
  if (selectedAutomation) {
    return (
      <Card className={!hideTitle ? undefined : "border-0 shadow-none"}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleBackToList} className="mr-2">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to list
              </Button>
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  {React.createElement(selectedAutomation.triggerIcon, { className: "h-5 w-5 text-primary" })}
                  {selectedAutomation.name}
                </CardTitle>
                <CardDescription>{selectedAutomation.description}</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={getStatusColor(selectedAutomation.status)} className="capitalize">
                {selectedAutomation.status}
              </Badge>
              <Button variant="outline" size="sm" onClick={() => handleEditClick(selectedAutomation)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={detailView} onValueChange={(value) => setDetailView(value as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="conditions">Conditions</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
              <TabsTrigger value="history">Execution History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Trigger Type</h3>
                    <div className="flex items-center gap-2">
                      {React.createElement(selectedAutomation.triggerIcon, { className: "h-4 w-4 text-primary" })}
                      <span className="font-medium">{selectedAutomation.triggerType}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Associated Workflow</h3>
                    <span className="font-medium">{selectedAutomation.workflowType || "—"}</span>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Created</h3>
                    <span>{selectedAutomation.createdAt}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                    <Badge variant={getStatusColor(selectedAutomation.status)} className="capitalize">
                      {selectedAutomation.status}
                    </Badge>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Execution Count</h3>
                    <span className="font-mono">{selectedAutomation.executionCount.toLocaleString()}</span>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Last Executed</h3>
                    <span>{selectedAutomation.lastExecuted ? new Date(selectedAutomation.lastExecuted).toLocaleString() : "Never"}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Button onClick={() => handleToggleStatus(selectedAutomation.id)}>
                  {selectedAutomation.status === 'active' ? (
                    <>
                      <PauseCircle className="h-4 w-4 mr-2" />
                      Deactivate Automation
                    </>
                  ) : (
                    <>
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Activate Automation
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="conditions" className="space-y-4 py-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Conditions</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  All of these conditions must be met for the automation to run.
                </p>
                
                {selectedAutomation.conditions.length > 0 ? (
                  <div className="space-y-2">
                    {selectedAutomation.conditions.map((condition, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span>{condition}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-6 border rounded-md bg-muted/50">
                    <p className="text-muted-foreground">No conditions defined</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="actions" className="space-y-4 py-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Actions</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  These actions will be performed when the conditions are met.
                </p>
                
                {selectedAutomation.actions.length > 0 ? (
                  <div className="space-y-2">
                    {selectedAutomation.actions.map((action, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                        <Zap className="h-4 w-4 text-primary" />
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-6 border rounded-md bg-muted/50">
                    <p className="text-muted-foreground">No actions defined</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="history" className="space-y-4 py-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Execution History</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Recent executions of this automation.
                </p>
                
                {selectedAutomation.executionCount > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Trigger</TableHead>
                          <TableHead>Result</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedAutomation.lastExecuted && (
                          <TableRow>
                            <TableCell>{new Date(selectedAutomation.lastExecuted).toLocaleString()}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {React.createElement(selectedAutomation.triggerIcon, { className: "h-4 w-4 text-muted-foreground" })}
                                <span>{selectedAutomation.triggerType}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="default">Success</Badge>
                            </TableCell>
                          </TableRow>
                        )}
                        {/* Mock previous executions */}
                        {selectedAutomation.executionCount > 1 && (
                          <>
                            <TableRow>
                              <TableCell>{new Date(new Date(selectedAutomation.lastExecuted || Date.now()).getTime() - 86400000).toLocaleString()}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {React.createElement(selectedAutomation.triggerIcon, { className: "h-4 w-4 text-muted-foreground" })}
                                  <span>{selectedAutomation.triggerType}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="default">Success</Badge>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>{new Date(new Date(selectedAutomation.lastExecuted || Date.now()).getTime() - 172800000).toLocaleString()}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {React.createElement(selectedAutomation.triggerIcon, { className: "h-4 w-4 text-muted-foreground" })}
                                  <span>{selectedAutomation.triggerType}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="default">Success</Badge>
                              </TableCell>
                            </TableRow>
                          </>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center p-6 border rounded-md bg-muted/50">
                    <p className="text-muted-foreground">No execution history</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={!hideTitle ? undefined : "border-0 shadow-none"}>
      {!hideTitle && (
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Automations</CardTitle>
              <CardDescription>
                Create rules that automatically trigger actions based on events in your system.
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
                <DialogContent className="sm:max-w-[700px]">
                  <DialogHeader>
                    <DialogTitle>{editingAutomation ? "Edit Automation" : "Create Automation"}</DialogTitle>
                    <DialogDescription>
                      {editingAutomation 
                        ? "Modify your automation rule to update how it works." 
                        : "Define a rule that automatically performs actions when specific conditions are met."}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="trigger">1. Trigger</TabsTrigger>
                      <TabsTrigger value="conditions">2. Conditions</TabsTrigger>
                      <TabsTrigger value="actions">3. Actions</TabsTrigger>
                    </TabsList>
                    
                    {/* Trigger Tab */}
                    <TabsContent value="trigger" className="space-y-4 py-4">
                      <div className="grid gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Automation Name</Label>
                          <Input
                            id="name"
                            value={currentAutomation.name}
                            onChange={(e) => editingAutomation 
                              ? setEditingAutomation({...editingAutomation, name: e.target.value})
                              : setNewAutomation({...newAutomation, name: e.target.value})
                            }
                            placeholder="e.g., Capital Call - Auto Task Creation"
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={currentAutomation.description}
                            onChange={(e) => editingAutomation
                              ? setEditingAutomation({...editingAutomation, description: e.target.value})
                              : setNewAutomation({...newAutomation, description: e.target.value})
                            }
                            placeholder="Describe what this automation does..."
                            rows={2}
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="triggerType">Trigger Type</Label>
                          <Select 
                            value={currentAutomation.triggerType} 
                            onValueChange={(value) => editingAutomation
                              ? setEditingAutomation({...editingAutomation, triggerType: value})
                              : setNewAutomation({...newAutomation, triggerType: value})
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a trigger type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Event Triggers</SelectLabel>
                                <SelectItem value="File Upload">
                                  <div className="flex items-center gap-2">
                                    <FileUp className="h-4 w-4" />
                                    <span>File Upload</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="Email Received">
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    <span>Email Received</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="Scheduled">
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span>Scheduled</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="Condition Met">
                                  <div className="flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4" />
                                    <span>Condition Met</span>
                                  </div>
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="workflowType">Associated Workflow (Optional)</Label>
                          <Select 
                            value={currentAutomation.workflowType} 
                            onValueChange={(value) => editingAutomation
                              ? setEditingAutomation({...editingAutomation, workflowType: value})
                              : setNewAutomation({...newAutomation, workflowType: value})
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a workflow" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Capital Call Processing">Capital Call Processing</SelectItem>
                              <SelectItem value="Tax Document Processing">Tax Document Processing</SelectItem>
                              <SelectItem value="Portfolio Monitoring">Portfolio Monitoring</SelectItem>
                              <SelectItem value="Deal Pipeline">Deal Pipeline</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex justify-end">
                          <Button onClick={() => setActiveTab("conditions")}>
                            Next: Conditions
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                    
                    {/* Conditions Tab */}
                    <TabsContent value="conditions" className="space-y-4 py-4">
                      <div className="grid gap-4">
                        <div>
                          <Label className="mb-2 block">Conditions</Label>
                          <p className="text-sm text-muted-foreground mb-4">
                            Define conditions that must be met for this automation to run.
                          </p>
                          
                          <div className="space-y-2 mb-4">
                            {(editingAutomation?.conditions || newAutomation.conditions || []).map((condition, index) => (
                              <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 className="h-4 w-4 text-primary" />
                                  <span>{condition}</span>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleRemoveCondition(index)}
                                >
                                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                                </Button>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex gap-2">
                            <Input
                              placeholder="e.g., File name contains 'Capital Call'"
                              value={currentCondition}
                              onChange={(e) => setCurrentCondition(e.target.value)}
                              className="flex-1"
                            />
                            <Button onClick={handleAddCondition}>Add Condition</Button>
                          </div>
                        </div>
                        
                        <div className="flex justify-between">
                          <Button variant="outline" onClick={() => setActiveTab("trigger")}>
                            Back
                          </Button>
                          <Button onClick={() => setActiveTab("actions")}>
                            Next: Actions
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                    
                    {/* Actions Tab */}
                    <TabsContent value="actions" className="space-y-4 py-4">
                      <div className="grid gap-4">
                        <div>
                          <Label className="mb-2 block">Actions</Label>
                          <p className="text-sm text-muted-foreground mb-4">
                            Define the actions that will be performed when conditions are met.
                          </p>
                          
                          <div className="space-y-2 mb-4">
                            {(editingAutomation?.actions || newAutomation.actions || []).map((action, index) => (
                              <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                                <div className="flex items-center gap-2">
                                  <Zap className="h-4 w-4 text-primary" />
                                  <span>{action}</span>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleRemoveAction(index)}
                                >
                                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                                </Button>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex gap-2">
                            <Input
                              placeholder="e.g., Create task titled 'Review Capital Call'"
                              value={currentAction}
                              onChange={(e) => setCurrentAction(e.target.value)}
                              className="flex-1"
                            />
                            <Button onClick={handleAddAction}>Add Action</Button>
                          </div>
                        </div>
                        
                        <div className="flex justify-between">
                          <Button variant="outline" onClick={() => setActiveTab("conditions")}>
                            Back
                          </Button>
                          <Button onClick={editingAutomation ? handleEditAutomation : handleCreateAutomation}>
                            {editingAutomation ? "Update Automation" : "Create Automation"}
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
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
                <TableHead className="w-[250px]">Automation</TableHead>
                <TableHead className="min-w-[300px]">Description</TableHead>
                <TableHead className="w-[120px] text-center">Status</TableHead>
                <TableHead className="w-[150px]">Trigger</TableHead>
                <TableHead className="w-[150px]">Workflow</TableHead>
                <TableHead className="w-[100px] text-center">Executions</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {automations.map((automation) => (
                <TableRow 
                  key={automation.id} 
                  className="hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleRowClick(automation)}
                >
                  <TableCell>
                    <div className="font-medium">{automation.name}</div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground leading-relaxed">
                      {automation.description}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center items-center">
                      <Badge variant={getStatusColor(automation.status)} className="capitalize">
                        {React.createElement(automation.triggerIcon, { className: "h-3 w-3 mr-1" })}
                        {automation.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {React.createElement(automation.triggerIcon, { className: "h-4 w-4 text-muted-foreground" })}
                      <span className="text-sm">{automation.triggerType}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{automation.workflowType || "—"}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="font-mono text-xs">
                      {automation.executionCount.toLocaleString()}
                    </Badge>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditClick(automation)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleStatus(automation.id)}>
                          {automation.status === 'active' ? (
                            <>
                              <PauseCircle className="h-4 w-4 mr-2" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <PlayCircle className="h-4 w-4 mr-2" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteAutomation(automation.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
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
    </Card>
  )
} 