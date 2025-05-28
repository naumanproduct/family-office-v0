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
  TrendingUpIcon,
  FileTextIcon,
  UsersIcon,
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
import { companiesData } from "./companies-table"

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
  // Find the corresponding company in companiesData
  const company = companiesData.find((c) => c.name === deal.companyName)

  if (!company) {
    // Fallback to the original card if company not found
    return (
      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-sm">{deal.companyName}</h4>
              <p className="text-xs text-muted-foreground">{deal.sector}</p>
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
    )
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-sm">{deal.companyName}</h4>
                <p className="text-xs text-muted-foreground">{deal.sector}</p>
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
      </SheetTrigger>
      <SheetContent side="right" className="flex w-full max-w-4xl flex-col p-0 sm:max-w-4xl [&>button]:hidden">
        {/* This will render the company drawer content */}
        <CompanyDrawerContent company={company} />
      </SheetContent>
    </Sheet>
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

// Add this new component to render the company drawer content
function CompanyDrawerContent({ company }: { company: any }) {
  const [activeTab, setActiveTab] = React.useState("details")

  const tabs = [
    { id: "details", label: "Details", count: null, icon: FileTextIcon },
    { id: "contacts", label: "Contacts", count: 5, icon: UsersIcon },
    { id: "emails", label: "Emails", count: 12, icon: MailIcon },
    { id: "tasks", label: "Tasks", count: 3, icon: CheckCircleIcon },
    { id: "notes", label: "Notes", count: 8, icon: FileTextIcon },
    { id: "meetings", label: "Meetings", count: 6, icon: CalendarIcon },
    { id: "files", label: "Files", count: 15, icon: FolderIcon },
    { id: "activity", label: "Activity", count: null, icon: CalendarIcon },
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
            {company.name}
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
              {company.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-semibold">{company.name}</h2>
              <p className="text-sm text-muted-foreground">
                {company.industry} • {company.stage}
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
              <h4 className="text-sm font-medium">Company Details</h4>

              <div className="rounded-lg border border-muted bg-muted/10 p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <BuildingIcon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Company Name</Label>
                      <p className="text-sm font-medium">{company.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Industry</Label>
                      <p className="text-sm">{company.industry}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Revenue</Label>
                      <p className="text-sm">{company.revenue}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <UsersIcon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Employees</Label>
                      <p className="text-sm">{company.employees}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <GlobeIcon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Website</Label>
                      <p className="text-sm text-blue-600">{company.website}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Location</Label>
                      <p className="text-sm">{company.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <FileTextIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Description</Label>
                      <p className="text-sm">{company.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>
                No {activeTab} found for {company.name}
              </p>
              <p className="text-sm">Add some {activeTab} to get started</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function DealDetails({ deal, isFullScreen }: { deal: Deal; isFullScreen: boolean }) {
  return (
    <div className="p-6">
      {/* Record Header */}
      <div className="border-b bg-background pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
            {deal.companyName.charAt(0)}
          </div>
          <div>
            <h2 className="text-lg font-semibold">{deal.companyName}</h2>
            <p className="text-sm text-muted-foreground">
              {deal.sector} • {deal.fundingRound}
            </p>
          </div>
        </div>
      </div>

      {/* Deal Details */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium">Deal Details</h4>

        <div className="rounded-lg border border-muted bg-muted/10 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <BuildingIcon className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Company</Label>
                  <p className="text-sm font-medium">{deal.companyName}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Funding Round</Label>
                  <p className="text-sm">{deal.fundingRound}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Target Raise</Label>
                  <p className="text-sm">{deal.targetRaise}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Deal Owner</Label>
                  <p className="text-sm">{deal.owner}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Location</Label>
                  <p className="text-sm">{deal.location}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <GlobeIcon className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Website</Label>
                  <p className="text-sm text-blue-600">{deal.website}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MailIcon className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <p className="text-sm text-blue-600">{deal.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Phone</Label>
                  <p className="text-sm">{deal.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Last Contact</Label>
                  <p className="text-sm">{deal.lastContact}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Next Meeting</Label>
                  <p className="text-sm">{deal.nextMeeting}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="flex items-start gap-2">
              <FileTextIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Description</Label>
                <p className="text-sm">{deal.description}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <Label className="text-xs text-muted-foreground">Valuation</Label>
                <p className="text-sm font-medium">{deal.valuation}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Revenue</Label>
                <p className="text-sm font-medium">{deal.revenue}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Employees</Label>
                <p className="text-sm font-medium">{deal.employees}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
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
