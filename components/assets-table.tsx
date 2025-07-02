"use client"

import * as React from "react"
import {
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
import { ChevronDownIcon, ColumnsIcon, FilterIcon, PlusIcon, SearchIcon, ChevronRightIcon, GitCompareIcon, DatabaseIcon, ClockIcon } from "lucide-react"
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
  DropdownMenuContent,
  DropdownMenuDraggableItem,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AddAssetDialog } from "./add-asset-dialog"
import { MasterDrawer } from "./master-drawer"
import { FileTextIcon,
  FileIcon, MailIcon, CheckCircleIcon, StickyNoteIcon, CalendarIcon, FolderIcon, UsersIcon, BuildingIcon, LandmarkIcon, BarChartIcon, TrendingUpIcon, TrendingDownIcon } from "lucide-react"
import { TabContentRenderer } from "@/components/shared/tab-content-renderer"
import { UnifiedDetailsPanel } from "@/components/shared/unified-details-panel"
import { buildStandardDetailSections } from "@/components/shared/detail-section-builder"
import { UnifiedActivitySection, type ActivityItem } from "@/components/shared/unified-activity-section"
import { generateInvestmentActivities } from "@/components/shared/activity-generators"
import { Card, CardContent, CardHeader, CardDescription, CardFooter, CardTitle } from "@/components/ui/card"
import { MoreVerticalIcon } from "lucide-react"
import { RecordCard } from "./shared/record-card"

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
  {
    id: 6,
    name: "KKR North America Fund VII",
    type: "Fund Investment",
    category: "Private Equity",
    currentValue: "$12.5M",
    originalCost: "$10.0M",
    unrealizedGain: "$2.5M",
    percentageGain: 25.0,
    acquisitionDate: "2020-03-15",
    lastValuation: "2024-12-31",
    entity: "Family Office Master Fund LP",
    status: "Active",
    sector: "Growth Companies",
    geography: "North America",
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

interface AssetsTableProps {
  onAssetClick?: (asset: Asset) => void
}

function AssetNameCell({ asset }: { asset: Asset }) {
  const tabs = [
    { id: "details", label: "Details", count: null, icon: FileTextIcon },
    { id: "external-data", label: "External Data", count: null, icon: DatabaseIcon },
    { id: "notes", label: "Notes", count: 3, icon: FileIcon },
    { id: "files", label: "Files", count: 1, icon: FileTextIcon },
    { id: "tasks", label: "Tasks", count: 1, icon: CheckCircleIcon },
    { id: "emails", label: "Emails", count: 1, icon: MailIcon },
    { id: "meetings", label: "Meetings", count: 1, icon: CalendarIcon },
    { id: "team", label: "Team", count: 1, icon: UsersIcon },
  ]

  const getAssetTabData = (activeTab: string) => {
    // Provide specific data for KKR North America Fund VII
    if (asset.name === "KKR North America Fund VII") {
      switch (activeTab) {
        case "tasks":
          return [
            { id: 1, title: "Q4 2024 Capital Account Review", priority: "High", status: "In Progress", assignee: "Sarah Chen", dueDate: "February 15, 2025" },
            { id: 2, title: "Annual GP Meeting Preparation", priority: "Medium", status: "Pending", assignee: "Michael Torres", dueDate: "March 1, 2025" },
            { id: 3, title: "Tax K-1 Processing", priority: "High", status: "Pending", assignee: "Tax Team", dueDate: "March 15, 2025" },
            { id: 4, title: "Side Letter Amendment Review", priority: "Low", status: "Pending", assignee: "Legal Team", dueDate: "April 1, 2025" },
          ]
        case "emails":
          return [
            { id: 1, subject: "Q4 2024 Capital Account Statement Available", from: "ir@kkr.com", date: "January 25, 2025", status: "Read", preview: "Your Q4 2024 capital account statement is now available for download..." },
            { id: 2, subject: "Portfolio Company Update - December 2024", from: "updates@kkr.com", date: "January 15, 2025", status: "Read", preview: "Monthly portfolio company performance highlights and key developments..." },
            { id: 3, subject: "Capital Call Notice - Fund VII", from: "capitalcalls@kkr.com", date: "December 10, 2024", status: "Read", preview: "You are hereby notified of a capital call in the amount of $850,000..." },
            { id: 4, subject: "Annual Meeting Invitation - March 2025", from: "events@kkr.com", date: "January 5, 2025", status: "Unread", preview: "You are cordially invited to KKR's Annual Limited Partner Meeting..." },
          ]
        case "notes":
          return [
            { 
              id: 1, 
              title: "KKR Fund VII Performance Review", 
              author: "Investment Committee", 
              date: "January 20, 2025", 
              topic: "Performance Review", 
              content: `KKR North America Fund VII - Annual Performance Review

Review Date: January 20, 2025
Participants: Investment Committee, Portfolio Team, External Consultant

Executive Summary:
Our investment in KKR North America Fund VII continues to perform in line with expectations. The fund is demonstrating strong execution against its investment thesis of North American growth companies, with a focus on technology-enabled businesses and market-leading companies.

Key Performance Metrics (as of Q4 2024):
• Fund Size: $19.0B (one of the largest buyout funds ever raised)
• Our Commitment: $10.0M (representing 0.05% of fund)
• Called Capital: $7.5M (75% of commitment called)
• Current NAV: $12.5M (1.67x TVPI multiple)
• Distributions Received: $1.5M (0.20x DPI multiple)  
• Net IRR: 15.2% (vs 12-15% target)
• Remaining Commitment: $2.5M

Portfolio Construction & Strategy:
The fund has deployed capital across 25+ platform investments, with an average equity check size of $750M. The portfolio is diversified across sectors including:
• Technology & Software: 35%
• Healthcare: 25% 
• Consumer: 20%
• Industrial & Services: 20%

Notable portfolio companies include established market leaders with strong competitive positions and predictable cash flow generation. The GP's operational expertise and network continue to drive value creation initiatives.

Performance Analysis:
1. Multiple Expansion: Strong execution on revenue growth and margin improvement
2. Market Leadership: Portfolio companies maintaining/gaining market share
3. Operational Improvements: KKR's operational team driving efficiency gains
4. Add-on Acquisitions: Successful bolt-on strategies across platforms

Risk Assessment:
• Vintage 2020: Benefited from favorable entry valuations pre-COVID
• Interest Rate Environment: Portfolio companies managing through higher rates
• Exit Environment: IPO market recovery supporting exit opportunities
• Portfolio Maturity: Fund entering harvest phase (years 4-5)

Comparative Analysis:
The fund is performing within the top quartile of its peer group based on:
• Cambridge Associates benchmarks
• Preqin vintage 2020 large buyout fund data
• Our internal benchmarking against similar vintage funds

Strategic Considerations:
1. Capital Management: Remaining commitment ($2.5M) expected to be called over next 12-18 months
2. Distribution Timing: Anticipate increased distribution activity as fund matures
3. Co-investment Opportunities: Continue to evaluate selective co-investment opportunities
4. Follow-on Funds: KKR Fund VIII launched in 2024 - evaluate participation

Recommendations:
• MAINTAIN: Continue current investment allocation
• MONITOR: Track distribution pacing and exit environment
• EVALUATE: Consider KKR Fund VIII participation based on Fund VII performance
• OPTIMIZE: Reinvestment strategy for upcoming distributions

Next Review: April 2025 (post Q1 2025 reporting)` 
            },
            { 
              id: 2, 
              title: "GP Meeting Notes - March 2024", 
              author: "Michael Torres", 
              date: "March 15, 2024", 
              topic: "GP Meeting", 
              content: `KKR Annual Limited Partner Meeting - Key Takeaways

Date: March 12-13, 2024
Location: New York, NY
Attendees: 150+ Limited Partners, KKR Leadership Team

Meeting Highlights:

Market Environment Update:
• KKR positioned defensively given macro uncertainty
• Focus on resilient business models with pricing power
• Portfolio companies demonstrating operational resilience
• Private credit becoming increasingly important strategy

Fund VII Portfolio Update:
• 23 platform investments completed (target: 25-30)
• Average revenue growth: 12% across portfolio
• EBITDA margin expansion: 150bps on average
• 3 full exits completed (Envision Healthcare, Academy Sports, WebMD)

Value Creation Initiatives:
• Digital transformation programs across 80% of portfolio
• ESG integration with measurable impact metrics
• Talent development through KKR Capstone program
• Supply chain optimization reducing costs by 3-5%

Market Outlook:
• Selective deployment given valuation environment
• Focus on add-on acquisitions vs new platforms
• Credit opportunities in dislocation markets
• Geographic expansion in Europe and Asia

Technology Transformation:
• AI and automation adoption across portfolio
• Data analytics driving operational improvements
• Cybersecurity investments protecting assets
• Digital customer engagement platforms

Q&A Session Highlights:
• Exit environment: Increased M&A activity expected in 2H 2024
• Interest rates: Portfolio positioned for higher rate environment
• Competition: Disciplined approach to competitive processes
• ESG: Integration driving both impact and returns

Action Items:
• Follow up on co-investment pipeline review
• Assess Fund VIII participation timeline
• Evaluate sector-specific opportunities
• Plan investor relations touchpoints` 
            },
            { 
              id: 3, 
              title: "Tax Implications Analysis", 
              author: "Tax Advisory Team", 
              date: "December 1, 2024", 
              topic: "Tax Planning", 
              content: `KKR Fund VII - Tax Structure and Implications Analysis

Prepared by: Tax Advisory Team
Date: December 1, 2024
Purpose: Annual tax planning and structure optimization

Fund Structure Overview:
KKR North America Fund VII is structured as a Delaware limited partnership with:
• GP: KKR Fund Holdings L.P.
• Management Fee: 2.0% on committed capital (reducing to 1.5% post-investment period)
• Carried Interest: 20% after 8% preferred return
• Investment Period: 5 years (ended March 2025)

Our Investment Structure:
• Investing Entity: Family Office Master Fund LP
• Investment Classification: Partnership interest
• Tax Treatment: Pass-through taxation
• State Jurisdiction: Delaware (no state income tax on fund)

Current Tax Positions:
1. Unrealized Gains: $2.5M (subject to potential tax on distributions)
2. Capital Losses: None currently recognized
3. Ordinary Income: Management fee deductions and interest income
4. Foreign Tax Credits: Minimal (primarily US-focused fund)

2024 Tax Implications:
• K-1 Schedule received: January 31, 2025
• Taxable Income: $125,000 (primarily from realized gains)
• Management Fee Deduction: $200,000 (offset against other income)
• Net Investment Income Tax: Applicable on distributions

Distribution Tax Planning:
Anticipated distributions in 2025-2027 will be treated as:
• Return of Capital: First $10M (tax-free)
• Capital Gains: Excess over cost basis (20% tax rate + 3.8% NIIT)
• Estimated Tax Liability: $650,000 on $2.5M gain

Optimization Strategies:
1. Timing: Coordinate distributions with other portfolio losses
2. Charitable Giving: Donate appreciated interests to reduce tax burden
3. Estate Planning: Consider gift tax implications for next generation
4. State Planning: Maintain favorable state residency for distributions

UBTI Considerations:
• Limited exposure given fund's investment strategy
• Debt-financed distributions: Monitor leverage at portfolio company level
• Blocked income: Minimal expected based on fund structure

Recommendations:
• Establish distribution reserve for tax obligations
• Consider installment sale elections if available
• Evaluate opportunity zone reinvestment options
• Plan charitable giving strategy for tax-efficient distributions

Next Steps:
• Review 2024 K-1 upon receipt
• Model distribution scenarios for 2025-2027
• Coordinate with estate planning attorney
• Update tax provision calculations` 
            }
          ]
        case "meetings":
          return [
            { id: 1, title: "KKR Annual LP Meeting", date: "March 12, 2025", time: "9:00 AM EST", attendees: ["Investment Team", "KKR Leadership"], status: "Scheduled" },
            { id: 2, title: "Fund VII Performance Review", date: "February 15, 2025", time: "2:00 PM EST", attendees: ["Investment Committee"], status: "Scheduled" },
            { id: 3, title: "Tax Planning Session", date: "February 28, 2025", time: "10:00 AM EST", attendees: ["Tax Team", "External CPA"], status: "Scheduled" },
            { id: 4, title: "Portfolio Company Deep Dive", date: "January 30, 2025", time: "3:00 PM EST", attendees: ["Portfolio Team"], status: "Completed" },
          ]
        case "files":
          return [
            { id: 1, name: "KKR_Fund_VII_Capital_Account_Q4_2024.pdf", uploadedBy: "IR Team", uploadedDate: "January 25, 2025", size: "2.4 MB", type: "PDF" },
            { id: 2, name: "Limited_Partnership_Agreement.pdf", uploadedBy: "Legal Team", uploadedDate: "March 15, 2020", size: "15.8 MB", type: "PDF" },
            { id: 3, name: "Annual_Report_2024.pdf", uploadedBy: "KKR", uploadedDate: "January 15, 2025", size: "8.2 MB", type: "PDF" },
            { id: 4, name: "Side_Letter_Amendment_2024.pdf", uploadedBy: "Legal Team", uploadedDate: "September 12, 2024", size: "1.1 MB", type: "PDF" },
            { id: 5, name: "Tax_K1_2024.pdf", uploadedBy: "Tax Team", uploadedDate: "January 31, 2025", size: "0.8 MB", type: "PDF" },
          ]
        case "team":
          return [
            { id: 1, name: "Sarah Chen", role: "Senior Investment Associate", email: "sarah.chen@familyoffice.com" },
            { id: 2, name: "Michael Torres", role: "VP, Private Equity", email: "michael.torres@familyoffice.com" },
            { id: 3, name: "Jennifer Walsh", role: "Investment Director", email: "jennifer.walsh@kkr.com" },
            { id: 4, name: "David Kim", role: "Principal", email: "david.kim@kkr.com" },
          ]
        default:
          return []
      }
    }

    // Default data for other assets
    switch (activeTab) {
      case "tasks":
        return [
          { id: 1, title: "Quarterly valuation", priority: "High", status: "Pending", assignee: "You", dueDate: "Next week" },
        ]
      case "emails":
        return [
          { id: 1, subject: "Capital Call Notice", from: "fund@gp.com", date: "Today", status: "Unread", preview: "Please see attached capital call" },
        ]
      case "notes":
        return [
          { id: 1, title: "Investment Committee Review", author: "Sarah Johnson", date: "Yesterday", topic: "Investment Committee Review", content: `Investment Review - TechFlow Ventures Series C

Meeting Date: January 14, 2025
Participants: Investment Committee, Fund Manager, Legal Counsel

Executive Summary:
The Investment Committee conducted a comprehensive review of our Series C investment in TechFlow Ventures. The company continues to demonstrate strong fundamentals with 85% YoY revenue growth and expanding market share in the enterprise automation sector.

Key Performance Metrics:
• Revenue Run Rate: $48M ARR (up from $26M at time of investment)
• Gross Margins: 78% (industry-leading for SaaS)
• Customer Retention: 98% net revenue retention
• Cash Burn: $2.1M/month (18 months runway)
• Team Growth: 145 FTEs (up from 87 at investment)

Portfolio Allocation Analysis:
Our $15M Series C investment represents 12.5% ownership on a fully diluted basis. This positions us as the second-largest institutional investor after Apex Capital Partners. The investment aligns with our technology sector allocation target of 35-40% of total portfolio.

Valuation Considerations:
• Current valuation: $450M (3x multiple from our entry)
• Comparable public companies trading at 8-12x revenue
• Secondary market interest at $500-550M valuation
• Next round (Series D) expected at $800M-1B valuation

Risk Assessment:
1. Customer Concentration: Top 10 customers represent 42% of revenue (down from 58%)
2. Competition: Microsoft and Salesforce entering adjacent markets
3. Regulatory: Potential data privacy regulations could impact growth
4. Key Person Risk: CTO departure could affect product roadmap

Strategic Recommendations:
1. Maintain position through Series D (no pro-rata beyond $5M)
2. Explore secondary sale of 20% of position at current valuations
3. Introduce company to our network for enterprise sales opportunities
4. Board seat designation to be reviewed at next funding round

Follow-up Actions:
• Schedule quarterly business review with CEO (February 15)
• Legal review of amended shareholder agreements
• Update valuation model with Q4 financials
• Coordinate with tax team on potential secondary sale implications

Next Review Date: April 2025 (post-Series D announcement)` },
          { id: 2, title: "Quarterly Valuation Update", author: "Michael Chen", date: "Last week", topic: "Quarterly Valuation Update", content: `Valuation Memorandum - TechFlow Ventures Series C

Date: January 7, 2025
Prepared by: Valuation Committee
Asset: TechFlow Ventures Series C Investment

Valuation Summary:
We have completed our quarterly fair value assessment of the TechFlow Ventures investment. Based on multiple valuation methodologies and recent market comparables, we recommend maintaining the current carrying value of $45.2M, representing a 3.01x multiple on our invested capital.

Valuation Methodology:
1. Revenue Multiple Approach:
   - Current ARR: $48M
   - Applied Multiple: 9.5x (based on public SaaS comparables)
   - Implied Valuation: $456M
   - Our Share (12.5%): $57M

2. Recent Transaction Method:
   - Last round valuation: $450M (6 months ago)
   - No material adverse changes
   - Market conditions remain favorable
   - Our Share: $56.25M

3. DCF Analysis:
   - 5-year projection with 35% revenue CAGR
   - Terminal value at 25x FCF
   - WACC: 18%
   - Our Share NPV: $52M

4. Secondary Market Activity:
   - Recent secondary trades at $500-520M valuation
   - Limited liquidity discount applied (15%)
   - Adjusted value: $53-55M

Weighted Average Fair Value: $54.8M
Conservative Adjustment Factor: 0.825
Final Carrying Value: $45.2M

Key Assumptions:
• Continued revenue growth of 75%+ for next 12 months
• No significant customer churn
• Successful Series D raising within 9 months
• Maintained gross margins above 75%

Sensitivity Analysis:
• Bull Case (+20% revenue): $58M value
• Base Case: $45.2M value
• Bear Case (-20% revenue): $32M value

Market Comparables:
• Automation Anywhere: 11.2x revenue
• UiPath: 8.5x revenue
• Workato: 12x revenue (private)
• Zapier: 15x revenue (private)

Recommendation:
Maintain current mark at $45.2M. The conservative discount reflects:
1. Private market illiquidity
2. Concentration risk in enterprise segment
3. Potential market correction in growth valuations

Next valuation review scheduled for March 31, 2025.` },
          { id: 3, title: "Due Diligence Summary", author: "Jessica Martinez", date: "2 months ago", topic: "Due Diligence Summary", content: `Series C Investment - Final Due Diligence Report

Investment: TechFlow Ventures Series C
Amount: $15M
Date: November 2024

Technology Due Diligence:
Our technical team conducted a comprehensive review of TechFlow's platform architecture, codebase, and infrastructure. The platform demonstrates enterprise-grade scalability with a modern microservices architecture built on AWS. Code quality scores in the 90th percentile, with strong documentation and testing coverage (87% automated test coverage).

Key technical strengths:
• Multi-tenant SaaS architecture with strong data isolation
• API-first design enabling seamless integrations
• Advanced ML/AI capabilities for workflow optimization
• SOC 2 Type II and ISO 27001 certifications
• 99.99% uptime SLA consistently achieved

Financial Due Diligence:
Ernst & Young conducted a detailed financial audit covering the past 3 years. All findings were satisfactory with no material issues identified. Revenue recognition practices align with ASC 606 standards. The company maintains strong financial controls with monthly board reporting.

Key financial metrics validated:
• Revenue growth: 127% CAGR over 3 years
• Gross margins improving from 68% to 78%
• CAC payback period: 14 months
• LTV/CAC ratio: 4.2x
• Net cash burn reducing quarter-over-quarter

Legal Due Diligence:
Kirkland & Ellis reviewed all material contracts, IP portfolio, and corporate structure. The company owns all core IP with 12 patents filed (3 granted). No ongoing litigation or regulatory issues. Clean cap table with proper 83(b) elections for all founders and early employees.

Customer Due Diligence:
We conducted reference calls with 15 enterprise customers including 3 Fortune 500 companies. Net Promoter Score of 72 (excellent for B2B SaaS). Customers consistently praised the platform's ease of use, reliability, and ROI. Average customer sees 40% productivity improvement within 6 months.

Management Team Assessment:
The leadership team combines strong technical expertise with proven execution ability. CEO previously scaled a SaaS company to $100M ARR and successful exit. CTO from Google with deep AI/ML expertise. CFO brings public company experience from ServiceNow. Cultural assessment shows strong alignment with portfolio values.

Market Analysis:
The workflow automation market is projected to reach $35B by 2028 (22% CAGR). TechFlow's enterprise focus and vertical-specific solutions position them well against horizontal players. Their platform approach creates strong competitive moats and expansion opportunities.

Investment Thesis Validation:
✓ Large and growing market opportunity
✓ Differentiated product with strong competitive advantages
✓ Proven business model with attractive unit economics
✓ Exceptional team with relevant experience
✓ Clear path to $100M ARR and beyond
✓ Multiple exit opportunities (IPO or strategic acquisition)

Risk Mitigation:
• Board observer rights secured
• Information rights including monthly financials
• Pro-rata rights for future rounds
• Protective provisions on key decisions
• Anti-dilution protection (weighted average)

Recommendation: PROCEED with $15M investment at $450M pre-money valuation.` },
        ]
      case "meetings":
        return [
          { id: 1, title: "Board Meeting", date: "Tomorrow", time: "10:00 AM", attendees: ["CFO"], status: "Scheduled" },
        ]
      case "files":
        return [
          { id: 1, name: "Subscription Agreement.pdf", uploadedBy: "Legal", uploadedDate: "Last month", size: "2 MB", type: "PDF" },
        ]
      case "team":
        return [
          { id: 1, name: "Sarah Johnson", role: "Investment Director", email: "sarah@fund.com" },
        ]
      default:
        return []
    }
  }

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
    
    if (activeTab === "external-data") {
      return <AssetExternalDataContent asset={asset} />
    }
    
    const data = getAssetTabData(activeTab)
    
    // Create custom tab renderers for special tabs
    const customTabRenderers = {
      details: (isFullScreen = false) => <AssetDetailsPanel asset={asset} isFullScreen={isFullScreen} />,
      "external-data": (isFullScreen = false) => <AssetExternalDataContent asset={asset} isFullScreen={isFullScreen} />,
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
      recordType="Investment"
      subtitle={asset.type}
      tabs={tabs}
      activityContent={<UnifiedActivitySection activities={generateInvestmentActivities()} />}
      detailsPanel={(isFullScreen) => <AssetDetailsPanel asset={asset} isFullScreen={isFullScreen} />}
    >
      {renderTabContent}
    </MasterDrawer>
  )
}

export function AssetsTable({ onAssetClick }: AssetsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [isAddAssetDialogOpen, setIsAddAssetDialogOpen] = React.useState(false)
  const [columnOrder, setColumnOrder] = React.useState<string[]>([])
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor), useSensor(KeyboardSensor))

  const table = useReactTable({
    data: assetsData,
    columns: [
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
        accessorKey: "entity",
        header: "Entity",
      },
      {
        accessorKey: "acquisitionDate",
        header: "Acquisition Date",
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
        header: "% Gain",
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
        accessorKey: "lastValuation",
        header: "Last Valuation",
      },
      {
        accessorKey: "sector",
        header: "Sector",
      },
      {
        accessorKey: "geography",
        header: "Geography",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status
          return <Badge variant="outline" className="capitalize">{status}</Badge>
        },
      },
    ],
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
      .map((column) => column.id)

    if (columnOrder.length === 0 && visibleColumns.length > 0) {
      setColumnOrder(visibleColumns)
    }
  }, [table.getAllColumns(), columnOrder])

  // Handle drag end for column reordering
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active && over && active.id !== over.id) {
      setColumnOrder((items) => {
        const oldIndex = items.indexOf(active.id as string)
        const newIndex = items.indexOf(over.id as string)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const columns = React.useMemo(() => table.getAllColumns(), [table.getAllColumns()])

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
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={columnOrder} strategy={verticalListSortingStrategy}>
                  {columnOrder.map((columnId) => {
                    const column = table.getColumn(columnId)
                    if (!column) return null

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
                    )
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

// -------- Details Panel helpers --------
function AssetDetailsPanel({ asset, isFullScreen = false }: { asset: Asset; isFullScreen?: boolean }) {
  // Mock related data (examples)
  const relatedData = {
    entities: [
      { id: 1, name: asset.entity, type: "Fund" },
    ],
    people: [
      { id: 1, name: "Sarah Johnson", role: "Investment Director" },
      { id: 2, name: "Tom Becker", role: "Analyst" },
    ],
    opportunities: [
      { id: 1, name: "Follow-on Investment", status: "Discussion" },
    ],
  }

  // Mock activity content
  const activities: ActivityItem[] = [
    {
      id: 1,
      type: "valuation",
      actor: "Michael Chen",
      action: "updated valuation",
      target: "Current Value",
      objectType: "field",
      url: "#valuation-history", // hypothetical anchor or modal link
      timestamp: "2 days ago",
      date: "2025-06-21",
    },
    {
      id: 2,
      type: "meeting",
      actor: "Thomas Wong",
      action: "held board meeting",
      target: "Q2 Performance Review",
      objectType: "meeting",
      url: "/meetings/2001",
      timestamp: "1 week ago",
      date: "2025-06-15",
    },
  ]

  // Handlers (stubbed)
  const navigateToRecord = (recordType: string, id: number) => {
    console.log(`Navigate to ${recordType} ${id}`)
  }
  const handleAddRecord = (sectionId: string) => {
    console.log(`Add record to ${sectionId}`)
  }
  const handleUnlinkRecord = (sectionId: string, id: number) => {
    console.log(`Unlink ${sectionId} ${id}`)
  }

  const infoFields = [
    { label: "Name", value: asset.name },
    { label: "Type", value: asset.type },
    { label: "Category", value: asset.category },
    { label: "Entity", value: asset.entity },
    { label: "Acquisition Date", value: asset.acquisitionDate },
    { label: "Current Value", value: asset.currentValue },
    { label: "Original Cost", value: asset.originalCost },
    { label: "Unrealized Gain", value: asset.unrealizedGain },
    { label: "% Gain", value: `${asset.percentageGain}%` },
    { label: "Last Valuation", value: asset.lastValuation },
    { label: "Sector", value: asset.sector },
    { label: "Geography", value: asset.geography },
    { label: "Status", value: asset.status },
  ]

  // Mock companies based on entity or asset name
  const companies = [
    {
      id: 1,
      name: asset.entity || asset.name.split(" ")[0] + " Corp",
      type: "Portfolio Company",
    },
  ]

  // Mock investments based on the asset
  const investments = [
    {
      id: 1,
      name: asset.name,
      amount: asset.currentValue,
      status: asset.status,
    },
    {
      id: 2,
      name: `${asset.sector} Co-Investment`,
      amount: "$5.2M",
      status: "Active",
    },
    {
      id: 3,
      name: `${asset.category} Follow-on`,
      amount: "$3.8M",
      status: "Pending",
    },
  ]

  const sections = buildStandardDetailSections({
    infoTitle: "Asset Information",
    infoIcon: <BarChartIcon className="h-4 w-4 text-muted-foreground" />,
    infoFields,
    companies,
    people: relatedData.people,
    entities: relatedData.entities,
    investments,
    opportunities: relatedData.opportunities,
  })

  return (
    <UnifiedDetailsPanel
      sections={sections}
      isFullScreen={isFullScreen}
      onNavigateToRecord={navigateToRecord}
      onAddRecord={handleAddRecord}
      onUnlinkRecord={handleUnlinkRecord}
      activityContent={<UnifiedActivitySection activities={activities} />}
    />
  )
}

function AssetExternalDataContent({ asset, isFullScreen = false }: { asset: Asset; isFullScreen?: boolean }) {
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
  const [expandedSource, setExpandedSource] = React.useState<string | null>(null)

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

  // Mock external data sources for assets - in production, this would come from your data layer
  // Special handling for Private Equity funds with PE-specific fields
  const isPEFund = asset.name === "KKR North America Fund VII"
  
  const externalDataSources = isPEFund ? [
    {
      id: "kkr-investor-portal",
      name: "KKR Investor Portal",
      type: "GP Portal",
      lastSync: "3 days ago",
      status: "synced",
      fieldsCount: 12,
      fields: [
        { 
          fieldName: "Fund Name", 
          value: "KKR North America Fund VII", 
          lastUpdated: "2020-03-15 00:00:00",
          confidence: "verified",
          variance: undefined,
          variantFromInternal: undefined
        },
        { 
          fieldName: "Fund Strategy", 
          value: "Large Buyout", 
          lastUpdated: "2020-03-15 00:00:00",
          confidence: "verified",
          variance: undefined,
          variantFromInternal: undefined
        },
        { 
          fieldName: "Commitment Amount", 
          value: "$10,000,000", 
          lastUpdated: "2020-03-15 00:00:00",
          confidence: "verified",
          variance: undefined,
          variantFromInternal: undefined
        },
        { 
          fieldName: "Called Capital", 
          value: "$7,500,000", 
          lastUpdated: "2024-12-31 00:00:00",
          confidence: "verified",
          variance: undefined,
          variantFromInternal: undefined
        },
        { 
          fieldName: "Remaining Commitment", 
          value: "$2,500,000", 
          lastUpdated: "2024-12-31 00:00:00",
          confidence: "calculated",
          variance: undefined,
          variantFromInternal: undefined
        },
        { 
          fieldName: "Distributions Received", 
          value: "$1,500,000", 
          lastUpdated: "2024-12-31 00:00:00",
          confidence: "verified",
          variance: undefined,
          variantFromInternal: undefined
        },
        { 
          fieldName: "Current NAV", 
          value: "$12,500,000", 
          lastUpdated: "2024-12-31 00:00:00",
          confidence: "verified",
          variance: undefined,
          variantFromInternal: undefined
        },
        { 
          fieldName: "TVPI Multiple", 
          value: "1.67x", 
          lastUpdated: "2024-12-31 00:00:00",
          confidence: "calculated",
          variance: undefined,
          variantFromInternal: undefined
        },
        { 
          fieldName: "DPI Multiple", 
          value: "0.20x", 
          lastUpdated: "2024-12-31 00:00:00",
          confidence: "calculated",
          variance: undefined,
          variantFromInternal: undefined
        },
        { 
          fieldName: "IRR to Date", 
          value: "15.2%", 
          lastUpdated: "2024-12-31 00:00:00",
          confidence: "calculated",
          variance: undefined,
          variantFromInternal: undefined
        },
        { 
          fieldName: "Vintage Year", 
          value: "2020", 
          lastUpdated: "2020-03-15 00:00:00",
          confidence: "verified",
          variance: undefined,
          variantFromInternal: undefined
        },
        { 
          fieldName: "Fund Status", 
          value: "Investment Period", 
          lastUpdated: "2025-01-30 00:00:00",
          confidence: "verified",
          variance: undefined,
          variantFromInternal: undefined
        }
      ]
    },
    {
      id: "addepar-pe",
      name: "Addepar",
      type: "Portfolio Management",
      lastSync: "1 day ago",
      status: "synced",
      fieldsCount: 8,
      fields: [
        { 
          fieldName: "Current NAV", 
          value: "$12,485,000", 
          lastUpdated: "2025-01-29 14:23:00",
          confidence: "high",
          variance: "-0.12%",
          variantFromInternal: "$15,000"
        },
        { 
          fieldName: "Called Capital", 
          value: "$7,500,000", 
          lastUpdated: "2025-01-29 14:23:00",
          confidence: "high",
          variance: undefined,
          variantFromInternal: undefined
        },
        { 
          fieldName: "Distributions Received", 
          value: "$1,500,000", 
          lastUpdated: "2025-01-29 14:23:00",
          confidence: "high",
          variance: undefined,
          variantFromInternal: undefined
        },
        { 
          fieldName: "TVPI Multiple", 
          value: "1.66x", 
          lastUpdated: "2025-01-29 14:23:00",
          confidence: "calculated",
          variance: "-0.6%",
          variantFromInternal: undefined
        },
        { 
          fieldName: "IRR to Date", 
          value: "15.1%", 
          lastUpdated: "2025-01-29 14:23:00",
          confidence: "calculated",
          variance: "-0.7%",
          variantFromInternal: undefined
        },
        { 
          fieldName: "Fund Size", 
          value: "$19,000,000,000", 
          lastUpdated: "2020-03-15 00:00:00",
          confidence: "verified",
          variance: undefined,
          variantFromInternal: undefined
        },
        { 
          fieldName: "Management Fee Rate", 
          value: "2.0%", 
          lastUpdated: "2020-03-15 00:00:00",
          confidence: "verified",
          variance: undefined,
          variantFromInternal: undefined
        },
        { 
          fieldName: "Carried Interest Rate", 
          value: "20.0%", 
          lastUpdated: "2020-03-15 00:00:00",
          confidence: "verified",
          variance: undefined,
          variantFromInternal: undefined
        }
      ]
    },
    {
      id: "netsuite-pe",
      name: "NetSuite",
      type: "Accounting",
      lastSync: "2 days ago",
      status: "synced",
      fieldsCount: 6,
      fields: [
        { 
          fieldName: "Current NAV", 
          value: "$12,520,000", 
          lastUpdated: "2025-01-28 18:00:00",
          confidence: "high",
          variance: "+0.16%",
          variantFromInternal: undefined
        },
        { 
          fieldName: "Called Capital", 
          value: "$7,500,000", 
          lastUpdated: "2025-01-28 18:00:00",
          confidence: "verified",
          variance: undefined,
          variantFromInternal: undefined
        },
        { 
          fieldName: "Commitment Amount", 
          value: "$10,000,000", 
          lastUpdated: "2020-03-15 00:00:00",
          confidence: "verified",
          variance: undefined,
          variantFromInternal: undefined
        },
        { 
          fieldName: "Distributions Received", 
          value: "$1,500,000", 
          lastUpdated: "2024-12-15 00:00:00",
          confidence: "verified",
          variance: undefined,
          variantFromInternal: undefined
        },
        { 
          fieldName: "Management Fees Paid", 
          value: "$950,000", 
          lastUpdated: "2024-12-31 00:00:00",
          confidence: "high",
          variance: undefined,
          variantFromInternal: undefined
        },
        { 
          fieldName: "Investment Period End", 
          value: "March 15, 2025", 
          lastUpdated: "2020-03-15 00:00:00",
          confidence: "verified",
          variance: undefined,
          variantFromInternal: undefined
        }
      ]
    },
    {
      id: "capital-account-docs",
      name: "Capital Account Statements",
      type: "Document Extract",
      lastSync: "1 week ago",
      status: "manual",
      fieldsCount: 5,
      fields: [
        { 
          fieldName: "Current NAV", 
          value: "$12,500,000", 
          lastUpdated: "2024-12-31 00:00:00",
          confidence: "verified",
          variance: undefined,
          variantFromInternal: undefined,
          documentName: "KKR_Fund_VII_Capital_Account_Q4_2024.pdf",
          pageNumber: 1
        },
        { 
          fieldName: "Called Capital", 
          value: "$7,500,000", 
          lastUpdated: "2024-12-31 00:00:00",
          confidence: "verified",
          variance: undefined,
          variantFromInternal: undefined,
          documentName: "KKR_Fund_VII_Capital_Account_Q4_2024.pdf",
          pageNumber: 1
        },
        { 
          fieldName: "Unfunded Commitment", 
          value: "$2,500,000", 
          lastUpdated: "2024-12-31 00:00:00",
          confidence: "verified",
          variance: undefined,
          variantFromInternal: undefined,
          documentName: "KKR_Fund_VII_Capital_Account_Q4_2024.pdf",
          pageNumber: 1
        },
        { 
          fieldName: "Partnership Percentage", 
          value: "0.0526%", 
          lastUpdated: "2024-12-31 00:00:00",
          confidence: "verified",
          variance: undefined,
          variantFromInternal: undefined,
          documentName: "KKR_Fund_VII_Capital_Account_Q4_2024.pdf",
          pageNumber: 2
        },
        { 
          fieldName: "Cumulative Distributions", 
          value: "$1,500,000", 
          lastUpdated: "2024-12-31 00:00:00",
          confidence: "verified",
          variance: undefined,
          variantFromInternal: undefined,
          documentName: "KKR_Fund_VII_Capital_Account_Q4_2024.pdf",
          pageNumber: 3
        }
      ]
    }
  ] : [
    {
      id: "addepar",
      name: "Addepar",
      type: "Portfolio Management",
      lastSync: "2 hours ago",
      status: "synced",
      fieldsCount: 4,
      fields: [
        { 
          fieldName: "Current Value", 
          value: "$22,150,000", 
          lastUpdated: "2025-01-30 14:23:00",
          confidence: "high",
          variance: "-0.23%",
          variantFromInternal: "$50,000"
        },
        { 
          fieldName: "Unrealized Gain", 
          value: "$7,150,000", 
          lastUpdated: "2025-01-30 14:23:00",
          confidence: "high",
          variance: undefined,
          variantFromInternal: undefined
        },
        { 
          fieldName: "IRR", 
          value: "18.5%", 
          lastUpdated: "2025-01-30 14:23:00",
          confidence: "calculated",
          variance: undefined,
          variantFromInternal: undefined
        },
        { 
          fieldName: "Multiple", 
          value: "2.48x", 
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
      fieldsCount: 4,
      fields: [
        { 
          fieldName: "Current Value", 
          value: "$22,200,000", 
          lastUpdated: "2025-01-29 18:00:00",
          confidence: "high",
          variance: "+0.23%",
          variantFromInternal: undefined
        },
        { 
          fieldName: "Cost Basis", 
          value: "$15,000,000", 
          lastUpdated: "2025-01-29 18:00:00",
          confidence: "verified",
          variance: undefined,
          variantFromInternal: undefined
        },
        { 
          fieldName: "Distributions YTD", 
          value: "$850,000", 
          lastUpdated: "2025-01-29 18:00:00",
          confidence: "high",
          variance: undefined,
          variantFromInternal: undefined
        },
        { 
          fieldName: "Capital Calls YTD", 
          value: "$2,100,000", 
          lastUpdated: "2025-01-29 18:00:00",
          confidence: "high",
          variance: undefined,
          variantFromInternal: undefined
        }
      ]
    },
    {
      id: "northern-trust",
      name: "Northern Trust",
      type: "Custodian",
      lastSync: "4 days ago",
      status: "pending",
      fieldsCount: 2,
      fields: [
        { 
          fieldName: "Current Value", 
          value: "$22,180,000", 
          lastUpdated: "2025-01-26 09:00:00",
          confidence: "medium",
          variance: "+0.14%",
          variantFromInternal: "$30,000"
        },
        { 
          fieldName: "Account Balance", 
          value: "$22,180,000", 
          lastUpdated: "2025-01-26 09:00:00",
          confidence: "high",
          variance: undefined,
          variantFromInternal: undefined
        }
      ]
    },
    {
      id: "fund-admin",
      name: "Fund Administrator",
      type: "Fund Admin Portal",
      lastSync: "1 week ago",
      status: "manual",
      fieldsCount: 3,
      fields: [
        { 
          fieldName: "NAV", 
          value: "$22,200,000", 
          lastUpdated: "2024-12-31 00:00:00",
          confidence: "verified",
          variance: undefined,
          variantFromInternal: undefined,
          documentName: "Q4_2024_Capital_Account_Statement.pdf",
          pageNumber: 1
        },
        { 
          fieldName: "Unfunded Commitment", 
          value: "$10,000,000", 
          lastUpdated: "2024-12-31 00:00:00",
          confidence: "verified",
          variance: undefined,
          variantFromInternal: undefined,
          documentName: "Q4_2024_Capital_Account_Statement.pdf",
          pageNumber: 1
        },
        { 
          fieldName: "Partnership %", 
          value: "12.5%", 
          lastUpdated: "2024-12-31 00:00:00",
          confidence: "verified",
          variance: undefined,
          variantFromInternal: undefined,
          documentName: "Q4_2024_Capital_Account_Statement.pdf",
          pageNumber: 2
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
              88%
            </CardTitle>
            <div className="absolute right-4 top-4">
              <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                <TrendingUpIcon className="size-3" />
                +2%
              </Badge>
            </div>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Most fields populated <TrendingUpIcon className="size-4" />
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
              {conflictCount > 0 ? "Values vary across systems" : "All systems aligned"} 
              {conflictCount > 0 ? <TrendingUpIcon className="size-4" /> : <TrendingDownIcon className="size-4" />}
            </div>
            <div className="text-muted-foreground">
              {conflictCount > 0 ? "Review required" : "No conflicts detected"}
            </div>
          </CardFooter>
        </Card>
        
        <Card className="@container/card">
          <CardHeader className="relative">
            <CardDescription>NAV Age</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              30d
            </CardTitle>
            <div className="absolute right-4 top-4">
              <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                <TrendingUpIcon className="size-3" />
                Q4
              </Badge>
            </div>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Last official NAV <TrendingUpIcon className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Q4 2024 statement
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
                              {/* Show internal value - in this mock, we use the asset data */}
                              {fieldName === "Current Value" && asset.currentValue}
                              {fieldName === "Cost Basis" && asset.originalCost}
                              {fieldName === "Unrealized Gain" && asset.unrealizedGain}
                              {!["Current Value", "Cost Basis", "Unrealized Gain"].includes(fieldName) && "—"}
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
                                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">All Sources</div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {sources.map((source, idx) => {
                                      const isActive = source.source === truthValue.source;
                                      return (
                                        <div key={idx}>
                                          <Card className="group cursor-pointer hover:bg-muted/50 h-full">
                                            <CardContent className="p-4">
                                              <div className="flex gap-4">
                                                <div className="flex-1">
                                                  {/* Title row with actions dropdown */}
                                                  <div className="flex items-start justify-between">
                                                    <h3 className="font-medium text-sm">
                                                      {source.source}
                                                    </h3>
                                                    
                                                    <div className="flex items-center gap-1">
                                                      <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={(e) => {
                                                          e.stopPropagation();
                                                          setExpandedSource(expandedSource === `${fieldName}-${idx}` ? null : `${fieldName}-${idx}`);
                                                        }}
                                                      >
                                                        {expandedSource === `${fieldName}-${idx}` ? (
                                                          <ChevronDownIcon className="h-4 w-4" />
                                                        ) : (
                                                          <ChevronRightIcon className="h-4 w-4" />
                                                        )}
                                                      </Button>
                                                      
                                                      <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
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
                                                        </DropdownMenuContent>
                                                      </DropdownMenu>
                                                    </div>
                                                  </div>
                                                  
                                                  {/* Primary metadata row (badges, status indicators) */}
                                                  <div className="flex items-center gap-2 mt-1">
                                                    {isActive && (
                                                      <Badge className="bg-black text-white hover:bg-black/90 text-xs">
                                                        Active
                                                      </Badge>
                                                    )}
                                                    {getConfidenceBadge(source.confidence)}
                                                  </div>
                                                  
                                                  {/* Secondary metadata row */}
                                                  <div className="mt-2 text-xs text-muted-foreground">
                                                    <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                                                      <div>
                                                        <span className="font-medium">Value:</span>
                                                      </div>
                                                      <div>
                                                        {source.value}
                                                      </div>
                                                      <div>
                                                        <span className="font-medium">Updated:</span>
                                                      </div>
                                                      <div>
                                                        {new Date(source.lastUpdated).toLocaleDateString()}
                                                      </div>
                                                      {source.variance && (
                                                        <>
                                                          <div>
                                                            <span className="font-medium">Variance:</span>
                                                          </div>
                                                          <div>
                                                            {source.variance}
                                                          </div>
                                                        </>
                                                      )}
                                                      {source.documentName && (
                                                        <>
                                                          <div>
                                                            <span className="font-medium">Document:</span>
                                                          </div>
                                                          <div>
                                                            Statement (p.{source.pageNumber})
                                                          </div>
                                                        </>
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </CardContent>
                                            
                                            {/* Expanded Source Details */}
                                            {expandedSource === `${fieldName}-${idx}` && (
                                              <div className="border-t border-muted bg-muted/10 p-4">
                                                <div className="flex items-center justify-between mb-3">
                                                  <h4 className="text-sm font-medium text-foreground">Additional Details</h4>
                                                  <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      setExpandedSource(null);
                                                    }}
                                                    className="h-6 w-6 p-0"
                                                  >
                                                    ×
                                                  </Button>
                                                </div>
                                                <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs">
                                                  <div>
                                                    <span className="font-medium text-muted-foreground">Source Format:</span>
                                                  </div>
                                                  <div>
                                                    {source.documentName ? 'PDF Document' : 'API Integration'}
                                                  </div>
                                                  <div>
                                                    <span className="font-medium text-muted-foreground">Derived From:</span>
                                                  </div>
                                                  <div>
                                                    {source.documentName 
                                                      ? `Document field on page ${source.pageNumber}`
                                                      : `API field: ${fieldName.toLowerCase().replace(' ', '_')}`
                                                    }
                                                  </div>
                                                  <div>
                                                    <span className="font-medium text-muted-foreground">Last Manual Override:</span>
                                                  </div>
                                                  <div>
                                                    None
                                                  </div>
                                                  <div>
                                                    <span className="font-medium text-muted-foreground">Currency:</span>
                                                  </div>
                                                  <div>
                                                    USD
                                                  </div>
                                                  <div>
                                                    <span className="font-medium text-muted-foreground">Refresh Cadence:</span>
                                                  </div>
                                                  <div>
                                                    {source.source === 'Addepar' ? 'Real-time' : 
                                                     source.source === 'NetSuite' ? 'Daily' : 
                                                     source.source === 'Northern Trust' ? 'Daily' :
                                                     'Monthly'}
                                                  </div>
                                                  <div>
                                                    <span className="font-medium text-muted-foreground">Confidence Explanation:</span>
                                                  </div>
                                                  <div>
                                                    {source.confidence === 'verified' ? 'Verified: Manual document review completed' :
                                                     source.confidence === 'high' ? 'High: Recent sync from trusted source' :
                                                     source.confidence === 'medium' ? 'Medium: Data is slightly stale' :
                                                     'Calculated: Derived from multiple data points'}
                                                  </div>
                                                </div>
                                              </div>
                                            )}
                                          </Card>
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
              actor: "Addepar",
              action: "updated",
              target: "Current Value",
              objectType: "field",
              timestamp: "2 hours ago",
              date: "2025-01-30",
              details: {
                previousValue: "$22,200,000",
                newValue: "$22,150,000",
                source: "Automated sync",
                variance: "-0.23%"
              }
            },
            {
              id: 2,
              type: "document_upload",
              actor: "System",
              action: "processed",
              target: "Q4 2024 statement",
              objectType: "document",
              timestamp: "1 week ago",
              date: "2025-01-23",
              details: {
                fieldsUpdated: ["NAV", "Unfunded Commitment"],
                extractionMethod: "Document upload",
                confidence: "verified"
              }
            },
            {
              id: 3,
              type: "calculation",
              actor: "System",
              action: "recalculated",
              target: "IRR and Multiple",
              objectType: "metrics",
              timestamp: "2 hours ago",
              date: "2025-01-30",
              details: {
                calculationMethod: "Based on latest cash flows",
                newIRR: "18.5%",
                newMultiple: "2.48x"
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
