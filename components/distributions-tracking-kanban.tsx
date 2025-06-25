"use client"

import * as React from "react"
import {
  DndContext,
  closestCenter,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  MoreVerticalIcon,
  PlusIcon,
  DollarSignIcon,
  CalendarIcon,
  UserIcon,
  FileTextIcon,
  FileIcon,
} from "lucide-react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MasterDrawer } from "./master-drawer"
import { Label } from "@/components/ui/label"
import { buildWorkflowDetailsPanel } from "@/components/shared/workflow-details-helper"
import { generateWorkflowActivities } from "@/components/shared/activity-generators"
import { TabContentRenderer } from "@/components/shared/tab-content-renderer"

interface Distribution {
  id: string
  fundName: string
  distributionNumber: string
  distributionAmount: string
  distributionDate: string
  investor: string
  stage: string
}

const initialDistributions: Distribution[] = [
  {
    id: "1",
    fundName: "Growth Fund II",
    distributionNumber: "Dist #5",
    distributionAmount: "$3.1M",
    distributionDate: "2024-07-01",
    investor: "Pension Fund Alpha",
    stage: "announced",
  },
  {
    id: "2",
    fundName: "TechVentures Fund III",
    distributionNumber: "Dist #2",
    distributionAmount: "$1.8M",
    distributionDate: "2024-06-20",
    investor: "Family Office Delta",
    stage: "in-progress",
  },
  {
    id: "3",
    fundName: "Real Estate Fund IV",
    distributionNumber: "Dist #7",
    distributionAmount: "$4.5M",
    distributionDate: "2024-06-15",
    investor: "Endowment Fund Gamma",
    stage: "sent",
  },
  {
    id: "4",
    fundName: "Infrastructure Fund I",
    distributionNumber: "Dist #1",
    distributionAmount: "$2.0M",
    distributionDate: "2024-06-10",
    investor: "Sovereign Wealth Fund",
    stage: "confirmed",
  },
]

const defaultStages = [
  { id: "announced", name: "Announced", color: "bg-gray-100" },
  { id: "in-progress", name: "In Progress", color: "bg-blue-100" },
  { id: "sent", name: "Sent", color: "bg-yellow-100" },
  { id: "confirmed", name: "Confirmed", color: "bg-green-100" },
]

const defaultAttributes = [
  { id: "fundName", name: "Fund", type: "text" },
  { id: "distributionAmount", name: "Amount", type: "currency" },
  { id: "distributionDate", name: "Date", type: "date" },
  { id: "investor", name: "Investor", type: "text" },
]

