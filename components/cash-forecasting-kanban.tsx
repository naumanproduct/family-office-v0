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
  FileTextIcon,
  FileIcon,
  UsersIcon,
  CheckCircleIcon,
  MailIcon,
  BuildingIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  WalletIcon,
  BarChart3Icon,
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
import { MasterDrawer } from "./master-drawer"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { TabContentRenderer } from "@/components/shared/tab-content-renderer"
import { UnifiedDetailsPanel } from "@/components/shared/unified-details-panel"
import { buildStandardDetailSections } from "@/components/shared/detail-section-builder"
import { UnifiedActivitySection } from "@/components/shared/unified-activity-section"
import { generateWorkflowActivities } from "@/components/shared/activity-generators"

interface CashForecast {
  id: string
  entityName: string
  period: string
  preparedBy: string
  cashBalance: string
  projectedInflows: string
  projectedOutflows: string
  dueDate: string
  stage: string
  // Additional fields for detailed view
  description?: string
  netCashFlow?: string
  endingCash?: string
  liquidityRatio?: string
  burnRate?: string
  runwayMonths?: string
  criticalItems?: string
  assumptions?: string
  lastUpdated?: string
}

const initialForecasts: CashForecast[] = [
  {
    id: "1",
    entityName: "Family Office Master Fund LP",
    period: "Q1 2025",
    preparedBy: "Sarah Johnson",
    cashBalance: "$12.5M",
    projectedInflows: "$8.2M",
    projectedOutflows: "$6.8M",
    dueDate: "2025-01-15",
    stage: "entity-review",
    description: "Quarterly cash flow forecast for main investment entity",
    netCashFlow: "+$1.4M",
    endingCash: "$13.9M",
    liquidityRatio: "2.1",
    burnRate: "$2.3M/month",
    runwayMonths: "6",
    lastUpdated: "2025-01-10",
  },
  {
    id: "2",
    entityName: "Family Office Holdings LLC",
    period: "Q1 2025",
    preparedBy: "Michael Chen",
    cashBalance: "$8.3M",
    projectedInflows: "$3.5M",
    projectedOutflows: "$4.2M",
    dueDate: "2025-01-15",
    stage: "projections-drafted",
    description: "Quarterly forecast for operating entity",
    netCashFlow: "-$0.7M",
    endingCash: "$7.6M",
    liquidityRatio: "1.8",
    burnRate: "$1.4M/month",
    runwayMonths: "5.4",
    criticalItems: "Large capital call expected in Q2",
    lastUpdated: "2025-01-12",
  },
  {
    id: "3",
    entityName: "Real Estate Holdings I LLC",
    period: "January 2025",
    preparedBy: "Jessica Liu",
    cashBalance: "$4.2M",
    projectedInflows: "$1.8M",
    projectedOutflows: "$2.1M",
    dueDate: "2025-01-05",
    stage: "reconciled",
    description: "Monthly forecast for real estate entity",
    netCashFlow: "-$0.3M",
    endingCash: "$3.9M",
    liquidityRatio: "1.9",
    assumptions: "Rental income stable, property tax due",
    lastUpdated: "2025-01-13",
  },
  {
    id: "4",
    entityName: "Private Equity Fund II LP",
    period: "January 2025",
    preparedBy: "David Park",
    cashBalance: "$15.7M",
    projectedInflows: "$0.5M",
    projectedOutflows: "$3.2M",
    dueDate: "2025-01-05",
    stage: "approved",
    description: "Monthly forecast for PE fund",
    netCashFlow: "-$2.7M",
    endingCash: "$13.0M",
    liquidityRatio: "4.1",
    burnRate: "$1.1M/month",
    runwayMonths: "12",
    lastUpdated: "2025-01-14",
  },
]

interface CashForecastingKanbanProps {
  workflowConfig?: {
    attributes: Array<{ id: string; name: string; type: string }>
    stages: Array<{ id: string; name: string; color: string }>
  }
  initialForecasts?: CashForecast[]
}

// Default stages if no config provided
const defaultStages = [
  { id: "entity-review", name: "Entity Review", color: "bg-gray-100" },
  { id: "projections-drafted", name: "Projections Drafted", color: "bg-blue-100" },
  { id: "reconciled", name: "Reconciled", color: "bg-purple-100" },
  { id: "approved", name: "Approved", color: "bg-green-100" },
]

