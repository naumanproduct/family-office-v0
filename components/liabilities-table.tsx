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
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ColumnsIcon,
  FilterIcon,
  MoreVerticalIcon,
  PlusIcon,
  SearchIcon,
  SortAscIcon,
  SortDescIcon,
  FileTextIcon,
  MailIcon,
  FolderIcon,
  UsersIcon,
  BuildingIcon,
  DollarSignIcon,
  TrendingUpIcon,
  ClockIcon,
  MessageSquareIcon,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { MasterDrawer } from "@/components/master-drawer"
import { AddLiabilityDialog } from "./add-liability-dialog"
import { TabContentRenderer } from "@/components/shared/tab-content-renderer"
import { MasterDetailsPanel } from "@/components/shared/master-details-panel"

export const liabilitySchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.string(),
  category: z.string(),
  currentBalance: z.string(),
  originalAmount: z.string(),
  interestRate: z.string(),
  maturityDate: z.string(),
  nextPayment: z.string(),
  paymentAmount: z.string(),
  entity: z.string(),
  status: z.string(),
  lender: z.string(),
  collateral: z.string(),
})

export type Liability = z.infer<typeof liabilitySchema>

export const liabilitiesData: Liability[] = [
  {
    id: 1,
    name: "Credit Facility - Fund Operations",
    type: "Credit Line",
    category: "Operating Debt",
    currentBalance: "$12.5M",
    originalAmount: "$25.0M",
    interestRate: "4.25%",
    maturityDate: "2026-12-31",
    nextPayment: "2024-08-15",
    paymentAmount: "$44,270",
    entity: "Meridian Capital Fund III",
    status: "Current",
    lender: "First National Bank",
    collateral: "Fund Assets",
  },
  {
    id: 2,
    name: "Acquisition Financing - TechFlow",
    type: "Term Loan",
    category: "Investment Debt",
    currentBalance: "$8.2M",
    originalAmount: "$10.0M",
    interestRate: "6.75%",
    maturityDate: "2027-08-15",
    nextPayment: "2024-08-01",
    paymentAmount: "$92,150",
    entity: "Innovation Ventures LLC",
    status: "Current",
    lender: "Capital Investment Bank",
    collateral: "TechFlow Equity",
  },
  {
    id: 3,
    name: "Bridge Loan - Real Estate Fund",
    type: "Bridge Financing",
    category: "Development Debt",
    currentBalance: "$35.8M",
    originalAmount: "$40.0M",
    interestRate: "8.50%",
    maturityDate: "2025-03-31",
    nextPayment: "2024-08-10",
    paymentAmount: "$253,833",
    entity: "Real Estate Investment Trust",
    status: "Current",
    lender: "Development Finance Corp",
    collateral: "Property Portfolio",
  },
  {
    id: 4,
    name: "Subscription Credit Line",
    type: "Credit Line",
    category: "Capital Call Facility",
    currentBalance: "$0.0M",
    originalAmount: "$50.0M",
    interestRate: "3.85%",
    maturityDate: "2025-12-31",
    nextPayment: "N/A",
    paymentAmount: "N/A",
    entity: "Global Growth Partners",
    status: "Undrawn",
    lender: "International Credit Bank",
    collateral: "LP Commitments",
  },
  {
    id: 5,
    name: "Equipment Financing",
    type: "Equipment Loan",
    category: "Asset-Based Debt",
    currentBalance: "$2.1M",
    originalAmount: "$3.5M",
    interestRate: "5.25%",
    maturityDate: "2026-06-30",
    nextPayment: "2024-08-05",
    paymentAmount: "$18,750",
    entity: "Sustainable Infrastructure Fund",
    status: "Current",
    lender: "Equipment Finance Solutions",
    collateral: "Infrastructure Equipment",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Current":
      return "bg-green-100 text-green-800"
    case "Past Due":
      return "bg-red-100 text-red-800"
    case "Undrawn":
      return "bg-blue-100 text-blue-800"
    case "Matured":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

function LiabilityNameCell({ liability }: { liability: Liability }) {
  const tabs = [
    { id: "details", label: "Details", count: null, icon: FileTextIcon },
    { id: "performance", label: "Performance", count: null, icon: TrendingUpIcon },
    { id: "tasks", label: "Tasks", count: 2, icon: ClockIcon },
    { id: "notes", label: "Notes", count: 1, icon: MessageSquareIcon },
    { id: "meetings", label: "Meetings", count: 1, icon: UsersIcon },
    { id: "emails", label: "Emails", count: 1, icon: MailIcon },
    { id: "files", label: "Files", count: 1, icon: FolderIcon },
    { id: "company", label: "Company", count: null, icon: BuildingIcon },
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
      return <LiabilityDetailsPanel liability={liability} isFullScreen={false} />
    }

    if (activeTab === "company") {
      return <LiabilityCompanyContent liability={liability} />
    }

    if (activeTab === "performance") {
      return <LiabilityPerformanceContent liability={liability} />
    }

    // For other tabs, use TabContentRenderer instead of custom implementations
    const data = getLiabilityTabData(activeTab, liability)

    // Create custom tab renderers for special tabs
    const customTabRenderers = {
      details: (isFullScreen = false) => <LiabilityDetailsPanel liability={liability} isFullScreen={isFullScreen} />,
      company: (isFullScreen = false) => <LiabilityCompanyContent liability={liability} />,
      performance: (isFullScreen = false) => <LiabilityPerformanceContent liability={liability} />,
    }

    // Create a handler for "add" actions for empty states
    const handleAdd = () => {
      console.log(`Add new ${activeTab.slice(0, -1)} for ${liability.name}`)
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
    return <LiabilityDetailsPanel liability={liability} isFullScreen={isFullScreen} />
  }

  const customActions: React.ReactNode[] = []

  return (
    <MasterDrawer
      trigger={
        <Button variant="link" className="w-fit px-0 text-left text-foreground h-auto">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground text-xs font-medium">
              {liability.name.charAt(0)}
            </div>
            <span className="font-medium">{liability.name}</span>
          </div>
        </Button>
      }
      title={liability.name}
      recordType="Liabilities"
      subtitle={`${liability.type} • ${liability.category}`}
      tabs={tabs}
      detailsPanel={renderDetailsPanel}
      customActions={customActions}
    >
      {renderTabContent}
    </MasterDrawer>
  )
}

function getLiabilityTabData(activeTab: string, liability: Liability) {
  switch (activeTab) {
    case "emails":
      return [
        {
          id: 1,
          subject: "Payment Reminder",
          from: "lender@bank.com",
          date: "1 day ago",
          status: "Unread",
          preview: "Upcoming payment due for " + liability.name,
          type: "received",
        },
        {
          id: 2,
          subject: "Payment Confirmation",
          from: "me@company.com",
          date: "3 days ago",
          status: "Sent",
          preview: "Payment processed for " + liability.name,
          type: "sent",
        },
      ]
    case "tasks":
      return [
        {
          id: 1,
          title: "Process monthly payment",
          priority: "High",
          status: "pending",
          assignee: "You",
          dueDate: "Tomorrow",
          description: "Process monthly payment for " + liability.name,
        },
      ]
    case "notes":
      return [
        {
          id: 1,
          title: "Refinancing opportunity",
          date: "1 week ago",
          author: "Michael Chen",
          content: `Potential to refinance ${liability.name} at lower rate.`,
          tags: ["Refinancing", "Cost Savings"],
        },
      ]
    case "meetings":
      return [
        {
          id: 1,
          title: "Lender Review Meeting",
          date: "Next week",
          time: "10:00 AM - 11:00 AM",
          status: "Scheduled",
          location: "Conference Room B",
          attendees: 3,
          description: `Annual review meeting for ${liability.name}.`,
        },
      ]
    case "files":
      return [
        {
          id: 1,
          name: "Loan_Agreement.pdf",
          size: "3.2 MB",
          uploadedBy: "Legal Team",
          uploadedDate: "1 week ago",
          type: "pdf",
          description: "Original loan agreement and terms.",
        },
      ]
    case "team":
      return [
        {
          id: 1,
          name: "Michael Chen",
          role: "Debt Manager",
          email: "michael.chen@company.com",
          phone: "+1 (555) 987-6543",
          department: "Finance",
          joinDate: "2022-08-20",
          status: "Active",
        },
      ]
    case "company":
      return [
        {
          id: 1,
          name: liability.lender,
          role: "Lender",
          relationship: "Active",
          contactPerson: "Jane Smith",
          email: "j.smith@lender.com",
          phone: "(555) 123-4567",
        },
      ]
    default:
      return []
  }
}

function LiabilityActivityContent({ liability }: { liability: Liability }) {
  const [expandedActivity, setExpandedActivity] = React.useState<number | null>(null)

  const activities = [
    {
      id: 1,
      type: "payment",
      actor: "Finance Team",
      action: "processed payment for",
      target: liability.name,
      timestamp: "1 week ago",
      date: "2025-01-23",
      details: {
        amount: liability.paymentAmount,
        paymentDate: "2025-01-23",
        method: "Wire Transfer",
        principal: "$35,000",
        interest: "$9,270",
        remainingBalance: liability.currentBalance,
      },
    },
    {
      id: 2,
      type: "rate_change",
      actor: liability.lender,
      action: "adjusted interest rate for",
      target: liability.name,
      timestamp: "2 months ago",
      date: "2024-11-28",
      details: {
        previousRate: "4.75%",
        newRate: liability.interestRate,
        effectiveDate: "2024-12-01",
        reason: "Federal Reserve rate adjustment",
        impact: "Monthly payment increased by $150",
      },
    },
    {
      id: 3,
      type: "review",
      actor: "Investment Team",
      action: "conducted annual review of",
      target: liability.name,
      timestamp: "3 months ago",
      date: "2024-10-28",
      details: {
        reviewType: "Annual Credit Review",
        outcome: "Approved for renewal",
        recommendations: ["Consider refinancing at lower rate", "Maintain current payment schedule"],
        nextReview: "2025-10-28",
        creditRating: "A-",
      },
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "payment":
        return <div className="h-2 w-2 rounded-full bg-green-500"></div>
      case "rate_change":
        return <div className="h-2 w-2 rounded-full bg-orange-500"></div>
      case "review":
        return <div className="h-2 w-2 rounded-full bg-blue-500"></div>
      default:
        return <div className="h-2 w-2 rounded-full bg-gray-500"></div>
    }
  }

  const formatActivityText = (activity: any) => {
    return (
      <span>
        <span className="font-medium">{activity.actor}</span>{" "}
        <span className="text-muted-foreground">{activity.action}</span>{" "}
        <span className="font-medium">{activity.target}</span>
      </span>
    )
  }

  const renderExpandedDetails = (activity: any) => {
    switch (activity.type) {
      case "payment":
        return (
          <div className="mt-4 space-y-3">
            <div>
              <h5 className="text-sm font-medium mb-2">Payment Details</h5>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Total Amount:</span> <span>{activity.details.amount}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Payment Date:</span>{" "}
                  <span>{activity.details.paymentDate}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Principal:</span> <span>{activity.details.principal}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Interest:</span> <span>{activity.details.interest}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Method:</span> <span>{activity.details.method}</span>
                </div>
              </div>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-1">Remaining Balance</h5>
              <p className="text-sm text-muted-foreground">{activity.details.remainingBalance}</p>
            </div>
          </div>
        )
      case "rate_change":
        return (
          <div className="mt-4 space-y-3">
            <div>
              <h5 className="text-sm font-medium mb-2">Rate Change Details</h5>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Previous Rate:</span>{" "}
                  <span>{activity.details.previousRate}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">New Rate:</span> <span>{activity.details.newRate}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Effective Date:</span>{" "}
                  <span>{activity.details.effectiveDate}</span>
                </div>
              </div>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-1">Reason</h5>
              <p className="text-sm text-muted-foreground">{activity.details.reason}</p>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-1">Impact</h5>
              <p className="text-sm text-muted-foreground">{activity.details.impact}</p>
            </div>
          </div>
        )
      case "review":
        return (
          <div className="mt-4 space-y-3">
            <div>
              <h5 className="text-sm font-medium mb-2">Review Details</h5>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Review Type:</span> <span>{activity.details.reviewType}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Outcome:</span> <span>{activity.details.outcome}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Credit Rating:</span>{" "}
                  <span>{activity.details.creditRating}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Next Review:</span> <span>{activity.details.nextReview}</span>
                </div>
              </div>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-1">Recommendations</h5>
              <ul className="text-sm text-muted-foreground list-disc list-inside">
                {activity.details.recommendations.map((rec: string, index: number) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id}>
          <button
            onClick={() => setExpandedActivity(expandedActivity === activity.id ? null : activity.id)}
            className="flex items-start gap-3 w-full text-left p-3 rounded-lg border hover:bg-muted/50 transition-colors"
          >
            <div className="mt-1">{getActivityIcon(activity.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm">{formatActivityText(activity)}</div>
              <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
            </div>
            <ChevronDownIcon
              className={`h-4 w-4 text-muted-foreground transition-transform ${
                expandedActivity === activity.id ? "rotate-180" : ""
              }`}
            />
          </button>
          {expandedActivity === activity.id && (
            <div className="ml-6 pl-3 border-l-2 border-muted">{renderExpandedDetails(activity)}</div>
          )}
        </div>
      ))}
    </div>
  )
}

function LiabilityDetailsPanel({ liability, isFullScreen = false }: { liability: Liability; isFullScreen?: boolean }) {
  const fieldGroups = [
    {
      id: "liability-info",
      label: "Liability Details",
      icon: DollarSignIcon,
      fields: [
        { label: "Liability Name", value: liability.name },
        { label: "Type", value: liability.type },
        { label: "Category", value: liability.category },
        { label: "Current Balance", value: liability.currentBalance },
        { label: "Original Amount", value: liability.originalAmount },
        { label: "Interest Rate", value: liability.interestRate },
        { label: "Maturity Date", value: liability.maturityDate },
        { label: "Lender", value: liability.lender },
        { label: "Entity", value: liability.entity },
      ],
    },
  ]

  // Define additional content with Activity section
  const additionalContent = (
    <>
      {/* Show all values button */}
      <Button variant="link" className="h-auto p-0 text-xs text-blue-600">
        Show all values
      </Button>

      {/* Activity Section - Only in Drawer View */}
      {!isFullScreen && (
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-sm font-medium">Activity</h4>
            <Button variant="outline" size="sm">
              <PlusIcon className="h-4 w-4" />
              Add meeting
            </Button>
          </div>
          <LiabilityActivityContent liability={liability} />
        </div>
      )}
    </>
  )

  return (
    <MasterDetailsPanel fieldGroups={fieldGroups} isFullScreen={isFullScreen} additionalContent={additionalContent} />
  )
}

function LiabilityCompanyContent({ liability }: { liability: Liability }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary text-primary-foreground text-2xl font-bold">
              {liability.lender.charAt(0)}
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl">{liability.lender}</CardTitle>
              <CardDescription className="mt-1">Financial Institution • {liability.type}</CardDescription>
              <div className="mt-3 flex items-center gap-4">
                <Badge variant="outline">Lender</Badge>
                <Badge variant="outline" className={getStatusColor(liability.status)}>
                  {liability.status}
                </Badge>
                <span className="text-sm text-muted-foreground">Relationship since 2018</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Lender Overview</h4>
            <p className="text-sm text-muted-foreground">
              {liability.lender} is a leading financial institution that provides a wide range of banking services,
              including loans, mortgages, and lines of credit. They specialize in commercial real estate financing and
              have been a trusted partner for our organization for many years.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Key Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Loan Type:</span>
                  <span>{liability.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Interest Rate:</span>
                  <span>{liability.interestRate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Portfolio:</span>
                  <span>$15M+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Website:</span>
                  <span className="text-blue-600">www.lender.com</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Contact Info</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Relationship Manager:</span>
                  <span>Jane Smith</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="text-blue-600">j.smith@lender.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span>(555) 123-4567</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Recent Activity</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <span>Payment processed</span>
                <span className="text-muted-foreground">• 2 weeks ago</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Rate adjustment discussion</span>
                <span className="text-muted-foreground">• 1 month ago</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function LiabilityPerformanceContent({ liability }: { liability: Liability }) {
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
            Payment history chart would appear here
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Principal Paid</div>
            <div className="text-2xl font-semibold">
              $
              {Math.round(
                (Number.parseFloat(liability.originalAmount.replace(/[^0-9.]/g, "")) -
                  Number.parseFloat(liability.currentBalance.replace(/[^0-9.]/g, ""))) /
                  1000,
              )}
              k
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Interest Paid YTD</div>
            <div className="text-2xl font-semibold">$12.4k</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Payoff Progress</div>
            <div className="text-2xl font-semibold">42%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const columns: ColumnDef<Liability>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="h-8 px-2">
        Liability Name
        {column.getIsSorted() === "asc" ? (
          <SortAscIcon className="ml-2 h-3 w-3" />
        ) : column.getIsSorted() === "desc" ? (
          <SortDescIcon className="ml-2 h-3 w-3" />
        ) : null}
      </Button>
    ),
    cell: ({ row }) => <LiabilityNameCell liability={row.original} />,
    enableHiding: false,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => <span className="text-sm">{row.original.category}</span>,
  },
  {
    accessorKey: "currentBalance",
    header: "Current Balance",
    cell: ({ row }) => <span className="text-sm font-medium">{row.original.currentBalance}</span>,
  },
  {
    accessorKey: "interestRate",
    header: "Interest Rate",
    cell: ({ row }) => <span className="text-sm">{row.original.interestRate}</span>,
  },
  {
    accessorKey: "maturityDate",
    header: "Maturity Date",
    cell: ({ row }) => <span className="text-sm">{row.original.maturityDate}</span>,
  },
  {
    accessorKey: "nextPayment",
    header: "Next Payment",
    cell: ({ row }) => (
      <div>
        <p className="text-sm">{row.original.nextPayment}</p>
        <p className="text-xs text-muted-foreground">{row.original.paymentAmount}</p>
      </div>
    ),
  },
  {
    accessorKey: "entity",
    header: "Entity",
    cell: ({ row }) => <span className="text-sm">{row.original.entity}</span>,
  },
  {
    accessorKey: "lender",
    header: "Lender",
    cell: ({ row }) => <span className="text-sm">{row.original.lender}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge className={`text-xs ${getStatusColor(row.original.status)}`}>{row.original.status}</Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
            <MoreVerticalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem>View details</DropdownMenuItem>
          <DropdownMenuItem>Edit liability</DropdownMenuItem>
          <DropdownMenuItem>Make payment</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>View payment history</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

export function LiabilitiesTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
  const [columnOrder, setColumnOrder] = React.useState<string[]>([])
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor), useSensor(KeyboardSensor))

  const table = useReactTable({
    data: liabilitiesData,
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
              placeholder="Search liabilities..."
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
              <DropdownMenuItem>Current liabilities</DropdownMenuItem>
              <DropdownMenuItem>Past due</DropdownMenuItem>
              <DropdownMenuItem>Maturing soon</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Credit lines</DropdownMenuItem>
              <DropdownMenuItem>Term loans</DropdownMenuItem>
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
          <Button size="sm" onClick={() => setIsAddDialogOpen(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Liability
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
        {table.getFilteredRowModel().rows.length} liability(s) total.
      </div>
      
      <AddLiabilityDialog isOpen={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} />
    </div>
  )
}
