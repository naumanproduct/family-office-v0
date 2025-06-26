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
import { MoreVerticalIcon, FileTextIcon, CalendarIcon, UserIcon, CheckCircleIcon } from "lucide-react"

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
import { buildWorkflowDetailsPanel } from "@/components/shared/workflow-details-helper"
import { generateWorkflowActivities } from "@/components/shared/activity-generators"

interface DiligenceItem {
  id: string
  dealName: string
  phase: string
  owner: string
  dueDate: string
  percentComplete: number
  stage: string
}

const initialItems: DiligenceItem[] = [
  { id: "1", dealName: "TechFlow Series A", phase: "Financial", owner: "David Park", dueDate: "2024-06-30", percentComplete: 40, stage: "not-started" },
  { id: "2", dealName: "GreenEnergy Seed", phase: "Legal", owner: "External Counsel", dueDate: "2024-07-05", percentComplete: 20, stage: "in-progress" },
  { id: "3", dealName: "FinanceAI Series A", phase: "Technical", owner: "CTO Office", dueDate: "2024-07-10", percentComplete: 70, stage: "pending-approval" },
  { id: "4", dealName: "HealthTech Series B", phase: "Commercial", owner: "Partner", dueDate: "2024-06-20", percentComplete: 100, stage: "completed" },
]

const defaultStages = [
  { id: "not-started", name: "Not Started", color: "bg-gray-100" },
  { id: "in-progress", name: "In Progress", color: "bg-blue-100" },
  { id: "pending-approval", name: "Pending Approval", color: "bg-yellow-100" },
  { id: "completed", name: "Completed", color: "bg-green-100" },
]

const defaultAttributes = [
  { id: "owner", name: "Owner", type: "user" },
  { id: "dueDate", name: "Due", type: "date" },
  { id: "percentComplete", name: "% Complete", type: "percent" },
]

function DiligenceCard({ item, attributes = defaultAttributes }: { item: DiligenceItem; attributes?: any[] }) {
  const detailsPanel = buildWorkflowDetailsPanel({
    infoTitle: "Workflow Information",
    infoFields: [
      { label: "Deal", value: item.dealName },
      { label: "Phase", value: item.phase },
      { label: "Owner", value: item.owner },
      { label: "Due Date", value: item.dueDate },
      { label: "% Complete", value: `${item.percentComplete}%` },
    ],
    opportunities:
      item.dealName === "TechFlow Series A"
        ? [{ id: 1, name: "TechFlow Series A", type: "Investment Opportunity" }]
        : [],
    companies:
      item.dealName === "TechFlow Series A"
        ? [{ id: 1, name: "TechFlow Solutions", type: "Target Company" }]
        : [],
    people:
      item.dealName === "TechFlow Series A"
        ? [
            { id: 1, name: "Sarah Johnson", role: "CEO" },
            { id: 2, name: "Michael Chen", role: "CFO" },
          ]
        : [],
    activities: generateWorkflowActivities(),
  })

  // get icon function
  const getIcon = (type: string) => {
    switch (type) {
      case "date":
        return CalendarIcon
      case "user":
        return UserIcon
      default:
        return FileTextIcon
    }
  }

  const renderValue = (attr: any, value: any) => {
    if (!value) return "—"
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

  return (
    <MasterDrawer
      trigger={
        <Card className="cursor-pointer hover:shadow-md transition-all group touch-manipulation">
          <CardHeader className="pb-2 flex flex-col gap-1">
            <h4 className="font-semibold text-sm truncate group-hover:underline">{item.dealName}</h4>
            <Badge variant="secondary" className="w-fit text-xs">{item.phase}</Badge>
          </CardHeader>
          <CardContent className="pt-0 pb-2 text-xs text-muted-foreground space-y-1">
            {attributes.map((attr) => {
              const Icon = getIcon(attr.type)
              const value = (item as any)[attr.id]
              if (value === undefined) return null
              return (
                <div key={attr.id} className="flex items-center gap-2">
                  <Icon className="h-3 w-3 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-500">{attr.name}:</span>
                  {renderValue(attr, value)}
                </div>
              )
            })}
          </CardContent>
        </Card>
      }
      title={item.dealName}
      recordType="Diligence"
      subtitle={`${item.phase} • ${item.owner}`}
      tabs={[
        { id: "details", label: "Details", count: null, icon: FileTextIcon },
  
      ]}
      detailsPanel={detailsPanel}
    >
      {() => (
        <div className="text-center py-8 text-muted-foreground">
          <p>No additional data</p>
        </div>
      )}
    </MasterDrawer>
  )
}

function SortableCard({ item }: { item: DiligenceItem }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <DiligenceCard item={item} />
    </div>
  )
}

function Column({ stage, items }: { stage: any; items: DiligenceItem[] }) {
  return (
    <div className="flex flex-col min-h-[600px] w-80">
      <div className={`rounded-t-xl p-4 border ${stage.color}`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">{stage.name}</h3>
          <Badge variant="secondary" className="h-5 w-5 rounded-full p-0 text-xs bg-white/80 text-gray-700">{items.length}</Badge>
        </div>
      </div>
      <div className="flex-1 bg-gray-50/50 rounded-b-xl border-l border-r border-b p-3 space-y-3">
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          {items.map((i) => (
            <SortableCard key={i.id} item={i} />
          ))}
        </SortableContext>
      </div>
    </div>
  )
}

export function DiligenceProcessKanban({ workflowConfig }: { workflowConfig?: { attributes: any[]; stages: any[] } }) {
  const [items, setItems] = React.useState(initialItems)
  const stages = workflowConfig?.stages || defaultStages
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor), useSensor(KeyboardSensor))
  const [activeId, setActiveId] = React.useState<string | null>(null)

  const handleDragStart = (e: any) => setActiveId(e.active.id as string)
  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    if (!over) return
    if (active.id === over.id) return
    const targetStage = stages.find((s) => s.id === over.id)
    if (!targetStage) return
    setItems((prev) => prev.map((it) => (it.id === active.id ? { ...it, stage: targetStage.id } : it)))
    setActiveId(null)
  }

  const grouped = stages.map((s) => ({ stage: s, items: items.filter((i) => i.stage === s.id) }))

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {grouped.map(({ stage, items }) => (
          <Column key={stage.id} stage={stage} items={items} />
        ))}
      </div>
      <DragOverlay>
        {activeId ? (
          <div className="w-80 shadow-lg opacity-80">
            <DiligenceCard item={items.find((i) => i.id === activeId)!} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
} 