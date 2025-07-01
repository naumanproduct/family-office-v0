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
  DollarSignIcon,
  CalendarIcon,
  UserIcon,
  MapPinIcon,
  TrendingUpIcon,
  FileTextIcon,
  FileIcon,
  UsersIcon,
  CheckCircleIcon,
  FolderIcon,
  MailIcon,
  BuildingIcon,
  ChevronDownIcon,
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
import { MasterDrawer } from "./master-drawer"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { TabContentRenderer } from "@/components/shared/tab-content-renderer"
import { UnifiedDetailsPanel } from "@/components/shared/unified-details-panel"
import { buildStandardDetailSections } from "@/components/shared/detail-section-builder"
import { UnifiedActivitySection } from "@/components/shared/unified-activity-section"
import { generateWorkflowActivities } from "@/components/shared/activity-generators"

interface Deal {
  id: string
  companyName: string
  sector: string
  fundingRound: string
  targetRaise: string
  owner: string
  stage: string
  // Additional fields for detailed view
  description?: string
  location?: string
  website?: string
  phone?: string
  email?: string
  lastContact?: string
  nextMeeting?: string
  valuation?: string
  revenue?: string
  employees?: string
}

const initialDeals: Deal[] = [
  {
    id: "1",
    companyName: "TechFlow Solutions",
    sector: "SaaS",
    fundingRound: "Series A",
    targetRaise: "$5M",
    owner: "Sarah Chen",
    stage: "awareness",
    description: "AI-powered workflow automation platform for enterprise clients",
    location: "San Francisco, CA",
    website: "techflow.com",
    phone: "+1 (555) 123-4567",
    email: "contact@techflow.com",
    lastContact: "2024-01-15",
    nextMeeting: "2024-01-22",
    valuation: "$20M",
    revenue: "$2M ARR",
    employees: "45",
  },
  {
    id: "2",
    companyName: "GreenEnergy Corp",
    sector: "CleanTech",
    fundingRound: "Seed",
    targetRaise: "$2M",
    owner: "Mike Rodriguez",
    stage: "initial-contact",
    description: "Solar panel efficiency optimization using machine learning",
    location: "Austin, TX",
    website: "greenenergy.com",
    phone: "+1 (555) 234-5678",
    email: "info@greenenergy.com",
    lastContact: "2024-01-18",
    nextMeeting: "2024-01-25",
    valuation: "$8M",
    revenue: "$500K ARR",
    employees: "12",
  },
  {
    id: "3",
    companyName: "HealthTech Innovations",
    sector: "HealthTech",
    fundingRound: "Series B",
    targetRaise: "$15M",
    owner: "Lisa Wang",
    stage: "work-in-progress",
    description: "Telemedicine platform with AI-powered diagnostics",
    location: "Boston, MA",
    website: "healthtech.com",
    phone: "+1 (555) 345-6789",
    email: "hello@healthtech.com",
    lastContact: "2024-01-20",
    nextMeeting: "2024-01-28",
    valuation: "$60M",
    revenue: "$8M ARR",
    employees: "120",
  },
  {
    id: "4",
    companyName: "FinanceAI",
    sector: "FinTech",
    fundingRound: "Series A",
    targetRaise: "$8M",
    owner: "David Kim",
    stage: "term-sheet",
    description: "AI-powered personal finance management and investment advice",
    location: "New York, NY",
    website: "financeai.com",
    phone: "+1 (555) 456-7890",
    email: "team@financeai.com",
    lastContact: "2024-01-22",
    nextMeeting: "2024-01-30",
    valuation: "$35M",
    revenue: "$3.5M ARR",
    employees: "65",
  },
]

interface DealPipelineKanbanProps {
  workflowConfig?: {
    attributes: Array<{ id: string; name: string; type: string }>
    stages: Array<{ id: string; name: string; color: string }>
  }
  initialDeals?: Deal[]
}

// Default stages if no config provided
const defaultStages = [
  { id: "awareness", name: "Awareness", color: "bg-gray-100" },
  { id: "initial-contact", name: "Initial Contact", color: "bg-blue-100" },
  { id: "work-in-progress", name: "Work in Progress", color: "bg-yellow-100" },
  { id: "term-sheet", name: "Term Sheet", color: "bg-purple-100" },
  { id: "due-diligence", name: "Due Diligence", color: "bg-orange-100" },
  { id: "invested", name: "Invested", color: "bg-green-100" },
  { id: "passed", name: "Passed", color: "bg-red-100" },
]

