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
  PhoneIcon,
  GlobeIcon,
  ClipboardCheckIcon,
  FileTextIcon,
  ScaleIcon,
  ClockIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  FolderIcon,
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
  entityName: string
  itemType: string
  dueDate: string
  responsiblePerson: string
  priority: string
  stage: string
  // Additional fields for detailed view
  description?: string
  entityType?: string
  jurisdiction?: string
  filingFrequency?: string
  lastFiled?: string
  requirements?: string
  estimatedCost?: string
  notes?: string
  documents?: { name: string; url: string }[]
  relatedEntities?: string[]
}

const initialComplianceItems: ComplianceItem[] = [
  {
    id: "1",
    entityName: "Johnson Family Trust",
    itemType: "Annual Report",
    dueDate: "2024-03-31",
    responsiblePerson: "Sarah Chen",
    priority: "High",
    stage: "upcoming",
    description: "Annual report filing with Secretary of State",
    entityType: "Trust",
    jurisdiction: "Delaware",
    filingFrequency: "Annual",
    lastFiled: "2023-03-25",
    requirements: "Financial statements, trustee information, beneficiary updates",
    estimatedCost: "$350",
    notes: "Last year had a 10-day extension, may need one this year as well",
    documents: [
      { name: "Last year's filing", url: "#" },
      { name: "Filing instructions", url: "#" }
    ],
    relatedEntities: ["Johnson Holdings LLC"],
  },
  {
    id: "2",
    entityName: "Smith Investments LLC",
    itemType: "Tax Registration Renewal",
    dueDate: "2024-02-28",
    responsiblePerson: "Mike Rodriguez",
    priority: "Medium",
    stage: "in-progress",
    description: "Renewal of state tax registration",
    entityType: "Limited Liability Company",
    jurisdiction: "New York",
    filingFrequency: "Annual",
    lastFiled: "2023-02-15",
    requirements: "Entity information, member details, business activity description",
    estimatedCost: "$250",
    notes: "Need updated member information from John Smith",
    documents: [
      { name: "Renewal form template", url: "#" },
      { name: "Prior year registration", url: "#" }
    ],
    relatedEntities: ["Smith Family Trust"],
  },
  {
    id: "3",
    entityName: "Coastal Properties LLC",
    itemType: "Business License",
    dueDate: "2024-04-15",
    responsiblePerson: "Lisa Wang",
    priority: "High",
    stage: "review",
    description: "Renewal of business license for property management",
    entityType: "Limited Liability Company",
    jurisdiction: "Florida",
    filingFrequency: "Annual",
    lastFiled: "2023-04-10",
    requirements: "Property inventory, management certification, insurance verification",
    estimatedCost: "$500",
    notes: "Need updated insurance certificates for all properties",
    documents: [
      { name: "License application", url: "#" },
      { name: "Property inventory", url: "#" }
    ],
    relatedEntities: ["Johnson Family Trust", "Coastal Holdings Inc."],
  },
  {
    id: "4",
    entityName: "Johnson Holdings LLC",
    itemType: "Registered Agent Update",
    dueDate: "2024-01-31",
    responsiblePerson: "David Kim",
    priority: "Low",
    stage: "completed",
    description: "Update registered agent information with Secretary of State",
    entityType: "Limited Liability Company",
    jurisdiction: "Nevada",
    filingFrequency: "As needed",
    lastFiled: "2022-05-20",
    requirements: "New agent details, service address, consent forms",
    estimatedCost: "$150",
    notes: "Switching from individual agent to registered agent service",
    documents: [
      { name: "Agent change form", url: "#" },
      { name: "New agent consent", url: "#" }
    ],
    relatedEntities: ["Johnson Family Trust"],
  },
  {
    id: "5",
    entityName: "Johnson Family Foundation",
    itemType: "Form 990-PF",
    dueDate: "2024-05-15",
    responsiblePerson: "Sarah Chen",
    priority: "High",
    stage: "needs-attention",
    description: "IRS annual filing for private foundations",
    entityType: "Private Foundation",
    jurisdiction: "Federal",
    filingFrequency: "Annual",
    lastFiled: "2023-05-10",
    requirements: "Financial statements, grant details, investment information",
    estimatedCost: "$2,500",
    notes: "Missing information on two grants made in December 2023",
    documents: [
      { name: "Prior year 990-PF", url: "#" },
      { name: "Foundation financial statements", url: "#" }
    ],
    relatedEntities: ["Johnson Family Trust"],
  },
]

const stages = [
  { id: "upcoming", title: "Upcoming", color: "bg-blue-100" },
  { id: "in-progress", title: "In Progress", color: "bg-yellow-100" },
  { id: "review", title: "Review", color: "bg-purple-100" },
  { id: "needs-attention", title: "Needs Attention", color: "bg-red-100" },
  { id: "completed", title: "Completed", color: "bg-green-100" },
]

