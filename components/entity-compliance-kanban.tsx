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
  MapPinIcon,
  FileTextIcon,
  CheckCircleIcon,
  FolderIcon,
  AlertTriangleIcon,
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

interface ComplianceItem {
  id: string
  complianceType: string
  entity: string
  jurisdiction: string
  assignedTo: string
  dueDate: string
  stage: string
  // Additional fields for detailed view
  description?: string
  filedDate?: string
  filingFee?: string
  priority?: string
  requirements?: string[]
  notes?: string
}

const initialComplianceItems: ComplianceItem[] = [
  {
    id: "1",
    complianceType: "Annual Report",
    entity: "Venture Fund I LP",
    jurisdiction: "Delaware",
    assignedTo: "Sarah Johnson",
    dueDate: "2024-03-01",
    stage: "pending",
    description: "Annual report filing for Delaware LP",
    filingFee: "$300",
    priority: "High",
    requirements: ["Financial statements", "Partner information", "Registered agent confirmation"],
    notes: "Waiting for final financial statements",
  },
  {
    id: "2",
    complianceType: "Tax Filing",
    entity: "Growth Fund II LP",
    jurisdiction: "California",
    assignedTo: "Michael Chen",
    dueDate: "2024-04-15",
    stage: "in-progress",
    description: "State tax return filing",
    filingFee: "$800",
    priority: "Critical",
    requirements: ["Form 565", "K-1 schedules", "Payment voucher"],
    notes: "Tax preparation in progress",
  },
  {
    id: "3",
    complianceType: "Regulatory Update",
    entity: "Real Estate Fund LP",
    jurisdiction: "New York",
    assignedTo: "Lisa Wang",
    dueDate: "2024-02-28",
    stage: "under-review",
    description: "Investment adviser registration update",
    filingFee: "$150",
    priority: "Medium",
    requirements: ["Form ADV amendment", "Updated disclosure documents"],
    notes: "Pending legal review",
  },
  {
    id: "4",
    complianceType: "Board Resolution",
    entity: "Tech Fund III LP",
    jurisdiction: "Delaware",
    assignedTo: "David Kim",
    dueDate: "2024-03-15",
    stage: "approved",
    description: "Annual board resolutions",
    priority: "Low",
    requirements: ["Meeting minutes", "Signed resolutions", "Corporate records update"],
    notes: "Board meeting completed, filing pending",
  },
  {
    id: "5",
    complianceType: "Annual Report",
    entity: "Bond Fund LP",
    jurisdiction: "Nevada",
    assignedTo: "Jennifer Lee",
    dueDate: "2024-01-31",
    stage: "filed",
    description: "Nevada annual report filing",
    filedDate: "2024-01-28",
    filingFee: "$125",
    priority: "Medium",
    requirements: ["Annual report form", "Filing fee", "Registered agent info"],
    notes: "Successfully filed on time",
  },
  {
    id: "6",
    complianceType: "Tax Filing",
    entity: "Infrastructure Fund LP",
    jurisdiction: "Texas",
    assignedTo: "Robert Wilson",
    dueDate: "2024-01-15",
    stage: "overdue",
    description: "Franchise tax report",
    filingFee: "$300",
    priority: "Critical",
    requirements: ["Public information report", "Franchise tax payment"],
    notes: "OVERDUE - Penalties may apply",
  },
]

const stages = [
  { id: "pending", title: "Pending", color: "bg-gray-100" },
  { id: "in-progress", title: "In Progress", color: "bg-blue-100" },
  { id: "under-review", title: "Under Review", color: "bg-yellow-100" },
  { id: "approved", title: "Approved", color: "bg-green-100" },
  { id: "filed", title: "Filed", color: "bg-purple-100" },
  { id: "overdue", title: "Overdue", color: "bg-red-100" },
]

// Separate the card UI from the sortable wrapper
function ComplianceCard({ item }: { item: ComplianceItem }) {
  const isOverdue = item.stage === "overdue" || (new Date(item.dueDate) < new Date() && item.stage !== "filed")

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-sm">{item.complianceType}</h4>
                <p className="text-xs text-muted-foreground">{item.jurisdiction}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreVerticalIcon className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Assign to User</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">Mark as Cancelled</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <BuildingIcon className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Entity:</span>
                <span>{item.entity}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <UserIcon className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Assigned:</span>
                <span>{item.assignedTo}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Due:</span>
                <span>{item.dueDate}</span>
                {isOverdue && <AlertTriangleIcon className="h-3 w-3 text-red-500" />}
              </div>
              {item.filedDate && (
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircleIcon className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Filed:</span>
                  <span>{item.filedDate}</span>
                </div>
              )}
              {item.filingFee && (
                <div className="flex items-center gap-2 text-xs">
                  <DollarSignIcon className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Fee:</span>
                  <span>{item.filingFee}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </SheetTrigger>
      <SheetContent side="right" className="flex w-full max-w-4xl flex-col p-0 sm:max-w-4xl [&>button]:hidden">
        <ComplianceDrawerContent item={item} />
      </SheetContent>
    </Sheet>
  )
}

function SortableComplianceCard({ item }: { item: ComplianceItem }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-manipulation">
      <ComplianceCard item={item} />
    </div>
  )
}