// Default attributes if no config provided
const defaultAttributes = [
  { id: "companyName", name: "Company", type: "text" },
  { id: "fundingRound", name: "Funding Round", type: "text" },
  { id: "targetRaise", name: "Target Raise", type: "currency" },
  { id: "owner", name: "Owner", type: "user" },
  { id: "nextMeeting", name: "Next Meeting", type: "date" },
]

// Separate the card UI from the sortable wrapper
function DealCard({
  deal,
  attributes = defaultAttributes,
}: {
  deal: Deal
  attributes?: Array<{ id: string; name: string; type: string }>
}) {
  // Determine opportunity stage
  const opportunityStage =
    deal.stage === "lead"
      ? "Lead"
      : deal.stage === "discovery"
      ? "Discovery"
      : deal.stage === "proposal"
      ? "Proposal"
      : deal.stage === "negotiation"
      ? "Negotiation"
      : deal.stage === "closed-won"
      ? "Closed Won"
      : deal.stage === "closed-lost"
      ? "Closed Lost"
      : "Initial Contact"

  // Create opportunity title
  const opportunityTitle = `${deal.fundingRound} Investment - ${deal.companyName}`

  // Create opportunity subtitle
  const opportunitySubtitle = `${deal.sector} • ${opportunityStage}`

  // Define tabs for the drawer
  const tabs = [
    { id: "details", label: "Details", count: null, icon: FileTextIcon },
    { id: "notes", label: "Notes", count: 2, icon: FileIcon },
    { id: "files", label: "Files", count: 2, icon: FileTextIcon },
    { id: "tasks", label: "Tasks", count: 2, icon: CheckCircleIcon },
    { id: "emails", label: "Emails", count: 2, icon: MailIcon },
    { id: "meetings", label: "Meetings", count: 2, icon: CalendarIcon },
    { id: "contacts", label: "Contacts", count: 3, icon: UsersIcon },
  ]

  // Create details panel function using shared builder
  const detailsPanel = (isFullScreen = false) => {
    const infoFields = [
      { label: "Company", value: deal.companyName },
      { label: "Funding Round", value: deal.fundingRound },
      { label: "Target Raise", value: deal.targetRaise },
      { label: "Owner", value: deal.owner },
      { label: "Stage", value: opportunityStage },
    ]

    // Provide mock related records only for the showcase deal
    const companies =
      deal.companyName === "TechFlow Solutions"
        ? [{ id: 1, name: "TechFlow Solutions", type: "Target Company" }]
        : []

    const entities =
      deal.companyName === "TechFlow Solutions"
        ? [
            {
              id: 1,
              name: "TechFlow Solutions Holdings LLC",
              type: "Holding Entity",
            },
          ]
        : []

    const investments =
      deal.companyName === "TechFlow Solutions"
        ? [
            {
              id: 1,
              name: "Series A – TechFlow Solutions",
              amount: "$15M",
              status: "Proposed",
            },
            {
              id: 2,
              name: "Seed Round – TechFlow Solutions",
              amount: "$3M",
              status: "Closed",
            },
          ]
        : []

    const opportunities =
      deal.companyName === "TechFlow Solutions"
        ? [
            {
              id: 1,
              name: "TechFlow Series A",
              type: "Investment Opportunity",
            },
          ]
        : []

    const sections = buildStandardDetailSections({
      infoTitle: "Workflow Information",
      infoIcon: <FileTextIcon className="h-4 w-4 text-muted-foreground" />,
      infoFields,
      companies,
      entities,
      investments,
      opportunities,
      people: [
        { id: 1, name: "Sarah Johnson", role: "CEO" },
        { id: 2, name: "Michael Chen", role: "CFO" },
      ],
    })

    return (
      <UnifiedDetailsPanel
        sections={sections}
        isFullScreen={isFullScreen}
        activityContent={<UnifiedActivitySection activities={generateWorkflowActivities()} />}
      />
    )
  }

  // Create children function for tabs
  const renderTabContent = (
    activeTab: string,
    viewMode: "card" | "list" | "table",
    setSelectedTask?: (task: any) => void,
    setSelectedNote?: (note: any) => void,
    setSelectedMeeting?: (meeting: any) => void,
    setSelectedEmail?: (email: any) => void,
  ) => {
    // Provide rich mock content only for TechFlow Solutions to showcase workflow container concept
    if (deal.companyName === "TechFlow Solutions") {
      // ------------------------------
      // Mock data definitions
      // ------------------------------
      const tasks = [
        {
          id: 1,
          title: "Review financials",
          priority: "High",
          status: "pending",
          assignee: "You",
          dueDate: "2024-07-01",
          description: "Review TechFlow Solutions' financial statements and KPIs.",
          relatedTo: { type: "Deal", name: "TechFlow Solutions" },
        },
        {
          id: 2,
          title: "Schedule meeting with founders",
          priority: "Medium",
          status: "pending",
          assignee: "Sarah Chen",
          dueDate: "2024-07-05",
          description: "Arrange a meeting to discuss valuation and next steps.",
          relatedTo: { type: "Deal", name: "TechFlow Solutions" },
        },
      ]

      const notes = [
        {
          id: 1,
          title: "Initial pitch notes",
          author: "You",
          date: "2024-06-15",
          tags: ["pitch", "AI"],
        },
        {
          id: 2,
          title: "Competitor analysis summary",
          author: "Sarah Johnson",
          date: "2024-06-20",
          tags: ["analysis"],
        },
      ]

      const emails = [
        {
          id: 1,
          subject: "Follow-up on financial model",
          from: "emily@techflow.com",
          date: "2024-06-21",
          status: "Read",
        },
        {
          id: 2,
          subject: "Data room access details",
          from: "investor_relations@techflow.com",
          date: "2024-06-22",
          status: "Unread",
        },
      ]

      const meetings = [
        {
          id: 1,
          title: "Product demo",
          date: "2024-06-25",
          time: "10:00 AM",
          status: "Scheduled",
          attendees: ["You", "Emily Zhang"],
        },
        {
          id: 2,
          title: "Financial deep-dive",
          date: "2024-07-02",
          time: "2:00 PM",
          status: "Planned",
          attendees: ["Michael Chen", "Founders"],
        },
      ]

      const files = [
        {
          id: 1,
          name: "TechFlow Pitch Deck.pdf",
          uploadedBy: "Emily Zhang",
          uploadedDate: "2024-06-15",
          size: "4.2 MB",
        },
        {
          id: 2,
          name: "Financial_Model.xlsx",
          uploadedBy: "You",
          uploadedDate: "2024-06-18",
          size: "220 KB",
        },
      ]

      const contacts = [
        {
          id: 1,
          name: "Emily Zhang",
          role: "Co-Founder & CEO",
          email: "emily@techflow.com",
          phone: "+1 (555) 123-4567",
        },
        {
          id: 2,
          name: "Jason Lee",
          role: "Co-Founder & CTO",
          email: "jason@techflow.com",
          phone: "+1 (555) 987-6543",
        },
        {
          id: 3,
          name: "Sarah Chen",
          role: "Deal Lead",
          email: "sarah.chen@familyoffice.com",
          phone: "+1 (555) 111-2222",
        },
      ]

      const dataMap: Record<string, any[]> = {
        tasks,
        notes,
        emails,
        meetings,
        files,
        contacts,
      }

      return (
        <TabContentRenderer
          activeTab={activeTab}
          viewMode={viewMode}
          data={dataMap[activeTab] || []}
          onTaskClick={setSelectedTask}
          onNoteClick={setSelectedNote}
          onMeetingClick={setSelectedMeeting}
          onEmailClick={setSelectedEmail}
        />
      )
    }

    // Default placeholder for other deals
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No {activeTab} found for this opportunity</p>
        <p className="text-sm">Add some {activeTab} to get started</p>
      </div>
    )
  }

  // Function to get the appropriate icon for each attribute type
  const getAttributeIcon = (type: string) => {
    switch (type) {
      case "currency":
        return DollarSignIcon
      case "date":
        return CalendarIcon
      case "user":
      case "relation":
        return UserIcon
      case "text":
      default:
        return FileTextIcon
    }
  }

  // Function to render attribute value based on type
  const renderAttributeValue = (attribute: any, value: any) => {
    if (!value) return "—"

    switch (attribute.type) {
      case "currency":
        return (
          <span
            className="font-medium outline-none hover:bg-primary/10 rounded-sm px-0.5 cursor-text transition-colors"
            contentEditable
            suppressContentEditableWarning
          >
            {value}
          </span>
        )
      default:
        return (
          <span
            className="outline-none hover:bg-primary/10 rounded-sm px-0.5 cursor-text transition-colors"
            contentEditable
            suppressContentEditableWarning
          >
            {value}
          </span>
        )
    }
  }

  return (
    <MasterDrawer
      trigger={
        <Card className="cursor-pointer hover:shadow-md transition-all duration-200 border-gray-200 hover:border-gray-300 group"
          onClick={(e) => e.stopPropagation()}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-gray-900 truncate cursor-pointer group-hover:underline">
                  {deal.companyName}
                </h4>
                <p className="text-xs text-gray-500 mt-1">{deal.sector}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-600">
                    <MoreVerticalIcon className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent
            className="pt-0 space-y-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-2">
              {attributes.map((attribute) => {
                const Icon = getAttributeIcon(attribute.type)
                const value = (deal as any)[attribute.id]

                if (!value) return null

                return (
                  <div key={attribute.id} className="flex items-center gap-2 text-xs">
                    <Icon className="h-3 w-3 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-500 truncate">{attribute.name}:</span>
                    <span className="truncate">{renderAttributeValue(attribute, value)}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      }
      title={opportunityTitle}
      recordType="Workflow"
      subtitle={opportunitySubtitle}
      tabs={tabs}
      children={renderTabContent}
      detailsPanel={detailsPanel}
      onComposeEmail={() => {}}
      activityContent={<UnifiedActivitySection activities={generateWorkflowActivities()} />}
    />
  )
}

function SortableDealCard({
  deal,
  attributes,
}: {
  deal: Deal
  attributes?: Array<{ id: string; name: string; type: string }>
}) {
  const {
    attributes: dndAttributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: deal.id,
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
      {...dndAttributes} 
      {...listeners} 
      className="touch-manipulation"
      suppressHydrationWarning
    >
      <DealCard deal={deal} attributes={attributes} />
    </div>
  )
}

function DroppableColumn({
  stage,
  deals,
  attributes,
}: {
  stage: { id: string; name: string; color: string }
  deals: Deal[]
  attributes?: Array<{ id: string; name: string; type: string }>
}) {
  const { setNodeRef, isOver } = useSortable({
    id: stage.id,
  })

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col min-h-[600px] w-80 transition-all duration-200 ${
        isOver ? "ring-2 ring-blue-500 ring-opacity-30 bg-blue-50/20" : ""
      }`}
    >
      <div className={`rounded-t-xl p-4 border border-gray-200 ${stage.color}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-sm text-gray-900">{stage.name}</h3>
            <Badge variant="secondary" className="h-5 w-5 rounded-full p-0 text-xs bg-white/80 text-gray-700 flex items-center justify-center">
              {deals.length}
            </Badge>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-500 hover:text-gray-700">
            <PlusIcon className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="flex-1 bg-gray-50/50 rounded-b-xl border-l border-r border-b border-gray-200 p-3 space-y-3">
        <SortableContext items={deals.map((d) => d.id)} strategy={verticalListSortingStrategy}>
          {deals.map((deal) => (
            <SortableDealCard key={deal.id} deal={deal} attributes={attributes} />
          ))}
        </SortableContext>
      </div>
    </div>
  )
}

// New component for adding a column
function AddColumnButton({ onAddColumn }: { onAddColumn: () => void }) {
  return (
    <div className="flex flex-col min-h-[600px] w-16 justify-center items-center">
      <Button
        variant="ghost"
        size="icon"
        className="h-12 w-12 rounded-full border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
        onClick={onAddColumn}
        title="Add Column"
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

export function DealPipelineKanban({ workflowConfig, initialDeals: propDeals }: DealPipelineKanbanProps) {
  const [deals, setDeals] = React.useState(propDeals || initialDeals)
  const [activeDeal, setActiveDeal] = React.useState<Deal | null>(null)
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
    const deal = deals.find((d) => d.id === activeId)
    if (deal) {
      setActiveDeal(deal)
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveDeal(null)
    const { active, over } = event

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeDeal = deals.find((d) => d.id === activeId)
    if (!activeDeal) return

    // Find which stage the item is being dropped on
    let targetStage = overId

    // If dropping on another deal, find its stage
    if (!stagesList.some((s) => s.id === overId)) {
      const targetDeal = deals.find((d) => d.id === overId)
      if (targetDeal) {
        targetStage = targetDeal.stage
      }
    }

    // Update the deal's stage if it's different
    if (activeDeal.stage !== targetStage && stagesList.some((s) => s.id === targetStage)) {
      setDeals(deals.map((deal) => (deal.id === activeId ? { ...deal, stage: targetStage } : deal)))
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

  const dealsByStage = stagesList.map((stage) => ({
    stage,
    deals: deals.filter((deal) => deal.stage === stage.id),
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
        {dealsByStage.map(({ stage, deals }) => (
          <DroppableColumn key={stage.id} stage={stage} deals={deals} attributes={attributes} />
        ))}
        <AddColumnButton onAddColumn={() => setAddColumnDialogOpen(true)} />
      </div>
      <DragOverlay>
        {activeDeal ? (
          <div className="w-80 opacity-80 shadow-lg">
            <DealCard deal={activeDeal} attributes={attributes} />
          </div>
        ) : null}
      </DragOverlay>
      <AddColumnDialog open={addColumnDialogOpen} onOpenChange={setAddColumnDialogOpen} onAddColumn={handleAddColumn} />
    </DndContext>
  )
}
