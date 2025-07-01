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
  getPaginationRowModel,
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
  BarChartIcon,
  ClipboardIcon,
  GlobeIcon,
  LandmarkIcon,
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
import {
  MailIcon,
  BuildingIcon,
  FileTextIcon,
  FileIcon,
  CalendarIcon,
  FolderIcon,
  UsersIcon,
  CheckCircleIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { formatDate } from "@/lib/utils"

// Import the AddEntityDialog
import { AddEntityDialog } from "./add-entity-dialog"
import { MasterDrawer } from "./master-drawer"
import { MasterDetailsPanel } from "./shared/master-details-panel"
import { UnifiedDetailsPanel } from "@/components/shared/unified-details-panel"
import { UnifiedActivitySection } from "@/components/shared/unified-activity-section"
import { TabContentRenderer } from "@/components/shared/tab-content-renderer"
import { generateEntityActivities } from "@/components/shared/activity-generators"
import { buildStandardDetailSections } from "@/components/shared/detail-section-builder"

export const entitySchema = z.object({
  id: z.number(),
  entityName: z.string(),
  entityType: z.string(),
  rolePurpose: z.string(),
  jurisdiction: z.string(),
  status: z.string(),
  ownershipPercent: z.number().optional(),
  parentEntity: z.string().optional(),
  managerController: z.string(),
  dateFormed: z.string(),
  tags: z.array(z.string()),
  lastModified: z.string(),
  linkedDocs: z.number(),
  upcomingDeadlines: z.array(z.string()),
  notes: z.string(),
})

type Entity = z.infer<typeof entitySchema>

export const entitiesData: Entity[] = [
  {
    id: 1,
    entityName: "Venture Holdings LLC",
    entityType: "LLC",
    rolePurpose: "Holding Co",
    jurisdiction: "Delaware",
    status: "Active",
    ownershipPercent: 100,
    parentEntity: undefined,
    managerController: "John Smith",
    dateFormed: "2020-01-15",
    tags: ["Taxable", "Onshore"],
    lastModified: "2024-01-15",
    linkedDocs: 12,
    upcomingDeadlines: ["Tax Filing - March 15", "Annual Report - April 30"],
    notes: "Primary holding company for all venture investments",
  },
  {
    id: 2,
    entityName: "Tech Investments LP",
    entityType: "LP",
    rolePurpose: "LP",
    jurisdiction: "Cayman",
    status: "Active",
    ownershipPercent: 75,
    parentEntity: "Venture Holdings LLC",
    managerController: "Sarah Johnson",
    dateFormed: "2021-03-10",
    tags: ["Offshore", "Investment Vehicle"],
    lastModified: "2024-01-10",
    linkedDocs: 8,
    upcomingDeadlines: ["Audit - June 30"],
    notes: "Limited partnership for technology sector investments",
  },
  {
    id: 3,
    entityName: "Global Trust Foundation",
    entityType: "Foundation",
    rolePurpose: "Trust",
    jurisdiction: "BVI",
    status: "Active",
    ownershipPercent: undefined,
    parentEntity: undefined,
    managerController: "Michael Chen",
    dateFormed: "2019-11-20",
    tags: ["Offshore", "Charitable"],
    lastModified: "2023-12-20",
    linkedDocs: 15,
    upcomingDeadlines: [],
    notes: "Charitable foundation for philanthropic activities",
  },
  {
    id: 4,
    entityName: "OpCo Delaware Inc",
    entityType: "Corp",
    rolePurpose: "Operating Co",
    jurisdiction: "Delaware",
    status: "Active",
    ownershipPercent: 100,
    parentEntity: "Venture Holdings LLC",
    managerController: "Lisa Wang",
    dateFormed: "2022-05-01",
    tags: ["Taxable", "Onshore", "Operating"],
    lastModified: "2024-01-05",
    linkedDocs: 6,
    upcomingDeadlines: ["Board Meeting - February 15", "Tax Filing - March 15"],
    notes: "Operating company for direct business activities",
  },
  {
    id: 5,
    entityName: "Legacy Trust LLC",
    entityType: "LLC",
    rolePurpose: "Trust",
    jurisdiction: "Nevada",
    status: "Inactive",
    ownershipPercent: undefined,
    parentEntity: undefined,
    managerController: "Robert Davis",
    dateFormed: "2018-08-12",
    tags: ["Onshore", "Legacy"],
    lastModified: "2023-08-12",
    linkedDocs: 3,
    upcomingDeadlines: [],
    notes: "Legacy trust structure, currently inactive",
  },
  {
    id: 6,
    entityName: "Growth Partners GP",
    entityType: "LP",
    rolePurpose: "GP",
    jurisdiction: "Delaware",
    status: "Active",
    ownershipPercent: 2,
    parentEntity: "Venture Holdings LLC",
    managerController: "Amanda Wilson",
    dateFormed: "2023-01-30",
    tags: ["Taxable", "Onshore", "GP"],
    lastModified: "2024-01-12",
    linkedDocs: 9,
    upcomingDeadlines: ["K-1 Distribution - March 31"],
    notes: "General partner entity for fund management",
  },
  {
    id: 7,
    entityName: "International Holdings Ltd",
    entityType: "Corp",
    rolePurpose: "Holding Co",
    jurisdiction: "Cayman",
    status: "Active",
    ownershipPercent: 50,
    parentEntity: "Global Trust Foundation",
    managerController: "David Brown",
    dateFormed: "2020-12-01",
    tags: ["Offshore", "International"],
    lastModified: "2023-12-01",
    linkedDocs: 11,
    upcomingDeadlines: ["Annual Filing - May 31"],
    notes: "International holding structure for global investments",
  },
  {
    id: 8,
    entityName: "Family Office Trust",
    entityType: "Trust",
    rolePurpose: "Trust",
    jurisdiction: "Wyoming",
    status: "Active",
    ownershipPercent: undefined,
    parentEntity: undefined,
    managerController: "Jennifer Taylor",
    dateFormed: "2021-09-15",
    tags: ["Onshore", "Family Office", "Dynasty"],
    lastModified: "2024-01-08",
    linkedDocs: 18,
    upcomingDeadlines: ["Trust Review - April 15"],
    notes: "Dynasty trust for multi-generational wealth planning",
  },
]

function TableView({
  data,
  activeTab,
  onTaskClick,
  onNoteClick,
  onMeetingClick,
  onEmailClick,
}: {
  data: any[]
  activeTab: string
  onTaskClick?: (task: any) => void
  onNoteClick?: (note: any) => void
  onMeetingClick?: (meeting: any) => void
  onEmailClick?: (email: any) => void
}) {
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

function CardView({
  data,
  activeTab,
  onTaskClick,
  onNoteClick,
  onMeetingClick,
  onEmailClick,
}: {
  data: any[]
  activeTab: string
  onTaskClick?: (task: any) => void
  onNoteClick?: (note: any) => void
  onMeetingClick?: (meeting: any) => void
  onEmailClick?: (email: any) => void
}) {
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

function ListView({
  data,
  activeTab,
  onTaskClick,
  onNoteClick,
  onMeetingClick,
  onEmailClick,
}: {
  data: any[]
  activeTab: string
  onTaskClick?: (task: any) => void
  onNoteClick?: (note: any) => void
  onMeetingClick?: (meeting: any) => void
  onEmailClick?: (email: any) => void
}) {
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

function getEntityTabData(activeTab: string, entity: Entity) {
  switch (activeTab) {
    case "emails":
      return [
        {
          id: 1,
          subject: "Investment Performance Update",
          from: "portfolio@company.com",
          date: "2 hours ago",
          status: "Unread",
          preview: "Quarterly performance report for your investment in " + entity.entityName,
          type: "received",
        },
        {
          id: 2,
          subject: "Valuation Update Required",
          from: "me@company.com",
          date: "1 day ago",
          status: "Sent",
          preview: "Please provide updated valuation for " + entity.entityName,
          type: "sent",
        },
        {
          id: 3,
          subject: "Due Diligence Documents",
          from: "legal@company.com",
          date: "3 days ago",
          status: "Read",
          preview: "Attached are the due diligence documents for " + entity.entityName,
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
          title: "Entity Structure Review",
          date: "Yesterday",
          author: "Legal Team",
          topic: "Entity Structure Review",
          content: `Entity Analysis - ${entity.entityName}

Meeting Date: January 29, 2025
Participants: Legal Team, Tax Advisory, Compliance

Executive Summary:
This memorandum provides a comprehensive review of ${entity.entityName} structure and recommendations for optimization within the family office framework.

Entity Details:
• Name: ${entity.entityName}
• Type: ${entity.entityType}
• Jurisdiction: ${entity.jurisdiction}
• Purpose: ${entity.rolePurpose}
• Status: ${entity.status}
• Ownership: ${entity.ownershipPercent ? entity.ownershipPercent + '%' : 'N/A'}
• Parent Entity: ${entity.parentEntity || 'None'}

Structural Analysis:
1. Current Structure Assessment:
   - Entity properly domiciled in ${entity.jurisdiction}
   - Corporate formalities maintained
   - Governance structure appropriate
   - Ownership chain clearly documented

2. Tax Efficiency Review:
   - Current structure optimized for tax efficiency
   - Pass-through taxation benefits utilized
   - No adverse tax consequences identified
   - International tax treaties applicable

3. Regulatory Compliance:
   ✓ All annual filings current
   ✓ Registered agent active
   ✓ Business licenses maintained
   ✓ Financial reporting compliant

Risk Assessment:
• Structural Risk: LOW - Well-organized structure
• Tax Risk: LOW - Compliant with regulations
• Operational Risk: MODERATE - Key person dependency
• Reputational Risk: LOW - Clean compliance record

Optimization Opportunities:
1. Consider converting to Series LLC for subsidiaries
2. Implement management agreement for efficiency
3. Explore offshore structuring for international assets
4. Consolidate inactive entities to reduce costs

Asset Protection Features:
• Limited liability protection intact
• Charging order protection (LLC)
• Asset segregation properly maintained
• Insurance coverage adequate

Governance Recommendations:
1. Update operating agreement annually
2. Document all major decisions
3. Maintain corporate minute book
4. Regular compliance calendar review

Financial Considerations:
• Annual maintenance cost: $${Math.floor(Math.random() * 20 + 5)}K
• Potential tax savings: $${Math.floor(Math.random() * 100 + 50)}K
• Administrative burden: Moderate
• ROI on structure: Positive

Next Steps:
1. Schedule annual entity review (Q2 2025)
2. Update beneficial ownership information
3. Review management structure
4. Consider subsidiary consolidation

This entity structure remains appropriate for its intended purpose with minor optimization opportunities available.`,
          tags: ["Structure Review", "Legal", "Compliance"],
        },
        {
          id: 2,
          title: "Annual Compliance Checklist",
          date: "Last week",
          author: "Compliance Officer",
          topic: "Annual Compliance Checklist",
          content: `${entity.entityName} - Annual Compliance Review

Review Date: January 22, 2025
Entity: ${entity.entityName}
Type: ${entity.entityType}
Jurisdiction: ${entity.jurisdiction}

Compliance Status Overview:
All required filings and compliance obligations for ${entity.entityName} have been reviewed. The entity is currently in good standing with all relevant authorities.

Annual Filing Requirements:
☑ State Annual Report - Filed (Due: ${entity.jurisdiction === 'Delaware' ? 'March 1' : 'Varies'})
☑ Registered Agent - Current (Next renewal: December 31, 2025)
☑ Business License - Active (Renewal: June 30, 2025)
☐ Franchise Tax - Pending (Due: June 1, 2025)
☑ Federal Tax Return - On schedule
☑ State Tax Return - On schedule

Corporate Governance:
☑ Annual Meeting - Held January 15, 2025
☑ Board Resolutions - Documented
☑ Minute Book - Updated
☑ Stock/Membership Ledger - Current
☑ Operating Agreement - Reviewed

Regulatory Compliance:
☑ FinCEN Beneficial Ownership - Filed
☑ Foreign Entity Registration - Current (if applicable)
☑ DBA/Trade Names - Active
☑ EIN Documentation - On file
☑ State Tax ID - Active

Banking & Financial:
☑ Bank Resolutions - Updated
☑ Signatory Cards - Current
☑ Credit Facilities - Reviewed
☑ Financial Statements - Prepared

Insurance Review:
☑ D&O Insurance - Active ($${Math.floor(Math.random() * 10 + 5)}M coverage)
☑ General Liability - Current
☑ Property Insurance - Adequate
☑ Cyber Insurance - In place

Key Dates for 2025:
• March 1: Delaware Annual Report
• March 15: Federal Tax Filing
• June 1: Franchise Tax Payment
• June 30: Business License Renewal
• December 31: Registered Agent Renewal

Recommendations:
1. Schedule Q2 compliance review
2. Update beneficial ownership if changes occur
3. Review D&O insurance limits
4. Consider consolidating filing dates

The entity remains in full compliance with all applicable requirements.`,
          tags: ["Compliance", "Annual Review", "Checklist"],
        },
        {
          id: 3,
          title: "Investment Authority Memo",
          date: "2 weeks ago",
          author: "Investment Committee",
          topic: "Investment Authority Memo",
          content: `Investment Authority Documentation - ${entity.entityName}

Date: January 15, 2025
Entity: ${entity.entityName}
Manager: ${entity.managerController}

Purpose:
This memorandum documents the investment authority and guidelines for ${entity.entityName} as approved by the Investment Committee.

Entity Investment Profile:
• Entity Type: ${entity.entityType}
• Investment Purpose: ${entity.rolePurpose}
• Risk Profile: Moderate to Aggressive
• Investment Horizon: Long-term (10+ years)
• Liquidity Needs: Low to Moderate

Authorized Investment Categories:
1. Public Equities: Up to 60% of portfolio
2. Private Equity: Up to 40% of portfolio
3. Real Estate: Up to 30% of portfolio
4. Fixed Income: Up to 20% of portfolio
5. Alternative Investments: Up to 25% of portfolio
6. Cash & Equivalents: Minimum 5%

Investment Authority Limits:
• ${entity.managerController} Authority:
  - Single investment: Up to $${Math.floor(Math.random() * 5 + 1)}M
  - Annual aggregate: Up to $${Math.floor(Math.random() * 20 + 10)}M
  - Requires IC approval above limits

• Investment Committee Authority:
  - Single investment: Up to $${Math.floor(Math.random() * 20 + 10)}M
  - No annual limit
  - Board approval required above $${Math.floor(Math.random() * 50 + 25)}M

Restricted Investments:
✗ Margin trading or leverage beyond 2:1
✗ Cryptocurrency exceeding 5% of portfolio
✗ Single position exceeding 15% of portfolio
✗ Related party transactions without approval
✗ Speculative derivatives

Investment Process:
1. Investment Sourcing
   - Manager identifies opportunities
   - Initial screening performed
   - Preliminary due diligence

2. Investment Analysis
   - Full due diligence required
   - Investment memo preparation
   - Risk assessment completion

3. Approval Process
   - Manager approval (within limits)
   - IC review for larger investments
   - Board notification quarterly

Performance Benchmarks:
• Absolute Return Target: 12% annually
• Relative Benchmark: S&P 500 + 200bps
• Risk-Adjusted: Sharpe Ratio > 1.0
• Liquidity: 20% within 30 days

Reporting Requirements:
• Monthly: Position summary to Manager
• Quarterly: Performance report to IC
• Annually: Comprehensive review to Board

This authority is effective immediately and remains in force until modified by the Investment Committee.`,
          tags: ["Investment Authority", "Guidelines", "Policy"],
        },
      ]
    case "meetings":
      return [
        {
          id: 1,
          title: "Annual Entity Review",
          date: "Next month",
          time: "2:00 PM",
          attendees: ["Legal", "Tax Advisory"],
          status: "Scheduled",
        },
      ]
    case "files":
      return [
        {
          id: 1,
          name: "Operating_Agreement.pdf",
          size: "1.5 MB",
          uploadedBy: "Legal Team",
          uploadedDate: "6 months ago",
          type: "pdf",
        },
        {
          id: 2,
          name: "Tax_Returns_2023.pdf",
          size: "3.2 MB",
          uploadedBy: "Tax Advisory",
          uploadedDate: "1 year ago",
          type: "pdf",
        },
      ]
    case "team":
      return [
        {
          id: 1,
          name: entity.managerController,
          role: "Manager",
          email: `${entity.managerController.toLowerCase().replace(' ', '.')}@company.com`,
          phone: "+1 (555) 123-4567",
        },
      ]
    default:
      return []
  }
}

function EntityActivityContent() {
  const activities = generateEntityActivities()
  return <UnifiedActivitySection activities={activities} />
}

function EntityDetailsPanel({ entity, isFullScreen = false }: { entity: Entity; isFullScreen?: boolean }) {
  const relatedData = {
    companies: [
          { id: 1, name: "Investment Holdings LLC", type: "Subsidiary" },
          { id: 2, name: "Operations Entity Corp", type: "Related Entity" },
        ],
    people: [
      { id: 1, name: entity.managerController, role: "Manager" },
      { id: 2, name: "Legal Advisor", role: "Counsel" },
    ],
    entities: [
      { id: 1, name: entity.parentEntity || "Parent Holdings", type: "Parent" },
      { id: 2, name: "Sister Entity LLC", type: "Related" },
    ],
    investments: [
      { id: 1, name: "Tech Investments LP", type: "Investment Vehicle" },
      { id: 2, name: "Growth Fund Series A", type: "Fund Investment" },
    ],
    opportunities: [
      { id: 1, name: "New Fund Formation", status: "Planning" },
      { id: 2, name: "Strategic Partnership", status: "Evaluating" },
    ],
  };

  // Basic fields for main section
  const basicFields = [
    {
      label: "Entity Name",
      value: entity.entityName,
    },
    {
      label: "Entity Type",
      value: entity.entityType,
    },
    {
      label: "Role / Purpose",
      value: entity.rolePurpose,
    },
    {
      label: "Jurisdiction",
      value: entity.jurisdiction,
    },
    {
      label: "Status",
      value: entity.status,
    },
    {
      label: "Manager / Controller",
      value: entity.managerController,
    },
    {
      label: "Date Formed",
      value: formatDate(entity.dateFormed),
    },
  ];
  
  // Extended fields for comprehensive view
  const extendedFields = [
    ...basicFields,
    {
      label: "Ownership %",
      value: entity.ownershipPercent ? `${entity.ownershipPercent}%` : "—",
    },
    {
      label: "Parent Entity",
      value: entity.parentEntity || "—",
      isLink: !!entity.parentEntity,
    },
    {
      label: "Last Modified",
      value: formatDate(entity.lastModified),
    },
    {
      label: "Linked Documents",
      value: entity.linkedDocs.toString(),
    },
    {
      label: "Notes",
      value: entity.notes,
    },
  ];

  // Use standard section builder
  const sections = buildStandardDetailSections({
    infoTitle: "Entity Information",
    infoIcon: <LandmarkIcon className="h-4 w-4 text-muted-foreground" />,
    infoFields: isFullScreen || basicFields.length <= 7 ? extendedFields : basicFields,
    companies: relatedData.companies,
    people: relatedData.people,
    entities: relatedData.entities,
    investments: relatedData.investments,
    opportunities: relatedData.opportunities,
    hideWhenEmpty: false,
  });

  // Navigation handler for related records
  const navigateToRecord = (recordType: string, id: number) => {
    console.log(`Navigate to ${recordType} record with ID: ${id}`);
    // This would be implemented to navigate to the record
  };
  
  // Add record handler
  const handleAddRecord = (sectionId: string) => {
    console.log(`Add new ${sectionId} record for ${entity.entityName}`);
    // This would open the appropriate creation dialog
  };
  
  // Unlink record handler
  const handleUnlinkRecord = (sectionId: string, id: number) => {
    console.log(`Unlink ${sectionId} record with ID ${id} from ${entity.entityName}`);
    // This would handle removal of the relationship
  };

  return (
    <UnifiedDetailsPanel
      sections={sections}
      isFullScreen={isFullScreen}
      onNavigateToRecord={navigateToRecord}
      onAddRecord={handleAddRecord}
      onUnlinkRecord={handleUnlinkRecord}
      activityContent={<EntityActivityContent />}
    />
  );
}

function EntityNameCell({ entity }: { entity: Entity }) {
  const tabs = [
    { id: "details", label: "Details", count: null, icon: LandmarkIcon },
    { id: "notes", label: "Notes", count: 3, icon: FileIcon },
    { id: "files", label: "Files", count: 2, icon: FileTextIcon },
    { id: "tasks", label: "Tasks", count: 2, icon: CheckCircleIcon },
    { id: "emails", label: "Emails", count: 3, icon: MailIcon },
    { id: "meetings", label: "Meetings", count: 1, icon: CalendarIcon },
    { id: "team", label: "People", count: 1, icon: UsersIcon },
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
      return <EntityDetailsPanel entity={entity} isFullScreen={false} />
    }
    const data = getEntityTabData(activeTab, entity)
    return (
      <TabContentRenderer activeTab={activeTab} viewMode={viewMode} data={data} onTaskClick={setSelectedTask} onNoteClick={setSelectedNote} onMeetingClick={setSelectedMeeting} onEmailClick={setSelectedEmail} />
    )
  }

  return (
    <MasterDrawer
      trigger={
        <Button variant="link" className="w-fit px-0 text-left text-foreground h-auto">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground text-xs font-medium">
              {entity.entityName.charAt(0)}
            </div>
            <span className="font-medium">{entity.entityName}</span>
          </div>
        </Button>
      }
      title={entity.entityName}
      recordType="Entity"
      subtitle={`${entity.entityType} • ${entity.jurisdiction}`}
      tabs={tabs}
      detailsPanel={(isFullScreen) => <EntityDetailsPanel entity={entity} isFullScreen={isFullScreen} />}
    >
      {renderTabContent}
    </MasterDrawer>
  )
}

const columns: ColumnDef<Entity>[] = [
  {
    accessorKey: "entityName",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="h-8 -ml-2 px-2">
        Entity Name
        {column.getIsSorted() === "asc" ? (
          <SortAscIcon className="ml-2 h-3 w-3" />
        ) : column.getIsSorted() === "desc" ? (
          <SortDescIcon className="ml-2 h-3 w-3" />
        ) : null}
      </Button>
    ),
    cell: ({ row }) => <EntityNameCell entity={row.original} />,
    enableHiding: false,
  },
  {
    accessorKey: "entityType",
    header: "Type",
    cell: ({ row }) => <span className="text-sm">{row.original.entityType}</span>,
  },
  {
    accessorKey: "rolePurpose",
    header: "Purpose",
    cell: ({ row }) => <span className="text-sm">{row.original.rolePurpose}</span>,
  },
  {
    accessorKey: "jurisdiction",
    header: "Jurisdiction",
    cell: ({ row }) => <span className="text-sm">{row.original.jurisdiction}</span>,
  },
  {
    accessorKey: "ownershipPercent",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="h-8 -ml-2 px-2">
        Ownership %
        {column.getIsSorted() === "asc" ? (
          <SortAscIcon className="ml-2 h-3 w-3" />
        ) : column.getIsSorted() === "desc" ? (
          <SortDescIcon className="ml-2 h-3 w-3" />
        ) : null}
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-sm">{row.original.ownershipPercent ? `${row.original.ownershipPercent}%` : "—"}</span>
    ),
  },
  {
    accessorKey: "parentEntity",
    header: "Parent Entity",
    cell: ({ row }) => <span className="text-sm">{row.original.parentEntity || "—"}</span>,
  },
  {
    accessorKey: "managerController",
    header: "Manager",
    cell: ({ row }) => <span className="text-sm">{row.original.managerController}</span>,
  },
  {
    accessorKey: "dateFormed",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="h-8 -ml-2 px-2">
        Date Formed
        {column.getIsSorted() === "asc" ? (
          <SortAscIcon className="ml-2 h-3 w-3" />
        ) : column.getIsSorted() === "desc" ? (
          <SortDescIcon className="ml-2 h-3 w-3" />
        ) : null}
      </Button>
    ),
    cell: ({ row }) => <span className="text-sm">{formatDate(row.original.dateFormed)}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <span className="text-sm">{row.original.status}</span>,
  },
  {
    accessorKey: "linkedDocs",
    header: "Documents",
    cell: ({ row }) => <span className="text-sm">{row.original.linkedDocs}</span>,
  },
  {
    accessorKey: "lastModified",
    header: "Last Modified",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{formatDate(row.original.lastModified)}</span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreVerticalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem>View details</DropdownMenuItem>
          <DropdownMenuItem>Edit entity</DropdownMenuItem>
          <DropdownMenuItem>Add to structure</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

export function EntitiesTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [addEntityOpen, setAddEntityOpen] = React.useState(false)
  const [columnOrder, setColumnOrder] = React.useState<string[]>([])
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor), useSensor(KeyboardSensor))

  const table = useReactTable({
    data: entitiesData,
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
      {/* Add Entity Dialog */}
      <AddEntityDialog open={addEntityOpen} onOpenChange={setAddEntityOpen} />

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search entities..."
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
              <DropdownMenuItem>Active entities</DropdownMenuItem>
              <DropdownMenuItem>Inactive entities</DropdownMenuItem>
              <DropdownMenuItem>Holding companies</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Upcoming deadlines</DropdownMenuItem>
              <DropdownMenuItem>Missing documents</DropdownMenuItem>
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
          <Button size="sm" onClick={() => setAddEntityOpen(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Entity
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
                  className="group h-12 cursor-pointer hover:bg-muted/50"
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
        {table.getFilteredRowModel().rows.length} entity(ies) total.
      </div>
    </div>
  )
}
