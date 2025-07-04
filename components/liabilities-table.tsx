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
  FileIcon,
  MailIcon,
  FolderIcon,
  UsersIcon,
  BuildingIcon,
  DollarSignIcon,
  TrendingUpIcon,
  ClockIcon,
  MessageSquareIcon,
  BarChart3Icon,
  GitCompareIcon,
  DatabaseIcon,
  TrendingDownIcon,
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { MasterDrawer } from "@/components/master-drawer"
import { AddLiabilityDialog } from "./add-liability-dialog"
import { TabContentRenderer } from "@/components/shared/tab-content-renderer"
import { MasterDetailsPanel } from "@/components/shared/master-details-panel"
import { UnifiedActivitySection, ActivityItem } from "@/components/shared/unified-activity-section"
import { RecordCard } from "./shared/record-card"

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
    { id: "external-data", label: "External Data", count: null, icon: FolderIcon },
    { id: "notes", label: "Notes", count: 1, icon: FileIcon },
    { id: "files", label: "Files", count: 1, icon: FileTextIcon },
    { id: "tasks", label: "Tasks", count: 2, icon: ClockIcon },
    { id: "emails", label: "Emails", count: 1, icon: MailIcon },
    { id: "meetings", label: "Meetings", count: 1, icon: UsersIcon },
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

    if (activeTab === "external-data") {
      return <LiabilityExternalDataContent liability={liability} isFullScreen={false} />
    }

    // For other tabs, use TabContentRenderer instead of custom implementations
    const data = getLiabilityTabData(activeTab, liability)

    // Create custom tab renderers for special tabs
    const customTabRenderers = {
      details: (isFullScreen = false) => <LiabilityDetailsPanel liability={liability} isFullScreen={isFullScreen} />,
      company: (isFullScreen = false) => <LiabilityCompanyContent liability={liability} />,
      "external-data": (isFullScreen = false) => <LiabilityExternalDataContent liability={liability} isFullScreen={isFullScreen} />,
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
          title: "Debt Management Strategy Review",
          date: "1 week ago",
          author: "Michael Chen",
          content: `Liability Analysis - ${liability.name}

Executive Summary:
This memorandum provides a comprehensive review of the ${liability.name} facility and recommendations for optimizing our debt structure within the family office portfolio.

Current Facility Details:
• Liability: ${liability.name}
• Type: ${liability.type}
• Current Balance: ${liability.currentBalance}
• Interest Rate: ${liability.interestRate}
• Maturity Date: ${liability.maturityDate}
• Lender: ${liability.lender}
• Entity: ${liability.entity}

Market Analysis:
The current interest rate environment presents opportunities for refinancing consideration:
• Federal Reserve Rate: 5.50% (as of January 2025)
• Prime Rate: 8.50%
• Our Current Rate: ${liability.interestRate} (${parseFloat(liability.interestRate) < 5.0 ? "Below market - favorable" : parseFloat(liability.interestRate) > 6.0 ? "Above market - consider refinancing" : "At market"})

Refinancing Opportunity Assessment:
1. Current Market Rates:
   - Similar facilities: 4.75% - 5.50%
   - Our relationship pricing potential: 4.50% - 5.25%
   - Estimated annual savings: $125,000 - $180,000

2. Refinancing Costs:
   - Prepayment penalty: 2% of outstanding balance
   - Legal and closing costs: $45,000 - $65,000
   - Break-even period: 14-18 months

3. Alternative Structures:
   - Interest-only period to improve cash flow
   - Floating rate with cap protection
   - Partial prepayment to reduce exposure

Cash Flow Impact:
• Current Monthly Payment: ${liability.paymentAmount}
• Projected with Refinancing: ${liability.paymentAmount.replace(/\d+,\d+/, (match) => {
  const amount = parseInt(match.replace(",", ""));
  return Math.round(amount * 0.85).toLocaleString();
})}
• Monthly Cash Flow Improvement: ~15%

Strategic Considerations:
1. Portfolio Leverage:
   - Current debt/asset ratio: 32%
   - Target range: 30-35%
   - This facility represents 18% of total debt

2. Interest Rate Risk:
   - Fixed rate protects against rising rates
   - Consider partial hedge if moving to floating
   - Duration matching with asset portfolio

3. Entity Structure:
   - Current entity (${liability.entity}) appropriate
   - No tax optimization opportunities identified
   - Cross-default provisions reviewed and acceptable

Covenant Compliance:
✓ Debt Service Coverage Ratio: 2.8x (Required: 1.5x)
✓ Loan-to-Value: 65% (Maximum: 75%)
✓ Liquidity Covenant: $50M+ (Required: $25M)
✓ No technical defaults or waivers required

Lender Relationship:
• ${liability.lender} - 12-year relationship
• Other facilities: $35M total exposure
• Recent interactions positive
• Willing to discuss improved terms

Recommendations:
1. IMMEDIATE: Initiate refinancing discussions with ${liability.lender}
2. Get competing term sheets from 2-3 banks
3. Target 50-75 bps rate reduction minimum
4. Extend maturity by 2-3 years if possible
5. Maintain strong banking relationships

Risk Factors:
• Interest rate volatility
• Potential covenant tightening
• Refinancing market conditions
• Prepayment penalty economics

Next Steps:
1. Schedule meeting with ${liability.lender} relationship manager
2. Prepare refinancing package (financials, projections)
3. Engage legal counsel for document review
4. Model various scenarios for IC presentation
5. Target closing within 60-90 days

This liability is well-managed but presents optimization opportunity in current market.`,
          tags: ["Refinancing", "Cost Savings", "Debt Management", "Strategic Review"],
        },
        {
          id: 2,
          title: "Annual Lender Meeting Notes",
          date: "1 month ago",
          author: "Jessica Martinez",
          content: `Annual Review Meeting - ${liability.lender}

Date: December 10, 2024
Attendees: Family Office CFO, Treasurer, ${liability.lender} Relationship Team
Location: Lender's Executive Conference Room

Meeting Purpose:
Annual relationship review and discussion of facility terms, performance, and future opportunities.

Key Discussion Points:

1. Relationship Overview:
   • Total exposure: $45M across 3 facilities
   • 12-year relationship history
   • No defaults or covenant breaches
   • Consistently meets all payment obligations

2. Facility Performance - ${liability.name}:
   • Outstanding Balance: ${liability.currentBalance}
   • Payment History: Perfect - no late payments
   • Current Rate: ${liability.interestRate}
   • Maturity: ${liability.maturityDate}

3. Financial Update Provided:
   • Family Office AUM: $485M (up 12% YoY)
   • Liquidity Position: Strong ($75M+ available)
   • Debt/Asset Ratio: 32% (conservative)
   • Investment Performance: +15.3% YTD

4. Lender Feedback:
   "One of our strongest relationships. The family office demonstrates exceptional financial management and transparency. Credit committee views very favorably."

5. Opportunities Discussed:

   a) Rate Reduction:
      - Lender open to repricing discussion
      - Potential for 25-50 bps reduction
      - Requires formal request and updated financials

   b) New Facilities:
      - Pre-approved for additional $25M
      - Acquisition financing available
      - Specialized lending for art/collectibles

   c) Treasury Services:
      - Enhanced cash management platform
      - Foreign exchange services
      - Wealth management integration

6. Market Intelligence Shared:
   • Other family offices refinancing at 4.50-5.25%
   • Strong appetite for family office lending
   • ESG-linked pricing becoming available
   • Expect continued rate volatility in 2025

7. Covenant Discussion:
   • All covenants currently met with significant cushion
   • Lender willing to relax certain restrictions
   • Streamlined reporting requirements offered
   • Quarterly financials sufficient (vs monthly)

8. Relationship Enhancements:
   • Invitation to exclusive economic forums
   • Access to lender's research platform
   • Introduction to private banking team
   • Co-investment opportunities notification

Action Items from Meeting:

1. For Family Office:
   ✓ Provide updated financial package (by Dec 31)
   ✓ Submit formal rate reduction request
   ✓ Consider consolidating smaller facilities
   ✓ Explore ESG-linked pricing structure

2. For Lender:
   ✓ Prepare term sheet for rate reduction
   ✓ Arrange treasury platform demo
   ✓ Schedule private banking introduction
   ✓ Provide market comparables analysis

Key Takeaways:
• Excellent relationship standing
• Clear path to improved pricing
• Additional credit available if needed
• Lender values the relationship highly

Next Meeting: March 2025 (Quarterly Check-in)

Overall Assessment: VERY POSITIVE
The lender relationship remains strong with immediate opportunities for cost savings and service enhancements. Recommend pursuing rate reduction in Q1 2025.`,
          tags: ["Lender Meeting", "Relationship", "Annual Review"],
        },
        {
          id: 3,
          title: "Payment Optimization Analysis",
          date: "2 months ago",
          author: "Robert Kim",
          content: `Payment Strategy Optimization - ${liability.name}

Analysis Date: November 15, 2024
Current Payment: ${liability.paymentAmount}
Payment Frequency: Monthly

Executive Summary:
This analysis explores opportunities to optimize payment strategy for ${liability.name} to improve cash flow management and reduce total interest expense.

Current Payment Structure:
• Monthly Payment: ${liability.paymentAmount}
• Principal Portion: ~75% of payment
• Interest Portion: ~25% of payment
• Remaining Term: ${Math.floor(Math.random() * 10 + 5)} years
• Total Interest Remaining: $${Math.floor(Math.random() * 500 + 200)}K

Optimization Strategies Analyzed:

1. Accelerated Payment Schedule:
   Option A: Bi-weekly payments
   - Annual Savings: $45,000 in interest
   - Term Reduction: 2.5 years
   - Cash Flow Impact: Minimal
   
   Option B: 10% increased monthly payment
   - Annual Savings: $62,000 in interest
   - Term Reduction: 3.8 years
   - Cash Flow Impact: Moderate

2. Lump Sum Principal Reductions:
   - Annual bonus payment of $500K
   - Interest savings: $125K over life
   - Preserves monthly cash flow
   - Aligns with distribution timing

3. Refinancing vs. Paydown Analysis:
   - Refinancing saves more if rate reduction >75 bps
   - Paydown better if staying < 5 years
   - Hybrid approach may be optimal

Cash Flow Considerations:
• Current monthly obligations: $${Math.floor(Math.random() * 200 + 100)}K total
• Available for acceleration: $${Math.floor(Math.random() * 100 + 50)}K/month
• Seasonal variation in cash flows noted
• Maintain 6-month reserve requirement

Investment Opportunity Cost:
• Debt Rate: ${liability.interestRate}
• Expected Portfolio Return: 8-10%
• After-tax analysis favors investment over paydown
• Consider risk-adjusted returns

Tax Implications:
• Interest deductibility at 37% bracket
• Effective after-tax rate: ${(parseFloat(liability.interestRate) * 0.63).toFixed(2)}%
• State tax considerations included
• No change to entity structure recommended

Stress Testing Results:
Scenario 1: Rates increase 200 bps
- Current structure: No impact (fixed rate)
- Maintains payment stability

Scenario 2: Cash flow reduction 30%
- Current payments sustainable
- Acceleration strategies can be paused

Scenario 3: Investment losses 20%
- Debt coverage ratios remain strong
- No covenant concerns

Recommendations:
1. MAINTAIN current payment schedule
2. IMPLEMENT annual lump sum strategy
3. MONITOR refinancing opportunities
4. REVISIT if rates drop below 4.50%

Implementation Plan:
• Continue standard monthly payments
• Schedule annual principal payment for January
• Set rate alert for refinancing trigger
• Review quarterly with treasury team

Conclusion:
Current payment strategy is appropriate given market conditions and family office objectives. Opportunistic refinancing remains the best optimization path.`,
          tags: ["Payment Strategy", "Optimization", "Cash Flow"],
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
          uploadedBy: "Jessica Martinez",
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
  const activities: ActivityItem[] = [
    {
      id: 1,
      type: "payment",
      actor: "Robert Kim",
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

  return <UnifiedActivitySection activities={activities} />
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
                <Badge variant="outline" className="capitalize">
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

function LiabilityExternalDataContent({ liability, isFullScreen = false }: { liability: Liability; isFullScreen?: boolean }) {
  // State for collapsible sections
  const [openSections, setOpenSections] = React.useState({
    fieldComparison: true,
    dataSources: true, // Expanded by default
  })

  // State for expanded rows to show conflicting values
  const [expandedRows, setExpandedRows] = React.useState<Set<string>>(new Set())
  
  // State to track selected source for each field
  const [selectedSources, setSelectedSources] = React.useState<Record<string, string>>({})

  // State to track expanded source details
  const [expandedSources, setExpandedSources] = React.useState<Set<string>>(new Set())
  
  // State to track manually verified sources
  const [verifiedSources, setVerifiedSources] = React.useState<Set<string>>(new Set())
  
  // State to track flagged for review sources
  const [flaggedSources, setFlaggedSources] = React.useState<Set<string>>(new Set())

  // Toggle function for collapsible sections
  const toggleSection = (section: 'fieldComparison' | 'dataSources') => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Toggle expanded row
  const toggleRowExpansion = (fieldName: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev)
      if (newSet.has(fieldName)) {
        newSet.delete(fieldName)
      } else {
        newSet.add(fieldName)
      }
      return newSet
    })
  }
  
  // Set a specific source as the current value source for a field
  const setSourceForField = (fieldName: string, sourceName: string) => {
    setSelectedSources(prev => ({
      ...prev,
      [fieldName]: sourceName
    }))
  }

  // Mock external data sources - in production, this would come from your data layer
  const externalDataSources = [
    {
      id: "addepar",
      name: "Addepar",
      type: "Portfolio Management",
      lastSync: "2 hours ago",
      status: "synced",
      fieldsCount: 4,
      fields: [
        { 
          fieldName: "Current Balance", 
          value: "$12,485,320", 
          lastUpdated: "2025-01-30 14:23:00",
          confidence: "high",
          variance: "-0.12%",
          variantFromInternal: "$15,000"
        },
        { 
          fieldName: "Interest Rate", 
          value: "5.25%", 
          lastUpdated: "2025-01-30 14:23:00",
          confidence: "high",
          variance: undefined,
          variantFromInternal: undefined
        },
        { 
          fieldName: "Monthly Payment", 
          value: "$85,420", 
          lastUpdated: "2025-01-30 14:23:00",
          confidence: "calculated",
          variance: undefined,
          variantFromInternal: undefined
        },
        { 
          fieldName: "Remaining Term", 
          value: "18 months", 
          lastUpdated: "2025-01-30 14:23:00",
          confidence: "calculated",
          variance: undefined,
          variantFromInternal: undefined
        }
      ]
    },
    {
      id: "netsuite",
      name: "NetSuite",
      type: "Accounting",
      lastSync: "Yesterday",
      status: "synced",
      fieldsCount: 3,
      fields: [
        { 
          fieldName: "Current Balance", 
          value: "$12,500,320", 
          lastUpdated: "2025-01-29 18:00:00",
          confidence: "high",
          variance: "+0.12%",
          variantFromInternal: undefined
        },
        { 
          fieldName: "Principal Balance", 
          value: "$12,000,000", 
          lastUpdated: "2025-01-29 18:00:00",
          confidence: "verified",
          variance: undefined,
          variantFromInternal: undefined
        },
        { 
          fieldName: "Accrued Interest", 
          value: "$500,320", 
          lastUpdated: "2025-01-29 18:00:00",
          confidence: "high",
          variance: undefined,
          variantFromInternal: undefined
        }
      ]
    },
    {
      id: "bank-portal",
      name: "Bank Portal",
      type: "Lender Portal",
      lastSync: "3 days ago",
      status: "pending",
      fieldsCount: 3,
      fields: [
        { 
          fieldName: "Current Balance", 
          value: "$12,475,000", 
          lastUpdated: "2025-01-27 09:00:00",
          confidence: "medium",
          variance: "-0.08%",
          variantFromInternal: "$10,320"
        },
        { 
          fieldName: "Next Payment Due", 
          value: "February 15, 2025", 
          lastUpdated: "2025-01-27 09:00:00",
          confidence: "high",
          variance: undefined,
          variantFromInternal: undefined
        },
        { 
          fieldName: "Credit Line Available", 
          value: "$2,500,000", 
          lastUpdated: "2025-01-27 09:00:00",
          confidence: "high",
          variance: undefined,
          variantFromInternal: undefined
        }
      ]
    },
    {
      id: "loan-docs",
      name: "Loan Documents",
      type: "Document Extract",
      lastSync: "2 weeks ago",
      status: "manual",
      fieldsCount: 2,
      fields: [
        { 
          fieldName: "Original Amount", 
          value: "$15,000,000", 
          lastUpdated: "2025-01-15 00:00:00",
          confidence: "verified",
          variance: undefined,
          variantFromInternal: undefined,
          documentName: "Credit_Agreement_2024.pdf",
          pageNumber: 1
        },
        { 
          fieldName: "Maturity Date", 
          value: "June 30, 2026", 
          lastUpdated: "2025-01-15 00:00:00",
          confidence: "verified",
          variance: undefined,
          variantFromInternal: undefined,
          documentName: "Credit_Agreement_2024.pdf",
          pageNumber: 3
        }
      ]
    }
  ]

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "synced":
        return "default"
      case "pending":
        return "secondary"
      case "error":
        return "destructive"
      case "manual":
        return "outline"
      default:
        return "outline"
    }
  }

  const getConfidenceBadge = (confidence: string) => {
    switch (confidence) {
      case "high":
        return <Badge variant="outline" className="text-green-600 border-green-200 text-xs">High</Badge>
      case "medium":
        return <Badge variant="outline" className="text-yellow-600 border-yellow-200 text-xs">Medium</Badge>
      case "low":
        return <Badge variant="outline" className="text-red-600 border-red-200 text-xs">Low</Badge>
      case "verified":
        return <Badge variant="outline" className="text-blue-600 border-blue-200 text-xs">Verified</Badge>
      case "calculated":
        return <Badge variant="outline" className="text-purple-600 border-purple-200 text-xs">Calculated</Badge>
      default:
        return null
    }
  }

  // Group ALL fields by field name to show complete comparison
  const fieldComparison = React.useMemo(() => {
    const comparison: Record<string, Array<{
      source: string
      sourceType: string
      value: string
      lastUpdated: string
      confidence: string
      variance?: string
      documentName?: string
      pageNumber?: number
    }>> = {}

    externalDataSources.forEach(source => {
      source.fields.forEach((field: any) => {
        if (!comparison[field.fieldName]) {
          comparison[field.fieldName] = []
        }
        comparison[field.fieldName].push({
          source: source.name,
          sourceType: source.type,
          value: field.value,
          lastUpdated: field.lastUpdated,
          confidence: field.confidence,
          variance: field.variance,
          documentName: field.documentName,
          pageNumber: field.pageNumber
        })
      })
    })

    return comparison
  }, [externalDataSources])

  // Count conflicts for the badge
  const conflictCount = Object.values(fieldComparison).filter(sources => {
    return sources.length > 1 && new Set(sources.map(s => s.value)).size > 1
  }).length

  // Get the "truth" value for a field (highest priority source or user-selected)
  const getTruthValue = (fieldName: string, sources: Array<{
    source: string
    sourceType: string
    value: string
    lastUpdated: string
    confidence: string
    variance?: string
    documentName?: string
    pageNumber?: number
  }>) => {
    // If user has selected a specific source for this field, use that
    if (selectedSources[fieldName]) {
      const userSelected = sources.find(s => s.source === selectedSources[fieldName])
      if (userSelected) return userSelected
    }
    
    // Otherwise use priority order: verified > high > medium > low, then by recency
    const priorityOrder = { verified: 4, high: 3, medium: 2, low: 1, calculated: 2 }
    
    return sources.sort((a, b) => {
      const aPriority = priorityOrder[a.confidence as keyof typeof priorityOrder] || 0
      const bPriority = priorityOrder[b.confidence as keyof typeof priorityOrder] || 0
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority
      }
      
      // If same priority, sort by recency
      return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    })[0]
  }

  return (
    <div className="space-y-6">
      {/* Data Quality Insights - Match SectionCards styling */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="@container/card">
          <CardHeader className="relative">
            <CardDescription>Data Completeness</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              92%
            </CardTitle>
            <div className="absolute right-4 top-4">
              <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                <TrendingUpIcon className="size-4" />
                +4%
              </Badge>
            </div>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              All fields populated <TrendingUpIcon className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Recent values available
            </div>
          </CardFooter>
        </Card>
        
        <Card className="@container/card">
          <CardHeader className="relative">
            <CardDescription>Active Conflicts</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              {conflictCount}
            </CardTitle>
            <div className="absolute right-4 top-4">
              <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                {conflictCount > 0 ? (
                  <TrendingUpIcon className="size-3" />
                ) : (
                  <TrendingDownIcon className="size-3" />
                )}
                {conflictCount > 0 ? `+${conflictCount}` : '0'}
              </Badge>
            </div>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {conflictCount > 0 ? "Balance varies across systems" : "All systems aligned"} 
              {conflictCount > 0 ? <TrendingUpIcon className="size-4" /> : <TrendingDownIcon className="size-4" />}
            </div>
            <div className="text-muted-foreground">
              {conflictCount > 0 ? "Review required" : "No conflicts detected"}
            </div>
          </CardFooter>
        </Card>
        
        <Card className="@container/card">
          <CardHeader className="relative">
            <CardDescription>Last Bank Sync</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              3d
            </CardTitle>
            <div className="absolute right-4 top-4">
              <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                <TrendingUpIcon className="size-3" />
                Recent
              </Badge>
            </div>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Bank portal data <TrendingUpIcon className="size-4" />
            </div>
            <div className="text-muted-foreground">
              3 days old
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Field Comparison Table - Collapsible - Show truth values with expandable conflicts */}
      <div className="rounded-lg border border-muted overflow-hidden">
        <button 
          onClick={() => toggleSection('fieldComparison')}
          className={`w-full flex items-center justify-between p-3 transition-colors ${openSections.fieldComparison ? 'bg-muted/20' : ''}`}
        >
          <div className="flex items-center">
            {openSections.fieldComparison ? (
              <ChevronDownIcon className="h-4 w-4 text-muted-foreground mr-2" />
            ) : (
              <ChevronRightIcon className="h-4 w-4 text-muted-foreground mr-2" /> 
            )}
            <div className="flex items-center gap-2">
              <GitCompareIcon className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-sm">Field Comparison</span>
            </div>
          </div>
          {conflictCount > 0 && (
            <Badge variant="outline" className="text-xs">
              <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
              {conflictCount} conflict{conflictCount !== 1 ? 's' : ''}
            </Badge>
          )}
        </button>
        {openSections.fieldComparison && (
          <div className="px-3 pb-3 pt-2">
            <Card>
              <Table className="table-fixed w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30%]">Field</TableHead>
                    <TableHead className="w-[30%]">System Value</TableHead>
                    <TableHead className="w-[40%]">Selected Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(fieldComparison).map(([fieldName, sources]) => {
                    const hasConflict = sources.length > 1 && 
                      new Set(sources.map(s => s.value)).size > 1
                    const truthValue = getTruthValue(fieldName, sources)
                    const isExpanded = expandedRows.has(fieldName)

                    return (
                      <React.Fragment key={fieldName}>
                        <TableRow 
                          className={`group hover:bg-muted/50 cursor-pointer ${hasConflict ? "bg-yellow-50/30" : ""}`}
                          onClick={() => toggleRowExpansion(fieldName)}
                        >
                          <TableCell className="py-4 truncate">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center">
                                {isExpanded ? (
                                  <ChevronDownIcon className="h-3 w-3 text-muted-foreground" />
                                ) : (
                                  <ChevronRightIcon className="h-3 w-3 text-muted-foreground" />
                                )}
                              </div>
                              <span className="font-medium text-sm truncate">{fieldName}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-4 truncate">
                            <div className="font-medium text-sm truncate">
                              {/* Show internal value - in this mock, we use the liability data */}
                              {fieldName === "Current Balance" && liability.currentBalance}
                              {fieldName === "Original Amount" && liability.originalAmount}
                              {fieldName === "Interest Rate" && liability.interestRate}
                              {fieldName === "Maturity Date" && liability.maturityDate}
                              {!["Current Balance", "Original Amount", "Interest Rate", "Maturity Date"].includes(fieldName) && "—"}
                            </div>
                          </TableCell>
                          <TableCell className="py-4 truncate">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm truncate">{truthValue.value}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {getConfidenceBadge(truthValue.confidence)}
                                {hasConflict && (
                                  <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-200">
                                    Conflict
                                  </Badge>
                                )}
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <MoreVerticalIcon className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>Update System Value</DropdownMenuItem>
                                    <DropdownMenuItem>Keep Selected Value</DropdownMenuItem>
                                    <DropdownMenuItem>Flag for Review</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                        {/* Expanded state showing metadata and all source values */}
                        {isExpanded && (
                          <TableRow>
                            <TableCell colSpan={3} className="bg-muted/20 border-t-0 py-4">
                              <div className="space-y-4">
                                {/* All Sources */}
                                <div className="space-y-3">
                                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{sources.length} Sources</div>
                                  <div className="space-y-3">
                                    {sources.map((source, idx) => {
                                      const isActive = source.source === truthValue.source;
                                      const isExpanded = expandedSources.has(`${fieldName}-${idx}`);
                                      
                                      return (
                                        <div 
                                          key={idx}
                                          className={`group rounded-lg border bg-background p-4 hover:shadow-md transition-all cursor-pointer ${
                                            isActive ? 'border-primary shadow-sm' : 'border-muted hover:border-muted-foreground'
                                          }`}
                                          onClick={() => {
                                            setExpandedSources(prev => {
                                              const newSet = new Set(prev);
                                              if (newSet.has(`${fieldName}-${idx}`)) {
                                                newSet.delete(`${fieldName}-${idx}`);
                                              } else {
                                                newSet.add(`${fieldName}-${idx}`);
                                              }
                                              return newSet;
                                            });
                                          }}
                                        >
                                          {/* Main card content */}
                                          <div className="flex items-center justify-between">
                                            {/* Left side - Key information */}
                                            <div className="flex-1">
                                              {/* Primary row - Value (hero element) */}
                                              <div className="flex items-baseline gap-3 mb-2">
                                                <span className="text-lg font-semibold text-foreground">
                                                  {source.value}
                                                </span>
                                                {source.variance && (
                                                  <span className={`text-sm font-medium ${
                                                    source.variance.startsWith('+') ? 'text-green-600' : 'text-red-600'
                                                  }`}>
                                                    {source.variance}
                                                  </span>
                                                )}
                                                {isActive && (
                                                  <Badge className="bg-primary text-primary-foreground text-xs">
                                                    Selected
                                                  </Badge>
                                                )}
                                                {verifiedSources.has(`${fieldName}-${source.source}`) && (
                                                  <TooltipProvider>
                                                    <Tooltip delayDuration={300}>
                                                      <TooltipTrigger asChild>
                                                        <Badge className="bg-blue-600 text-white text-xs">
                                                          ✓ Verified
                                                        </Badge>
                                                      </TooltipTrigger>
                                                      <TooltipContent>
                                                        <p>Manually verified by authorized personnel</p>
                                                      </TooltipContent>
                                                    </Tooltip>
                                                  </TooltipProvider>
                                                )}
                                                {flaggedSources.has(`${fieldName}-${source.source}`) && (
                                                  <TooltipProvider>
                                                    <Tooltip delayDuration={300}>
                                                      <TooltipTrigger asChild>
                                                        <Badge className="bg-orange-600 text-white text-xs">
                                                          ⚠ Review
                                                        </Badge>
                                                      </TooltipTrigger>
                                                      <TooltipContent>
                                                        <p>Flagged for manual review</p>
                                                      </TooltipContent>
                                                    </Tooltip>
                                                  </TooltipProvider>
                                                )}
                                              </div>
                                              
                                              {/* Secondary row - Source info */}
                                              <div className="flex items-center gap-3 mb-1">
                                                <span className="font-medium text-sm text-foreground">
                                                  {source.source}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                  {source.sourceType}
                                                </span>
                                                <TooltipProvider>
                                                  <Tooltip delayDuration={300}>
                                                    <TooltipTrigger asChild>
                                                      <div className="cursor-help">
                                                        {getConfidenceBadge(source.confidence)}
                                                      </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                      <p>
                                                        {source.confidence === 'verified' ? 'Data manually reviewed and confirmed by fund administrator or authorized personnel' :
                                                         source.confidence === 'high' ? 'Recent data from established financial institution or fund administrator with strong track record' :
                                                         source.confidence === 'medium' ? 'Automated data from established source but may be delayed or require review' :
                                                         source.confidence === 'calculated' ? 'System-calculated value based on verified inputs and established formulas' :
                                                         'Data may be stale or from source requiring manual verification'}
                                                      </p>
                                                    </TooltipContent>
                                                  </Tooltip>
                                                </TooltipProvider>
                                              </div>
                                              
                                              {/* Tertiary row - Meta info */}
                                              <div className="text-xs text-muted-foreground">
                                                Updated {new Date(source.lastUpdated).toLocaleDateString()}
                                                {source.documentName && (
                                                  <span> • From {source.documentName} (p.{source.pageNumber})</span>
                                                )}
                                              </div>
                                            </div>

                                            {/* Right side - Actions */}
                                            <div className="flex items-center gap-2 ml-4">
                                              {/* Expand indicator */}
                                              <div className="text-muted-foreground">
                                                {isExpanded ? (
                                                  <ChevronDownIcon className="h-4 w-4" />
                                                ) : (
                                                  <ChevronRightIcon className="h-4 w-4" />
                                                )}
                                              </div>
                                              
                                              {/* Actions dropdown */}
                                              <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                  <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                    }}
                                                  >
                                                    <MoreVerticalIcon className="h-4 w-4" />
                                                  </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                  {!isActive && (
                                                    <DropdownMenuItem 
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSourceForField(fieldName, source.source);
                                                      }}
                                                    >
                                                      Use This Value
                                                    </DropdownMenuItem>
                                                  )}
                                                  <DropdownMenuItem
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      const sourceKey = `${fieldName}-${source.source}`;
                                                      setVerifiedSources(prev => {
                                                        const newSet = new Set(prev);
                                                        if (newSet.has(sourceKey)) {
                                                          newSet.delete(sourceKey);
                                                        } else {
                                                          newSet.add(sourceKey);
                                                        }
                                                        return newSet;
                                                      });
                                                    }}
                                                  >
                                                    {verifiedSources.has(`${fieldName}-${source.source}`) ? 'Remove Verification' : 'Mark as Verified'}
                                                  </DropdownMenuItem>
                                                  <DropdownMenuItem
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      const sourceKey = `${fieldName}-${source.source}`;
                                                      setFlaggedSources(prev => {
                                                        const newSet = new Set(prev);
                                                        if (newSet.has(sourceKey)) {
                                                          newSet.delete(sourceKey);
                                                        } else {
                                                          newSet.add(sourceKey);
                                                        }
                                                        return newSet;
                                                      });
                                                    }}
                                                  >
                                                    {flaggedSources.has(`${fieldName}-${source.source}`) ? 'Remove Flag' : 'Flag for Review'}
                                                  </DropdownMenuItem>
                                                </DropdownMenuContent>
                                              </DropdownMenu>
                                            </div>
                                          </div>
                                          
                                          {/* Expanded details */}
                                          {isExpanded && (
                                            <div className="mt-4 pt-4 border-t border-border">
                                              <div className="space-y-3">
                                                <h4 className="text-sm font-medium text-foreground mb-3">Source Details</h4>
                                                
                                                {/* Details in a more readable layout */}
                                                <div className="space-y-2">
                                                  <div className="flex justify-between">
                                                    <span className="text-sm text-muted-foreground">Confidence Level</span>
                                                    <span className="text-sm font-medium">{source.confidence}</span>
                                                  </div>
                                                  <div className="flex justify-between">
                                                    <span className="text-sm text-muted-foreground">Last Updated</span>
                                                    <span className="text-sm font-medium">
                                                      {new Date(source.lastUpdated).toLocaleDateString()} at {new Date(source.lastUpdated).toLocaleTimeString()}
                                                    </span>
                                                  </div>
                                                  <div className="flex justify-between">
                                                    <span className="text-sm text-muted-foreground">Data Source</span>
                                                    <span className="text-sm font-medium">
                                                      {source.documentName ? 'PDF Document' : 'API Integration'}
                                                    </span>
                                                  </div>
                                                  {source.variance && (
                                                    <div className="flex justify-between">
                                                      <span className="text-sm text-muted-foreground">Variance from System</span>
                                                      <span className="text-sm font-medium">{source.variance}</span>
                                                    </div>
                                                  )}
                                                  {source.documentName && (
                                                    <div className="flex justify-between">
                                                      <span className="text-sm text-muted-foreground">Document Source</span>
                                                      <span className="text-sm font-medium">{source.documentName} (p.{source.pageNumber})</span>
                                                    </div>
                                                  )}
                                                  <div className="flex justify-between">
                                                    <span className="text-sm text-muted-foreground">Refresh Cadence</span>
                                                    <span className="text-sm font-medium">
                                                      {source.source === 'Addepar' ? 'Real-time' : 
                                                       source.source === 'NetSuite' ? 'Daily' : 
                                                       source.source === 'Bank Portal' ? 'Daily' :
                                                       'Monthly'}
                                                    </span>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    )
                  })}
                </TableBody>
              </Table>
            </Card>
          </div>
        )}
      </div>

      {/* Connected Data Sources - Collapsible - Expanded by default */}
      <div className="rounded-lg border border-muted overflow-hidden">
        <button 
          onClick={() => toggleSection('dataSources')}
          className={`w-full flex items-center justify-between p-3 transition-colors ${openSections.dataSources ? 'bg-muted/20' : ''}`}
        >
          <div className="flex items-center">
            {openSections.dataSources ? (
              <ChevronDownIcon className="h-4 w-4 text-muted-foreground mr-2" />
            ) : (
              <ChevronRightIcon className="h-4 w-4 text-muted-foreground mr-2" /> 
            )}
            <div className="flex items-center gap-2">
              <DatabaseIcon className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-sm">Connected Data Sources</span>
            </div>
          </div>
        </button>
        {openSections.dataSources && (
          <div className="px-3 pb-3 pt-2">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Source</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Sync</TableHead>
                    <TableHead>Fields</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {externalDataSources.map((source) => (
                    <TableRow key={source.id}>
                      <TableCell className="font-medium text-sm">{source.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{source.type}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(source.status)} className="text-xs">
                          {source.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{source.lastSync}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{source.fieldsCount} fields</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          Sync
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        )}
      </div>

      {/* Recent Data Changes - No container, direct content */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Recent Data Changes</h3>
          <Button variant="link" className="h-auto p-0 text-xs text-blue-600">
            View full audit log
          </Button>
        </div>
        <UnifiedActivitySection 
          activities={[
            {
              id: 1,
              type: "data_sync",
              actor: "Bank Portal",
              action: "updated",
              target: "Current Balance",
              objectType: "field",
              timestamp: "3 days ago",
              date: "2025-01-27",
              details: {
                previousValue: "$12,500,000",
                newValue: "$12,475,000",
                source: "Automated sync",
                variance: "-0.2%"
              }
            },
            {
              id: 2,
              type: "document_upload",
              actor: "System",
              action: "processed",
              target: "Credit Agreement",
              objectType: "document",
              timestamp: "2 weeks ago",
              date: "2025-01-15",
              details: {
                fieldsUpdated: ["Original Amount", "Maturity Date"],
                extractionMethod: "Document upload",
                confidence: "verified"
              }
            },
            {
              id: 3,
              type: "calculation",
              actor: "System",
              action: "recalculated",
              target: "Monthly Payment",
              objectType: "metrics",
              timestamp: "2 hours ago",
              date: "2025-01-30",
              details: {
                calculationMethod: "Based on current balance and rate",
                newPayment: "$85,420",
                previousPayment: "$85,600"
              }
            }
          ]}
          showHeader={true}
          customFilterOptions={[
            { value: "all", label: "All Changes" },
            { value: "data_sync", label: "Updated" },
            { value: "document_upload", label: "Processed" },
            { value: "calculation", label: "Recalculated" },
            { value: "conflict_detected", label: "Conflicts" },
            { value: "sync", label: "Synced" }
          ]}
        />
      </div>
    </div>
  )
}

const columns: ColumnDef<Liability>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="h-8 -ml-2 px-2">
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
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <span className="text-sm">{row.original.type}</span>,
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
    accessorKey: "originalAmount",
    header: "Original Amount",
    cell: ({ row }) => <span className="text-sm">{row.original.originalAmount}</span>,
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
    accessorKey: "lender",
    header: "Lender",
    cell: ({ row }) => <span className="text-sm">{row.original.lender}</span>,
  },
  {
    accessorKey: "entity",
    header: "Entity",
    cell: ({ row }) => <span className="text-sm">{row.original.entity}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-xs capitalize">{row.original.status}</Badge>
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