// Separate the card UI from the sortable wrapper
function ComplianceItemCard({ item }: { item: ComplianceItem }) {
  // Get appropriate icon based on priority
  const getPriorityIcon = () => {
    switch (item.priority.toLowerCase()) {
      case "high":
        return <AlertCircleIcon className="h-3 w-3 text-red-500" />
      case "medium":
        return <ClockIcon className="h-3 w-3 text-yellow-500" />
      case "low":
        return <CheckCircleIcon className="h-3 w-3 text-green-500" />
      default:
        return <ClockIcon className="h-3 w-3 text-muted-foreground" />
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-sm">{item.entityName}</h4>
                <p className="text-xs text-muted-foreground">{item.itemType}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreVerticalIcon className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Assign</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Due:</span>
                <span>{item.dueDate}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <ScaleIcon className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Jurisdiction:</span>
                <span>{item.jurisdiction}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <UserIcon className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Responsible:</span>
                <span>{item.responsiblePerson}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                {getPriorityIcon()}
                <span className="text-muted-foreground">Priority:</span>
                <span>{item.priority}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <ComplianceItemDetails item={item} isFullScreen={false} />
      </SheetContent>
    </Sheet>
  )
}

function SortableComplianceItemCard({ item }: { item: ComplianceItem }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    data: { type: "compliance-item", item },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ComplianceItemCard item={item} />
    </div>
  )
}

function ComplianceItemDetails({ item, isFullScreen }: { item: ComplianceItem; isFullScreen: boolean }) {
  const BackButton = isFullScreen ? (
    <Button variant="ghost" size="icon" className="h-8 w-8 mr-2">
      <ChevronLeftIcon className="h-4 w-4" />
    </Button>
  ) : null

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        {BackButton}
        <h2 className="text-xl font-semibold">{item.entityName}</h2>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Compliance Item Details</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          <div>
            <Label className="text-xs text-muted-foreground">Item Type</Label>
            <div className="text-sm font-medium">{item.itemType}</div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Entity Type</Label>
            <div className="text-sm font-medium">{item.entityType}</div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Due Date</Label>
            <div className="text-sm font-medium">{item.dueDate}</div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Priority</Label>
            <div className="text-sm font-medium">{item.priority}</div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Jurisdiction</Label>
            <div className="text-sm font-medium">{item.jurisdiction}</div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Filing Frequency</Label>
            <div className="text-sm font-medium">{item.filingFrequency}</div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Last Filed</Label>
            <div className="text-sm font-medium">{item.lastFiled}</div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Estimated Cost</Label>
            <div className="text-sm font-medium">{item.estimatedCost}</div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Description</h3>
        <p className="text-sm">{item.description}</p>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Requirements</h3>
        <p className="text-sm">{item.requirements}</p>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Related Entities</h3>
        <div className="flex flex-wrap gap-2">
          {item.relatedEntities?.map((entity, index) => (
            <Badge key={index} variant="secondary">
              {entity}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Documents</h3>
        <div className="space-y-2">
          {item.documents?.map((doc, index) => (
            <div key={index} className="flex items-center gap-2">
              <FileTextIcon className="h-4 w-4 text-muted-foreground" />
              <a href={doc.url} className="text-sm text-blue-600 hover:underline">
                {doc.name}
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Notes</h3>
        <p className="text-sm">{item.notes}</p>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Actions</h3>
        <div className="flex space-x-2">
          <Button size="sm">
            <ClipboardCheckIcon className="mr-2 h-4 w-4" />
            Mark Complete
          </Button>
          <Button size="sm" variant="outline">
            <FileTextIcon className="mr-2 h-4 w-4" />
            Add Document
          </Button>
        </div>
      </div>
    </div>
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
        <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <SortableComplianceItemCard key={item.id} item={item} />
          ))}
        </SortableContext>
      </div>
    </div>
  )
}

export function EntityComplianceKanban() {
  const [complianceItems, setComplianceItems] = React.useState(initialComplianceItems)
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
    useSensor(KeyboardSensor)
  )

  function handleDragStart(event: any) {
    const { active } = event
    const activeId = active.id as string
    const item = complianceItems.find((i) => i.id === activeId)
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

    const activeItem = complianceItems.find((i) => i.id === activeId)
    if (!activeItem) return

    // Find which stage the item is being dropped on
    let targetStage = overId

    // If dropping on another item, find its stage
    if (!stages.some((s) => s.id === overId)) {
      const targetItem = complianceItems.find((i) => i.id === overId)
      if (targetItem) {
        targetStage = targetItem.stage
      }
    }

    // Update the item's stage if it's different
    if (activeItem.stage !== targetStage && stages.some((s) => s.id === targetStage)) {
      setComplianceItems(complianceItems.map((item) => 
        (item.id === activeId ? { ...item, stage: targetStage } : item)
      ))
    }
  }

  const itemsByStage = stages.map((stage) => ({
    stage,
    items: complianceItems.filter((item) => item.stage === stage.id),
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
            <ComplianceItemCard item={activeItem} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
} 