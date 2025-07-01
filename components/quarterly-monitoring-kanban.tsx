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
  TrendingUpIcon,
  FileTextIcon,
  FileIcon,
  UsersIcon,
  CheckCircleIcon,
  MailIcon,
  BuildingIcon,
  ChevronDownIcon,
  BarChartIcon,
  AlertCircleIcon,
  BookOpenIcon,
  ClipboardListIcon,
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

interface QuarterlyReview {
  id: string
  investmentName: string
  fundManager: string
  assetClass: string
  quarter: string
  dueDate: string
  analyst: string
  currentNAV: string
  stage: string
  // Additional fields for detailed view
  description?: string
  previousNAV?: string
  irr?: string
  multiple?: string
  capitalCalled?: string
  distributions?: string
  keyDevelopments?: string
  redFlags?: string
  lastReviewDate?: string
  fundSize?: string
  vintage?: string
  commitment?: string
}

const initialReviews: QuarterlyReview[] = [
  {
    id: "1",
    investmentName: "Blackstone Real Estate Fund IX",
    fundManager: "Blackstone",
    assetClass: "Real Estate",
    quarter: "Q4 2024",
    dueDate: "2024-01-31",
    analyst: "Sarah Johnson",
    currentNAV: "$52.3M",
    stage: "to-review",
    description: "Flagship real estate fund focused on core-plus opportunities in major US markets",
    previousNAV: "$48.7M",
    irr: "14.2%",
    multiple: "1.4x",
    capitalCalled: "$35M",
    distributions: "$12M",
    fundSize: "$20B",
    vintage: "2019",
    commitment: "$50M",
  },
  {
    id: "2",
    investmentName: "KKR Americas XII",
    fundManager: "KKR",
    assetClass: "Private Equity",
    quarter: "Q4 2024",
    dueDate: "2024-01-31",
    analyst: "Michael Chen",
    currentNAV: "$78.5M",
    stage: "documents-received",
    description: "Large-cap buyout fund focused on North American opportunities",
    previousNAV: "$75.2M",
    irr: "18.5%",
    multiple: "1.6x",
    capitalCalled: "$50M",
    distributions: "$20M",
    fundSize: "$18.5B",
    vintage: "2020",
    commitment: "$75M",
  },
  {
    id: "3",
    investmentName: "Sequoia Capital Growth Fund",
    fundManager: "Sequoia Capital",
    assetClass: "Venture Capital",
    quarter: "Q4 2024",
    dueDate: "2024-01-31",
    analyst: "Jessica Liu",
    currentNAV: "$42.1M",
    stage: "analysis-in-progress",
    description: "Late-stage venture fund investing in technology companies",
    previousNAV: "$38.9M",
    irr: "22.3%",
    multiple: "2.1x",
    capitalCalled: "$20M",
    distributions: "$5M",
    keyDevelopments: "Two portfolio companies filed for IPO",
    fundSize: "$8B",
    vintage: "2021",
    commitment: "$25M",
  },
  {
    id: "4",
    investmentName: "Apollo Credit Fund III",
    fundManager: "Apollo",
    assetClass: "Credit",
    quarter: "Q4 2024",
    dueDate: "2024-01-31",
    analyst: "David Park",
    currentNAV: "$31.2M",
    stage: "review-complete",
    description: "Opportunistic credit fund focusing on distressed and special situations",
    previousNAV: "$30.8M",
    irr: "11.5%",
    multiple: "1.2x",
    capitalCalled: "$25M",
    distributions: "$8M",
    fundSize: "$15B",
    vintage: "2022",
    commitment: "$30M",
  },
]

interface QuarterlyMonitoringKanbanProps {
  workflowConfig?: {
    attributes: Array<{ id: string; name: string; type: string }>
    stages: Array<{ id: string; name: string; color: string }>
  }
  initialReviews?: QuarterlyReview[]
}

// Default stages if no config provided
const defaultStages = [
  { id: "to-review", name: "To Review", color: "bg-gray-100" },
  { id: "documents-received", name: "Documents Received", color: "bg-blue-100" },
  { id: "analysis-in-progress", name: "Analysis in Progress", color: "bg-yellow-100" },
  { id: "review-complete", name: "Review Complete", color: "bg-purple-100" },
  { id: "insights-logged", name: "Insights Logged", color: "bg-green-100" },
]

