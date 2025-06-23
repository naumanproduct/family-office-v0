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
  DollarSignIcon,
  CalendarIcon,
  UserIcon,
  FileTextIcon,
  AlertCircleIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  UsersIcon,
  FolderIcon,
  BuildingIcon,
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
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { TaskDetailsView } from "@/components/task-details-view"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { MasterDrawer } from "./master-drawer"
import { TabContentRenderer } from "@/components/shared/tab-content-renderer"
import { buildWorkflowDetailsPanel } from "@/components/shared/workflow-details-helper"
import { generateWorkflowActivities } from "@/components/shared/activity-generators"

interface CapitalCall {
  id: string
  fundName: string
  callNumber: string
  callAmount: string
  commitmentAmount: string
  dueDate: string
  noticeDate: string
  investor: string
  stage: string
  // Additional fields for detailed view
  description?: string
  fundManager?: string
  email?: string
  phone?: string
  website?: string
  fundType?: string
  vintage?: string
  totalFundSize?: string
  remainingCommitment?: string
  previousCalls?: string
  purpose?: string
}

const initialCapitalCalls: CapitalCall[] = [
  {
    id: "1",
    fundName: "TechVentures Fund III",
    callNumber: "Call #4",
    callAmount: "$2.5M",
    commitmentAmount: "$10M",
    dueDate: "2024-02-15",
    noticeDate: "2024-01-15",
    investor: "Pension Fund Alpha",
    stage: "new",
    description: "Capital call for follow-on investments in portfolio companies",
    fundManager: "TechVentures Management",
    email: "capital@techventures.com",
    phone: "+1 (555) 123-4567",
    website: "techventures.com",
    fundType: "Venture Capital",
    vintage: "2022",
    totalFundSize: "$100M",
    remainingCommitment: "$7.5M",
    previousCalls: "3",
    purpose: "Follow-on investments and management fees",
  },
  {
    id: "2",
    fundName: "Growth Equity Partners II",
    callNumber: "Call #2",
    callAmount: "$5M",
    commitmentAmount: "$25M",
    dueDate: "2024-02-20",
    noticeDate: "2024-01-20",
    investor: "Insurance Corp Beta",
    stage: "in-progress",
    description: "Capital call for new investment opportunities",
    fundManager: "Growth Equity Management",
    email: "calls@growthequity.com",
    phone: "+1 (555) 234-5678",
    website: "growthequity.com",
    fundType: "Growth Equity",
    vintage: "2023",
    totalFundSize: "$200M",
    remainingCommitment: "$20M",
    previousCalls: "1",
    purpose: "New investments and operating expenses",
  },
  {
    id: "3",
    fundName: "Real Estate Fund IV",
    callNumber: "Call #6",
    callAmount: "$3.2M",
    commitmentAmount: "$15M",
    dueDate: "2024-02-10",
    noticeDate: "2024-01-10",
    investor: "Endowment Fund Gamma",
    stage: "in-progress",
    description: "Capital call for property acquisition",
    fundManager: "Real Estate Partners",
    email: "capital@realestate.com",
    phone: "+1 (555) 345-6789",
    website: "realestate.com",
    fundType: "Real Estate",
    vintage: "2021",
    totalFundSize: "$150M",
    remainingCommitment: "$11.8M",
    previousCalls: "5",
    purpose: "Property acquisition and development",
  },
  {
    id: "4",
    fundName: "Infrastructure Fund I",
    callNumber: "Call #3",
    callAmount: "$8M",
    commitmentAmount: "$40M",
    dueDate: "2024-02-25",
    noticeDate: "2024-01-25",
    investor: "Sovereign Wealth Fund",
    stage: "in-progress",
    description: "Capital call for infrastructure project funding",
    fundManager: "Infrastructure Capital",
    email: "calls@infrastructure.com",
    phone: "+1 (555) 456-7890",
    website: "infrastructure.com",
    fundType: "Infrastructure",
    vintage: "2023",
    totalFundSize: "$300M",
    remainingCommitment: "$32M",
    previousCalls: "2",
    purpose: "Infrastructure project development",
  },
  {
    id: "5",
    fundName: "Private Credit Fund II",
    callNumber: "Call #5",
    callAmount: "$4.5M",
    commitmentAmount: "$20M",
    dueDate: "2024-01-30",
    noticeDate: "2024-01-01",
    investor: "Family Office Delta",
    stage: "done",
    description: "Capital call for credit facility deployment",
    fundManager: "Private Credit Partners",
    email: "capital@privatecredit.com",
    phone: "+1 (555) 567-8901",
    website: "privatecredit.com",
    fundType: "Private Credit",
    vintage: "2022",
    totalFundSize: "$180M",
    remainingCommitment: "$15.5M",
    previousCalls: "4",
    purpose: "Credit facility deployment and fees",
  },
  {
    id: "6",
    fundName: "Growth Fund III",
    callNumber: "Call #1",
    callAmount: "$6M",
    commitmentAmount: "$30M",
    dueDate: "2024-07-15",
    noticeDate: "2024-06-15",
    investor: "Institutional Investor Epsilon",
    stage: "new",
    description: "Initial capital call for Growth Fund III to finance early investments",
    fundManager: "Growth Equity Management",
    email: "calls@growthfund.com",
    phone: "+1 (555) 678-9012",
    website: "growthfund.com",
    fundType: "Growth Equity",
    vintage: "2024",
    totalFundSize: "$400M",
    remainingCommitment: "$24M",
    previousCalls: "0",
    purpose: "Initial investments and fees",
  },
]

