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
  BriefcaseIcon,
  ClipboardCheckIcon,
  SendIcon,
  DatabaseIcon,
  CheckSquareIcon,
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
import { MasterDrawer } from "./master-drawer"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { TabContentRenderer } from "@/components/shared/tab-content-renderer"
import { UnifiedDetailsPanel } from "@/components/shared/unified-details-panel"
import { buildStandardDetailSections } from "@/components/shared/detail-section-builder"
import { UnifiedActivitySection } from "@/components/shared/unified-activity-section"
import { generateWorkflowActivities } from "@/components/shared/activity-generators"

interface InvestmentOnboarding {
  id: string
  investmentName: string
  fundManager: string
  commitmentAmount: string
  investmentType: string
  leadPartner: string
  targetCloseDate: string
  status: string
  stage: string
  // Additional fields for detailed view
  description?: string
  entityName?: string
  bankAccount?: string
  wireStatus?: string
  legalDocuments?: string
  systemStatus?: string
  approvedBy?: string
  approvalDate?: string
  fundSize?: string
  ownership?: string
}

const initialOnboardings: InvestmentOnboarding[] = [
  {
    id: "1",
    investmentName: "Carlyle Growth Fund VI",
    fundManager: "Carlyle Group",
    commitmentAmount: "$25M",
    investmentType: "Private Equity",
    leadPartner: "Sarah Johnson",
    targetCloseDate: "2025-02-15",
    status: "In Progress",
    stage: "legal-setup",
    description: "Growth equity fund focused on technology and healthcare",
    entityName: "Family Office Master Fund LP",
    bankAccount: "Morgan Stanley ***1234",
    legalDocuments: "LPA under review",
    approvedBy: "Investment Committee",
    approvalDate: "2025-01-10",
    fundSize: "$8B",
    ownership: "Limited Partner",
  },
  {
    id: "2",
    investmentName: "Silver Lake Partners VII",
    fundManager: "Silver Lake",
    commitmentAmount: "$40M",
    investmentType: "Buyout",
    leadPartner: "Michael Chen",
    targetCloseDate: "2025-02-01",
    status: "Wire Pending",
    stage: "wire-sent",
    description: "Large-cap technology buyout fund",
    entityName: "Family Office Master Fund LP",
    bankAccount: "JPMorgan ***5678",
    wireStatus: "Initiated - Awaiting Confirmation",
    legalDocuments: "LPA executed",
    approvedBy: "Board of Directors",
    approvalDate: "2025-01-05",
    fundSize: "$20B",
    ownership: "Limited Partner",
  },
  {
    id: "3",
    investmentName: "Warburg Pincus Energy",
    fundManager: "Warburg Pincus",
    commitmentAmount: "$30M",
    investmentType: "Energy",
    leadPartner: "Jessica Liu",
    targetCloseDate: "2025-01-20",
    status: "Documents Pending",
    stage: "document-filing",
    description: "Energy transition and infrastructure fund",
    entityName: "Energy Investments LLC",
    bankAccount: "Goldman Sachs ***9012",
    wireStatus: "Completed",
    legalDocuments: "Side letter pending",
    systemStatus: "Ready for entry",
    approvedBy: "Investment Committee",
    approvalDate: "2024-12-20",
    fundSize: "$5.8B",
    ownership: "Limited Partner",
  },
  {
    id: "4",
    investmentName: "TPG Real Estate IV",
    fundManager: "TPG",
    commitmentAmount: "$20M",
    investmentType: "Real Estate",
    leadPartner: "David Park",
    targetCloseDate: "2025-01-15",
    status: "System Entry",
    stage: "system-entry",
    description: "Opportunistic real estate fund",
    entityName: "Real Estate Holdings I LLC",
    bankAccount: "BofA ***3456",
    wireStatus: "Completed",
    legalDocuments: "All executed",
    systemStatus: "Entering positions",
    approvedBy: "Investment Committee",
    approvalDate: "2024-12-15",
    fundSize: "$3.5B",
    ownership: "Limited Partner",
  },
]

interface InvestmentOnboardingKanbanProps {
  workflowConfig?: {
    attributes: Array<{ id: string; name: string; type: string }>
    stages: Array<{ id: string; name: string; color: string }>
  }
  initialOnboardings?: InvestmentOnboarding[]
}

