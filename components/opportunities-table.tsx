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
  BuildingIcon,
  UsersIcon,
  LandmarkIcon,
  BarChartIcon,
  FileTextIcon,
  FileIcon,
  MailIcon,
  CheckCircleIcon,
  StickyNoteIcon,
  CalendarIcon,
  FolderIcon,
  TrendingUpIcon,
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
import { MasterDrawer } from "./master-drawer"
import { AddOpportunityDialog } from "./add-opportunity-dialog"
import { MasterDetailsPanel } from "@/components/shared/master-details-panel"
import { UnifiedDetailsPanel, type DetailSection } from "@/components/shared/unified-details-panel"
import { Label } from "@/components/ui/label"
import { UnifiedActivitySection } from "@/components/shared/unified-activity-section"
import { generateOpportunityActivities } from "@/components/shared/activity-generators"
import { TabContentRenderer } from "@/components/shared/tab-content-renderer"
import { buildStandardDetailSections } from "@/components/shared/detail-section-builder"

export const opportunitySchema = z.object({
  id: z.number(),
  name: z.string(),
  company: z.object({
    name: z.string(),
    type: z.string(), // "Issuer" or "GP"
  }),
  contact: z.object({
    name: z.string(),
    role: z.string(), // Deal sponsor
  }),
  legalEntity: z.object({
    name: z.string(),
    type: z.string(), // Investing party
  }),
  stage: z.string(),
  amount: z.string(),
  probability: z.number(),
  expectedCloseDate: z.string(),
  lastActivity: z.string(),
  status: z.string(),
  description: z.string(),
  fundingRound: z.string(),
  valuation: z.string(),
  sector: z.string(),
  geography: z.string(),
  dealType: z.string(),
  sourcedBy: z.string(),
  introducedBy: z.string(),
  internalOwner: z.string(),
  targetRaise: z.string(),
  minCommitment: z.string(),
  decisionStatus: z.string(),
})

export type Opportunity = z.infer<typeof opportunitySchema>

