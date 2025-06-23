"use client"

import * as React from "react"
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core"
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  MoreVerticalIcon,
  PlusIcon,
  ExpandIcon,
  ChevronLeftIcon,
  MailIcon,
  BuildingIcon,
  DollarSignIcon,
  CalendarIcon,
  UserIcon,
  TrendingUpIcon,
  FileTextIcon,
  UsersIcon,
  CheckCircleIcon,
  FolderIcon,
  ChevronDown,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { opportunitiesData, type Opportunity } from "./opportunities-table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { buildWorkflowDetailsPanel } from "@/components/shared/workflow-details-helper";

// Default stages if no config provided
const defaultStages = [
  { id: "initial-contact", name: "Initial Contact", color: "bg-gray-100" },
  { id: "proposal", name: "Proposal", color: "bg-blue-100" },
  { id: "due-diligence", name: "Due Diligence", color: "bg-yellow-100" },
  { id: "term-sheet", name: "Term Sheet", color: "bg-purple-100" },
  { id: "closed-won", name: "Closed Won", color: "bg-green-100" },
  { id: "closed-lost", name: "Closed Lost", color: "bg-red-100" },
]

// Default attributes for opportunities
const defaultAttributes = [
  { id: "name", name: "Name", type: "text" },
  { id: "company", name: "Company", type: "relation" },
  { id: "contact", name: "Contact", type: "relation" },
  { id: "amount", name: "Amount", type: "currency" },
  { id: "probability", name: "Probability", type: "number" },
  { id: "expectedClose", name: "Expected Close", type: "date" },
]

// Convert stage names to match kanban IDs
const normalizeStage = (stage: string): string => {
  return stage.toLowerCase().replace(/\s+/g, "-")
}

interface OpportunityKanbanProps {
  workflowConfig?: {
    attributes: Array<{ id: string; name: string; type: string }>
    stages: Array<{ id: string; name: string; color: string }>
  }
}

// Separate the card UI from the sortable wrapper
function OpportunityCard({
  opportunity,
}: {
  opportunity: Opportunity
}) {
  // Determine opportunity stage
  const opportunityStage =
    opportunity.stage === "lead"
      ? "Lead"
      : opportunity.stage === "discovery"
      ? "Discovery"
      : opportunity.stage === "proposal"
      ? "Proposal"
      : opportunity.stage === "negotiation"
      ? "Negotiation"
      : opportunity.stage === "closed-won"
      ? "Closed Won"
      : "Closed Lost"

  // Define tabs for the drawer
  const tabs = [
    { id: "details", label: "Details", count: null, icon: FileTextIcon },
    { id: "tasks", label: "Tasks", count: 2, icon: CheckCircleIcon },
    { id: "notes", label: "Notes", count: 3, icon: FileTextIcon },
    { id: "emails", label: "Emails", count: 5, icon: MailIcon },
    { id: "files", label: "Files", count: 1, icon: FolderIcon },
    { id: "activity", label: "Activity", count: null, icon: CalendarIcon },
  ]

  // Move state hooks outside of detailsPanel
  const [openSections, setOpenSections] = React.useState<{
    details: boolean;
    company: boolean;
    financials: boolean;
    contacts: boolean;
  }>({
    details: true, // Details expanded by default
    company: false,
    financials: false,
    contacts: false,
  });

  // Add state for showing all values
  const [showingAllValues, setShowingAllValues] = React.useState(false);

  // Create details panel function
  const detailsPanel = () => buildWorkflowDetailsPanel({
                infoTitle: "Workflow Information",
                infoFields: [],
              });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="bg-white dark:bg-gray-950 rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
          <div className="p-4">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-medium truncate">{opportunity.name}</h3>
              <Badge variant={opportunity.stage === "closed-won" ? "default" : opportunity.stage === "closed-lost" ? "destructive" : "outline"}>
                {opportunityStage}
              </Badge>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Company:</span>
                <span className="font-medium text-foreground">{opportunity.company.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Value:</span>
                <span className="font-medium text-foreground">${opportunity.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Probability:</span>
                <span className="font-medium text-foreground">{opportunity.probability}%</span>
              </div>
              <div className="flex justify-between">
                <span>Close Date:</span>
                <span className="font-medium text-foreground">
                  {new Date(opportunity.expectedClose).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md p-0 overflow-y-auto">
        <MasterDrawer
          title={opportunity.name}
          subtitle={opportunity.company.name}
          tabs={tabs}
          detailsPanel={detailsPanel}
        />
      </SheetContent>
    </Sheet>
  );
}

function SortableOpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: opportunity.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  }

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners} 
      className="touch-manipulation"
      suppressHydrationWarning
    >
      <OpportunityCard opportunity={opportunity} />
    </div>
  )
}