// Default stages if no config provided
const defaultStages = [
  { id: "legal-setup", name: "Legal Setup", color: "bg-gray-100" },
  { id: "wire-sent", name: "Wire Sent", color: "bg-blue-100" },
  { id: "document-filing", name: "Document Filing", color: "bg-yellow-100" },
  { id: "system-entry", name: "System Entry", color: "bg-purple-100" },
  { id: "final-confirmation", name: "Final Confirmation", color: "bg-green-100" },
]

// Default attributes if no config provided
const defaultAttributes = [
  { id: "investmentName", name: "Investment", type: "text" },
  { id: "fundManager", name: "Fund Manager", type: "text" },
  { id: "commitmentAmount", name: "Commitment", type: "currency" },
  { id: "investmentType", name: "Type", type: "text" },
  { id: "leadPartner", name: "Lead Partner", type: "user" },
  { id: "targetCloseDate", name: "Target Close", type: "date" },
  { id: "status", name: "Status", type: "text" },
]

// Separate the card UI from the sortable wrapper
function InvestmentOnboardingCard({
  onboarding,
  attributes = defaultAttributes,
}: {
  onboarding: InvestmentOnboarding
  attributes?: Array<{ id: string; name: string; type: string }>
}) {
  // Determine onboarding stage
  const onboardingStage =
    onboarding.stage === "legal-setup"
      ? "Legal Setup"
      : onboarding.stage === "wire-sent"
      ? "Wire Sent"
      : onboarding.stage === "document-filing"
      ? "Document Filing"
      : onboarding.stage === "system-entry"
      ? "System Entry"
      : "Final Confirmation"

  // Create onboarding title
  const onboardingTitle = `${onboarding.investmentName} Onboarding`

  // Create onboarding subtitle
  const onboardingSubtitle = `${onboarding.fundManager} • ${onboarding.investmentType}`

  // Define tabs for the drawer
  const tabs = [
    { id: "details", label: "Details", count: null, icon: FileTextIcon },
    { id: "notes", label: "Notes", count: 3, icon: FileIcon },
    { id: "files", label: "Files", count: 8, icon: FileTextIcon },
    { id: "tasks", label: "Tasks", count: 12, icon: CheckCircleIcon },
    { id: "emails", label: "Emails", count: 5, icon: MailIcon },
    { id: "checklist", label: "Checklist", count: null, icon: ClipboardCheckIcon },
  ]

  // Create details panel function using shared builder
  const detailsPanel = (isFullScreen = false) => {
    const infoFields = [
      { label: "Investment", value: onboarding.investmentName },
      { label: "Fund Manager", value: onboarding.fundManager },
      { label: "Commitment Amount", value: onboarding.commitmentAmount },
      { label: "Investment Type", value: onboarding.investmentType },
      { label: "Lead Partner", value: onboarding.leadPartner },
      { label: "Target Close Date", value: onboarding.targetCloseDate },
      { label: "Entity", value: onboarding.entityName || "N/A" },
      { label: "Bank Account", value: onboarding.bankAccount || "N/A" },
      { label: "Wire Status", value: onboarding.wireStatus || "N/A" },
      { label: "Status", value: onboardingStage },
    ]

    // Provide mock related records only for the showcase onboarding
    const investments =
      onboarding.investmentName === "Carlyle Growth Fund VI"
        ? [
            {
              id: 1,
              name: onboarding.investmentName,
              amount: onboarding.commitmentAmount,
              status: "Onboarding",
            },
          ]
        : []

    const companies =
      onboarding.investmentName === "Carlyle Growth Fund VI"
        ? [{ id: 1, name: onboarding.fundManager, type: "Fund Manager" }]
        : []

    const entities =
      onboarding.investmentName === "Carlyle Growth Fund VI"
        ? [
            {
              id: 1,
              name: onboarding.entityName || "Family Office Master Fund LP",
              type: "Investment Entity",
            },
          ]
        : []

    const sections = buildStandardDetailSections({
      infoTitle: "Onboarding Information",
      infoIcon: <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />,
      infoFields,
      investments,
      companies,
      entities,
      opportunities: [],
      people: [
        { id: 1, name: onboarding.leadPartner, role: "Lead Partner" },
        { id: 2, name: "Operations Team", role: "Support" },
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
    // Provide rich mock content only for Carlyle fund to showcase workflow container concept
    if (onboarding.investmentName === "Carlyle Growth Fund VI") {
      // ------------------------------
      // Mock data definitions
      // ------------------------------
      const tasks = [
        {
          id: 1,
          title: "Review and execute LPA",
          priority: "High",
          status: "completed",
          assignee: "Legal Team",
          dueDate: "2025-01-20",
          description: "Review Limited Partnership Agreement and coordinate execution",
          relatedTo: { type: "Onboarding", name: onboarding.investmentName },
        },
        {
          id: 2,
          title: "Negotiate side letter terms",
          priority: "High",
          status: "in-progress",
          assignee: onboarding.leadPartner,
          dueDate: "2025-01-25",
          description: "Negotiate favorable terms for MFN, fees, and reporting",
          relatedTo: { type: "Onboarding", name: onboarding.investmentName },
        },
        {
          id: 3,
          title: "Complete KYC documentation",
          priority: "High",
          status: "in-progress",
          assignee: "Compliance Team",
          dueDate: "2025-01-28",
          description: "Submit all required KYC and AML documentation",
          relatedTo: { type: "Onboarding", name: onboarding.investmentName },
        },
        {
          id: 4,
          title: "Setup entity structure",
          priority: "Medium",
          status: "pending",
          assignee: "Tax Team",
          dueDate: "2025-01-30",
          description: "Confirm entity structure for investment",
          relatedTo: { type: "Onboarding", name: onboarding.investmentName },
        },
        {
          id: 5,
          title: "Obtain board approval",
          priority: "High",
          status: "pending",
          assignee: onboarding.leadPartner,
          dueDate: "2025-02-01",
          description: "Present to board for final approval",
          relatedTo: { type: "Onboarding", name: onboarding.investmentName },
        },
        {
          id: 6,
          title: "Setup wire instructions",
          priority: "High",
          status: "pending",
          assignee: "Treasury Team",
          dueDate: "2025-02-05",
          description: "Confirm wire instructions with fund administrator",
          relatedTo: { type: "Onboarding", name: onboarding.investmentName },
        },
        {
          id: 7,
          title: "Execute capital commitment",
          priority: "High",
          status: "pending",
          assignee: "CFO",
          dueDate: "2025-02-10",
          description: "Send initial capital commitment wire",
          relatedTo: { type: "Onboarding", name: onboarding.investmentName },
        },
        {
          id: 8,
          title: "File documents in DMS",
          priority: "Medium",
          status: "pending",
          assignee: "Operations Team",
          dueDate: "2025-02-12",
          description: "File all executed documents in document management system",
          relatedTo: { type: "Onboarding", name: onboarding.investmentName },
        },
        {
          id: 9,
          title: "Enter investment in portfolio system",
          priority: "High",
          status: "pending",
          assignee: "Portfolio Team",
          dueDate: "2025-02-13",
          description: "Create investment record in portfolio management system",
          relatedTo: { type: "Onboarding", name: onboarding.investmentName },
        },
        {
          id: 10,
          title: "Setup reporting cadence",
          priority: "Medium",
          status: "pending",
          assignee: "Investor Relations",
          dueDate: "2025-02-14",
          description: "Establish quarterly reporting and update schedule",
          relatedTo: { type: "Onboarding", name: onboarding.investmentName },
        },
        {
          id: 11,
          title: "Add to cash flow model",
          priority: "Medium",
          status: "pending",
          assignee: "Finance Team",
          dueDate: "2025-02-14",
          description: "Update cash flow projections with commitment",
          relatedTo: { type: "Onboarding", name: onboarding.investmentName },
        },
        {
          id: 12,
          title: "Final confirmation and close",
          priority: "High",
          status: "pending",
          assignee: onboarding.leadPartner,
          dueDate: "2025-02-15",
          description: "Confirm all steps complete and close onboarding",
          relatedTo: { type: "Onboarding", name: onboarding.investmentName },
        },
      ]

      const notes = [
        {
          id: 1,
          title: "IC approval memo",
          author: onboarding.leadPartner,
          date: "2025-01-10",
          tags: ["approval", "investment-committee"],
        },
        {
          id: 2,
          title: "Side letter negotiation points",
          author: "Legal Team",
          date: "2025-01-22",
          tags: ["legal", "negotiation"],
        },
        {
          id: 3,
          title: "Entity structure decision",
          author: "Tax Team",
          date: "2025-01-24",
          tags: ["tax", "structure"],
        },
      ]

      const emails = [
        {
          id: 1,
          subject: "Welcome to Carlyle Growth Fund VI",
          from: "investor.relations@carlyle.com",
          date: "2025-01-11",
          status: "Read",
        },
        {
          id: 2,
          subject: "LPA and Subscription Documents",
          from: "legal@carlyle.com",
          date: "2025-01-15",
          status: "Read",
        },
        {
          id: 3,
          subject: "KYC Requirements - Action Required",
          from: "compliance@carlyle.com",
          date: "2025-01-18",
          status: "Read",
        },
        {
          id: 4,
          subject: "Wire Instructions Confirmation",
          from: "fundadmin@carlyle.com",
          date: "2025-01-25",
          status: "Unread",
        },
        {
          id: 5,
          subject: "Capital Call Notice - Initial Close",
          from: "capitalcalls@carlyle.com",
          date: "2025-01-28",
          status: "Unread",
        },
      ]

      const files = [
        {
          id: 1,
          name: "Carlyle_Growth_VI_LPA_Final.pdf",
          uploadedBy: "Legal Team",
          uploadedDate: "2025-01-15",
          size: "4.5 MB",
        },
        {
          id: 2,
          name: "Subscription_Agreement_Draft.pdf",
          uploadedBy: "Legal Team",
          uploadedDate: "2025-01-16",
          size: "2.1 MB",
        },
        {
          id: 3,
          name: "Side_Letter_Template.docx",
          uploadedBy: onboarding.leadPartner,
          uploadedDate: "2025-01-20",
          size: "125 KB",
        },
        {
          id: 4,
          name: "Investment_Committee_Approval.pdf",
          uploadedBy: onboarding.leadPartner,
          uploadedDate: "2025-01-10",
          size: "890 KB",
        },
        {
          id: 5,
          name: "KYC_Checklist.xlsx",
          uploadedBy: "Compliance Team",
          uploadedDate: "2025-01-18",
          size: "45 KB",
        },
        {
          id: 6,
          name: "Wire_Instructions.pdf",
          uploadedBy: "Treasury Team",
          uploadedDate: "2025-01-25",
          size: "210 KB",
        },
        {
          id: 7,
          name: "Entity_Structure_Diagram.pdf",
          uploadedBy: "Tax Team",
          uploadedDate: "2025-01-24",
          size: "350 KB",
        },
        {
          id: 8,
          name: "Fund_Overview_Presentation.pptx",
          uploadedBy: "Carlyle",
          uploadedDate: "2025-01-05",
          size: "8.2 MB",
        },
      ]

      const checklist = [
        { id: 1, item: "Investment Committee Approval", status: "completed", completedBy: "Board", completedDate: "2025-01-10" },
        { id: 2, item: "Legal Documentation Review", status: "in-progress", assignee: "Legal Team" },
        { id: 3, item: "KYC/AML Compliance", status: "in-progress", assignee: "Compliance Team" },
        { id: 4, item: "Entity Structure Confirmation", status: "pending", assignee: "Tax Team" },
        { id: 5, item: "Wire Instructions Setup", status: "pending", assignee: "Treasury Team" },
        { id: 6, item: "Capital Transfer", status: "pending", assignee: "CFO" },
        { id: 7, item: "Document Filing", status: "pending", assignee: "Operations" },
        { id: 8, item: "System Entry", status: "pending", assignee: "Portfolio Team" },
        { id: 9, item: "Reporting Setup", status: "pending", assignee: "IR Team" },
        { id: 10, item: "Final Confirmation", status: "pending", assignee: onboarding.leadPartner },
      ]

      const dataMap: Record<string, any[]> = {
        tasks,
        notes,
        emails,
        files,
        checklist,
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

    // Default placeholder for other onboardings
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No {activeTab} found for this onboarding</p>
        <p className="text-sm">Add some {activeTab} to get started</p>
      </div>
    )
  }

  // Function to get the appropriate icon for each attribute type
  const getAttributeIcon = (type: string, id: string) => {
    if (id === "commitmentAmount") return DollarSignIcon
    if (id === "targetCloseDate") return CalendarIcon
    if (id === "fundManager") return BuildingIcon
    if (id === "investmentType") return BriefcaseIcon
    
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
                  {onboarding.investmentName}
                </h4>
                <p className="text-xs text-gray-500 mt-1">{onboarding.fundManager} • {onboarding.investmentType}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-600">
                    <MoreVerticalIcon className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>View Documents</DropdownMenuItem>
                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">Cancel Onboarding</DropdownMenuItem>
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
                const value = (onboarding as any)[attribute.id]

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
      title={onboardingTitle}
      recordType="Investment Onboarding"
      subtitle={onboardingSubtitle}
      tabs={tabs}
      children={renderTabContent}
      detailsPanel={detailsPanel}
      onComposeEmail={() => {}}
    />
  )
}

function SortableInvestmentOnboardingCard({
  onboarding,
  attributes,
}: {
  onboarding: InvestmentOnboarding
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
    id: onboarding.id,
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
      <InvestmentOnboardingCard onboarding={onboarding} attributes={attributes} />
    </div>
  )
}

function DroppableColumn({
  stage,
  onboardings,
  attributes,
}: {
  stage: { id: string; name: string; color: string }
  onboardings: InvestmentOnboarding[]
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
              {onboardings.length}
            </Badge>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-500 hover:text-gray-700">
            <PlusIcon className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="flex-1 bg-gray-50/50 rounded-b-xl border-l border-r border-b border-gray-200 p-3 space-y-3">
        <SortableContext items={onboardings.map((o) => o.id)} strategy={verticalListSortingStrategy}>
          {onboardings.map((onboarding) => (
            <SortableInvestmentOnboardingCard key={onboarding.id} onboarding={onboarding} attributes={attributes} />
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

export function InvestmentOnboardingKanban({ workflowConfig, initialOnboardings: propOnboardings }: InvestmentOnboardingKanbanProps) {
  const [onboardings, setOnboardings] = React.useState(propOnboardings || initialOnboardings)
  const [activeOnboarding, setActiveOnboarding] = React.useState<InvestmentOnboarding | null>(null)
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
    const onboarding = onboardings.find((o) => o.id === activeId)
    if (onboarding) {
      setActiveOnboarding(onboarding)
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveOnboarding(null)
    const { active, over } = event

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeOnboarding = onboardings.find((o) => o.id === activeId)
    if (!activeOnboarding) return

    // Find which stage the item is being dropped on
    let targetStage = overId

    // If dropping on another onboarding, find its stage
    if (!stagesList.some((s) => s.id === overId)) {
      const targetOnboarding = onboardings.find((o) => o.id === overId)
      if (targetOnboarding) {
        targetStage = targetOnboarding.stage
      }
    }

    // Update the onboarding's stage if it's different
    if (activeOnboarding.stage !== targetStage && stagesList.some((s) => s.id === targetStage)) {
      setOnboardings(onboardings.map((onboarding) => (onboarding.id === activeId ? { ...onboarding, stage: targetStage } : onboarding)))
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

  const onboardingsByStage = stagesList.map((stage) => ({
    stage,
    onboardings: onboardings.filter((onboarding) => onboarding.stage === stage.id),
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
        {onboardingsByStage.map(({ stage, onboardings }) => (
          <DroppableColumn key={stage.id} stage={stage} onboardings={onboardings} attributes={attributes} />
        ))}
        <AddColumnButton onAddColumn={() => setAddColumnDialogOpen(true)} />
      </div>
      <DragOverlay>
        {activeOnboarding ? (
          <div className="w-80 opacity-80 shadow-lg">
            <InvestmentOnboardingCard onboarding={activeOnboarding} attributes={attributes} />
          </div>
        ) : null}
      </DragOverlay>
      <AddColumnDialog open={addColumnDialogOpen} onOpenChange={setAddColumnDialogOpen} onAddColumn={handleAddColumn} />
    </DndContext>
  )
} 