// Default attributes if no config provided
const defaultAttributes = [
  { id: "entityName", name: "Entity", type: "text" },
  { id: "period", name: "Period", type: "text" },
  { id: "preparedBy", name: "Prepared By", type: "user" },
  { id: "cashBalance", name: "Starting Cash", type: "currency" },
  { id: "projectedInflows", name: "Projected Inflows", type: "currency" },
  { id: "projectedOutflows", name: "Projected Outflows", type: "currency" },
  { id: "dueDate", name: "Due Date", type: "date" },
]

// Separate the card UI from the sortable wrapper
function CashForecastCard({
  forecast,
  attributes = defaultAttributes,
}: {
  forecast: CashForecast
  attributes?: Array<{ id: string; name: string; type: string }>
}) {
  // Determine forecast status
  const forecastStatus =
    forecast.stage === "entity-review"
      ? "Entity Review"
      : forecast.stage === "projections-drafted"
      ? "Projections Drafted"
      : forecast.stage === "reconciled"
      ? "Reconciled"
      : "Approved"

  // Create forecast title
  const forecastTitle = `${forecast.period} Cash Forecast - ${forecast.entityName}`

  // Create forecast subtitle
  const forecastSubtitle = `${forecast.entityName} • ${forecast.period}`

  // Define tabs for the drawer
  const tabs = [
    { id: "details", label: "Details", count: null, icon: FileTextIcon },
    { id: "notes", label: "Notes", count: 4, icon: FileIcon },
    { id: "files", label: "Files", count: 3, icon: FileTextIcon },
    { id: "tasks", label: "Tasks", count: 5, icon: CheckCircleIcon },
    { id: "analysis", label: "Analysis", count: null, icon: BarChart3Icon },
    { id: "assumptions", label: "Assumptions", count: 6, icon: FileTextIcon },
  ]

  // Create details panel function using shared builder
  const detailsPanel = (isFullScreen = false) => {
    const infoFields = [
      { label: "Entity", value: forecast.entityName },
      { label: "Period", value: forecast.period },
      { label: "Prepared By", value: forecast.preparedBy },
      { label: "Starting Cash", value: forecast.cashBalance },
      { label: "Projected Inflows", value: forecast.projectedInflows },
      { label: "Projected Outflows", value: forecast.projectedOutflows },
      { label: "Net Cash Flow", value: forecast.netCashFlow || "N/A" },
      { label: "Ending Cash", value: forecast.endingCash || "N/A" },
      { label: "Liquidity Ratio", value: forecast.liquidityRatio || "N/A" },
      { label: "Due Date", value: forecast.dueDate },
      { label: "Status", value: forecastStatus },
    ]

    // Provide mock related records only for the showcase forecast
    const entities =
      forecast.entityName === "Family Office Master Fund LP"
        ? [
            {
              id: 1,
              name: forecast.entityName,
              type: "Master Fund",
            },
          ]
        : []

    const sections = buildStandardDetailSections({
      infoTitle: "Forecast Information",
      infoIcon: <WalletIcon className="h-4 w-4 text-muted-foreground" />,
      infoFields,
      entities,
      investments: [],
      companies: [],
      opportunities: [],
      people: [
        { id: 1, name: forecast.preparedBy, role: "Analyst" },
        { id: 2, name: "Finance Team", role: "Department" },
      ],
    })

    return (
      <UnifiedDetailsPanel
        sections={sections}
        isFullScreen={isFullScreen}
        activityContent={<UnifiedActivitySection activities={generateWorkflowActivities()} />}
      />
    )
  }

  // Create children function for tabs
  const renderTabContent = (
    activeTab: string,
    viewMode: "card" | "list" | "table",
    setSelectedTask?: (task: any) => void,
    setSelectedNote?: (note: any) => void,
    setSelectedMeeting?: (meeting: any) => void,
    setSelectedEmail?: (email: any) => void,
  ) => {
    // Provide rich mock content only for Master Fund forecast to showcase workflow container concept
    if (forecast.entityName === "Family Office Master Fund LP") {
      // ------------------------------
      // Mock data definitions
      // ------------------------------
      const tasks = [
        {
          id: 1,
          title: "Gather bank statements",
          priority: "High",
          status: "completed",
          assignee: forecast.preparedBy,
          dueDate: "2025-01-08",
          description: "Collect all entity bank statements for starting balances",
          relatedTo: { type: "Forecast", name: forecast.period },
        },
        {
          id: 2,
          title: "Review capital call schedule",
          priority: "High",
          status: "completed",
          assignee: forecast.preparedBy,
          dueDate: "2025-01-10",
          description: "Identify upcoming capital calls for Q1",
          relatedTo: { type: "Forecast", name: forecast.period },
        },
        {
          id: 3,
          title: "Project distribution income",
          priority: "Medium",
          status: "in-progress",
          assignee: "Michael Chen",
          dueDate: "2025-01-12",
          description: "Estimate distributions from investments",
          relatedTo: { type: "Forecast", name: forecast.period },
        },
        {
          id: 4,
          title: "Calculate operating expenses",
          priority: "High",
          status: "pending",
          assignee: forecast.preparedBy,
          dueDate: "2025-01-13",
          description: "Project monthly operating costs and fees",
          relatedTo: { type: "Forecast", name: forecast.period },
        },
        {
          id: 5,
          title: "CFO review and approval",
          priority: "High",
          status: "pending",
          assignee: "CFO",
          dueDate: "2025-01-15",
          description: "Final review and sign-off on forecast",
          relatedTo: { type: "Forecast", name: forecast.period },
        },
      ]

      const notes = [
        {
          id: 1,
          title: "Large capital call expected",
          author: forecast.preparedBy,
          date: "2025-01-10",
          tags: ["capital-call", "liquidity"],
        },
        {
          id: 2,
          title: "Distribution timing uncertain",
          author: "Michael Chen",
          date: "2025-01-11",
          tags: ["distributions", "risk"],
        },
        {
          id: 3,
          title: "Tax payment considerations",
          author: "Jessica Liu",
          date: "2025-01-12",
          tags: ["tax", "outflows"],
        },
        {
          id: 4,
          title: "Credit facility availability",
          author: forecast.preparedBy,
          date: "2025-01-13",
          tags: ["credit", "backup"],
        },
      ]

      const files = [
        {
          id: 1,
          name: "Q1_2025_Cash_Forecast_Draft.xlsx",
          uploadedBy: forecast.preparedBy,
          uploadedDate: "2025-01-12",
          size: "1.8 MB",
        },
        {
          id: 2,
          name: "Bank_Statements_Dec_2024.pdf",
          uploadedBy: "Finance Team",
          uploadedDate: "2025-01-08",
          size: "3.2 MB",
        },
        {
          id: 3,
          name: "Capital_Call_Schedule.pdf",
          uploadedBy: "Michael Chen",
          uploadedDate: "2025-01-10",
          size: "450 KB",
        },
      ]

      const analysis = [
        {
          id: 1,
          title: "Cash Flow Summary",
          type: "summary",
          data: {
            startingCash: forecast.cashBalance,
            inflows: forecast.projectedInflows,
            outflows: forecast.projectedOutflows,
            netFlow: forecast.netCashFlow,
            endingCash: forecast.endingCash,
          },
        },
        {
          id: 2,
          title: "Liquidity Metrics",
          type: "metrics",
          data: {
            liquidityRatio: forecast.liquidityRatio,
            burnRate: forecast.burnRate,
            runwayMonths: forecast.runwayMonths,
          },
        },
      ]

      const assumptions = [
        {
          id: 1,
          category: "Inflows",
          assumption: "Q4 2024 distributions received by end of January",
          impact: "+$2.5M",
        },
        {
          id: 2,
          category: "Inflows",
          assumption: "Management fee income collected monthly",
          impact: "+$0.8M/month",
        },
        {
          id: 3,
          category: "Outflows",
          assumption: "Blackstone capital call due January 31",
          impact: "-$3.0M",
        },
        {
          id: 4,
          category: "Outflows",
          assumption: "Operating expenses remain flat vs Q4",
          impact: "-$1.2M/month",
        },
        {
          id: 5,
          category: "Risk",
          assumption: "No emergency capital calls",
          impact: "Variable",
        },
        {
          id: 6,
          category: "Risk",
          assumption: "Credit facility remains available",
          impact: "$10M backup",
        },
      ]

      const dataMap: Record<string, any[]> = {
        tasks,
        notes,
        files,
        analysis,
        assumptions,
      }

      return (
        <TabContentRenderer
          activeTab={activeTab}
          viewMode={viewMode}
          data={dataMap[activeTab] || []}
          onTaskClick={setSelectedTask}
          onNoteClick={setSelectedNote}
          onMeetingClick={setSelectedMeeting}
          onEmailClick={setSelectedEmail}
        />
      )
    }

    // Default placeholder for other forecasts
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No {activeTab} found for this forecast</p>
        <p className="text-sm">Add some {activeTab} to get started</p>
      </div>
    )
  }

  // Function to get the appropriate icon for each attribute type
  const getAttributeIcon = (type: string, id: string) => {
    if (id === "cashBalance" || id === "projectedInflows" || id === "projectedOutflows") return DollarSignIcon
    if (id === "dueDate") return CalendarIcon
    if (id === "entityName") return BuildingIcon
    if (id === "period") return CalendarIcon
    
    switch (type) {
      case "currency":
        return DollarSignIcon
      case "date":
        return CalendarIcon
      case "user":
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

  return (
    <MasterDrawer
      trigger={
        <Card className="cursor-pointer hover:shadow-md transition-all duration-200 border-gray-200 hover:border-gray-300 group"
          onClick={(e) => e.stopPropagation()}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-gray-900 truncate cursor-pointer group-hover:underline">
                  {forecast.entityName}
                </h4>
                <p className="text-xs text-gray-500 mt-1">{forecast.period}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-600">
                    <MoreVerticalIcon className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Export</DropdownMenuItem>
                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent
            className="pt-0 space-y-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-2">
              {attributes.map((attribute) => {
                const Icon = getAttributeIcon(attribute.type, attribute.id)
                const value = (forecast as any)[attribute.id]

                if (!value || attribute.id === "entityName" || attribute.id === "period") return null

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
      }
      title={forecastTitle}
      recordType="Cash Forecast"
      subtitle={forecastSubtitle}
      tabs={tabs}
      children={renderTabContent}
      detailsPanel={detailsPanel}
      onComposeEmail={() => {}}
    />
  )
}

function SortableCashForecastCard({
  forecast,
  attributes,
}: {
  forecast: CashForecast
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
    id: forecast.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  }

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...dndAttributes} 
      {...listeners} 
      className="touch-manipulation"
      suppressHydrationWarning
    >
      <CashForecastCard forecast={forecast} attributes={attributes} />
    </div>
  )
}

function DroppableColumn({
  stage,
  forecasts,
  attributes,
}: {
  stage: { id: string; name: string; color: string }
  forecasts: CashForecast[]
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
            <Badge variant="secondary" className="h-5 w-5 rounded-full p-0 text-xs bg-white/80 text-gray-700 flex items-center justify-center">
              {forecasts.length}
            </Badge>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-500 hover:text-gray-700">
            <PlusIcon className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="flex-1 bg-gray-50/50 rounded-b-xl border-l border-r border-b border-gray-200 p-3 space-y-3">
        <SortableContext items={forecasts.map((f) => f.id)} strategy={verticalListSortingStrategy}>
          {forecasts.map((forecast) => (
            <SortableCashForecastCard key={forecast.id} forecast={forecast} attributes={attributes} />
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

export function CashForecastingKanban({ workflowConfig, initialForecasts: propForecasts }: CashForecastingKanbanProps) {
  const [forecasts, setForecasts] = React.useState(propForecasts || initialForecasts)
  const [activeForecast, setActiveForecast] = React.useState<CashForecast | null>(null)
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
    const forecast = forecasts.find((f) => f.id === activeId)
    if (forecast) {
      setActiveForecast(forecast)
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveForecast(null)
    const { active, over } = event

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeForecast = forecasts.find((f) => f.id === activeId)
    if (!activeForecast) return

    // Find which stage the item is being dropped on
    let targetStage = overId

    // If dropping on another forecast, find its stage
    if (!stagesList.some((s) => s.id === overId)) {
      const targetForecast = forecasts.find((f) => f.id === overId)
      if (targetForecast) {
        targetStage = targetForecast.stage
      }
    }

    // Update the forecast's stage if it's different
    if (activeForecast.stage !== targetStage && stagesList.some((s) => s.id === targetStage)) {
      setForecasts(forecasts.map((forecast) => (forecast.id === activeId ? { ...forecast, stage: targetStage } : forecast)))
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

  const forecastsByStage = stagesList.map((stage) => ({
    stage,
    forecasts: forecasts.filter((forecast) => forecast.stage === stage.id),
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
        {forecastsByStage.map(({ stage, forecasts }) => (
          <DroppableColumn key={stage.id} stage={stage} forecasts={forecasts} attributes={attributes} />
        ))}
        <AddColumnButton onAddColumn={() => setAddColumnDialogOpen(true)} />
      </div>
      <DragOverlay>
        {activeForecast ? (
          <div className="w-80 opacity-80 shadow-lg">
            <CashForecastCard forecast={activeForecast} attributes={attributes} />
          </div>
        ) : null}
      </DragOverlay>
      <AddColumnDialog open={addColumnDialogOpen} onOpenChange={setAddColumnDialogOpen} onAddColumn={handleAddColumn} />
    </DndContext>
  )
} 