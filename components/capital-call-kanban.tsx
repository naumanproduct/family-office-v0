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

interface CapitalCallKanbanProps {
  workflowConfig?: {
    attributes: Array<{ id: string; name: string; type: string }>
    stages: Array<{ id: string; name: string; color: string }>
  }
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
        return <span className="font-medium">{value}</span>
      default:
        return value
    }
  }

  return (
    <>
      <Card
        className="cursor-pointer hover:shadow-md transition-all duration-200 border-gray-200 hover:border-gray-300"
        onClick={() => setSelectedTask(capitalCallTask)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm text-gray-900 truncate">{capitalCall.fundName}</h4>
              <p className="text-xs text-gray-500 mt-1">{capitalCall.callNumber}</p>
              {isOverdue && (
                <Badge variant="destructive" className="mt-2 text-xs">
                  <AlertCircleIcon className="h-3 w-3 mr-1" />
                  Overdue
                </Badge>
              )}
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
        <CardContent className="pt-0 space-y-2">
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

      {selectedTask && (
        <Sheet open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
          <SheetContent side="right" className="flex w-full max-w-2xl flex-col p-0 sm:max-w-2xl [&>button]:hidden">
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
    <div ref={setNodeRef} style={style} {...dndAttributes} {...listeners} className="touch-manipulation">
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

export function CapitalCallKanban({ workflowConfig }: CapitalCallKanbanProps) {
  const [capitalCalls, setCapitalCalls] = React.useState(initialCapitalCalls)
  const [activeCapitalCall, setActiveCapitalCall] = React.useState<CapitalCall | null>(null)
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
    if (!stagesList.some((s) => s.id === overId)) {
      const targetCapitalCall = capitalCalls.find((c) => c.id === overId)
      if (targetCapitalCall) {
        targetStage = targetCapitalCall.stage
      }
    }

    // Update the capital call's stage if it's different
    if (activeCapitalCall.stage !== targetStage && stagesList.some((s) => s.id === targetStage)) {
      setCapitalCalls(
        capitalCalls.map((capitalCall) =>
          capitalCall.id === activeId ? { ...capitalCall, stage: targetStage } : capitalCall,
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

  const capitalCallsByStage = stagesList.map((stage) => ({
    stage,
    capitalCalls: capitalCalls.filter((capitalCall) => capitalCall.stage === stage.id),
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
      <AddColumnDialog open={addColumnDialogOpen} onOpenChange={setAddColumnDialogOpen} onAddColumn={handleAddColumn} />
    </DndContext>
  )
}