function DistributionCard({
  distribution,
  attributes = defaultAttributes,
}: {
  distribution: Distribution
  attributes?: any[]
}) {
  // Function to map type -> icon
  const getIcon = (type: string) => {
    switch (type) {
      case "currency":
        return DollarSignIcon
      case "date":
        return CalendarIcon
      case "user":
      case "relation":
        return UserIcon
      default:
        return FileTextIcon
    }
  }

  // Render attribute value
  const renderValue = (attribute: any, value: any) => {
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

  const detailsPanel = buildWorkflowDetailsPanel({
    infoTitle: "Workflow Information",
    infoFields: [
      { label: "Fund", value: distribution.fundName },
      { label: "Distribution #", value: distribution.distributionNumber },
      { label: "Amount", value: distribution.distributionAmount },
      { label: "Distribution Date", value: distribution.distributionDate },
      { label: "Investor", value: distribution.investor },
    ],
    companies:
      distribution.fundName === "Growth Fund II"
        ? [{ id: 1, name: "Growth Equity Partners", type: "Fund Manager" }]
        : [],
    entities:
      distribution.fundName === "Growth Fund II"
        ? [{ id: 1, name: "Growth Fund II, L.P.", type: "Fund Entity" }]
        : [],
    people:
      distribution.fundName === "Growth Fund II"
        ? [
            { id: 1, name: "Laura Kim", role: "Investor Relations" },
            { id: 2, name: "Richard Lee", role: "Controller" },
          ]
        : [],
    investments:
      distribution.fundName === "Growth Fund II"
        ? [
            { id: 1, name: "Series A – TechFlow Solutions", amount: "$3M", status: "Active" },
          ]
        : [],
    opportunities:
      distribution.fundName === "Growth Fund II"
        ? [
            { id: 1, name: "TechFlow Series A", type: "Investment Opportunity" },
          ]
        : [],
    activities: generateWorkflowActivities(),
  })

  // Drawer tabs identical to Deal Pipeline
  const tabs = [
    { id: "details", label: "Details", count: null, icon: FileTextIcon },
    { id: "notes", label: "Notes", count: 2, icon: FileIcon },
    { id: "files", label: "Files", count: 2, icon: FileTextIcon },
    { id: "tasks", label: "Tasks", count: 2, icon: FileTextIcon },
    { id: "emails", label: "Emails", count: 2, icon: CalendarIcon },
    { id: "meetings", label: "Meetings", count: 2, icon: CalendarIcon },
    { id: "contacts", label: "Contacts", count: 3, icon: UserIcon },
  ]

  // Children renderer with mock data for Growth Fund II as showcase
  const renderTabContent = (
    activeTab: string,
    viewMode: "card" | "list" | "table",
    setSelectedTask?: (task: any) => void,
    setSelectedNote?: (note: any) => void,
    setSelectedMeeting?: (meeting: any) => void,
    setSelectedEmail?: (email: any) => void,
  ) => {
    if (distribution.fundName === "Growth Fund II") {
      const tasks = [
        {
          id: 1,
          title: "Draft distribution notice",
          priority: "High",
          status: "pending",
          assignee: "You",
          dueDate: "2024-06-20",
          description: "Prepare and review the notice for Dist #5",
          relatedTo: { type: "Distribution", name: "Growth Fund II" },
        },
      ]
      const notes = [
        { id: 1, title: "Notice rationale", author: "Ops Team", date: "2024-06-10", tags: ["distribution"] },
      ]
      const emails = [
        { id: 1, subject: "Distribution draft", from: "admin@growthfund.com", date: "2024-06-11", status: "Read" },
      ]
      const meetings = [
        { id: 1, title: "Distribution approval call", date: "2024-06-15", time: "10:00", status: "Scheduled", attendees: ["You"] },
      ]
      const files = [
        { id: 1, name: "GFII_Dist5_Notice.pdf", uploadedBy: "You", uploadedDate: "2024-06-12", size: "1.1 MB" },
      ]
      const contacts = [
        { id: 1, name: "Laura Kim", role: "Investor Relations", email: "laura@growthfund.com", phone: "+1 (555) 123-4567" },
      ]

      const map: Record<string, any[]> = { tasks, notes, emails, meetings, files, contacts }

      return (
        <TabContentRenderer
          activeTab={activeTab}
          viewMode={viewMode}
          data={map[activeTab] || []}
          onTaskClick={setSelectedTask}
          onNoteClick={setSelectedNote}
          onMeetingClick={setSelectedMeeting}
          onEmailClick={setSelectedEmail}
        />
      )
    }

    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No {activeTab} found for this distribution</p>
        <p className="text-sm">Add some {activeTab} to get started</p>
      </div>
    )
  }

  return (
    <MasterDrawer
      trigger={
        <Card className="cursor-pointer hover:shadow-md transition-all border-gray-200 hover:border-gray-300 group">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm truncate group-hover:underline">{distribution.fundName}</h4>
                <p className="text-xs text-muted-foreground mt-1">{distribution.distributionNumber}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-600">
                    <MoreVerticalIcon className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Mark Sent</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {attributes.map((attr) => {
              const Icon = getIcon(attr.type)
              const value = (distribution as any)[attr.id]
              if (!value) return null
              return (
                <div key={attr.id} className="flex items-center gap-2 text-xs">
                  <Icon className="h-3 w-3 text-gray-400" />
                  <span className="text-muted-foreground truncate">{attr.name}:</span>
                  <span className="truncate">{renderValue(attr, value)}</span>
                </div>
              )
            })}
          </CardContent>
        </Card>
      }
      title={distribution.fundName}
      recordType="Distributions"
      subtitle={`${distribution.distributionNumber} • ${distribution.distributionAmount}`}
      tabs={tabs}
      detailsPanel={detailsPanel}
    >
      {renderTabContent}
    </MasterDrawer>
  )
}

function SortableDistributionCard({ distribution }: { distribution: Distribution }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: distribution.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  }
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-manipulation">
      <DistributionCard distribution={distribution} />
    </div>
  )
}

function Column({ stage, items }: { stage: any; items: Distribution[] }) {
  return (
    <div className={`flex flex-col min-h-[600px] w-80`}>
      <div className={`rounded-t-xl p-4 border ${stage.color}`}> 
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">{stage.name}</h3>
          <Badge variant="secondary" className="h-5 w-5 rounded-full p-0 text-xs bg-white/80 text-gray-700">
            {items.length}
          </Badge>
        </div>
      </div>
      <div className="flex-1 bg-gray-50/50 rounded-b-xl border-l border-r border-b p-3 space-y-3">
        <SortableContext items={items.map((d) => d.id)} strategy={verticalListSortingStrategy}>
          {items.map((d) => (
            <SortableDistributionCard key={d.id} distribution={d} />
          ))}
        </SortableContext>
      </div>
    </div>
  )
}

export function DistributionsTrackingKanban({
  workflowConfig,
  initialDistributions: initial,
}: {
  workflowConfig?: {
    attributes: any[]
    stages: any[]
  }
  initialDistributions?: Distribution[]
}) {
  const [records, setRecords] = React.useState(initial || initialDistributions)
  const stages = workflowConfig?.stages || defaultStages

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
    useSensor(KeyboardSensor),
  )

  const [activeId, setActiveId] = React.useState<string | null>(null)

  const handleDragStart = (event: any) => setActiveId(event.active.id as string)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return
    if (active.id === over.id) return
    const targetStage = stages.find((s) => s.id === over.id)
    if (!targetStage) return
    setRecords((prev) => prev.map((r) => (r.id === active.id ? { ...r, stage: targetStage.id } : r)))
    setActiveId(null)
  }

  const grouped = stages.map((s) => ({ stage: s, items: records.filter((r) => r.stage === s.id) }))

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {grouped.map(({ stage, items }) => (
          <Column key={stage.id} stage={stage} items={items} />
        ))}
      </div>
      <DragOverlay>
        {activeId ? (
          <div className="w-80 opacity-80 shadow-lg">
            <DistributionCard distribution={records.find((r) => r.id === activeId)!} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
} 