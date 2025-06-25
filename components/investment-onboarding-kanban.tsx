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
import { FileTextIcon, CalendarIcon } from "lucide-react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MasterDrawer } from "./master-drawer"
import { buildWorkflowDetailsPanel } from "@/components/shared/workflow-details-helper"
import { generateWorkflowActivities } from "@/components/shared/activity-generators"

interface OnboardingRecord {
  id: string
  investment: string
  custodian: string
  account: string
  fundingStatus: string
  expectedSettlement: string
  owner: string
  stage: string
}

const initialRecords: OnboardingRecord[] = [
  { id: "1", investment: "TechFlow Series A", custodian: "Morgan Stanley", account: "•••1234", fundingStatus: "Pending", expectedSettlement: "2024-06-25", owner: "Ops Team", stage: "documentation" },
  { id: "2", investment: "Growth Fund III", custodian: "JPMorgan", account: "•••9876", fundingStatus: "Funded", expectedSettlement: "2024-06-18", owner: "You", stage: "funded" },
  { id: "3", investment: "RE Fund IV", custodian: "Goldman Sachs", account: "•••5555", fundingStatus: "Awaiting Custodian", expectedSettlement: "2024-06-30", owner: "Custody", stage: "custodian-open" },
]

const defaultStages = [
  { id: "documentation", name: "Documentation", color: "bg-gray-100" },
  { id: "funded", name: "Funded", color: "bg-blue-100" },
  { id: "custodian-open", name: "Custodian Open", color: "bg-yellow-100" },
  { id: "active", name: "Active", color: "bg-green-100" },
]

function OnboardingCard({ rec }: { rec: OnboardingRecord }) {
  const detailsPanel = buildWorkflowDetailsPanel({
    infoTitle: "Workflow Information",
    infoFields: [
      { label: "Investment", value: rec.investment },
      { label: "Custodian", value: rec.custodian },
      { label: "Account", value: rec.account },
      { label: "Funding Status", value: rec.fundingStatus },
      { label: "Expected Settlement", value: rec.expectedSettlement },
      { label: "Owner", value: rec.owner },
    ],
    investments:
      rec.investment === "TechFlow Series A"
        ? [{ id: 1, name: "Series A – TechFlow Solutions", amount: "$15M", status: "Pending Settlement" }]
        : [],
    companies:
      rec.investment === "TechFlow Series A"
        ? [{ id: 1, name: "TechFlow Solutions", type: "Portfolio Company" }]
        : [],
    entities:
      rec.investment === "TechFlow Series A"
        ? [{ id: 1, name: "TechFlow Holdings LLC", type: "Holding Entity" }]
        : [],
    people:
      rec.investment === "TechFlow Series A"
        ? [
            { id: 1, name: "Laura Kim", role: "Investor Relations" },
            { id: 2, name: "John Doe", role: "Custody Officer" },
          ]
        : [],
    activities: generateWorkflowActivities(),
  })

  return (
    <MasterDrawer
      trigger={
        <Card className="cursor-pointer hover:shadow-md transition-all group">
          <CardHeader className="pb-2">
            <h4 className="font-semibold text-sm truncate group-hover:underline">{rec.investment}</h4>
          </CardHeader>
          <CardContent className="pt-0 pb-2 text-xs text-muted-foreground">
            <p>
              <span className="outline-none hover:bg-primary/10 rounded-sm px-0.5 cursor-text transition-colors" contentEditable suppressContentEditableWarning>{rec.custodian}</span>
            </p>
            <p>
              <span className="outline-none hover:bg-primary/10 rounded-sm px-0.5 cursor-text transition-colors" contentEditable suppressContentEditableWarning>{rec.fundingStatus}</span>
            </p>
          </CardContent>
        </Card>
      }
      title={rec.investment}
      recordType="Onboarding"
      subtitle={`${rec.custodian} • ${rec.fundingStatus}`}
      tabs={[
        { id: "details", label: "Details", count: null, icon: FileTextIcon },
  
      ]}
      detailsPanel={detailsPanel}
    >
      {() => (<div className="text-center py-8 text-muted-foreground"><p>No additional data</p></div>)}
    </MasterDrawer>
  )
}

function Column({ stage, items }: { stage: any; items: OnboardingRecord[] }) {
  return (
    <div className="flex flex-col min-h-[600px] w-80">
      <div className={`rounded-t-xl p-4 border ${stage.color}`}> <h3 className="font-semibold text-sm">{stage.name}</h3></div>
      <div className="flex-1 bg-gray-50/50 rounded-b-xl border-l border-r border-b p-3 space-y-3">
        {items.map((r) => <OnboardingCard key={r.id} rec={r} />)}
      </div>
    </div>
  )
}

export function InvestmentOnboardingKanban({ workflowConfig }: { workflowConfig?: { attributes: any[]; stages: any[] } }) {
  const [records, setRecords] = React.useState(initialRecords)
  const stages = workflowConfig?.stages || defaultStages
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {stages.map((s) => (<Column key={s.id} stage={s} items={records.filter((r) => r.stage === s.id)} />))}
    </div>
  )
} 