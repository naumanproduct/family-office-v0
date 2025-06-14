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
  ChevronLeftIcon,
  XIcon,
  LayoutIcon,
  MoreHorizontalIcon,
  ExternalLinkIcon,
  UnlinkIcon,
} from "lucide-react"
import { z } from "zod"
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuDraggableItem,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MasterDrawer } from "./master-drawer"
import { AddAssetDialog } from "./add-asset-dialog"
import { TabContentRenderer } from "@/components/shared/tab-content-renderer"
import { MasterDetailsPanel } from "@/components/shared/master-details-panel"
import { UnifiedDetailsPanel, type DetailSection } from "@/components/shared/unified-details-panel"
import { Label } from "@/components/ui/label"
import { UnifiedActivitySection, ActivityItem } from "./shared/unified-activity-section"

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
    { id: "performance", label: "Performance", count: null, icon: TrendingUpIcon },
    { id: "tasks", label: "Tasks", count: 2, icon: ClockIcon },
    { id: "notes", label: "Notes", count: 1, icon: MessageSquareIcon },
    { id: "meetings", label: "Meetings", count: 3, icon: CalendarIcon },
    { id: "emails", label: "Emails", count: 2, icon: MailIcon },
    { id: "files", label: "Files", count: 4, icon: FolderIcon },
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

    if (activeTab === "performance") {
      return <AssetPerformanceContent asset={asset} />
    }

    // For other tabs, use TabContentRenderer instead of custom implementations
    const data = getAssetTabData(activeTab, asset)

    // Create custom tab renderers for special tabs
    const customTabRenderers = {
      details: (isFullScreen = false) => <AssetDetailsPanel asset={asset} isFullScreen={isFullScreen} />,
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
    <MasterDrawer
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
    </MasterDrawer>
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
          author: "Sarah Johnson",
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
  };

  // Navigation function for when a chip is clicked
  const navigateToRecord = (recordType: string, id: number) => {
    console.log(`Navigate to ${recordType} record with ID: ${id}`);
    // This would be implemented to navigate to the record within the same panel
  };

  // Handler for adding a linked record
  const handleAddRecord = (sectionId: string) => {
    console.log(`Add linked ${sectionId} for ${asset.name}`);
    // In a real implementation, this would open a dialog to select records to link
  };
  
  // Handler for removing a linked record
  const handleUnlinkRecord = (sectionId: string, id: number) => {
    console.log(`Unlink ${sectionId} record with ID: ${id} from ${asset.name}`);
    // In a real implementation, this would remove the link between records
  };

  // Define all sections for the unified details panel
  const sections: DetailSection[] = [
    {
      id: "details",
      title: "Asset Details",
      icon: <FileTextIcon className="h-4 w-4 text-muted-foreground" />,
      fields: [
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
      ],
    },
    {
      id: "companies",
      title: "Companies",
      icon: <BuildingIcon className="h-4 w-4 text-muted-foreground" />,
      sectionData: {
        items: relatedData.companies,
      },
    },
    {
      id: "people",
      title: "People",
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      sectionData: {
        items: relatedData.people,
      },
    },
    {
      id: "entities",
      title: "Entities",
      icon: <LayoutIcon className="h-4 w-4 text-muted-foreground" />,
      sectionData: {
        items: relatedData.entities,
      },
    },
    {
      id: "investments",
      title: "Investments",
      icon: <DollarSignIcon className="h-4 w-4 text-muted-foreground" />,
      sectionData: {
        items: relatedData.investments,
      },
    },
    {
      id: "opportunities",
      title: "Opportunities",
      icon: <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />,
      sectionData: {
        items: relatedData.opportunities,
      },
    },
  ];

  return (
    <UnifiedDetailsPanel
      sections={sections}
      isFullScreen={isFullScreen}
      onNavigateToRecord={navigateToRecord}
      onAddRecord={handleAddRecord}
      onUnlinkRecord={handleUnlinkRecord}
      activityContent={<AssetActivityContent asset={asset} />}
    />
  );
}

function AssetActivityContent({ asset }: { asset: Asset }) {
  const activities: ActivityItem[] = [
    {
      id: 1,
      type: "distribution",
      actor: "ABC Fund",
      action: "issued",
      target: "Q2 dividend distribution",
      timestamp: "2 weeks ago",
      date: "2024-06-15",
      details: {
        amount: "$5,000",
        type: "Dividend",
        perShare: "$0.50",
        totalShares: "10,000",
        paymentDate: "June 15, 2024",
      },
    },
    {
      id: 2,
      type: "update",
      actor: "System",
      action: "updated the valuation to",
      target: "$220,000",
      timestamp: "1 month ago",
      date: "2024-05-30",
      details: {
        previousValue: "$200,000",
        newValue: "$220,000",
        change: "+10%",
        reason: "Market appreciation",
      },
    },
    {
      id: 3,
      type: "investment",
      actor: "You",
      action: "made an additional investment of",
      target: "$25,000",
      timestamp: "3 months ago",
      date: "2024-04-12",
      details: {
        amount: "$25,000",
        investmentType: "Follow-on",
        sector: "Technology",
        geography: "United States",
        approvalDate: "April 5, 2024",
        fundingDate: "April 12, 2024",
      },
    },
  ]

  return <UnifiedActivitySection activities={activities} />
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
      <div className="flex items-center justify-end">
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
  const [columnOrder, setColumnOrder] = React.useState<string[]>([])
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor), useSensor(KeyboardSensor))

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

  // Initialize column order from table columns
  React.useEffect(() => {
    const visibleColumns = table
      .getAllColumns()
      .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
      .map((column) => column.id);
    
    if (columnOrder.length === 0 && visibleColumns.length > 0) {
      setColumnOrder(visibleColumns);
    }
  }, [table.getAllColumns(), columnOrder]);

  // Handle drag end for column reordering
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active && over && active.id !== over.id) {
      setColumnOrder((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

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
              <DropdownMenuItem>Liquid assets</DropdownMenuItem>
              <DropdownMenuItem>Alternative investments</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>High performance</DropdownMenuItem>
              <DropdownMenuItem>Recently acquired</DropdownMenuItem>
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
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={columnOrder} strategy={verticalListSortingStrategy}>
                  {columnOrder.map((columnId) => {
                    const column = table.getColumn(columnId);
                    if (!column) return null;
                    
                    return (
                      <DropdownMenuDraggableItem
                        key={columnId}
                        id={columnId}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(checked) => column.toggleVisibility(checked)}
                      >
                        {columnId}
                      </DropdownMenuDraggableItem>
                    );
                  })}
                </SortableContext>
              </DndContext>
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
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="h-12 cursor-pointer hover:bg-muted/50"
                >
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

      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredRowModel().rows.length} asset(s) total.
      </div>
      
      <AddAssetDialog isOpen={isAddAssetDialogOpen} onClose={() => setIsAddAssetDialogOpen(false)} />
    </div>
  )
}