interface CapitalCallKanbanProps {
  workflowConfig?: {
    attributes: Array<{ id: string; name: string; type: string }>
    stages: Array<{ id: string; name: string; color: string }>
  }
  initialCalls?: CapitalCall[]
}

// Default stages if no config provided
const defaultStages = [
  { id: "new", name: "New", color: "bg-gray-100" },
  { id: "in-progress", name: "In Progress", color: "bg-blue-100" },
  { id: "done", name: "Done", color: "bg-green-100" },
]

// Default attributes if no config provided
const defaultAttributes = [
  { id: "fundName", name: "Fund Name", type: "text" },
  { id: "callAmount", name: "Call Amount", type: "currency" },
  { id: "investor", name: "Investor", type: "text" },
  { id: "dueDate", name: "Due Date", type: "date" },
  { id: "noticeDate", name: "Notice Date", type: "date" },
]

// Replace the CapitalCallCard component with this new implementation that opens the task drawer
function CapitalCallCard({
  capitalCall,
  attributes = defaultAttributes,
}: {
  capitalCall: CapitalCall
  attributes?: Array<{ id: string; name: string; type: string }>
}) {
  // Define tabs for the drawer
  const tabs = [
    { id: "details", label: "Details", count: null, icon: FileTextIcon },
    { id: "contacts", label: "Contacts", count: 3, icon: UsersIcon },
    { id: "emails", label: "Emails", count: 2, icon: MailIcon },
    { id: "tasks", label: "Tasks", count: 2, icon: CheckCircleIcon },
    { id: "notes", label: "Notes", count: 2, icon: FileTextIcon },
    { id: "meetings", label: "Meetings", count: 2, icon: CalendarIcon },
    { id: "files", label: "Files", count: 2, icon: FolderIcon },
    { id: "activity", label: "Activity", count: null, icon: CalendarIcon },
  ]

  // Move state hooks outside of detailsPanel
  const [openSections, setOpenSections] = React.useState<{
    details: boolean;
    fund: boolean;
    contacts: boolean;
    financials: boolean;
  }>({
    details: true, // Details expanded by default
    fund: false,
    contacts: false,
    financials: false,
  });

  // Add state for showing all values
  const [showingAllValues, setShowingAllValues] = React.useState(false);

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
      case "date":
        const isOverdueDate = attribute.id === "dueDate" && new Date(value) < new Date() && capitalCall.stage !== "done"
        return <span className={isOverdueDate ? "text-red-600 font-medium" : ""}>{value}</span>
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

  // Build details panel with mock data for every record
  const detailsPanel = buildWorkflowDetailsPanel({
    infoTitle: "Workflow Information",
    infoFields: [
      { label: "Fund", value: capitalCall.fundName },
      { label: "Call #", value: capitalCall.callNumber },
      { label: "Call Amount", value: capitalCall.callAmount },
      { label: "Commitment", value: capitalCall.commitmentAmount },
      { label: "Due Date", value: capitalCall.dueDate },
      { label: "Notice Date", value: capitalCall.noticeDate },
      { label: "Investor", value: capitalCall.investor },
    ],
    // Generic related data so every drawer has something to show
    companies: [
      { id: 1, name: capitalCall.fundManager || `${capitalCall.fundName} Manager`, type: "Fund Manager" },
    ],
    entities: [
      { id: 1, name: `${capitalCall.fundName}, L.P.`, type: "Fund Entity" },
    ],
    people: [
      { id: 1, name: "Alex Johnson", role: "Investor Relations" },
      { id: 2, name: "Jamie Lee", role: "Portfolio Manager" },
    ],
    opportunities: [
      { id: 1, name: `${capitalCall.fundName} – Follow-on Round`, type: "Opportunity" },
    ],
    investments: [
      { id: 1, name: `${capitalCall.fundName} Sidecar`, type: "Co-Investment" },
      { id: 2, name: `${capitalCall.fundName} Parallel Fund`, type: "Parallel Vehicle" },
    ],
    activities: generateWorkflowActivities(),
  });

  // Create children function for tabs
  const renderTabContent = (
    activeTab: string,
    viewMode: "card" | "list" | "table",
    setSelectedTask?: (task: any) => void,
    setSelectedNote?: (note: any) => void,
    setSelectedMeeting?: (meeting: any) => void,
    setSelectedEmail?: (email: any) => void,
  ) => {
    // ---------- Generate generic mock data for each tab ----------
    const tasks = [
      {
        id: 1,
        title: `Prepare notice for ${capitalCall.fundName}`,
        priority: "High",
        status: "pending",
        assignee: "You",
        dueDate: capitalCall.dueDate,
        description: `Draft and review the capital call notice for ${capitalCall.fundName}.`,
        relatedTo: { type: "Capital Call", name: capitalCall.fundName },
      },
      {
        id: 2,
        title: `Update capital schedule – ${capitalCall.callNumber}`,
        priority: "Medium",
        status: "pending",
        assignee: "Finance Team",
        dueDate: capitalCall.dueDate,
        description: "Reflect the new call in the fund's capital schedule.",
        relatedTo: { type: "Capital Call", name: capitalCall.fundName },
      },
    ];

    const notes = [
      { id: 1, title: "Call rationale", author: "You", date: capitalCall.noticeDate, tags: ["call"] },
      { id: 2, title: "Fee breakdown", author: "Controller", date: capitalCall.noticeDate, tags: ["fees"] },
    ];

    const emails = [
      { id: 1, subject: "Capital call draft", from: "admin@fund.com", date: capitalCall.noticeDate, status: "Read" },
      { id: 2, subject: "Questions on commitment", from: "investor@fund.com", date: capitalCall.noticeDate, status: "Unread" },
    ];

    const meetings = [
      { id: 1, title: "Internal review", date: capitalCall.noticeDate, time: "9:00 AM", status: "Scheduled", attendees: ["You", "Finance Team"] },
      { id: 2, title: "Investor Q&A", date: capitalCall.dueDate, time: "11:00 AM", status: "Planned", attendees: ["Investor Relations"] },
    ];

    const files = [
      { id: 1, name: `${capitalCall.fundName.replace(/ /g, "")}_CallNotice.pdf`, uploadedBy: "You", uploadedDate: capitalCall.noticeDate, size: "1.2 MB" },
    ];

    const contacts = [
      { id: 1, name: "Alex Johnson", role: "Investor Relations", email: "alex@fund.com", phone: "+1 (555) 123-0000" },
      { id: 2, name: "Jamie Lee", role: "Fund Manager", email: "jamie@fund.com", phone: "+1 (555) 123-1111" },
    ];

    const dataMap: Record<string, any[]> = { tasks, notes, emails, meetings, files, contacts };

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
    );
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
                <h4 className="font-semibold text-sm text-gray-900 truncate cursor-pointer group-hover:underline">{capitalCall.fundName}</h4>
                <p className="text-xs text-gray-500 mt-1">{capitalCall.callNumber}</p>
                {/* Removed overdue badge */}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-600">
                    <MoreVerticalIcon className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">Cancel Call</DropdownMenuItem>
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
                const value = (capitalCall as any)[attribute.id]

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
      title={capitalCall.fundName}
      recordType="Capital Calls"
      subtitle={`${capitalCall.callNumber} • ${capitalCall.callAmount}`}
      tabs={tabs}
      detailsPanel={detailsPanel}
    >
      {renderTabContent}
    </MasterDrawer>
  )
}