// Default attributes if no config provided
const defaultAttributes = [
  { id: "investmentName", name: "Investment", type: "text" },
  { id: "fundManager", name: "Fund Manager", type: "text" },
  { id: "assetClass", name: "Asset Class", type: "text" },
  { id: "quarter", name: "Quarter", type: "text" },
  { id: "dueDate", name: "Due Date", type: "date" },
  { id: "analyst", name: "Analyst", type: "user" },
  { id: "currentNAV", name: "Current NAV", type: "currency" },
]

// Separate the card UI from the sortable wrapper
function QuarterlyReviewCard({
  review,
  attributes = defaultAttributes,
}: {
  review: QuarterlyReview
  attributes?: Array<{ id: string; name: string; type: string }>
}) {
  // Determine review status
  const reviewStatus =
    review.stage === "to-review"
      ? "To Review"
      : review.stage === "documents-received"
      ? "Documents Received"
      : review.stage === "analysis-in-progress"
      ? "Analysis in Progress"
      : review.stage === "review-complete"
      ? "Review Complete"
      : "Insights Logged"

  // Create review title
  const reviewTitle = `${review.quarter} Review - ${review.investmentName}`

  // Create review subtitle
  const reviewSubtitle = `${review.fundManager} • ${review.assetClass}`

  // Define tabs for the drawer
  const tabs = [
    { id: "details", label: "Details", count: null, icon: FileTextIcon },
    { id: "notes", label: "Notes", count: 4, icon: FileIcon },
    { id: "files", label: "Files", count: 6, icon: FileTextIcon },
    { id: "tasks", label: "Tasks", count: 8, icon: CheckCircleIcon },
    { id: "emails", label: "Emails", count: 5, icon: MailIcon },
    { id: "analysis", label: "Analysis", count: null, icon: BarChartIcon },
    { id: "history", label: "History", count: 12, icon: ClipboardListIcon },
  ]

  // Create details panel function using shared builder
  const detailsPanel = (isFullScreen = false) => {
    const infoFields = [
      { label: "Investment", value: review.investmentName },
      { label: "Fund Manager", value: review.fundManager },
      { label: "Asset Class", value: review.assetClass },
      { label: "Quarter", value: review.quarter },
      { label: "Due Date", value: review.dueDate },
      { label: "Analyst", value: review.analyst },
      { label: "Current NAV", value: review.currentNAV },
      { label: "Previous NAV", value: review.previousNAV || "N/A" },
      { label: "IRR", value: review.irr || "N/A" },
      { label: "Multiple", value: review.multiple || "N/A" },
      { label: "Status", value: reviewStatus },
    ]

    // Provide mock related records only for the showcase review
    const investments =
      review.investmentName === "Blackstone Real Estate Fund IX"
        ? [
            {
              id: 1,
              name: review.investmentName,
              amount: review.commitment || "$50M",
              status: "Active",
            },
          ]
        : []

    const companies =
      review.investmentName === "Blackstone Real Estate Fund IX"
        ? [{ id: 1, name: review.fundManager, type: "Fund Manager" }]
        : []

    const entities =
      review.investmentName === "Blackstone Real Estate Fund IX"
        ? [
            {
              id: 1,
              name: "Family Office Master Fund LP",
              type: "Investment Entity",
            },
          ]
        : []

    const sections = buildStandardDetailSections({
      infoTitle: "Review Information",
      infoIcon: <BookOpenIcon className="h-4 w-4 text-muted-foreground" />,
      infoFields,
      investments,
      companies,
      entities,
      opportunities: [],
      people: [
        { id: 1, name: review.analyst, role: "Lead Analyst" },
        { id: 2, name: "Investment Committee", role: "Reviewer" },
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
    // Provide rich mock content only for Blackstone fund to showcase workflow container concept
    if (review.investmentName === "Blackstone Real Estate Fund IX") {
      // ------------------------------
      // Mock data definitions
      // ------------------------------
      const tasks = [
        {
          id: 1,
          title: "Upload quarterly fund letter",
          priority: "High",
          status: "completed",
          assignee: review.analyst,
          dueDate: "2024-01-25",
          description: "Upload Q4 2024 fund letter and performance report",
          relatedTo: { type: "Review", name: review.investmentName },
        },
        {
          id: 2,
          title: "Update valuation and NAV",
          priority: "High",
          status: "completed",
          assignee: review.analyst,
          dueDate: "2024-01-26",
          description: "Update system with latest NAV from fund report",
          relatedTo: { type: "Review", name: review.investmentName },
        },
        {
          id: 3,
          title: "Summarize key fund developments",
          priority: "Medium",
          status: "in-progress",
          assignee: review.analyst,
          dueDate: "2024-01-28",
          description: "Document major portfolio changes and exits",
          relatedTo: { type: "Review", name: review.investmentName },
        },
        {
          id: 4,
          title: "Note capital activity",
          priority: "High",
          status: "pending",
          assignee: review.analyst,
          dueDate: "2024-01-29",
          description: "Record any capital calls or distributions in Q4",
          relatedTo: { type: "Review", name: review.investmentName },
        },
        {
          id: 5,
          title: "Identify follow-ups or risks",
          priority: "Medium",
          status: "pending",
          assignee: review.analyst,
          dueDate: "2024-01-30",
          description: "Flag any concerns or items requiring follow-up",
          relatedTo: { type: "Review", name: review.investmentName },
        },
        {
          id: 6,
          title: "Finalize quarterly writeup",
          priority: "High",
          status: "pending",
          assignee: review.analyst,
          dueDate: "2024-01-31",
          description: "Complete internal quarterly review memo",
          relatedTo: { type: "Review", name: review.investmentName },
        },
      ]

      const notes = [
        {
          id: 1,
          title: "Q4 Performance Summary",
          author: review.analyst,
          date: "2024-01-26",
          tags: ["performance", "quarterly"],
        },
        {
          id: 2,
          title: "Portfolio company exits",
          author: "Michael Chen",
          date: "2024-01-27",
          tags: ["exits", "portfolio"],
        },
        {
          id: 3,
          title: "Market conditions impact",
          author: review.analyst,
          date: "2024-01-27",
          tags: ["market", "analysis"],
        },
        {
          id: 4,
          title: "Capital call analysis",
          author: "Jessica Liu",
          date: "2024-01-28",
          tags: ["capital", "liquidity"],
        },
      ]

      const emails = [
        {
          id: 1,
          subject: "Q4 2024 Investor Letter - Blackstone BREIT IX",
          from: "investor.relations@blackstone.com",
          date: "2024-01-15",
          status: "Read",
        },
        {
          id: 2,
          subject: "Capital Account Statement - Q4 2024",
          from: "fundadmin@blackstone.com",
          date: "2024-01-16",
          status: "Read",
        },
        {
          id: 3,
          subject: "Portfolio Update - Major Exit Completed",
          from: "portfolio.updates@blackstone.com",
          date: "2024-01-20",
          status: "Read",
        },
        {
          id: 4,
          subject: "Distribution Notice - Q4 2024",
          from: "distributions@blackstone.com",
          date: "2024-01-22",
          status: "Unread",
        },
        {
          id: 5,
          subject: "Annual Meeting Save the Date",
          from: "events@blackstone.com",
          date: "2024-01-24",
          status: "Unread",
        },
      ]

      const files = [
        {
          id: 1,
          name: "Q4_2024_Investor_Letter.pdf",
          uploadedBy: review.analyst,
          uploadedDate: "2024-01-26",
          size: "2.8 MB",
        },
        {
          id: 2,
          name: "Capital_Account_Statement_Q4.pdf",
          uploadedBy: review.analyst,
          uploadedDate: "2024-01-26",
          size: "450 KB",
        },
        {
          id: 3,
          name: "Performance_Report_Q4_2024.xlsx",
          uploadedBy: "Michael Chen",
          uploadedDate: "2024-01-27",
          size: "1.2 MB",
        },
        {
          id: 4,
          name: "Portfolio_Analysis_Q4.pptx",
          uploadedBy: review.analyst,
          uploadedDate: "2024-01-28",
          size: "5.4 MB",
        },
        {
          id: 5,
          name: "Quarterly_Review_Memo_DRAFT.docx",
          uploadedBy: review.analyst,
          uploadedDate: "2024-01-29",
          size: "125 KB",
        },
        {
          id: 6,
          name: "Market_Comparison_Analysis.pdf",
          uploadedBy: "Jessica Liu",
          uploadedDate: "2024-01-29",
          size: "890 KB",
        },
      ]

      const analysis = [
        {
          id: 1,
          title: "Performance Metrics",
          type: "metrics",
          data: {
            nav: review.currentNAV,
            previousNav: review.previousNAV,
            change: "+7.4%",
            irr: review.irr,
            multiple: review.multiple,
          },
        },
        {
          id: 2,
          title: "Capital Activity",
          type: "capital",
          data: {
            called: "$2.5M",
            distributed: "$4.1M",
            netCashFlow: "+$1.6M",
          },
        },
      ]

      const history = [
        {
          id: 1,
          title: "Q3 2024 Review",
          date: "2023-10-31",
          status: "Completed",
          nav: "$48.7M",
        },
        {
          id: 2,
          title: "Q2 2024 Review",
          date: "2023-07-31",
          status: "Completed",
          nav: "$45.2M",
        },
        {
          id: 3,
          title: "Q1 2024 Review",
          date: "2023-04-30",
          status: "Completed",
          nav: "$43.8M",
        },
      ]

      const dataMap: Record<string, any[]> = {
        tasks,
        notes,
        emails,
        files,
        analysis,
        history,
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

    // Default placeholder for other reviews
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No {activeTab} found for this review</p>
        <p className="text-sm">Add some {activeTab} to get started</p>
      </div>
    )
  }

  // Function to get the appropriate icon for each attribute type
  const getAttributeIcon = (type: string, id: string) => {
    if (id === "currentNAV") return DollarSignIcon
    if (id === "dueDate") return CalendarIcon
    if (id === "assetClass") return TrendingUpIcon
    
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
                  {review.investmentName}
                </h4>
                <p className="text-xs text-gray-500 mt-1">{review.fundManager} • {review.assetClass}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-600">
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
          <CardContent
            className="pt-0 space-y-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-2">
              {attributes.map((attribute) => {
                const Icon = getAttributeIcon(attribute.type, attribute.id)
                const value = (review as any)[attribute.id]

                if (!value || attribute.id === "investmentName" || attribute.id === "fundManager") return null

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
      title={reviewTitle}
      recordType="Workflow"
      subtitle={reviewSubtitle}
      tabs={tabs}
      children={renderTabContent}
      detailsPanel={detailsPanel}
      onComposeEmail={() => {}}
      activityContent={<UnifiedActivitySection activities={generateWorkflowActivities()} />}
    />
  )
}

function SortableQuarterlyReviewCard({
  review,
  attributes,
}: {
  review: QuarterlyReview
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
    id: review.id,
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
      <QuarterlyReviewCard review={review} attributes={attributes} />
    </div>
  )
}

function DroppableColumn({
  stage,
  reviews,
  attributes,
}: {
  stage: { id: string; name: string; color: string }
  reviews: QuarterlyReview[]
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
              {reviews.length}
            </Badge>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-500 hover:text-gray-700">
            <PlusIcon className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="flex-1 bg-gray-50/50 rounded-b-xl border-l border-r border-b border-gray-200 p-3 space-y-3">
        <SortableContext items={reviews.map((r) => r.id)} strategy={verticalListSortingStrategy}>
          {reviews.map((review) => (
            <SortableQuarterlyReviewCard key={review.id} review={review} attributes={attributes} />
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

export function QuarterlyMonitoringKanban({ workflowConfig, initialReviews: propReviews }: QuarterlyMonitoringKanbanProps) {
  const [reviews, setReviews] = React.useState(propReviews || initialReviews)
  const [activeReview, setActiveReview] = React.useState<QuarterlyReview | null>(null)
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
    const review = reviews.find((r) => r.id === activeId)
    if (review) {
      setActiveReview(review)
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveReview(null)
    const { active, over } = event

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeReview = reviews.find((r) => r.id === activeId)
    if (!activeReview) return

    // Find which stage the item is being dropped on
    let targetStage = overId

    // If dropping on another review, find its stage
    if (!stagesList.some((s) => s.id === overId)) {
      const targetReview = reviews.find((r) => r.id === overId)
      if (targetReview) {
        targetStage = targetReview.stage
      }
    }

    // Update the review's stage if it's different
    if (activeReview.stage !== targetStage && stagesList.some((s) => s.id === targetStage)) {
      setReviews(reviews.map((review) => (review.id === activeId ? { ...review, stage: targetStage } : review)))
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

  const reviewsByStage = stagesList.map((stage) => ({
    stage,
    reviews: reviews.filter((review) => review.stage === stage.id),
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
        {reviewsByStage.map(({ stage, reviews }) => (
          <DroppableColumn key={stage.id} stage={stage} reviews={reviews} attributes={attributes} />
        ))}
        <AddColumnButton onAddColumn={() => setAddColumnDialogOpen(true)} />
      </div>
      <DragOverlay>
        {activeReview ? (
          <div className="w-80 opacity-80 shadow-lg">
            <QuarterlyReviewCard review={activeReview} attributes={attributes} />
          </div>
        ) : null}
      </DragOverlay>
      <AddColumnDialog open={addColumnDialogOpen} onOpenChange={setAddColumnDialogOpen} onAddColumn={handleAddColumn} />
    </DndContext>
  )
} 