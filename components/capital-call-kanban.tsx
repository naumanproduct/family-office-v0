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
  PhoneIcon,
  GlobeIcon,
  TrendingUpIcon,
  FileTextIcon,
  FolderIcon,
  ClockIcon,
  AlertCircleIcon,
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
]

const stages = [
  { id: "new", title: "New", color: "bg-gray-100" },
  { id: "in-progress", title: "In Progress", color: "bg-blue-100" },
  { id: "done", title: "Done", color: "bg-green-100" },
]

// Replace the CapitalCallCard component with this new implementation that opens the task drawer
function CapitalCallCard({ capitalCall }: { capitalCall: CapitalCall }) {
  const isOverdue = new Date(capitalCall.dueDate) < new Date() && capitalCall.stage !== "done"

  // Create a task object that matches the structure expected by TaskDetailsView
  const capitalCallTask = {
    id: capitalCall.id,
    title: "Capital Call",
    description: `Process capital call for ${capitalCall.fundName}`,
    priority: "High",
    status: capitalCall.stage === "done" ? "Completed" : capitalCall.stage === "in-progress" ? "In Progress" : "To Do",
    assignee: "You",
    dueDate: capitalCall.dueDate,
    subtasks: [
      {
        id: "CC-1",
        title: "Review Capital Call Notice PDF",
        description: "Open and understand key terms (amount, due date)",
        status: "Completed",
        priority: "High",
        assignee: "You",
        dueDate: new Date(new Date(capitalCall.dueDate).getTime() - 5 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      },
      {
        id: "CC-2",
        title: "Validate with Principal",
        description: "Confirm LP or internal commitment matches",
        status: "Completed",
        priority: "High",
        assignee: "You",
        dueDate: new Date(new Date(capitalCall.dueDate).getTime() - 4 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      },
      {
        id: "CC-3",
        title: "Record in System",
        description: "Log in accounting system or ledger",
        status: capitalCall.stage === "done" || capitalCall.stage === "in-progress" ? "Completed" : "In Progress",
        priority: "Medium",
        assignee: "You",
        dueDate: new Date(new Date(capitalCall.dueDate).getTime() - 3 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      },
      {
        id: "CC-4",
        title: "Notify Accountant",
        description: "Forward or tag accountant for payment setup",
        status: capitalCall.stage === "done" ? "Completed" : "To Do",
        priority: "Medium",
        assignee: "Sarah Johnson",
        dueDate: new Date(new Date(capitalCall.dueDate).getTime() - 2 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      },
      {
        id: "CC-5",
        title: "Confirm Wire Date",
        description: "Align on when funds will be sent",
        status: capitalCall.stage === "done" ? "Completed" : "To Do",
        priority: "High",
        assignee: "You",
        dueDate: new Date(new Date(capitalCall.dueDate).getTime() - 1 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      },
      {
        id: "CC-6",
        title: "Follow-Up if Not Funded",
        description: "If deadline passes, notify appropriate party",
        status: capitalCall.stage === "done" ? "Completed" : "To Do",
        priority: "Medium",
        assignee: "You",
        dueDate: new Date(new Date(capitalCall.dueDate).getTime() + 1 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      },
      {
        id: "CC-7",
        title: "Mark as Complete",
        description: "Close the call internally",
        status: capitalCall.stage === "done" ? "Completed" : "To Do",
        priority: "Low",
        assignee: "You",
        dueDate: new Date(new Date(capitalCall.dueDate).getTime() + 2 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      },
    ],
  }

  const [selectedTask, setSelectedTask] = React.useState<any>(null)

  return (
    <>
      <Card
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setSelectedTask(capitalCallTask)}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-sm">{capitalCall.fundName}</h4>
              <p className="text-xs text-muted-foreground">{capitalCall.callNumber}</p>
              {isOverdue && (
                <Badge variant="destructive" className="mt-1 text-xs">
                  <AlertCircleIcon className="h-3 w-3 mr-1" />
                  Overdue
                </Badge>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-6 w-6">
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
        <CardContent className="pt-0 space-y-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs">
              <DollarSignIcon className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-medium">{capitalCall.callAmount}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <TrendingUpIcon className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Commitment:</span>
              <span>{capitalCall.commitmentAmount}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <UserIcon className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Investor:</span>
              <span>{capitalCall.investor}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <CalendarIcon className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Due:</span>
              <span className={isOverdue ? "text-red-600 font-medium" : ""}>{capitalCall.dueDate}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <ClockIcon className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Notice:</span>
              <span>{capitalCall.noticeDate}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedTask && (
        <Sheet open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
          <SheetContent side="right" className="flex w-full max-w-4xl flex-col p-0 sm:max-w-4xl [&>button]:hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => setSelectedTask(null)}>
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <Badge variant="outline" className="bg-background">
                  Task
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

            {/* Task Details View */}
            <TaskDetailsView
              task={selectedTask}
              onBack={() => setSelectedTask(null)}
              recordName={capitalCall.fundName}
            />
          </SheetContent>
        </Sheet>
      )}
    </>
  )
}

function SortableCapitalCallCard({ capitalCall }: { capitalCall: CapitalCall }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: capitalCall.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-manipulation">
      <CapitalCallCard capitalCall={capitalCall} />
    </div>
  )
}

// Add this new component to render the capital call drawer content
function CapitalCallDrawerContent({ capitalCall }: { capitalCall: CapitalCall }) {
  const [activeTab, setActiveTab] = React.useState("details")

  const tabs = [
    { id: "details", label: "Details", count: null, icon: FileTextIcon },
    { id: "documents", label: "Documents", count: 8, icon: FolderIcon },
    { id: "communications", label: "Communications", count: 12, icon: MailIcon },
    { id: "history", label: "History", count: 6, icon: CalendarIcon },
    { id: "notes", label: "Notes", count: 3, icon: FileTextIcon },
  ]

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => document.querySelector('[data-state="open"]')?.click()}>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Badge variant="outline" className="bg-background">
            {capitalCall.fundName}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <ExpandIcon className="h-4 w-4" />
            Full screen
          </Button>
          <Button variant="outline" size="sm">
            <MailIcon className="h-4 w-4" />
            Send reminder
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Record Header */}
        <div className="border-b bg-background px-6 py-2">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
              {capitalCall.fundName.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-semibold">{capitalCall.fundName}</h2>
              <p className="text-sm text-muted-foreground">
                {capitalCall.callNumber} • {capitalCall.fundType}
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
              <h4 className="text-sm font-medium">Capital Call Details</h4>

              <div className="rounded-lg border border-muted bg-muted/10 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <BuildingIcon className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground">Fund Name</Label>
                        <p className="text-sm font-medium">{capitalCall.fundName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground">Call Number</Label>
                        <p className="text-sm">{capitalCall.callNumber}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground">Call Amount</Label>
                        <p className="text-sm font-medium">{capitalCall.callAmount}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground">Total Commitment</Label>
                        <p className="text-sm">{capitalCall.commitmentAmount}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground">Investor</Label>
                        <p className="text-sm">{capitalCall.investor}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <BuildingIcon className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground">Fund Manager</Label>
                        <p className="text-sm">{capitalCall.fundManager}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground">Due Date</Label>
                        <p className="text-sm">{capitalCall.dueDate}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <ClockIcon className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground">Notice Date</Label>
                        <p className="text-sm">{capitalCall.noticeDate}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <GlobeIcon className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground">Website</Label>
                        <p className="text-sm text-blue-600">{capitalCall.website}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <MailIcon className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground">Email</Label>
                        <p className="text-sm text-blue-600">{capitalCall.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground">Phone</Label>
                        <p className="text-sm">{capitalCall.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground">Fund Type</Label>
                        <p className="text-sm">{capitalCall.fundType}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-start gap-2">
                    <FileTextIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Purpose</Label>
                      <p className="text-sm">{capitalCall.purpose}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <Label className="text-xs text-muted-foreground">Fund Size</Label>
                      <p className="text-sm font-medium">{capitalCall.totalFundSize}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Vintage</Label>
                      <p className="text-sm font-medium">{capitalCall.vintage}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Previous Calls</Label>
                      <p className="text-sm font-medium">{capitalCall.previousCalls}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Remaining</Label>
                      <p className="text-sm font-medium">{capitalCall.remainingCommitment}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>
                No {activeTab} found for {capitalCall.fundName}
              </p>
              <p className="text-sm">Add some {activeTab} to get started</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function DroppableColumn({ stage, capitalCalls }: { stage: (typeof stages)[0]; capitalCalls: CapitalCall[] }) {
  const { setNodeRef, isOver } = useSortable({
    id: stage.id,
  })

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col min-h-[600px] w-80 ${isOver ? "ring-2 ring-primary ring-opacity-50 bg-muted/20" : ""}`}
    >
      <div className={`rounded-t-lg p-3 ${stage.color}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-sm">{stage.title}</h3>
            <Badge variant="secondary" className="h-5 w-5 rounded-full p-0 text-xs">
              {capitalCalls.length}
            </Badge>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <PlusIcon className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="flex-1 bg-gray-50 rounded-b-lg p-3 space-y-3">
        <SortableContext items={capitalCalls.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {capitalCalls.map((capitalCall) => (
            <SortableCapitalCallCard key={capitalCall.id} capitalCall={capitalCall} />
          ))}
        </SortableContext>
      </div>
    </div>
  )
}

export function CapitalCallKanban() {
  const [capitalCalls, setCapitalCalls] = React.useState(initialCapitalCalls)
  const [activeCapitalCall, setActiveCapitalCall] = React.useState<CapitalCall | null>(null)

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
    const capitalCall = capitalCalls.find((c) => c.id === activeId)
    if (capitalCall) {
      setActiveCapitalCall(capitalCall)
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveCapitalCall(null)
    const { active, over } = event

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeCapitalCall = capitalCalls.find((c) => c.id === activeId)
    if (!activeCapitalCall) return

    // Find which stage the item is being dropped on
    let targetStage = overId

    // If dropping on another capital call, find its stage
    if (!stages.some((s) => s.id === overId)) {
      const targetCapitalCall = capitalCalls.find((c) => c.id === overId)
      if (targetCapitalCall) {
        targetStage = targetCapitalCall.stage
      }
    }

    // Update the capital call's stage if it's different
    if (activeCapitalCall.stage !== targetStage && stages.some((s) => s.id === targetStage)) {
      setCapitalCalls(
        capitalCalls.map((capitalCall) =>
          capitalCall.id === activeId ? { ...capitalCall, stage: targetStage } : capitalCall,
        ),
      )
    }
  }

  const capitalCallsByStage = stages.map((stage) => ({
    stage,
    capitalCalls: capitalCalls.filter((capitalCall) => capitalCall.stage === stage.id),
  }))

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {capitalCallsByStage.map(({ stage, capitalCalls }) => (
          <DroppableColumn key={stage.id} stage={stage} capitalCalls={capitalCalls} />
        ))}
      </div>
      <DragOverlay>
        {activeCapitalCall ? (
          <div className="w-80 opacity-80 shadow-lg">
            <CapitalCallCard capitalCall={activeCapitalCall} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
