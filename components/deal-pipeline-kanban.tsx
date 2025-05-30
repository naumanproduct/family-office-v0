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
import { OpportunityNameCell, type Opportunity } from "./opportunities-table"

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

const stages = [
  { id: "awareness", title: "Awareness", color: "bg-gray-100" },
  { id: "initial-contact", title: "Initial Contact", color: "bg-blue-100" },
  { id: "work-in-progress", title: "Work in Progress", color: "bg-yellow-100" },
  { id: "term-sheet", title: "Term Sheet", color: "bg-purple-100" },
  { id: "due-diligence", title: "Due Diligence", color: "bg-orange-100" },
  { id: "invested", title: "Invested", color: "bg-green-100" },
  { id: "passed", title: "Passed", color: "bg-red-100" },
]

// Separate the card UI from the sortable wrapper
function DealCard({ deal }: { deal: Deal }) {
  // Convert deal to opportunity format
  const opportunity: Opportunity = {
    id: Number.parseInt(deal.id),
    name: `${deal.fundingRound} Investment - ${deal.companyName}`,
    company: {
      name: deal.companyName,
      type: "Issuer",
    },
    contact: {
      name: deal.owner,
      role: "Deal Owner",
    },
    legalEntity: {
      name: "Investment Fund",
      type: "Investment Vehicle",
    },
    stage:
      deal.stage === "awareness"
        ? "Initial Contact"
        : deal.stage === "initial-contact"
          ? "Proposal"
          : deal.stage === "work-in-progress"
            ? "Due Diligence"
            : deal.stage === "term-sheet"
              ? "Term Sheet"
              : deal.stage === "due-diligence"
                ? "Due Diligence"
                : deal.stage === "invested"
                  ? "Closed Won"
                  : deal.stage === "passed"
                    ? "Closed Lost"
                    : "Initial Contact",
    amount: deal.targetRaise,
    probability:
      deal.stage === "awareness"
        ? 20
        : deal.stage === "initial-contact"
          ? 40
          : deal.stage === "work-in-progress"
            ? 60
            : deal.stage === "term-sheet"
              ? 80
              : deal.stage === "due-diligence"
                ? 85
                : deal.stage === "invested"
                  ? 100
                  : deal.stage === "passed"
                    ? 0
                    : 30,
    expectedClose: deal.nextMeeting || "TBD",
    lastActivity: "2 days ago",
    priority: "High",
    status: deal.stage === "invested" ? "Closed" : deal.stage === "passed" ? "Cancelled" : "Active",
    description: deal.description || `${deal.fundingRound} investment opportunity in ${deal.sector}`,
    fundingRound: deal.fundingRound,
    valuation: deal.valuation || "TBD",
    sector: deal.sector,
    geography: "North America",
  }

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex-1" onClick={(e) => e.stopPropagation()}>
              <OpportunityNameCell opportunity={opportunity} />
              <p className="text-xs text-muted-foreground mt-1">{deal.sector}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-6 w-6">
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
        <CardContent className="pt-0 space-y-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs">
              <TrendingUpIcon className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Funding:</span>
              <span>{deal.fundingRound}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <DollarSignIcon className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Target:</span>
              <span>{deal.targetRaise}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <UserIcon className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Owner:</span>
              <span>{deal.owner}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <MapPinIcon className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Location:</span>
              <span>{deal.location}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <CalendarIcon className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Next:</span>
              <span>{deal.nextMeeting}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function SortableDealCard({ deal }: { deal: Deal }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: deal.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-manipulation">
      <DealCard deal={deal} />
    </div>
  )
}

function DroppableColumn({ stage, deals }: { stage: (typeof stages)[0]; deals: Deal[] }) {
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
              {deals.length}
            </Badge>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <PlusIcon className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="flex-1 bg-gray-50 rounded-b-lg p-3 space-y-3">
        <SortableContext items={deals.map((d) => d.id)} strategy={verticalListSortingStrategy}>
          {deals.map((deal) => (
            <SortableDealCard key={deal.id} deal={deal} />
          ))}
        </SortableContext>
      </div>
    </div>
  )
}

export function DealPipelineKanban() {
  const [deals, setDeals] = React.useState(initialDeals)
  const [activeDeal, setActiveDeal] = React.useState<Deal | null>(null)

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
    if (!stages.some((s) => s.id === overId)) {
      const targetDeal = deals.find((d) => d.id === overId)
      if (targetDeal) {
        targetStage = targetDeal.stage
      }
    }

    // Update the deal's stage if it's different
    if (activeDeal.stage !== targetStage && stages.some((s) => s.id === targetStage)) {
      setDeals(deals.map((deal) => (deal.id === activeId ? { ...deal, stage: targetStage } : deal)))
    }
  }

  const dealsByStage = stages.map((stage) => ({
    stage,
    deals: deals.filter((deal) => deal.stage === stage.id),
  }))

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {dealsByStage.map(({ stage, deals }) => (
          <DroppableColumn key={stage.id} stage={stage} deals={deals} />
        ))}
      </div>
      <DragOverlay>
        {activeDeal ? (
          <div className="w-80 opacity-80 shadow-lg">
            <DealCard deal={activeDeal} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