export const opportunitiesData: Opportunity[] = [
  {
    id: 1,
    name: "Series C Investment - TechFlow",
    company: {
      name: "TechFlow Ventures",
      type: "GP",
    },
    contact: {
      name: "Sarah Chen",
      role: "Managing Partner",
    },
    legalEntity: {
      name: "Meridian Capital Fund III",
      type: "Investment Fund",
    },
    stage: "Due Diligence",
    amount: "$15M",
    probability: 75,
    expectedCloseDate: "2024-08-15",
    lastActivity: "2 days ago",
    status: "Active",
    description: "Growth stage investment in enterprise software company",
    fundingRound: "Series C",
    valuation: "$150M",
    sector: "Enterprise Software",
    geography: "North America",
    dealType: "Series C",
    sourcedBy: "Sarah Chen",
    introducedBy: "Venture Capital",
    internalOwner: "Meridian Capital",
    targetRaise: "$15M",
    minCommitment: "$10M",
    decisionStatus: "Approved",
  },
  {
    id: 2,
    name: "Seed Round - HealthTech Startup",
    company: {
      name: "MedInnovate Inc",
      type: "Issuer",
    },
    contact: {
      name: "Dr. Michael Rodriguez",
      role: "CEO & Founder",
    },
    legalEntity: {
      name: "Innovation Ventures LLC",
      type: "Investment Vehicle",
    },
    stage: "Term Sheet",
    amount: "$3M",
    probability: 60,
    expectedCloseDate: "2024-07-30",
    lastActivity: "1 week ago",
    status: "Active",
    description: "Early stage investment in digital health platform",
    fundingRound: "Seed",
    valuation: "$20M",
    sector: "Healthcare Technology",
    geography: "North America",
    dealType: "Seed",
    sourcedBy: "Dr. Michael Rodriguez",
    introducedBy: "HealthTech Angels",
    internalOwner: "Innovation Ventures",
    targetRaise: "$3M",
    minCommitment: "$2M",
    decisionStatus: "Approved",
  },
  {
    id: 3,
    name: "Growth Investment - FinTech Platform",
    company: {
      name: "PayFlow Solutions",
      type: "Issuer",
    },
    contact: {
      name: "Jennifer Kim",
      role: "VP Business Development",
    },
    legalEntity: {
      name: "Global Growth Partners",
      type: "Private Equity Fund",
    },
    stage: "Initial Contact",
    amount: "$25M",
    probability: 30,
    expectedCloseDate: "2024-10-15",
    lastActivity: "3 days ago",
    status: "Active",
    description: "Growth capital for payment processing expansion",
    fundingRound: "Series B",
    valuation: "$200M",
    sector: "Financial Technology",
    geography: "Global",
    dealType: "Series B",
    sourcedBy: "Jennifer Kim",
    introducedBy: "Global Growth Partners",
    internalOwner: "Global Growth Partners",
    targetRaise: "$25M",
    minCommitment: "$15M",
    decisionStatus: "Pending",
  },
  {
    id: 4,
    name: "Acquisition Opportunity - AI Startup",
    company: {
      name: "Neural Networks Corp",
      type: "Issuer",
    },
    contact: {
      name: "Alex Thompson",
      role: "Chief Strategy Officer",
    },
    legalEntity: {
      name: "Strategic Acquisitions Fund",
      type: "Acquisition Vehicle",
    },
    stage: "Closed Won",
    amount: "$50M",
    probability: 100,
    expectedCloseDate: "2024-06-01",
    lastActivity: "1 month ago",
    status: "Closed",
    description: "Strategic acquisition of AI/ML technology company",
    fundingRound: "Acquisition",
    valuation: "$50M",
    sector: "Artificial Intelligence",
    geography: "North America",
    dealType: "Acquisition",
    sourcedBy: "Alex Thompson",
    introducedBy: "Strategic Acquisitions Fund",
    internalOwner: "Strategic Acquisitions Fund",
    targetRaise: "$50M",
    minCommitment: "$50M",
    decisionStatus: "Approved",
  },
  {
    id: 5,
    name: "Real Estate Fund Investment",
    company: {
      name: "Urban Development Partners",
      type: "GP",
    },
    contact: {
      name: "Robert Martinez",
      role: "Fund Manager",
    },
    legalEntity: {
      name: "Real Estate Investment Trust",
      type: "REIT",
    },
    stage: "Proposal",
    amount: "$100M",
    probability: 45,
    expectedCloseDate: "2024-09-30",
    lastActivity: "5 days ago",
    status: "Active",
    description: "Commercial real estate development fund",
    fundingRound: "Fund Investment",
    valuation: "N/A",
    sector: "Real Estate",
    geography: "North America",
    dealType: "Fund Investment",
    sourcedBy: "Robert Martinez",
    introducedBy: "Urban Development Partners",
    internalOwner: "Urban Development Partners",
    targetRaise: "$100M",
    minCommitment: "$75M",
    decisionStatus: "Pending",
  },
  {
    id: 6,
    name: "Co-Investment - Consumer Tech",
    company: {
      name: "Apollo Global Management",
      type: "GP",
    },
    contact: {
      name: "Lisa Wang",
      role: "Partner",
    },
    legalEntity: {
      name: "Family Office Co-Invest Vehicle",
      type: "SPV",
    },
    stage: "Due Diligence",
    amount: "$5M",
    probability: 65,
    expectedCloseDate: "2024-08-30",
    lastActivity: "1 day ago",
    status: "Active",
    description: "Co-investment alongside Apollo in consumer technology platform",
    fundingRound: "Buyout",
    valuation: "$500M",
    sector: "Consumer Technology",
    geography: "North America",
    dealType: "Co-Investment",
    sourcedBy: "Investment Team",
    introducedBy: "Apollo Global Management",
    internalOwner: "Michael Chen",
    targetRaise: "$150M",
    minCommitment: "$5M",
    decisionStatus: "Under Review",
  },
  {
    id: 7,
    name: "KKR Americas Fund XIII",
    company: {
      name: "KKR & Co.",
      type: "GP",
    },
    contact: {
      name: "James Patterson",
      role: "Managing Director",
    },
    legalEntity: {
      name: "Family Office Master Fund",
      type: "Investment Fund",
    },
    stage: "Term Sheet",
    amount: "$20M",
    probability: 80,
    expectedCloseDate: "2024-07-15",
    lastActivity: "3 hours ago",
    status: "Active",
    description: "Commitment to KKR's flagship North American buyout fund",
    fundingRound: "Fund Commitment",
    valuation: "N/A",
    sector: "Diversified",
    geography: "North America",
    dealType: "Fund Commitment",
    sourcedBy: "CIO Office",
    introducedBy: "KKR Investor Relations",
    internalOwner: "Sarah Johnson",
    targetRaise: "$15B",
    minCommitment: "$10M",
    decisionStatus: "Approved",
  },
  {
    id: 8,
    name: "Secondary Purchase - Vista Fund",
    company: {
      name: "Vista Equity Partners",
      type: "GP",
    },
    contact: {
      name: "David Miller",
      role: "Secondary Advisory",
    },
    legalEntity: {
      name: "Secondary Investment Vehicle",
      type: "SPV",
    },
    stage: "Initial Contact",
    amount: "$8M",
    probability: 40,
    expectedCloseDate: "2024-09-15",
    lastActivity: "1 week ago",
    status: "Active",
    description: "Secondary purchase of LP interest in Vista Equity Fund VI",
    fundingRound: "Secondary",
    valuation: "$8M",
    sector: "Enterprise Software",
    geography: "Global",
    dealType: "Secondary",
    sourcedBy: "Secondary Desk",
    introducedBy: "Jefferies",
    internalOwner: "Tom Anderson",
    targetRaise: "N/A",
    minCommitment: "$8M",
    decisionStatus: "Pending",
  },
  {
    id: 9,
    name: "Direct Investment - Renewable Energy",
    company: {
      name: "SolarTech Industries",
      type: "Issuer",
    },
    contact: {
      name: "Emma Green",
      role: "CFO",
    },
    legalEntity: {
      name: "Green Investment Holdings",
      type: "Investment Vehicle",
    },
    stage: "Closed Lost",
    amount: "$30M",
    probability: 0,
    expectedCloseDate: "2024-05-15",
    lastActivity: "2 months ago",
    status: "Closed",
    description: "Direct investment in solar panel manufacturing",
    fundingRound: "Growth Equity",
    valuation: "$300M",
    sector: "Renewable Energy",
    geography: "Europe",
    dealType: "Direct Investment",
    sourcedBy: "European Team",
    introducedBy: "Credit Suisse",
    internalOwner: "Klaus Weber",
    targetRaise: "$100M",
    minCommitment: "$25M",
    decisionStatus: "Rejected",
  },
  {
    id: 10,
    name: "Blackstone Strategic Partners IV",
    company: {
      name: "Blackstone",
      type: "GP",
    },
    contact: {
      name: "Rachel Cohen",
      role: "Senior Managing Director",
    },
    legalEntity: {
      name: "Family Office Fund Holdings",
      type: "Investment Fund",
    },
    stage: "Due Diligence",
    amount: "$25M",
    probability: 70,
    expectedCloseDate: "2024-08-01",
    lastActivity: "4 days ago",
    status: "Active",
    description: "Commitment to Blackstone's secondary fund",
    fundingRound: "Fund Commitment",
    valuation: "N/A",
    sector: "Diversified",
    geography: "Global",
    dealType: "Fund Commitment",
    sourcedBy: "Investment Committee",
    introducedBy: "Blackstone",
    internalOwner: "Jessica Martinez",
    targetRaise: "$20B",
    minCommitment: "$15M",
    decisionStatus: "Under Review",
  },
  {
    id: 11,
    name: "Citadel Wellington Fund",
    company: {
      name: "Citadel",
      type: "GP",
    },
    contact: {
      name: "Mark Stevens",
      role: "Portfolio Manager",
    },
    legalEntity: {
      name: "Liquid Strategies Portfolio",
      type: "Investment Fund",
    },
    stage: "Proposal",
    amount: "$50M",
    probability: 55,
    expectedCloseDate: "2024-07-31",
    lastActivity: "2 days ago",
    status: "Active",
    description: "Allocation to Citadel's multi-strategy hedge fund",
    fundingRound: "Fund Investment",
    valuation: "N/A",
    sector: "Hedge Fund",
    geography: "Global",
    dealType: "Hedge Fund",
    sourcedBy: "Risk Management",
    introducedBy: "Goldman Sachs PB",
    internalOwner: "Robert Chen",
    targetRaise: "N/A",
    minCommitment: "$25M",
    decisionStatus: "Pending",
  },
  {
    id: 12,
    name: "Warburg Pincus Asia Fund",
    company: {
      name: "Warburg Pincus",
      type: "GP",
    },
    contact: {
      name: "Kevin Liu",
      role: "Managing Director",
    },
    legalEntity: {
      name: "Asia Growth Capital",
      type: "Investment Fund",
    },
    stage: "Term Sheet",
    amount: "$15M",
    probability: 85,
    expectedCloseDate: "2024-07-20",
    lastActivity: "6 hours ago",
    status: "Active",
    description: "Commitment to Warburg Pincus Asia-focused growth fund",
    fundingRound: "Fund Commitment",
    valuation: "N/A",
    sector: "Diversified",
    geography: "Asia",
    dealType: "Fund Commitment",
    sourcedBy: "Asia Team",
    introducedBy: "Warburg Pincus",
    internalOwner: "Linda Zhang",
    targetRaise: "$8B",
    minCommitment: "$10M",
    decisionStatus: "Approved",
  },
]

