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

const stages = [
  { id: "initial-contact", title: "Initial Contact", color: "bg-gray-100" },
  { id: "proposal", title: "Proposal", color: "bg-blue-100" },
  { id: "due-diligence", title: "Due Diligence", color: "bg-yellow-100" },
  { id: "term-sheet", title: "Term Sheet", color: "bg-purple-100" },
  { id: "closed-won", title: "Closed Won", color: "bg-green-100" },
  { id: "closed-lost", title: "Closed Lost", color: "bg-red-100" },
]

// Convert stage names to match kanban IDs
const normalizeStage = (stage: string): string => {
  return stage.toLowerCase().replace(/\s+/g, "-")
}

// Separate the card UI from the sortable wrapper
function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-sm">{opportunity.name}</h4>
                <p className="text-xs text-muted-foreground">{opportunity.company.name}</p>
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
                <DollarSignIcon className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium">{opportunity.amount}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <TrendingUpIcon className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Probability:</span>
                <span>{opportunity.probability}%</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <UserIcon className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Contact:</span>
                <span>{opportunity.contact.name}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Close:</span>
                <span>{opportunity.expectedClose}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <BuildingIcon className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Entity:</span>
                <span>{opportunity.legalEntity.name}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </SheetTrigger>
      <SheetContent side="right" className="flex w-full max-w-4xl flex-col p-0 sm:max-w-4xl [&>button]:hidden">
        <OpportunityDrawerContent opportunity={opportunity} />
      </SheetContent>
    </Sheet>
  )
}

function SortableOpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: opportunity.id.toString(),
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-manipulation">
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
          <Button variant="ghost" size="icon" onClick={() => document.querySelector('[data-state="open"]')?.click()}>
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

function DroppableColumn({ stage, opportunities }: { stage: (typeof stages)[0]; opportunities: Opportunity[] }) {
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
              {opportunities.length}
            </Badge>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <PlusIcon className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="flex-1 bg-gray-50 rounded-b-lg p-3 space-y-3">
        <SortableContext items={opportunities.map((o) => o.id.toString())} strategy={verticalListSortingStrategy}>
          {opportunities.map((opportunity) => (
            <SortableOpportunityCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </SortableContext>
      </div>
    </div>
  )
}

export function OpportunitiesKanban() {
  const [opportunities, setOpportunities] = React.useState(
    opportunitiesData.map((opp) => ({
      ...opp,
      stage: normalizeStage(opp.stage),
    })),
  )
  const [activeOpportunity, setActiveOpportunity] = React.useState<Opportunity | null>(null)

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
    if (!stages.some((s) => s.id === overId)) {
      const targetOpportunity = opportunities.find((o) => o.id.toString() === overId)
      if (targetOpportunity) {
        targetStage = targetOpportunity.stage
      }
    }

    // Update the opportunity's stage if it's different
    if (activeOpportunity.stage !== targetStage && stages.some((s) => s.id === targetStage)) {
      setOpportunities(
        opportunities.map((opportunity) =>
          opportunity.id.toString() === activeId ? { ...opportunity, stage: targetStage } : opportunity,
        ),
      )
    }
  }

  const opportunitiesByStage = stages.map((stage) => ({
    stage,
    opportunities: opportunities.filter((opportunity) => opportunity.stage === stage.id),
  }))

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
      </div>
      <DragOverlay>
        {activeOpportunity ? (
          <div className="w-80 opacity-80 shadow-lg">
            <OpportunityCard opportunity={activeOpportunity} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