function ComplianceDrawerContent({ item }: { item: ComplianceItem }) {
  const [activeTab, setActiveTab] = React.useState("details")

  const tabs = [
    { id: "details", label: "Details", count: null, icon: FileTextIcon },
    { id: "requirements", label: "Requirements", count: item.requirements?.length || 0, icon: CheckCircleIcon },
    { id: "history", label: "History", count: 4, icon: CalendarIcon },
    { id: "files", label: "Files", count: 3, icon: FolderIcon },
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
            {item.complianceType}
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
              {item.complianceType.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-semibold">{item.complianceType}</h2>
              <p className="text-sm text-muted-foreground">
                {item.entity} • {item.jurisdiction}
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
              <h4 className="text-sm font-medium">Compliance Details</h4>

              <div className="rounded-lg border border-muted bg-muted/10 p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Compliance Type</Label>
                      <p className="text-sm font-medium">{item.complianceType}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <BuildingIcon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Entity</Label>
                      <p className="text-sm">{item.entity}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Jurisdiction</Label>
                      <p className="text-sm">{item.jurisdiction}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Assigned To</Label>
                      <p className="text-sm">{item.assignedTo}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Due Date</Label>
                      <p className="text-sm">{item.dueDate}</p>
                    </div>
                  </div>

                  {item.filedDate && (
                    <div className="flex items-center gap-2">
                      <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground">Filed Date</Label>
                        <p className="text-sm">{item.filedDate}</p>
                      </div>
                    </div>
                  )}

                  {item.filingFee && (
                    <div className="flex items-center gap-2">
                      <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground">Filing Fee</Label>
                        <p className="text-sm">{item.filingFee}</p>
                      </div>
                    </div>
                  )}

                  {item.description && (
                    <div className="flex items-start gap-2">
                      <FileTextIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground">Description</Label>
                        <p className="text-sm">{item.description}</p>
                      </div>
                    </div>
                  )}

                  {item.notes && (
                    <div className="flex items-start gap-2">
                      <FileTextIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground">Notes</Label>
                        <p className="text-sm">{item.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : activeTab === "requirements" && item.requirements ? (
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Requirements</h4>
              <div className="space-y-2">
                {item.requirements.map((requirement, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 rounded border">
                    <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{requirement}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>
                No {activeTab} found for {item.complianceType}
              </p>
              <p className="text-sm">Add some {activeTab} to get started</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function DroppableColumn({ stage, items }: { stage: (typeof stages)[0]; items: ComplianceItem[] }) {
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
              {items.length}
            </Badge>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <PlusIcon className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="flex-1 bg-gray-50 rounded-b-lg p-3 space-y-3">
        <SortableContext items={items.map((d) => d.id)} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <SortableComplianceCard key={item.id} item={item} />
          ))}
        </SortableContext>
      </div>
    </div>
  )
}

export function EntityComplianceKanban() {
  const [items, setItems] = React.useState(initialComplianceItems)
  const [activeItem, setActiveItem] = React.useState<ComplianceItem | null>(null)

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
    const item = items.find((d) => d.id === activeId)
    if (item) {
      setActiveItem(item)
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveItem(null)
    const { active, over } = event

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeItem = items.find((d) => d.id === activeId)
    if (!activeItem) return

    // Find which stage the item is being dropped on
    let targetStage = overId

    // If dropping on another item, find its stage
    if (!stages.some((s) => s.id === overId)) {
      const targetItem = items.find((d) => d.id === overId)
      if (targetItem) {
        targetStage = targetItem.stage
      }
    }

    // Update the item's stage if it's different
    if (activeItem.stage !== targetStage && stages.some((s) => s.id === targetStage)) {
      setItems(items.map((item) => (item.id === activeId ? { ...item, stage: targetStage } : item)))
    }
  }

  const itemsByStage = stages.map((stage) => ({
    stage,
    items: items.filter((item) => item.stage === stage.id),
  }))

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {itemsByStage.map(({ stage, items }) => (
          <DroppableColumn key={stage.id} stage={stage} items={items} />
        ))}
      </div>
      <DragOverlay>
        {activeItem ? (
          <div className="w-80 opacity-80 shadow-lg">
            <ComplianceCard item={activeItem} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