function OpportunityDrawerContent({ opportunity }: { opportunity: Opportunity }) {
  const [activeTab, setActiveTab] = React.useState("details")

  const tabs = [
    { id: "details", label: "Details", count: null, icon: FileTextIcon },
    { id: "contacts", label: "Contacts", count: 3, icon: UsersIcon },
    { id: "emails", label: "Emails", count: 8, icon: MailIcon },
    { id: "tasks", label: "Tasks", count: 5, icon: CheckCircleIcon },
    { id: "notes", label: "Notes", count: 12, icon: FileTextIcon },
    { id: "meetings", label: "Meetings", count: 4, icon: CalendarIcon },
    { id: "files", label: "Files", count: 7, icon: FolderIcon },
    { id: "activity", label: "Activity", count: null, icon: CalendarIcon },
  ]

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => {
            const element = document.querySelector('[data-state="open"]');
            if (element && element instanceof HTMLElement) {
              element.click();
            }
          }}>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Badge variant="outline" className="bg-background">
            {opportunity.name}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <ExpandIcon className="h-4 w-4" />
            Full screen
          </Button>
          <Button variant="outline" size="sm">
            <MailIcon className="h-4 w-4" />
            Compose email
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Record Header */}
        <div className="border-b bg-background px-6 py-2">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
              {opportunity.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-semibold">{opportunity.name}</h2>
              <p className="text-sm text-muted-foreground">
                {opportunity.company.name} • {opportunity.stage}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b bg-background px-6">
          <div className="flex gap-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative whitespace-nowrap py-3 text-sm font-medium flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.icon && <tab.icon className="h-4 w-4" />}
                {tab.label}
                {tab.count !== null && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                    {tab.count}
                  </Badge>
                )}
                {activeTab === tab.id && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"></span>}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "details" ? (
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Opportunity Details</h4>

              <div className="rounded-lg border border-muted bg-muted/10 p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Opportunity Name</Label>
                      <p className="text-sm font-medium">{opportunity.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <BuildingIcon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Company ({opportunity.company.type})</Label>
                      <p className="text-sm">{opportunity.company.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <UsersIcon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Contact (Deal Sponsor)</Label>
                      <p className="text-sm">{opportunity.contact.name}</p>
                      <p className="text-xs text-muted-foreground">{opportunity.contact.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Legal Entity (Investing Party)</Label>
                      <p className="text-sm">{opportunity.legalEntity.name}</p>
                      <p className="text-xs text-muted-foreground">{opportunity.legalEntity.type}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Investment Amount</Label>
                      <p className="text-sm">{opportunity.amount}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Expected Close</Label>
                      <p className="text-sm">{opportunity.expectedClose}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Probability</Label>
                      <p className="text-sm">{opportunity.probability}%</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <FileTextIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Description</Label>
                      <p className="text-sm">{opportunity.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>
                No {activeTab} found for {opportunity.name}
              </p>
              <p className="text-sm">Add some {activeTab} to get started</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function DroppableColumn({ stage, opportunities }: { stage: { id: string; name: string; color: string }; opportunities: Opportunity[] }) {
  const { setNodeRef, isOver } = useSortable({
    id: stage.id,
  })

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col min-h-[600px] w-80 transition-all duration-200 ${isOver ? "ring-2 ring-blue-500 ring-opacity-30 bg-blue-50/20" : ""}`}
    >
      <div className={`rounded-t-xl p-4 border border-gray-200 ${stage.color}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-sm text-gray-900">{stage.name}</h3>
            <Badge variant="secondary" className="h-5 w-5 rounded-full p-0 text-xs bg-white/80 text-gray-700">
              {opportunities.length}
            </Badge>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-500 hover:text-gray-700">
            <PlusIcon className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="flex-1 bg-gray-50/50 rounded-b-xl border-l border-r border-b border-gray-200 p-3 space-y-3">
        <SortableContext items={opportunities.map((o) => o.id.toString())} strategy={verticalListSortingStrategy}>
          {opportunities.map((opportunity) => (
            <SortableOpportunityCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </SortableContext>
      </div>
    </div>
  )
}

// Add Column Button Component
function AddColumnButton({ onAddColumn }: { onAddColumn: () => void }) {
  return (
    <div className="flex items-center justify-center w-16">
      <Button
        variant="ghost"
        size="icon"
        className="h-12 w-12 rounded-full border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors"
        onClick={onAddColumn}
      >
        <PlusIcon className="h-5 w-5 text-gray-400" />
      </Button>
    </div>
  )
}

// New dialog for adding a column
function AddColumnDialog({
  open,
  onOpenChange,
  onAddColumn,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddColumn: (name: string, color: string) => void
}) {
  const [name, setName] = React.useState("")
  const [color, setColor] = React.useState("bg-gray-100")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onAddColumn(name, color)
      setName("")
      onOpenChange(false)
    }
  }

  const colorOptions = [
    { value: "bg-gray-100", label: "Gray" },
    { value: "bg-blue-100", label: "Blue" },
    { value: "bg-green-100", label: "Green" },
    { value: "bg-yellow-100", label: "Yellow" },
    { value: "bg-purple-100", label: "Purple" },
    { value: "bg-red-100", label: "Red" },
    { value: "bg-orange-100", label: "Orange" },
    { value: "bg-pink-100", label: "Pink" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Column</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="column-name">Column Name</Label>
            <Input
              id="column-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., In Review"
              autoFocus
              className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <Label>Column Color</Label>
            <div className="grid grid-cols-4 gap-2">
              {colorOptions.map((option) => (
                <div
                  key={option.value}
                  className={`h-10 rounded-lg cursor-pointer ${option.value} border-2 transition-all ${
                    color === option.value
                      ? "border-blue-500 scale-105 shadow-sm"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setColor(option.value)}
                  title={option.label}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim()} className="bg-blue-600 hover:bg-blue-700">
              Add Column
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function OpportunitiesKanban({ workflowConfig }: OpportunityKanbanProps) {
  const [opportunities, setOpportunities] = React.useState(
    opportunitiesData.map((opp) => ({
      ...opp,
      stage: normalizeStage(opp.stage),
    })),
  )
  const [activeOpportunity, setActiveOpportunity] = React.useState<Opportunity | null>(null)
  const [stagesList, setStagesList] = React.useState(workflowConfig?.stages || defaultStages)
  const [addColumnDialogOpen, setAddColumnDialogOpen] = React.useState(false)

  // Update stages when workflow config changes
  React.useEffect(() => {
    if (workflowConfig?.stages) {
      setStagesList(workflowConfig.stages)
    }
  }, [workflowConfig?.stages])

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor),
  )

  function handleDragStart(event: any) {
    const { active } = event
    const activeId = active.id as string
    const opportunity = opportunities.find((o) => o.id.toString() === activeId)
    if (opportunity) {
      setActiveOpportunity(opportunity)
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveOpportunity(null)
    const { active, over } = event

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeOpportunity = opportunities.find((o) => o.id.toString() === activeId)
    if (!activeOpportunity) return

    // Find which stage the item is being dropped on
    let targetStage = overId

    // If dropping on another opportunity, find its stage
    if (!stagesList.some((s) => s.id === overId)) {
      const targetOpportunity = opportunities.find((o) => o.id.toString() === overId)
      if (targetOpportunity) {
        targetStage = targetOpportunity.stage
      }
    }

    // Update the opportunity's stage if it's different
    if (activeOpportunity.stage !== targetStage && stagesList.some((s) => s.id === targetStage)) {
      setOpportunities(
        opportunities.map((opportunity) =>
          opportunity.id.toString() === activeId ? { ...opportunity, stage: targetStage } : opportunity,
        ),
      )
    }
  }

  const handleAddColumn = (name: string, color: string) => {
    const newStage = {
      id: `stage-${Date.now()}`,
      name: name,
      color: color,
    }
    setStagesList([...stagesList, newStage])
  }

  const opportunitiesByStage = stagesList.map((stage) => ({
    stage,
    opportunities: opportunities.filter((opportunity) => opportunity.stage === stage.id),
  }))

  const attributes = workflowConfig?.attributes || defaultAttributes

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {opportunitiesByStage.map(({ stage, opportunities }) => (
          <DroppableColumn key={stage.id} stage={stage} opportunities={opportunities} />
        ))}
        <AddColumnButton onAddColumn={() => setAddColumnDialogOpen(true)} />
      </div>
      <DragOverlay>
        {activeOpportunity ? (
          <div className="w-80 opacity-80 shadow-lg">
            <OpportunityCard opportunity={activeOpportunity} />
          </div>
        ) : null}
      </DragOverlay>
      <AddColumnDialog open={addColumnDialogOpen} onOpenChange={setAddColumnDialogOpen} onAddColumn={handleAddColumn} />
    </DndContext>
  )
}