function SortableCapitalCallCard({
  capitalCall,
  attributes,
}: {
  capitalCall: CapitalCall
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
    id: capitalCall.id,
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
      <CapitalCallCard capitalCall={capitalCall} attributes={attributes} />
    </div>
  )
}

function DroppableColumn({
  stage,
  capitalCalls,
  attributes,
}: {
  stage: { id: string; name: string; color: string }
  capitalCalls: CapitalCall[]
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
            <Badge variant="secondary" className="h-5 w-5 rounded-full p-0 text-xs bg-white/80 text-gray-700">
              {capitalCalls.length}
            </Badge>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-500 hover:text-gray-700">
            <PlusIcon className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="flex-1 bg-gray-50/50 rounded-b-xl border-l border-r border-b border-gray-200 p-3 space-y-3">
        <SortableContext items={capitalCalls.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {capitalCalls.map((capitalCall) => (
            <SortableCapitalCallCard key={capitalCall.id} capitalCall={capitalCall} attributes={attributes} />
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
        <PlusIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

// Add column dialog
function AddColumnDialog({
  open,
  onOpenChange,
  onAddColumn,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddColumn: (name: string, color: string) => void
}) {
  const [columnName, setColumnName] = React.useState("")
  const [columnColor, setColumnColor] = React.useState("bg-gray-100")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (columnName.trim()) {
      onAddColumn(columnName.trim(), columnColor)
      setColumnName("")
      onOpenChange(false)
    }
  }

  const colorOptions = [
    { id: "bg-gray-100", label: "Gray" },
    { id: "bg-blue-100", label: "Blue" },
    { id: "bg-green-100", label: "Green" },
    { id: "bg-yellow-100", label: "Yellow" },
    { id: "bg-purple-100", label: "Purple" },
    { id: "bg-red-100", label: "Red" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Column</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="column-name">Column Name</Label>
            <Input
              id="column-name"
              placeholder="Enter column name"
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label>Column Color</Label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <div
                  key={color.id}
                  className={`w-8 h-8 rounded-full cursor-pointer border-2 ${color.id} ${
                    columnColor === color.id ? "border-primary" : "border-transparent"
                  }`}
                  onClick={() => setColumnColor(color.id)}
                  title={color.label}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit">Add Column</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Main component export
export function CapitalCallKanban({ workflowConfig, initialCalls }: CapitalCallKanbanProps) {
  const [capitalCalls, setCapitalCalls] = React.useState(initialCalls || initialCapitalCalls)
  const [activeId, setActiveId] = React.useState<string | null>(null)
  const [addColumnDialogOpen, setAddColumnDialogOpen] = React.useState(false)
  
  // Use config or defaults
  const stages = workflowConfig?.stages || defaultStages
  const attributes = workflowConfig?.attributes || defaultAttributes
  
  // Get capital calls grouped by stage
  const capitalCallsByStage = stages.map((stage) => ({
    stage,
    capitalCalls: capitalCalls.filter((call) => call.stage === stage.id),
  }))
  
  // Get the active capital call for drag overlay
  const activeCapitalCall = activeId ? capitalCalls.find((call) => call.id === activeId) : null
  
  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  )
  
  // Handle drag start
  const handleDragStart = (event: DragEndEvent) => {
    const { active } = event
    setActiveId(active.id as string)
  }
  
  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (over && active.id !== over.id) {
      // Find the stage that was dropped on
      const targetStage = stages.find((stage) => stage.id === over.id)
      
      if (targetStage) {
        // Update the capital call's stage
        setCapitalCalls((prev) =>
          prev.map((call) => (call.id === active.id ? { ...call, stage: targetStage.id } : call))
        )
      }
    }
    
    setActiveId(null)
  }
  
  // Handle adding a new column
  const handleAddColumn = (name: string, color: string) => {
    const newStageId = name.toLowerCase().replace(/\s+/g, '-')
    const newStage = {
      id: newStageId,
      name,
      color,
    }
    
    if (workflowConfig && workflowConfig.stages) {
      workflowConfig.stages.push(newStage)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {capitalCallsByStage.map(({ stage, capitalCalls }) => (
          <DroppableColumn key={stage.id} stage={stage} capitalCalls={capitalCalls} attributes={attributes} />
        ))}
        <AddColumnButton onAddColumn={() => setAddColumnDialogOpen(true)} />
      </div>
      <DragOverlay>
        {activeCapitalCall ? (
          <div className="w-80 opacity-80 shadow-lg">
            <CapitalCallCard capitalCall={activeCapitalCall} attributes={attributes} />
          </div>
        ) : null}
      </DragOverlay>
      <AddColumnDialog 
        open={addColumnDialogOpen} 
        onOpenChange={setAddColumnDialogOpen} 
        onAddColumn={handleAddColumn} 
      />
    </DndContext>
  )
}
