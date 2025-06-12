"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  ChevronDownIcon,
  ColumnsIcon,
  FilterIcon,
  PlusIcon,
  SearchIcon,
  BuildingIcon,
  FileTextIcon,
  CalendarIcon,
  FolderIcon,
  DollarSignIcon,
  TrendingUpIcon,
  MailIcon,
  ClockIcon,
  MessageSquareIcon,
  Users,
  LayoutIcon,
  MoreHorizontalIcon,
  ExternalLinkIcon,
  UnlinkIcon,
} from "lucide-react"
import { z } from "zod"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AddAssetDialog } from "./add-asset-dialog"
import { TabContentRenderer } from "@/components/shared/tab-content-renderer"
import { ClientDrawerWrapper } from "./client-drawer-wrapper"
import { Label } from "@/components/ui/label"

export const assetSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.string(),
  category: z.string(),
  currentValue: z.string(),
  originalCost: z.string(),
  unrealizedGain: z.string(),
  percentageGain: z.number(),
  acquisitionDate: z.string(),
  lastValuation: z.string(),
  entity: z.string(),
  status: z.string(),
  sector: z.string(),
  geography: z.string(),
})

export type Asset = z.infer<typeof assetSchema>

export const assetsData: Asset[] = [
  {
    id: 1,
    name: "TechFlow Ventures Series C",
    type: "Equity Investment",
    category: "Private Equity",
    currentValue: "$18.5M",
    originalCost: "$15.0M",
    unrealizedGain: "$3.5M",
    percentageGain: 23.3,
    acquisitionDate: "2023-08-15",
    lastValuation: "2024-06-30",
    entity: "Meridian Capital Fund III",
    status: "Active",
    sector: "Enterprise Software",
    geography: "North America",
  },
  {
    id: 2,
    name: "MedInnovate Seed Round",
    type: "Equity Investment",
    category: "Venture Capital",
    currentValue: "$4.2M",
    originalCost: "$3.0M",
    unrealizedGain: "$1.2M",
    percentageGain: 40.0,
    acquisitionDate: "2024-01-30",
    lastValuation: "2024-06-30",
    entity: "Innovation Ventures LLC",
    status: "Active",
    sector: "Healthcare Technology",
    geography: "North America",
  },
  {
    id: 3,
    name: "PayFlow Solutions Growth",
    type: "Equity Investment",
    category: "Growth Capital",
    currentValue: "$22.8M",
    originalCost: "$25.0M",
    unrealizedGain: "-$2.2M",
    percentageGain: -8.8,
    acquisitionDate: "2023-10-15",
    lastValuation: "2024-06-30",
    entity: "Global Growth Partners",
    status: "Under Review",
    sector: "Financial Technology",
    geography: "Global",
  },
  {
    id: 4,
    name: "Urban Development Fund II",
    type: "Fund Investment",
    category: "Real Estate",
    currentValue: "$85.6M",
    originalCost: "$80.0M",
    unrealizedGain: "$5.6M",
    percentageGain: 7.0,
    acquisitionDate: "2022-09-30",
    lastValuation: "2024-03-31",
    entity: "Real Estate Investment Trust",
    status: "Active",
    sector: "Real Estate",
    geography: "North America",
  },
  {
    id: 5,
    name: "Green Energy Infrastructure",
    type: "Direct Investment",
    category: "Infrastructure",
    currentValue: "$45.2M",
    originalCost: "$40.0M",
    unrealizedGain: "$5.2M",
    percentageGain: 13.0,
    acquisitionDate: "2023-03-15",
    lastValuation: "2024-06-30",
    entity: "Sustainable Infrastructure Fund",
    status: "Active",
    sector: "Clean Energy",
    geography: "Europe",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800"
    case "Under Review":
      return "bg-yellow-100 text-yellow-800"
    case "Exited":
      return "bg-blue-100 text-blue-800"
    case "Written Off":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getGainColor = (percentage: number) => {
  if (percentage > 0) return "text-green-600"
  if (percentage < 0) return "text-red-600"
  return "text-gray-600"
}

function AssetNameCell({ asset }: { asset: Asset }) {
  const tabs = [
    { id: "details", label: "Details", count: null, icon: FileTextIcon },
    { id: "tasks", label: "Tasks", count: 2, icon: ClockIcon },
    { id: "notes", label: "Notes", count: 1, icon: MessageSquareIcon },
    { id: "meetings", label: "Meetings", count: 3, icon: CalendarIcon },
    { id: "emails", label: "Emails", count: 2, icon: MailIcon },
    { id: "files", label: "Files", count: 4, icon: FolderIcon },
    { id: "company", label: "Company", count: null, icon: BuildingIcon },
    { id: "performance", label: "Performance", count: null, icon: TrendingUpIcon },
  ]

  const renderTabContent = (
    activeTab: string,
    viewMode: "card" | "list" | "table",
    setSelectedTask?: (task: any) => void,
    setSelectedNote?: (note: any) => void,
    setSelectedMeeting?: (meeting: any) => void,
    setSelectedEmail?: (email: any) => void,
  ) => {
    if (activeTab === "details") {
      return <AssetDetailsPanel asset={asset} isFullScreen={false} />
    }

    if (activeTab === "company") {
      return <AssetCompanyContent asset={asset} />
    }

    if (activeTab === "performance") {
      return <AssetPerformanceContent asset={asset} />
    }

    // For other tabs, use TabContentRenderer instead of custom implementations
    const data = getAssetTabData(activeTab, asset)

    // Create custom tab renderers for special tabs
    const customTabRenderers = {
      details: (isFullScreen = false) => <AssetDetailsPanel asset={asset} isFullScreen={isFullScreen} />,
      company: (isFullScreen = false) => <AssetCompanyContent asset={asset} />,
      performance: (isFullScreen = false) => <AssetPerformanceContent asset={asset} />,
    }

    // Create a handler for "add" actions for empty states
    const handleAdd = () => {
      console.log(`Add new ${activeTab.slice(0, -1)} for ${asset.name}`)
      // In a real implementation, this would open the appropriate modal or form
    }

    return (
      <TabContentRenderer
        activeTab={activeTab}
        viewMode={viewMode}
        data={data}
        customTabRenderers={customTabRenderers}
        onTaskClick={setSelectedTask}
        onNoteClick={setSelectedNote}
        onMeetingClick={setSelectedMeeting}
        onEmailClick={setSelectedEmail}
        onAdd={handleAdd}
      />
    )
  }

  const renderDetailsPanel = (isFullScreen = false) => {
    return <AssetDetailsPanel asset={asset} isFullScreen={isFullScreen} />
  }

  const customActions: React.ReactNode[] = []

  return (
    <ClientDrawerWrapper
      trigger={
        <Button variant="link" className="w-fit px-0 text-left text-foreground h-auto">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground text-xs font-medium">
              {asset.name.charAt(0)}
            </div>
            <span className="font-medium">{asset.name}</span>
          </div>
        </Button>
      }
      title={asset.name}
      recordType="Assets"
      subtitle={`${asset.type} • ${asset.category}`}
      tabs={tabs}
      detailsPanel={renderDetailsPanel}
      customActions={customActions}
    >
      {renderTabContent}
    </ClientDrawerWrapper>
  )
}

function getAssetTabData(activeTab: string, asset: Asset) {
  switch (activeTab) {
    case "emails":
      return [
        {
          id: 1,
          subject: "Investment Performance Update",
          from: "portfolio@company.com",
          date: "2 hours ago",
          status: "Unread",
          preview: "Quarterly performance report for your investment in " + asset.name,
          type: "received",
        },
        {
          id: 2,
          subject: "Valuation Update Required",
          from: "me@company.com",
          date: "1 day ago",
          status: "Sent",
          preview: "Please provide updated valuation for " + asset.name,
          type: "sent",
        },
      ]
    case "tasks":
      return [
        {
          id: 1,
          title: "Review quarterly performance",
          priority: "High",
          status: "pending",
          assignee: "You",
          dueDate: "Tomorrow",
          description: "Review Q3 performance metrics and prepare summary report.",
        },
        {
          id: 2,
          title: "Update valuation model",
          priority: "Medium",
          status: "completed",
          assignee: "You",
          dueDate: "2 days ago",
          description: "Updated valuation model with latest market data.",
        },
        {
          id: 3,
          title: "Capital Call",
          priority: "High",
          status: "In Progress",
          assignee: "You",
          dueDate: "2024-01-15",
          description: "Process capital call for TechFlow Ventures Series C investment",
          subtasks: [
            {
              id: "CC-1",
              title: "Review Capital Call Notice PDF",
              description: "Open and understand key terms (amount, due date)",
              status: "Completed",
              priority: "High",
              assignee: "You",
              dueDate: "2024-01-10",
              subtasks: [],
            },
            {
              id: "CC-2",
              title: "Validate with Principal",
              description: "Confirm LP or internal commitment matches",
              status: "Completed",
              priority: "High",
              assignee: "You",
              dueDate: "2024-01-11",
              subtasks: [],
            },
            {
              id: "CC-3",
              title: "Record in System",
              description: "Log in accounting system or ledger",
              status: "In Progress",
              priority: "Medium",
              assignee: "You",
              dueDate: "2024-01-12",
              subtasks: [],
            },
            {
              id: "CC-4",
              title: "Notify Accountant",
              description: "Forward or tag accountant for payment setup",
              status: "To Do",
              priority: "Medium",
              assignee: "Sarah Johnson",
              dueDate: "2024-01-13",
              subtasks: [],
            },
            {
              id: "CC-5",
              title: "Confirm Wire Date",
              description: "Align on when funds will be sent",
              status: "To Do",
              priority: "High",
              assignee: "You",
              dueDate: "2024-01-14",
              subtasks: [],
            },
            {
              id: "CC-6",
              title: "Follow-Up if Not Funded",
              description: "If deadline passes, notify appropriate party",
              status: "To Do",
              priority: "Medium",
              assignee: "You",
              dueDate: "2024-01-16",
              subtasks: [],
            },
            {
              id: "CC-7",
              title: "Mark as Complete",
              description: "Close the call internally",
              status: "To Do",
              priority: "Low",
              assignee: "You",
              dueDate: "2024-01-17",
              subtasks: [],
            },
          ],
        },
      ]
    case "notes":
      return [
        {
          id: 1,
          title: "Investment thesis review",
          date: "3 days ago",
          content: `Strong performance in ${asset.sector} sector. Key growth drivers remain intact.`,
          tags: ["Investment", "Review"],
        },
      ]
    case "meetings":
      return [
        {
          id: 1,
          title: "Portfolio Review Meeting",
          date: "Tomorrow",
          time: "2:00 PM - 3:00 PM",
          status: "Confirmed",
          location: "Conference Room A",
          attendees: 5,
          description: `Quarterly review of ${asset.name} performance.`,
        },
      ]
    case "files":
      return [
        {
          id: 1,
          name: "Investment_Agreement.pdf",
          size: "2.4 MB",
          uploadedBy: "Legal Team",
          uploadedDate: "2 days ago",
          type: "pdf",
          description: "Original investment agreement and terms.",
        },
      ]
    case "team":
      return [
        {
          id: 1,
          name: "Sarah Johnson",
          role: "Portfolio Manager",
          email: "sarah.johnson@company.com",
          phone: "+1 (555) 123-4567",
          department: "Investments",
          joinDate: "2023-01-15",
          status: "Active",
        },
      ]
    default:
      return []
  }
}

function AssetDetailsPanel({ asset, isFullScreen = false }: { asset: Asset; isFullScreen?: boolean }) {
  // Add state for collapsible sections
  const [openSections, setOpenSections] = React.useState<{
    details: boolean
    company: boolean
    people: boolean
    entities: boolean
    investments: boolean
    opportunities: boolean
  }>({
    details: true, // Details expanded by default
    company: false,
    people: false,
    entities: false,
    investments: false,
    opportunities: false,
  })

  // Add state for showing all values
  const [showingAllValues, setShowingAllValues] = React.useState(false)

  // Toggle function for collapsible sections
  const toggleSection = (section: "details" | "company" | "people" | "entities" | "investments" | "opportunities") => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Mock data for related entities
  const relatedData = {
    companies: [
      { id: 1, name: "TechFlow Inc.", type: "Portfolio Company" },
      { id: 2, name: "Meridian Capital", type: "Investment Fund" },
    ],
    people: [
      { id: 1, name: "Sarah Johnson", role: "CEO" },
      { id: 2, name: "Michael Chen", role: "Investment Manager" },
      { id: 3, name: "David Williams", role: "Board Member" },
    ],
    entities: [
      { id: 1, name: "Trust #1231", type: "Family Trust" },
      { id: 2, name: "Offshore Holdings LLC", type: "Holding Company" },
    ],
    investments: [
      { id: 1, name: "Series B Round", amount: "$5M" },
      { id: 2, name: "Series C Round", amount: "$10M" },
    ],
    opportunities: [
      { id: 1, name: "Expansion Funding", status: "In Discussion" },
      { id: 2, name: "Strategic Partnership", status: "Initial Review" },
    ],
  }

  // Basic fields for collapsed view
  const basicFields = [
    {
      label: "Asset Name",
      value: asset.name,
    },
    {
      label: "Asset Type",
      value: asset.type,
    },
    {
      label: "Investment Thesis",
      value: `Strategic investment in ${asset.sector} sector with strong growth potential and market leadership position...`,
    },
    {
      label: "Owning Entity",
      value: asset.entity,
      isLink: true,
    },
    {
      label: "Acquisition Date",
      value: asset.acquisitionDate,
    },
    {
      label: "Current Value",
      value: asset.currentValue,
    },
    {
      label: "Performance",
      value: (
        <span className={getGainColor(asset.percentageGain)}>
          {asset.unrealizedGain} ({asset.percentageGain > 0 ? "+" : ""}
          {asset.percentageGain}%)
        </span>
      ),
    },
  ]

  // Extended fields for "Show all" view
  const extendedFields = [
    {
      label: "Asset Name",
      value: asset.name,
    },
    {
      label: "Asset Type",
      value: asset.type,
    },
    {
      label: "Category",
      value: asset.category,
    },
    {
      label: "Investment Thesis",
      value: `Strategic investment in ${asset.sector} sector with strong growth potential and market leadership position...`,
    },
    {
      label: "Owning Entity",
      value: asset.entity,
      isLink: true,
    },
    {
      label: "Status",
      value: asset.status,
    },
    {
      label: "Acquisition Date",
      value: asset.acquisitionDate,
    },
    {
      label: "Last Valuation",
      value: asset.lastValuation,
    },
    {
      label: "Current Value",
      value: asset.currentValue,
    },
    {
      label: "Original Cost",
      value: asset.originalCost,
    },
    {
      label: "Unrealized Gain",
      value: asset.unrealizedGain,
    },
    {
      label: "Performance",
      value: (
        <span className={getGainColor(asset.percentageGain)}>
          {asset.unrealizedGain} ({asset.percentageGain > 0 ? "+" : ""}
          {asset.percentageGain}%)
        </span>
      ),
    },
    {
      label: "Sector",
      value: asset.sector,
    },
    {
      label: "Geography",
      value: asset.geography,
    },
  ]

  // Navigation function for when a chip is clicked
  const navigateToRecord = (recordType: string, id: number) => {
    console.log(`Navigate to ${recordType} record with ID: ${id}`)
    // This would be implemented to navigate to the record within the same panel
    // For example, this could update state to show the record details
  }

  // Render the detail fields
  const renderFields = (fields: typeof basicFields, showAllButton = false) => (
    <div className="space-y-3">
      {fields.map((field, index) => (
        <div key={index} className="flex items-center">
          {/* Field name aligned directly with section icons (matching the ml-2 of icons) */}
          <Label className="text-xs text-muted-foreground w-28 shrink-0 ml-2">{field.label}</Label>

          {/* Field value */}
          {field.isLink ? (
            <p className="text-sm text-blue-600 flex-1">{field.value}</p>
          ) : (
            <p className="text-sm flex-1">{field.value}</p>
          )}
        </div>
      ))}
      {showAllButton && (
        <div className="flex items-center mt-2">
          <Button
            variant="link"
            className="h-auto p-0 text-xs text-blue-600 ml-2"
            onClick={() => setShowingAllValues(true)}
          >
            Show all
          </Button>
        </div>
      )}
    </div>
  )

  // Items section for related data
  const ItemsSection = ({
    items,
  }: {
    items: any[]
  }) => {
    // Mock function for adding a linked record
    const handleAddRecord = (e: React.MouseEvent) => {
      e.stopPropagation()
      console.log("Add linked record")
      // In a real implementation, this would open a dialog to select records to link
    }

    // Mock function for removing a linked record
    const handleUnlinkRecord = (e: React.MouseEvent, id: number) => {
      e.stopPropagation()
      console.log(`Unlink record with ID: ${id}`)
      // In a real implementation, this would remove the link between records
    }

    // Mock function for viewing a linked record
    const handleViewRecord = (e: React.MouseEvent, id: number) => {
      e.stopPropagation()
      console.log(`View record with ID: ${id}`)
      // In a real implementation, this would navigate to the record's details
    }

    return (
      <div className="ml-2 group/section">
        <div className="flex flex-col space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between group">
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-muted/50 transition-colors flex items-center gap-1 py-1 w-fit font-normal"
                onClick={() => navigateToRecord(item.type || item.role || "", item.id)}
              >
                {item.name}
              </Badge>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontalIcon className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                  <DropdownMenuItem onClick={(e) => handleViewRecord(e, item.id)}>
                    <ExternalLinkIcon className="mr-2 h-3.5 w-3.5" />
                    <span>View</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={(e) => handleUnlinkRecord(e, item.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <UnlinkIcon className="mr-2 h-3.5 w-3.5" />
                    <span>Unlink</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="mt-2 text-xs text-muted-foreground opacity-0 group-hover/section:opacity-100 transition-opacity"
          onClick={handleAddRecord}
        >
          <PlusIcon className="h-3 w-3 mr-1" />
          Add
        </Button>
      </div>
    )
  }

  // Apple-style section headers and content
  const sections = [
    {
      id: "details",
      title: "Record Details",
      icon: FileTextIcon,
      content: renderFields(showingAllValues ? extendedFields : basicFields, !showingAllValues),
      count: null,
    },
    {
      id: "company",
      title: "Company",
      icon: BuildingIcon,
      content: <ItemsSection items={relatedData.companies} />,
      count: relatedData.companies.length,
    },
    {
      id: "people",
      title: "People",
      icon: Users,
      content: <ItemsSection items={relatedData.people} />,
      count: relatedData.people.length,
    },
    {
      id: "entities",
      title: "Entities",
      icon: LayoutIcon,
      content: <ItemsSection items={relatedData.entities} />,
      count: relatedData.entities.length,
    },
    {
      id: "investments",
      title: "Investments",
      icon: DollarSignIcon,
      content: <ItemsSection items={relatedData.investments} />,
      count: relatedData.investments.length,
    },
    {
      id: "opportunities",
      title: "Opportunities",
      icon: TrendingUpIcon,
      content: <ItemsSection items={relatedData.opportunities} />,
      count: relatedData.opportunities.length,
    },
  ]

  return (
    <div className="px-6 pt-2 pb-6">
      {/* Unified container with Apple-style cohesive design */}
      <div className="rounded-lg border border-muted overflow-hidden">
        {sections.map((section, index) => {
          const isOpen = openSections[section.id as keyof typeof openSections]
          const Icon = section.icon

          return (
            <React.Fragment key={section.id}>
              {/* Divider between sections (except for the first one) */}
              {index > 0 && <div className="h-px bg-muted mx-3" />}

              {/* Section Header */}
              <button
                onClick={() =>
                  toggleSection(
                    section.id as "details" | "company" | "people" | "entities" | "investments" | "opportunities",
                  )
                }
                className={`w-full flex items-center justify-between p-3 hover:bg-muted/20 transition-colors ${isOpen ? "bg-muted/20" : ""}`}
              >
                <div className="flex items-center">
                  <Icon className="h-4 w-4 text-muted-foreground ml-2" />
                  <h4 className="text-sm font-medium ml-2">{section.title}</h4>

                  {/* Show count badge for sections that have counts */}
                  {section.count !== null && (
                    <Badge variant="secondary" className="ml-1 h-5 px-1.5 rounded-full text-xs">
                      {section.count}
                    </Badge>
                  )}
                </div>
                <ChevronDownIcon
                  className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Section Content with smooth height transition */}
              {isOpen && <div className="px-3 pb-3 pt-2 group/section">{section.content}</div>}
            </React.Fragment>
          )
        })}
      </div>

      {/* Activity Section - Only in Drawer View */}
      {!isFullScreen && (
        <div className="mt-8">
          <div className="mb-4">
            <h4 className="text-sm font-medium">Activity</h4>
          </div>
          <AssetActivityContent asset={asset} />
        </div>
      )}
    </div>
  )
}

function AssetActivityContent({ asset }: { asset: Asset }) {
  const [expandedActivity, setExpandedActivity] = React.useState<number | null>(null)

  const activities = [
    {
      id: 1,
      type: "valuation",
      actor: "Portfolio Team",
      action: "updated valuation for",
      target: asset.name,
      timestamp: "2 days ago",
      date: "2025-01-28",
      details: {
        previousValue: "$17.2M",
        newValue: asset.currentValue,
        reason: "Q4 2024 performance review and market comparables analysis",
        methodology: "DCF and comparable company analysis",
      },
    },
    {
      id: 2,
      type: "distribution",
      actor: asset.name,
      action: "distributed",
      target: "$500K",
      timestamp: "1 week ago",
      date: "2025-01-23",
      details: {
        amount: "$500,000",
        type: "Quarterly Distribution",
        perShare: "$2.50",
        totalShares: "200,000",
        paymentDate: "2025-01-25",
      },
    },
    {
      id: 3,
      type: "investment",
      actor: "Investment Committee",
      action: "approved investment in",
      target: asset.name,
      timestamp: "6 months ago",
      date: "2024-08-15",
      details: {
        amount: asset.originalCost,
        investmentType: asset.type,
        sector: asset.sector,
        geography: asset.geography,
        approvalDate: "2024-08-10",
        fundingDate: "2024-08-15",
      },
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "valuation":
        return <div className="h-2 w-2 rounded-full bg-blue-500"></div>
      case "distribution":
        return <div className="h-2 w-2 rounded-full bg-green-500"></div>
      case "investment":
        return <div className="h-2 w-2 rounded-full bg-purple-500"></div>
      default:
        return <div className="h-2 w-2 rounded-full bg-gray-500"></div>
    }
  }

  const formatActivityText = (activity: any) => {
    switch (activity.type) {
      case "valuation":
        return (
          <span className="text-sm">
            <span className="font-medium">{activity.actor}</span>{" "}
            <span className="text-muted-foreground">{activity.action}</span>{" "}
            <Badge variant="outline" className="text-xs mx-1">
              {activity.target}
            </Badge>
          </span>
        )
      case "distribution":
        return (
          <span className="text-sm">
            <span className="font-medium">{activity.actor}</span>{" "}
            <span className="text-muted-foreground">{activity.action}</span>{" "}
            <span className="font-medium text-green-600">{activity.target}</span>
          </span>
        )
      case "investment":
        return (
          <span className="text-sm">
            <span className="font-medium">{activity.actor}</span>{" "}
            <span className="text-muted-foreground">{activity.action}</span>{" "}
            <span className="font-medium">{activity.target}</span>
          </span>
        )
      default:
        return (
          <span className="text-sm">
            <span className="font-medium">{activity.actor}</span>{" "}
            <span className="text-muted-foreground">{activity.action}</span>{" "}
            <span className="font-medium">{activity.target}</span>
          </span>
        )
    }
  }

  const renderExpandedDetails = (activity: any) => {
    switch (activity.type) {
      case "valuation":
        return (
          <div className="mt-4 space-y-3">
            <div>
              <h5 className="text-sm font-medium mb-2">Valuation Update</h5>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Previous Value:</span>{" "}
                  <span>{activity.details.previousValue}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">New Value:</span>{" "}
                  <span className="font-medium">{activity.details.newValue}</span>
                </div>
              </div>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-1">Methodology</h5>
              <p className="text-sm text-muted-foreground">{activity.details.methodology}</p>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-1">Reason</h5>
              <p className="text-sm text-muted-foreground">{activity.details.reason}</p>
            </div>
          </div>
        )
      case "distribution":
        return (
          <div className="mt-4 space-y-3">
            <div>
              <h5 className="text-sm font-medium mb-2">Distribution Details</h5>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Amount:</span> <span>{activity.details.amount}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Type:</span> <span>{activity.details.type}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Per Share:</span> <span>{activity.details.perShare}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Shares:</span>{" "}
                  <span>{activity.details.totalShares}</span>
                </div>
              </div>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-1">Payment Date</h5>
              <p className="text-sm text-muted-foreground">{activity.details.paymentDate}</p>
            </div>
          </div>
        )
      case "investment":
        return (
          <div className="mt-4 space-y-3">
            <div>
              <h5 className="text-sm font-medium mb-2">Investment Details</h5>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Amount:</span> <span>{activity.details.amount}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Type:</span> <span>{activity.details.investmentType}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Sector:</span> <span>{activity.details.sector}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Geography:</span> <span>{activity.details.geography}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Approval Date:</span>{" "}
                <span>{activity.details.approvalDate}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Funding Date:</span> <span>{activity.details.fundingDate}</span>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-2">
      {activities.map((activity) => {
        const isExpanded = expandedActivity === activity.id

        return (
          <div key={activity.id} className={`${isExpanded ? "border rounded-lg overflow-hidden" : ""}`}>
            <div
              className={`flex items-center ${isExpanded ? "p-3 border-b bg-muted/20" : "py-2 px-3"} cursor-pointer`}
              onClick={() => setExpandedActivity(isExpanded ? null : activity.id)}
            >
              <div className="flex items-center flex-1">
                {getActivityIcon(activity.type)}
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <div>{formatActivityText(activity)}</div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{activity.timestamp}</span>
                  </div>
                </div>
              </div>
            </div>

            {isExpanded && <div className="p-3">{renderExpandedDetails(activity)}</div>}
          </div>
        )
      })}
    </div>
  )
}

function AssetCompanyContent({ asset }: { asset: Asset }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary text-primary-foreground text-2xl font-bold">
              AC
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl">Acme Corporation</CardTitle>
              <CardDescription className="mt-1">Technology • San Francisco, CA</CardDescription>
              <div className="mt-3 flex items-center gap-4">
                <Badge variant="outline">Enterprise</Badge>
                <Badge variant="outline" className="text-green-600">
                  Active Customer
                </Badge>
                <span className="text-sm text-muted-foreground">Founded 2015</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Company Overview</h4>
            <p className="text-sm text-muted-foreground">
              Acme Corporation is a leading technology company specializing in enterprise software solutions. They
              provide innovative tools for project management, team collaboration, and business analytics to Fortune 500
              companies worldwide. With over 500 employees and offices in 12 countries, Acme has established itself as a
              trusted partner for digital transformation initiatives.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Key Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Industry:</span>
                  <span>Technology</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Employees:</span>
                  <span>500-1000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Revenue:</span>
                  <span>$50M - $100M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Website:</span>
                  <span className="text-blue-600">acme.com</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Contact Info</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="text-blue-600">info@acme.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Address:</span>
                  <span>123 Tech St, SF, CA</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Recent Activity</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Contract renewed for $250K</span>
                <span className="text-muted-foreground">• 2 weeks ago</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <span>New contact added: Sarah Johnson</span>
                <span className="text-muted-foreground">• 1 month ago</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AssetPerformanceContent({ asset }: { asset: Asset }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Performance</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            1Y
          </Button>
          <Button variant="outline" size="sm">
            3Y
          </Button>
          <Button variant="outline" size="sm">
            5Y
          </Button>
          <Button variant="outline" size="sm">
            All
          </Button>
        </div>
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Performance chart would appear here
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Total Return</div>
            <div className={`text-2xl font-semibold ${getGainColor(asset.percentageGain)}`}>
              {asset.percentageGain > 0 ? "+" : ""}
              {asset.percentageGain}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">IRR</div>
            <div className="text-2xl font-semibold">12.4%</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">MOIC</div>
            <div className="text-2xl font-semibold">1.8x</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const columns: ColumnDef<Asset>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <AssetNameCell asset={row.original} />,
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "currentValue",
    header: "Current Value",
  },
  {
    accessorKey: "originalCost",
    header: "Original Cost",
  },
  {
    accessorKey: "unrealizedGain",
    header: "Unrealized Gain",
  },
  {
    accessorKey: "percentageGain",
    header: "Percentage Gain",
    cell: ({ row }) => {
      const percentage = row.original.percentageGain
      const gainColor = getGainColor(percentage)
      return (
        <span className={gainColor}>
          {percentage > 0 ? "+" : ""}
          {percentage}%
        </span>
      )
    },
  },
  {
    accessorKey: "acquisitionDate",
    header: "Acquisition Date",
  },
  {
    accessorKey: "lastValuation",
    header: "Last Valuation",
  },
  {
    accessorKey: "entity",
    header: "Entity",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status
      const statusColor = getStatusColor(status)
      return <Badge className={statusColor}>{status}</Badge>
    },
  },
  {
    accessorKey: "sector",
    header: "Sector",
  },
  {
    accessorKey: "geography",
    header: "Geography",
  },
]

export function AssetsTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [isAddAssetDialogOpen, setIsAddAssetDialogOpen] = React.useState(false)

  const table = useReactTable({
    data: assetsData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
  })

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search assets..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-8 w-[300px]"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <FilterIcon className="mr-2 h-4 w-4" />
                Filter
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px]">
              <DropdownMenuItem>Active assets</DropdownMenuItem>
              <DropdownMenuItem>High performers</DropdownMenuItem>
              <DropdownMenuItem>Under review</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Private equity</DropdownMenuItem>
              <DropdownMenuItem>Venture capital</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ColumnsIcon className="mr-2 h-4 w-4" />
                Columns
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              {table
                .getAllColumns()
                .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" onClick={() => setIsAddAssetDialogOpen(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Asset
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="h-10">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="h-12">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <AddAssetDialog isOpen={isAddAssetDialogOpen} onClose={() => setIsAddAssetDialogOpen(false)} />
    </div>
  )
}