const getStageColor = (stage: string) => {
  switch (stage) {
    case "Initial Contact":
      return "bg-gray-100 text-gray-800"
    case "Proposal":
      return "bg-blue-100 text-blue-800"
    case "Due Diligence":
      return "bg-yellow-100 text-yellow-800"
    case "Term Sheet":
      return "bg-purple-100 text-purple-800"
    case "Closed Won":
      return "bg-green-100 text-green-800"
    case "Closed Lost":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800"
    case "On Hold":
      return "bg-yellow-100 text-yellow-800"
    case "Closed":
      return "bg-blue-100 text-blue-800"
    case "Cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

function TableView({ data, activeTab, onTaskClick, onNoteClick, onMeetingClick, onEmailClick }: any) {
  return (
    <TabContentRenderer
      activeTab={activeTab}
      viewMode="table"
      data={data}
      onTaskClick={onTaskClick}
      onNoteClick={onNoteClick}
      onMeetingClick={onMeetingClick}
      onEmailClick={onEmailClick}
    />
  )
}

function CardView({ data, activeTab, onTaskClick, onNoteClick, onMeetingClick, onEmailClick }: any) {
  return (
    <TabContentRenderer
      activeTab={activeTab}
      viewMode="card"
      data={data}
      onTaskClick={onTaskClick}
      onNoteClick={onNoteClick}
      onMeetingClick={onMeetingClick}
      onEmailClick={onEmailClick}
    />
  )
}

function ListView({ data, activeTab, onTaskClick, onNoteClick, onMeetingClick, onEmailClick }: any) {
  return (
    <TabContentRenderer
      activeTab={activeTab}
      viewMode="list"
      data={data}
      onTaskClick={onTaskClick}
      onNoteClick={onNoteClick}
      onMeetingClick={onMeetingClick}
      onEmailClick={onEmailClick}
    />
  )
}

function getOpportunityTabData(activeTab: string, opportunity: Opportunity) {
  switch (activeTab) {
    case "emails":
      return [
        {
          id: 1,
          subject: "Investment Performance Update",
          from: "portfolio@company.com",
          date: "2 hours ago",
          status: "Unread",
          preview: "Quarterly performance report for your investment in " + opportunity.name,
          type: "received",
        },
        {
          id: 2,
          subject: "Valuation Update Required",
          from: "me@company.com",
          date: "1 day ago",
          status: "Sent",
          preview: "Please provide updated valuation for " + opportunity.name,
          type: "sent",
        },
        {
          id: 3,
          subject: "Due Diligence Documents",
          from: "legal@company.com",
          date: "3 days ago",
          status: "Read",
          preview: "Attached are the due diligence documents for " + opportunity.name,
          type: "received",
        },
      ]
    case "tasks":
      return [
        {
          id: 1,
          title: "Review financial statements",
          assignee: "John Smith",
          dueDate: "2024-02-15",
          status: "In Progress",
          priority: "High",
        },
        {
          id: 2,
          title: "Complete due diligence checklist",
          assignee: "Sarah Johnson",
          dueDate: "2024-02-20",
          status: "Pending",
          priority: "Medium",
        },
      ]
    case "notes":
      return [
        {
          id: 1,
          title: "Investment Committee Analysis",
          content: `Investment Opportunity Assessment - ${opportunity.name}

Date: January 10, 2025
Prepared by: Investment Team
Company: ${opportunity.company.name}
Deal Type: ${opportunity.dealType}
Stage: ${opportunity.stage}

Executive Summary:
This memorandum presents our analysis of the ${opportunity.name} investment opportunity. After comprehensive due diligence and market analysis, we recommend proceeding with a ${opportunity.amount} investment as part of the ${opportunity.fundingRound}.

Investment Highlights:
1. Market Opportunity:
   - TAM: $${Math.floor(Math.random() * 50 + 20)}B growing at ${Math.floor(Math.random() * 20 + 15)}% CAGR
   - Company positioned to capture significant market share
   - Clear path to market leadership in ${opportunity.sector}

2. Business Model:
   - Recurring revenue model with strong unit economics
   - Gross margins of ${Math.floor(Math.random() * 30 + 60)}%
   - Low customer acquisition costs
   - High customer lifetime value

3. Team Assessment:
   - CEO: Former VP at Fortune 500 company
   - CTO: 20+ years experience, 3 successful exits
   - Strong bench depth across all functions
   - Board includes industry luminaries

4. Financial Performance:
   - Current ARR: $${Math.floor(Math.random() * 50 + 10)}M
   - YoY Growth: ${Math.floor(Math.random() * 100 + 50)}%
   - Path to profitability: ${Math.floor(Math.random() * 24 + 12)} months
   - Burn rate well-managed

5. Investment Terms:
   - Our Investment: ${opportunity.amount}
   - Valuation: ${opportunity.valuation}
   - Ownership: ${Math.floor(Math.random() * 10 + 5)}% (fully diluted)
   - Pro-rata rights for future rounds

Risk Analysis:
• Market Risk: MODERATE - Competitive landscape evolving
• Execution Risk: LOW - Team has proven track record
• Technology Risk: LOW - Platform is mature and scalable
• Regulatory Risk: LOW - No significant concerns

Strategic Fit:
This opportunity aligns perfectly with our family office investment strategy:
- Focus on ${opportunity.sector} sector
- ${opportunity.stage} stage investments
- Geographic presence in ${opportunity.geography}
- ESG compliance verified

Co-Investment Partners:
- Lead Investor: Top-tier VC firm
- Other participants: Strategic corporate investor
- Total round: ${opportunity.targetRaise}

Due Diligence Completed:
✓ Financial audit by Big 4 firm
✓ Legal review by external counsel
✓ Technical due diligence
✓ Customer reference calls (15 completed)
✓ Background checks on key executives

Investment Committee Vote:
- Unanimous approval (5-0)
- Strong enthusiasm from all members
- Recommended for immediate execution

Next Steps:
1. Execute subscription agreement
2. Wire funds by ${opportunity.expectedCloseDate}
3. Designate board observer
4. Schedule quarterly review meetings
5. Introduce to portfolio companies for synergies

Conclusion:
This represents a compelling opportunity to invest in a high-growth company with strong fundamentals. The investment aligns with our strategic objectives and offers attractive risk-adjusted returns.`,
          author: "Mike Wilson",
          date: "2024-01-10",
          tags: ["Investment Committee", "Analysis", "Recommendation"],
        },
        {
          id: 2,
          title: "Due Diligence Summary",
          content: `Due Diligence Report - ${opportunity.name}

Date: January 5, 2024
Lead: Investment Team
Status: COMPLETED

Overview:
We have completed comprehensive due diligence on ${opportunity.company.name} for the proposed ${opportunity.amount} investment. Our findings support proceeding with the investment.

Key Findings:

1. Business Due Diligence:
   ✓ Business model validated with customers
   ✓ Strong product-market fit confirmed
   ✓ Competitive advantages sustainable
   ✓ Growth projections achievable

2. Financial Due Diligence:
   ✓ Historical financials audited and clean
   ✓ Revenue recognition appropriate
   ✓ Cash flow projections reasonable
   ✓ No hidden liabilities identified

3. Legal Due Diligence:
   ✓ Corporate structure properly organized
   ✓ All IP owned by company
   ✓ No material litigation
   ✓ Employment agreements in place

4. Technical Due Diligence:
   ✓ Technology platform scalable
   ✓ No critical technical debt
   ✓ Security measures appropriate
   ✓ Development roadmap realistic

5. Commercial Due Diligence:
   ✓ Customer satisfaction high (NPS: 72)
   ✓ Low churn rates (<5% annually)
   ✓ Strong sales pipeline
   ✓ Expansion opportunities identified

Red Flags Identified: None

Yellow Flags:
- Customer concentration (top 10 = 45% of revenue)
- International expansion requires investment
- Key person dependency on CTO

Mitigation Strategies:
- Diversification plan in place
- International team being hired
- CTO succession planning initiated

Reference Calls Summary:
- 15 customer references (all positive)
- 5 investor references (strong endorsements)
- 3 partner references (excellent feedback)

Expert Network Feedback:
- Industry experts validate market opportunity
- Technology approach considered best-in-class
- Team highly regarded in industry

Investment Recommendation: PROCEED

The company presents an attractive investment opportunity with manageable risks and strong upside potential.`,
          author: "Sarah Johnson",
          date: "2024-01-05",
          tags: ["Due Diligence", "Summary", "Completed"],
        },
        {
          id: 3,
          title: "Strategic Rationale",
          content: `Strategic Investment Thesis - ${opportunity.name}

Date: January 3, 2024
Author: Investment Director

Strategic Context:
This investment opportunity in ${opportunity.company.name} represents a strategic addition to our family office portfolio, providing exposure to the high-growth ${opportunity.sector} sector.

Portfolio Construction Benefits:

1. Diversification:
   - Adds exposure to ${opportunity.sector} (currently underweight)
   - Geographic diversification in ${opportunity.geography}
   - Stage diversification (${opportunity.stage})
   - Low correlation with existing holdings

2. Synergies with Portfolio:
   - Customer overlap with 3 portfolio companies
   - Technology complementary to existing investments
   - Management team connections valuable
   - Cross-selling opportunities identified

3. Family Office Objectives:
   - Aligns with next-generation interests
   - ESG criteria fully satisfied
   - Educational opportunity for family members
   - Potential for philanthropic partnership

Market Thesis:
The ${opportunity.sector} market is experiencing secular growth driven by:
- Digital transformation acceleration
- Changing consumer behaviors
- Regulatory tailwinds
- Technology enablement

We believe ${opportunity.company.name} is uniquely positioned to capitalize on these trends through:
- Superior technology platform
- First-mover advantage in key segments
- Network effects creating moat
- Experienced team with domain expertise

Value Creation Plan:
1. Operational Support:
   - Introduce to our advisor network
   - Share best practices from portfolio
   - Assist with executive recruiting
   - Provide market intelligence

2. Strategic Initiatives:
   - Facilitate customer introductions
   - Support international expansion
   - Help with add-on acquisitions
   - Board governance expertise

3. Exit Planning:
   - IPO candidate in 3-5 years
   - Strategic buyer interest likely
   - Secondary opportunities available
   - Management buy-back possible

Expected Returns:
- Base Case: 3.5x MOIC, 35% IRR
- Bull Case: 5.0x MOIC, 45% IRR
- Bear Case: 1.5x MOIC, 10% IRR
- Probability-weighted: 3.8x MOIC

Investment Horizon: 4-6 years

Key Success Factors:
1. Continued market growth
2. Successful product roadmap execution
3. Talent retention and recruitment
4. International expansion success
5. Maintaining technology leadership

Monitoring Plan:
- Quarterly financial reporting
- Monthly KPI dashboard
- Board observer rights
- Annual strategy sessions
- Regular management check-ins

This investment strongly aligns with our family office strategy and offers attractive risk-adjusted returns with multiple paths to liquidity.`,
          author: "Michael Chen",
          date: "2024-01-03",
          tags: ["Strategy", "Investment Thesis", "Portfolio"],
        },
      ]
    case "meetings":
      return [
        {
          id: 1,
          title: "Investment Committee Meeting",
          date: "2024-02-10",
          time: "10:00 AM",
          attendees: ["John Smith", "Sarah Johnson", "Mike Wilson"],
          status: "Scheduled",
        },
        {
          id: 2,
          title: "Due Diligence Review",
          date: "2024-02-15",
          time: "2:00 PM",
          attendees: ["Jessica Martinez", "Sarah Johnson"],
          status: "Scheduled",
        },
        {
          id: 3,
          title: "Management Presentation",
          date: "2024-02-20",
          time: "9:00 AM",
          attendees: ["Management Team", "Investment Committee"],
          status: "Pending",
        },
        {
          id: 4,
          title: "Final Investment Decision",
          date: "2024-02-25",
          time: "11:00 AM",
          attendees: ["Investment Committee"],
          status: "Pending",
        },
      ]
    case "files":
      return [
        {
          id: 1,
          name: "Investment Memorandum.pdf",
          size: "2.4 MB",
          type: "PDF",
          uploadedDate: "2024-01-15",
          uploadedBy: "John Smith",
        },
        {
          id: 2,
          name: "Financial Statements Q4.xlsx",
          size: "1.1 MB",
          type: "Excel",
          uploadedDate: "2024-01-20",
          uploadedBy: "Sarah Johnson",
        },
        {
          id: 3,
          name: "Due Diligence Checklist.docx",
          size: "850 KB",
          type: "Word",
          uploadedDate: "2024-01-25",
          uploadedBy: "Mike Wilson",
        },
        {
          id: 4,
          name: "Market Analysis Report.pdf",
          size: "3.2 MB",
          type: "PDF",
          uploadedDate: "2024-02-01",
          uploadedBy: "Analysis Team",
        },
        {
          id: 5,
          name: "Legal Documents.zip",
          size: "5.8 MB",
          type: "Archive",
          uploadedDate: "2024-02-05",
          uploadedBy: "Jessica Martinez",
        },
      ]
    case "team":
      return [
        {
          id: 1,
          name: "John Smith",
          role: "Investment Manager",
          email: "john.smith@company.com",
          phone: "+1 (555) 123-4567",
        },
        {
          id: 2,
          name: "Sarah Johnson",
          role: "Senior Analyst",
          email: "sarah.johnson@company.com",
          phone: "+1 (555) 234-5678",
        },
        {
          id: 3,
          name: "Mike Wilson",
          role: "Investment Director",
          email: "mike.wilson@company.com",
          phone: "+1 (555) 345-6789",
        },
        {
          id: 4,
          name: "Emily Davis",
          role: "Research Analyst",
          email: "emily.davis@company.com",
          phone: "+1 (555) 456-7890",
        },
        {
          id: 5,
          name: "David Brown",
          role: "Investment Associate",
          email: "david.brown@company.com",
          phone: "+1 (555) 567-8901",
        },
        {
          id: 6,
          name: "Lisa Garcia",
          role: "Operations Manager",
          email: "lisa.garcia@company.com",
          phone: "+1 (555) 678-9012",
        },
      ]
    case "company":
      return [
        {
          id: 1,
          name: opportunity.company.name,
          type: opportunity.company.type,
          description: "Company information and details",
          website: "https://company.com",
          industry: opportunity.sector,
          location: opportunity.geography,
        },
      ]
    default:
      return []
  }
}

function OpportunityNameCell({ opportunity }: { opportunity: Opportunity }) {
  const tabs = [
    { id: "details", label: "Details", count: null, icon: FileTextIcon },
    { id: "notes", label: "Notes", count: 3, icon: FileIcon },
    { id: "files", label: "Files", count: 5, icon: FileTextIcon },
    { id: "tasks", label: "Tasks", count: 2, icon: CheckCircleIcon },
    { id: "emails", label: "Emails", count: 3, icon: MailIcon },
    { id: "meetings", label: "Meetings", count: 4, icon: CalendarIcon },
    { id: "team", label: "People", count: 6, icon: UsersIcon },
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
      return <OpportunityDetailsPanel opportunity={opportunity} isFullScreen={false} />
    }

    // For other tabs, return generic content similar to the dashboard
    const data = getOpportunityTabData(activeTab, opportunity)

    if (viewMode === "table") {
      return (
        <TableView
          data={data}
          activeTab={activeTab}
          onTaskClick={setSelectedTask}
          onNoteClick={setSelectedNote}
          onMeetingClick={setSelectedMeeting}
          onEmailClick={setSelectedEmail}
        />
      )
    }

    if (viewMode === "card") {
      return (
        <CardView
          data={data}
          activeTab={activeTab}
          onTaskClick={setSelectedTask}
          onNoteClick={setSelectedNote}
          onMeetingClick={setSelectedMeeting}
          onEmailClick={setSelectedEmail}
        />
      )
    }

    return (
      <ListView
        data={data}
        activeTab={activeTab}
        onTaskClick={setSelectedTask}
        onNoteClick={setSelectedNote}
        onMeetingClick={setSelectedMeeting}
        onEmailClick={setSelectedEmail}
      />
    )
  }

  const renderDetailsPanel = (isFullScreen = false) => {
    return <OpportunityDetailsPanel opportunity={opportunity} isFullScreen={isFullScreen} />
  }

  const customActions: React.ReactNode[] = []

  return (
    <MasterDrawer
      trigger={
        <Button variant="link" className="w-fit px-0 text-left text-foreground h-auto">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground text-xs font-medium">
              {opportunity.name.charAt(0)}
            </div>
            <span className="font-medium">{opportunity.name}</span>
          </div>
        </Button>
      }
      title={opportunity.name}
      recordType="Opportunities"
      subtitle={`${opportunity.company.name} • ${opportunity.stage}`}
      tabs={tabs}
      detailsPanel={renderDetailsPanel}
      activityContent={<OpportunityActivityContent />}
      customActions={customActions}
    >
      {renderTabContent}
    </MasterDrawer>
  )
}

function OpportunityActivityContent() {
  const activities = generateOpportunityActivities()
  return <UnifiedActivitySection activities={activities} />
}

function OpportunityDetailsPanel({
  opportunity,
  isFullScreen = false,
}: { opportunity: Opportunity; isFullScreen?: boolean }) {
  // Mock data for related records
  const relatedData = {
    companies: [
      { id: 1, name: opportunity.company.name, type: opportunity.company.type },
      { id: 2, name: "Venture Partners LLC", type: "Co-Investor" },
    ],
    people: [
      { id: 1, name: opportunity.contact.name, role: opportunity.contact.role },
      { id: 2, name: "Michael Chen", role: "Investment Manager" },
      { id: 3, name: "David Williams", role: "Board Member" },
    ],
    entities: [
      { id: 1, name: opportunity.legalEntity.name, type: opportunity.legalEntity.type },
      { id: 2, name: "Offshore Holdings LLC", type: "Holding Company" },
    ],
    investments: [
      { id: 1, name: "Previous Funding Round", amount: "$3M" },
      { id: 2, name: "Strategic Investment", amount: "$1.5M" },
    ],
    opportunities: [
      { id: 1, name: "Follow-on Investment", status: "In Discussion" },
      { id: 2, name: "Related Partnership Deal", status: "Initial Review" },
    ],
  };

  // Mock navigation handler for related records
  const navigateToRecord = (recordType: string, id: number) => {
    console.log(`Navigate to ${recordType} record with ID: ${id}`);
    // This would be implemented to navigate to the record
  };

  // Mock handler for adding a linked record
  const handleAddRecord = (sectionId: string) => {
    console.log(`Add new ${sectionId} record for ${opportunity.name}`);
    // This would open the appropriate creation dialog
  };

  // Mock handler for removing a linked record
  const handleUnlinkRecord = (sectionId: string, id: number) => {
    console.log(`Unlink ${sectionId} record with ID ${id} from ${opportunity.name}`);
    // This would handle removal of the relationship
  };
  
  const infoFields = [
    { label: "Opportunity Name", value: opportunity.name },
    { label: "Deal Type", value: opportunity.dealType },
    { label: "Stage", value: opportunity.stage },
    { label: "Decision Status", value: opportunity.decisionStatus },
    { label: "Our Investment", value: opportunity.amount },
    { label: "Target Raise", value: opportunity.targetRaise },
    { label: "Minimum Commitment", value: opportunity.minCommitment },
    { label: "Valuation", value: opportunity.valuation },
    { label: "Company", value: `${opportunity.company.name} (${opportunity.company.type})` },
    { label: "Sourced By", value: opportunity.sourcedBy },
    { label: "Introduced By", value: opportunity.introducedBy },
    { label: "Internal Owner", value: opportunity.internalOwner },
    { label: "Contact", value: `${opportunity.contact.name} - ${opportunity.contact.role}` },
    { label: "Legal Entity", value: `${opportunity.legalEntity.name} (${opportunity.legalEntity.type})` },
    { label: "Expected Close Date", value: opportunity.expectedCloseDate },
    { label: "Probability", value: `${opportunity.probability}%` },
    { label: "Funding Round", value: opportunity.fundingRound },
    { label: "Sector", value: opportunity.sector },
    { label: "Geography", value: opportunity.geography },
    { label: "Status", value: opportunity.status },
    { label: "Last Activity", value: opportunity.lastActivity },
    { label: "Description", value: opportunity.description },
  ]

  const sections = buildStandardDetailSections({
    infoTitle: "Opportunity Information",
    infoIcon: <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />,
    infoFields,
    companies: relatedData.companies,
    people: relatedData.people,
    entities: relatedData.entities,
    investments: relatedData.investments,
    opportunities: relatedData.opportunities,
  })

  return (
    <UnifiedDetailsPanel
      sections={sections}
      isFullScreen={isFullScreen}
      onNavigateToRecord={navigateToRecord}
      onAddRecord={handleAddRecord}
      onUnlinkRecord={handleUnlinkRecord}
      activityContent={<OpportunityActivityContent />}
    />
  )
}

const columns: ColumnDef<Opportunity>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="h-8 -ml-2 px-2">
        Opportunity
        {column.getIsSorted() === "asc" ? (
          <SortAscIcon className="ml-2 h-3 w-3" />
        ) : column.getIsSorted() === "desc" ? (
          <SortDescIcon className="ml-2 h-3 w-3" />
        ) : null}
      </Button>
    ),
    cell: ({ row }) => <OpportunityNameCell opportunity={row.original} />,
    enableHiding: false,
  },
  {
    accessorKey: "dealType",
    header: "Deal Type",
    cell: ({ row }) => <span className="text-sm font-medium">{row.original.dealType}</span>,
  },
  {
    accessorKey: "stage",
    header: "Stage",
    cell: ({ row }) => <Badge className={`text-xs ${getStageColor(row.original.stage)}`}>{row.original.stage}</Badge>,
  },
  {
    accessorKey: "decisionStatus",
    header: "Decision Status",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-xs capitalize">
        {row.original.decisionStatus}
      </Badge>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="h-8 -ml-2 px-2">
        Our Investment
        {column.getIsSorted() === "asc" ? (
          <SortAscIcon className="ml-2 h-3 w-3" />
        ) : column.getIsSorted() === "desc" ? (
          <SortDescIcon className="ml-2 h-3 w-3" />
        ) : null}
      </Button>
    ),
    cell: ({ row }) => <span className="text-sm font-medium">{row.original.amount}</span>,
  },
  {
    accessorKey: "targetRaise",
    header: "Target Raise",
    cell: ({ row }) => <span className="text-sm">{row.original.targetRaise}</span>,
  },
  {
    accessorKey: "minCommitment",
    header: "Min Commitment",
    cell: ({ row }) => <span className="text-sm">{row.original.minCommitment}</span>,
  },
  {
    accessorKey: "valuation",
    header: "Valuation",
    cell: ({ row }) => <span className="text-sm font-medium">{row.original.valuation}</span>,
  },
  {
    accessorKey: "company",
    header: "Company",
    cell: ({ row }) => <span className="text-sm font-medium">{row.original.company.name}</span>,
  },
  {
    accessorKey: "companyType",
    header: "Company Type",
    cell: ({ row }) => <span className="text-sm">{row.original.company.type}</span>,
  },
  {
    accessorKey: "sourcedBy",
    header: "Sourced By",
    cell: ({ row }) => <span className="text-sm">{row.original.sourcedBy}</span>,
  },
  {
    accessorKey: "introducedBy",
    header: "Introduced By",
    cell: ({ row }) => <span className="text-sm">{row.original.introducedBy}</span>,
  },
  {
    accessorKey: "internalOwner",
    header: "Internal Owner",
    cell: ({ row }) => <span className="text-sm font-medium">{row.original.internalOwner}</span>,
  },
  {
    accessorKey: "expectedCloseDate",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="h-8 -ml-2 px-2">
        Expected Close
        {column.getIsSorted() === "asc" ? (
          <SortAscIcon className="ml-2 h-3 w-3" />
        ) : column.getIsSorted() === "desc" ? (
          <SortDescIcon className="ml-2 h-3 w-3" />
        ) : null}
      </Button>
    ),
    cell: ({ row }) => <span className="text-sm">{row.original.expectedCloseDate}</span>,
  },
  {
    accessorKey: "sector",
    header: "Sector",
    cell: ({ row }) => <span className="text-sm">{row.original.sector}</span>,
  },
  {
    accessorKey: "geography",
    header: "Geography",
    cell: ({ row }) => <span className="text-sm">{row.original.geography}</span>,
  },
  {
    accessorKey: "lastActivity",
    header: "Last Activity",
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.lastActivity}</span>,
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
          <DropdownMenuItem>Edit opportunity</DropdownMenuItem>
          <DropdownMenuItem>Add to pipeline</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

export function OpportunitiesTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [addOpportunityOpen, setAddOpportunityOpen] = React.useState(false)
  const [columnOrder, setColumnOrder] = React.useState<string[]>([])
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor), useSensor(KeyboardSensor))

  const table = useReactTable({
    data: opportunitiesData,
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
      {/* Add Opportunity Dialog */}
      <AddOpportunityDialog open={addOpportunityOpen} onOpenChange={setAddOpportunityOpen} />

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search opportunities..."
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
              <DropdownMenuItem>Active opportunities</DropdownMenuItem>
              <DropdownMenuItem>High potential</DropdownMenuItem>
              <DropdownMenuItem>Early stage</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Due diligence</DropdownMenuItem>
              <DropdownMenuItem>Term sheet issued</DropdownMenuItem>
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
          <Button size="sm" onClick={() => setAddOpportunityOpen(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Opportunity
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
        {table.getFilteredRowModel().rows.length} opportunity(ies) total.
      </div>
    </div>
  )
}
