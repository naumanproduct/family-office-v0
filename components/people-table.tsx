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
  UsersIcon,
  BuildingIcon,
  FileTextIcon,
  FileIcon,
  CalendarIcon,
  FolderIcon,
  CheckCircleIcon,
  UserIcon,
  LayoutIcon,
  DollarSignIcon,
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
import { MailIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Import the AddPersonDialog at the top of the file
import { AddPersonDialog } from "./add-person-dialog"
import { MasterDrawer } from "./master-drawer"
import { MasterDetailsPanel } from "./shared/master-details-panel"
import { UnifiedDetailsPanel, type DetailSection } from "@/components/shared/unified-details-panel"
import { UnifiedActivitySection, ActivityItem } from "@/components/shared/unified-activity-section"
import { Label } from "@/components/ui/label"
import { TabContentRenderer } from "@/components/shared/tab-content-renderer"
import { generatePersonActivities } from "@/components/shared/activity-generators"

// Add missing component imports
function ContactTabContent({ activeTab, contact }: { activeTab: string; contact: Contact }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>
        <Button variant="outline" size="sm">
          <PlusIcon className="h-4 w-4" />
          Add {activeTab.slice(0, -1)}
        </Button>
      </div>
      <div className="text-center py-8 text-muted-foreground">
        <p>
          No {activeTab} found for {contact.firstName} {contact.lastName}
        </p>
        <p className="text-sm">Add some {activeTab} to get started</p>
      </div>
    </div>
  )
}

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

export const contactSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string(),
  jobTitle: z.string(),
  company: z.string(),
  companyId: z.number().optional(),
  location: z.string(),
  tags: z.array(z.string()),
  lastInteraction: z.string(),
  connectionStrength: z.string(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
  twitterFollowers: z.number().optional(),
  bio: z.string(),
  avatar: z.string().optional(),
  status: z.string(),
  type: z.string().optional(),
  associatedEntities: z.array(z.string()).optional(),
  relatedInvestments: z.array(z.string()).optional(),
  internalOwner: z.string().optional(),
  introducedBy: z.string().optional(),
})

type Contact = z.infer<typeof contactSchema>

const contactsData: Contact[] = [
  {
    id: 1,
    firstName: "Stephen",
    lastName: "Schwarzman",
    email: "stephen.schwarzman@blackstone.com",
    phone: "+1 (555) 123-4567",
    jobTitle: "Chairman & CEO",
    company: "Blackstone",
    companyId: 1,
    location: "New York, NY",
    tags: ["Investor", "Decision Maker", "VIP"],
    lastInteraction: "2 days ago",
    connectionStrength: "Very strong",
    linkedin: "stephen-schwarzman",
    twitter: "@StephenSchwarzman",
    twitterFollowers: 156000,
    bio: "Chairman, CEO and Co-Founder of Blackstone, one of the world's leading investment firms...",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "Active",
    type: "GP",
    associatedEntities: ["Blackstone Inc.", "Blackstone Real Estate Fund IX"],
    relatedInvestments: ["BX Real Estate Fund IX", "BX Growth Equity Fund II"],
    internalOwner: "John Smith",
    introducedBy: "Direct Relationship",
  },
  {
    id: 2,
    firstName: "Ken",
    lastName: "Griffin",
    email: "ken.griffin@citadel.com",
    phone: "+1 (555) 234-5678",
    jobTitle: "Founder & CEO",
    company: "Citadel",
    companyId: 2,
    location: "Chicago, IL",
    tags: ["Hedge Fund", "Decision Maker"],
    lastInteraction: "1 week ago",
    connectionStrength: "Strong",
    linkedin: "kengriffin",
    twitter: "@kengriffin",
    twitterFollowers: 87000,
    bio: "Founder and CEO of Citadel, a leading global financial institution...",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "Active",
    type: "GP",
    associatedEntities: ["Citadel LLC", "Citadel Securities"],
    relatedInvestments: ["Tech Growth Co-investment", "Healthcare Opportunities"],
    internalOwner: "Emily Johnson",
    introducedBy: "Industry Network",
  },
  {
    id: 3,
    firstName: "Mary",
    lastName: "Erdoes",
    email: "mary.erdoes@jpmorgan.com",
    phone: "+1 (555) 345-6789",
    jobTitle: "CEO Asset & Wealth Management",
    company: "JPMorgan Chase",
    companyId: 3,
    location: "New York, NY",
    tags: ["Banking", "Private Wealth"],
    lastInteraction: "3 days ago",
    connectionStrength: "Very strong",
    linkedin: "mary-erdoes",
    twitter: "@MaryErdoes",
    twitterFollowers: 24000,
    bio: "CEO of J.P. Morgan Asset & Wealth Management, overseeing $4 trillion in assets...",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "Active",
    type: "Banker",
    associatedEntities: ["JP Morgan Private Bank", "JP Morgan Asset Management"],
    relatedInvestments: [],
    internalOwner: "Robert Chen",
    introducedBy: "Direct Relationship",
  },
  {
    id: 4,
    firstName: "Debanjan",
    lastName: "Saha",
    email: "debanjan.saha@datarobot.com",
    phone: "+1 (555) 456-7890",
    jobTitle: "CEO",
    company: "DataRobot",
    companyId: 4,
    location: "Boston, MA",
    tags: ["Portfolio Company", "CEO"],
    lastInteraction: "5 days ago",
    connectionStrength: "Strong",
    linkedin: "debanjansaha",
    bio: "CEO of DataRobot, leading the company's AI platform strategy...",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "Active",
    type: "Portfolio Company Executive",
    associatedEntities: ["DataRobot Inc."],
    relatedInvestments: ["Series F - DataRobot", "Series G - DataRobot"],
    internalOwner: "Sarah Wilson",
    introducedBy: "Tiger Global",
  },
  {
    id: 5,
    firstName: "Henry",
    lastName: "Kravis",
    email: "henry.kravis@kkr.com",
    phone: "+1 (555) 567-8901",
    jobTitle: "Co-Chairman & Co-CEO",
    company: "KKR",
    companyId: 5,
    location: "New York, NY",
    tags: ["Private Equity", "Decision Maker"],
    lastInteraction: "2 weeks ago",
    connectionStrength: "Strong",
    linkedin: "henry-kravis",
    twitter: "@HenryKravis",
    twitterFollowers: 45600,
    bio: "Co-founder and Co-Executive Chairman of KKR, pioneer in private equity...",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "Active",
    type: "GP",
    associatedEntities: ["KKR & Co.", "KKR Americas Fund XII"],
    relatedInvestments: ["Americas Fund XII", "Infrastructure Fund III"],
    internalOwner: "John Smith",
    introducedBy: "Industry Network",
  },
  {
    id: 6,
    firstName: "Craig",
    lastName: "Jacoby",
    email: "craig.jacoby@cooley.com",
    phone: "+1 (555) 678-9012",
    jobTitle: "Partner - Fund Formation",
    company: "Cooley LLP",
    companyId: 6,
    location: "Palo Alto, CA",
    tags: ["Legal", "Fund Formation"],
    lastInteraction: "5 days ago",
    connectionStrength: "Very strong",
    linkedin: "craig-jacoby",
    twitter: "@CooleyLLP",
    twitterFollowers: 2800,
    bio: "Leading fund formation partner at Cooley, specializing in venture capital and private equity...",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "Active",
    type: "Advisor",
    associatedEntities: ["Cooley LLP"],
    relatedInvestments: [],
    internalOwner: "Emily Johnson",
    introducedBy: "Direct Referral",
  },
  {
    id: 7,
    firstName: "Brian",
    lastName: "Chesky",
    email: "brian.chesky@airbnb.com",
    phone: "+1 (555) 789-0123",
    jobTitle: "Co-founder & CEO",
    company: "Airbnb",
    companyId: 7,
    location: "San Francisco, CA",
    tags: ["Portfolio Company", "CEO"],
    lastInteraction: "3 weeks ago",
    connectionStrength: "Medium",
    linkedin: "brianchesky",
    twitter: "@bchesky",
    twitterFollowers: 543000,
    bio: "Co-founder and CEO of Airbnb, transforming the travel and hospitality industry...",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "Active",
    type: "Portfolio Company Executive",
    associatedEntities: ["Airbnb Inc."],
    relatedInvestments: ["Series B - Airbnb", "IPO Allocation"],
    internalOwner: "Robert Chen",
    introducedBy: "Sequoia Capital",
  },
  {
    id: 8,
    firstName: "Carol",
    lastName: "Sawdye",
    email: "carol.sawdye@pwc.com",
    phone: "+1 (555) 890-1234",
    jobTitle: "Vice Chairman & CFO",
    company: "PwC",
    companyId: 8,
    location: "New York, NY",
    tags: ["Accounting", "Tax"],
    lastInteraction: "1 week ago",
    connectionStrength: "Strong",
    linkedin: "carol-sawdye",
    twitter: "@PwC",
    twitterFollowers: 7200,
    bio: "Vice Chairman and CFO of PwC US, overseeing financial operations and strategy...",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "Active",
    type: "Vendor",
    associatedEntities: ["PwC US", "PwC Private Company Services"],
    relatedInvestments: [],
    internalOwner: "Sarah Wilson",
    introducedBy: "Direct Relationship",
  },
  {
    id: 9,
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@familyoffice.com",
    phone: "+1 (555) 111-2222",
    jobTitle: "Chief Investment Officer",
    company: "Family Office",
    companyId: undefined,
    location: "New York, NY",
    tags: ["Internal", "Investment Team"],
    lastInteraction: "Today",
    connectionStrength: "Internal",
    linkedin: "johnsmith-cio",
    bio: "CIO of the family office, responsible for overall investment strategy and portfolio management...",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "Active",
    type: "Internal",
    associatedEntities: ["Family Office Management LLC"],
    relatedInvestments: ["All Active Investments"],
    internalOwner: "Self",
    introducedBy: "Founding Team",
  },
  {
    id: 10,
    firstName: "Emily",
    lastName: "Johnson",
    email: "emily.johnson@familyoffice.com",
    phone: "+1 (555) 222-3333",
    jobTitle: "Managing Director",
    company: "Family Office",
    companyId: undefined,
    location: "New York, NY",
    tags: ["Internal", "Investment Team"],
    lastInteraction: "Today",
    connectionStrength: "Internal",
    linkedin: "emilyjohnson-md",
    bio: "Managing Director focusing on private equity investments and GP relationships...",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "Active",
    type: "Internal",
    associatedEntities: ["Family Office Management LLC"],
    relatedInvestments: ["Blackstone Funds", "KKR Funds", "Citadel Co-investments"],
    internalOwner: "Self",
    introducedBy: "Founding Team",
  },
  {
    id: 11,
    firstName: "Sarah",
    lastName: "Wilson",
    email: "sarah.wilson@familyoffice.com",
    phone: "+1 (555) 333-4444",
    jobTitle: "Director - Portfolio Management",
    company: "Family Office",
    companyId: undefined,
    location: "New York, NY",
    tags: ["Internal", "Portfolio Team"],
    lastInteraction: "Today",
    connectionStrength: "Internal",
    linkedin: "sarahwilson-portfolio",
    bio: "Director of Portfolio Management, overseeing portfolio company monitoring and value creation...",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "Active",
    type: "Internal",
    associatedEntities: ["Family Office Management LLC"],
    relatedInvestments: ["DataRobot", "Airbnb", "Portfolio Companies"],
    internalOwner: "Self",
    introducedBy: "Founding Team",
  },
]

const getConnectionStrengthColor = (strength: string) => {
  switch (strength) {
    case "Very strong":
      return "bg-green-100 text-green-800"
    case "Strong":
      return "bg-blue-100 text-blue-800"
    case "Medium":
      return "bg-yellow-100 text-yellow-800"
    case "Weak":
      return "bg-red-100 text-red-800"
    case "Internal":
      return "bg-purple-100 text-purple-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800"
    case "Prospect":
      return "bg-blue-100 text-blue-800"
    case "VIP":
      return "bg-purple-100 text-purple-800"
    case "Inactive":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  }
  return num.toString()
}

function ContactNameCell({ contact }: { contact: Contact }) {
  const tabs = [
    { id: "details", label: "Details", count: null, icon: FileTextIcon },
    { id: "notes", label: "Notes", count: 1, icon: FileIcon },
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
      return <ContactDetailsPanel contact={contact} isFullScreen={false} />
    }

    if (activeTab === "company") {
      return <ContactTabContent activeTab={activeTab} contact={contact} />
    }

    // For other tabs, return generic content similar to the dashboard
    const data = getContactTabData(activeTab, contact)

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
    return <ContactDetailsPanel contact={contact} isFullScreen={isFullScreen} />
  }

  const customActions: React.ReactNode[] = []

  return (
    <MasterDrawer
      trigger={
        <Button variant="link" className="w-fit px-0 text-left text-foreground h-auto">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback>
                {contact.firstName.charAt(0)}
                {contact.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="font-medium">
              {contact.firstName} {contact.lastName}
            </div>
          </div>
        </Button>
      }
      title={`${contact.firstName} ${contact.lastName}`}
      recordType="People"
      subtitle={`${contact.jobTitle} at ${contact.company}`}
      tabs={tabs}
      detailsPanel={renderDetailsPanel}
      customActions={customActions}
      onComposeEmail={() => console.log("Compose email clicked")}
      activityContent={<PersonActivityContent contact={contact} />}
    >
      {renderTabContent}
    </MasterDrawer>
  )
}

function PersonActivityContent({ contact }: { contact: Contact }) {
  const activities = generatePersonActivities(contact)

  return <UnifiedActivitySection activities={activities} />
}

function ContactDetailsPanel({ contact, isFullScreen = false }: { contact: Contact; isFullScreen?: boolean }) {
  // Mock data for related records
  const relatedData = {
    companies: [
      { id: 1, name: contact.company, type: "Employer" },
      { id: 2, name: "TechFlow Inc.", type: "Portfolio Company" },
    ],
    people: [
      { id: 1, name: "Sarah Johnson", role: "Colleague" },
      { id: 2, name: "Michael Chen", role: "Business Partner" },
    ],
    entities: [
      { id: 1, name: "Family Trust #1231", type: "Family Trust" },
      { id: 2, name: "Offshore Holdings LLC", type: "Holding Company" },
    ],
    investments: [
      { id: 1, name: "Series B Round", amount: "$5M" },
      { id: 2, name: "Real Estate Venture", amount: "$3.2M" },
    ],
    opportunities: [
      { id: 1, name: "Green Energy Fund", status: "In Discussion" },
      { id: 2, name: "Tech Startup Acquisition", status: "Due Diligence" },
    ],
  };

  // Mock navigation handler for related records
  const navigateToRecord = (recordType: string, id: number) => {
    console.log(`Navigate to ${recordType} record with ID: ${id}`);
    // This would be implemented to navigate to the record
  };

  // Mock handler for adding a linked record
  const handleAddRecord = (sectionId: string) => {
    console.log(`Add new ${sectionId} record for ${contact.firstName} ${contact.lastName}`);
    // This would open the appropriate creation dialog
  };

  // Mock handler for removing a linked record
  const handleUnlinkRecord = (sectionId: string, id: number) => {
    console.log(`Unlink ${sectionId} record with ID ${id} from ${contact.firstName} ${contact.lastName}`);
    // This would handle removal of the relationship
  };
  
  // Define all sections for the details panel
  const sections: DetailSection[] = [
    {
      id: "personalInfo",
      title: "Personal Information",
      icon: <UserIcon className="h-4 w-4 text-muted-foreground" />,
      fields: [
        { label: "First Name", value: contact.firstName },
        { label: "Last Name", value: contact.lastName },
        { label: "Email", value: contact.email, isLink: true },
        { label: "Phone", value: contact.phone },
        { label: "Job Title", value: contact.jobTitle },
        { label: "Company", value: contact.company, isLink: true },
        { label: "Location", value: contact.location },
        { label: "Bio", value: contact.bio },
        { label: "Status", value: contact.status },
        { label: "Last Interaction", value: contact.lastInteraction },
        { label: "Connection Strength", value: contact.connectionStrength },
      ],
    },
    {
      id: "companies",
      title: "Companies",
      icon: <BuildingIcon className="h-4 w-4 text-muted-foreground" />,
      sectionData: {
        items: relatedData.companies
      },
    },
    {
      id: "people",
      title: "Related People",
      icon: <UsersIcon className="h-4 w-4 text-muted-foreground" />,
      sectionData: {
        items: relatedData.people
      },
    },
    {
      id: "entities",
      title: "Entities",
      icon: <LayoutIcon className="h-4 w-4 text-muted-foreground" />,
      sectionData: {
        items: relatedData.entities
      },
    },
    {
      id: "investments",
      title: "Investments",
      icon: <DollarSignIcon className="h-4 w-4 text-muted-foreground" />,
      sectionData: {
        items: relatedData.investments
      },
    },
    {
      id: "opportunities",
      title: "Opportunities",
      icon: <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />,
      sectionData: {
        items: relatedData.opportunities
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
      activityContent={<PersonActivityContent contact={contact} />}
    />
  )
}

function getContactTabData(activeTab: string, contact: Contact) {
  switch (activeTab) {
    case "emails":
      return [
        {
          id: 1,
          subject: "Investment Performance Update",
          from: "portfolio@company.com",
          date: "2 hours ago",
          status: "Unread",
          preview: "Quarterly performance report for your investment in " + contact.firstName + " " + contact.lastName,
          type: "received",
        },
        {
          id: 2,
          subject: "Valuation Update Required",
          from: "me@company.com",
          date: "1 day ago",
          status: "Sent",
          preview: "Please provide updated valuation for " + contact.firstName + " " + contact.lastName,
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
          title: "Relationship Overview",
          date: "3 days ago",
          author: "Emily Davis",
          topic: `Strategic relationship assessment for ${contact.firstName} ${contact.lastName}`,
          content: `Contact Profile - ${contact.firstName} ${contact.lastName}

Position: ${contact.jobTitle} at ${contact.company}
Relationship Status: ${contact.connectionStrength} Connection
Primary Contact: ${contact.internalOwner || "Unassigned"}
Last Interaction: ${contact.lastInteraction}

Executive Summary:
${contact.firstName} ${contact.lastName} serves as a key relationship for our family office operations. As ${contact.jobTitle} at ${contact.company}, they provide valuable insights into ${contact.company}'s strategic direction and have been instrumental in facilitating investment opportunities.

Relationship History:
• First Contact: ${contact.introducedBy ? `Introduced by ${contact.introducedBy}` : "Direct outreach"} (2022)
• Total Interactions: 47 touchpoints over 24 months
• Meeting Frequency: Quarterly formal meetings, monthly informal check-ins
• Response Time: Typically responds within 24 hours

Professional Background:
${contact.firstName} brings over 15 years of experience in the ${contact.jobTitle.includes("CEO") ? "executive leadership" : contact.jobTitle.includes("CFO") ? "financial management" : "industry"}. Previous roles include:
- ${contact.jobTitle} at Current Company (2020-Present)
- Senior positions at Fortune 500 companies
- Board positions on 3 technology companies
- MBA from Wharton, BS from MIT

Investment Relevance:
1. Deal Flow Source:
   - Introduced 5 investment opportunities (2 closed)
   - Total deal value introduced: $85M
   - Success rate: 40% (above average)

2. Portfolio Support:
   - Advisor to 2 portfolio companies
   - Facilitated 3 strategic partnerships
   - Customer introductions resulting in $5M+ revenue

3. Market Intelligence:
   - Regular insights on ${contact.company} sector trends
   - Early warning on market shifts
   - Competitive intelligence sharing

Communication Preferences:
• Preferred Channel: ${contact.email.includes("gmail") ? "Personal email" : "Business email"}
• Best Meeting Times: Mornings (8-10 AM EST)
• Topics of Interest: Innovation, sustainability, market dynamics
• Communication Style: Direct, data-driven, appreciates brevity

Key Relationships:
- Spouse: Active in philanthropy (potential co-investment interest)
- Network: Connected to 15+ relevant executives in our focus sectors
- Affiliations: Member of YPO, serves on 2 nonprofit boards

Personal Interests:
• Passionate about climate technology
• Active angel investor ($2-5M annually)
• Golf enthusiast (member at Pine Valley)
• Art collector (contemporary focus)

Recent Developments:
1. Promoted to ${contact.jobTitle} (if applicable)
2. Leading company's expansion into new markets
3. Speaking at upcoming industry conference
4. Exploring personal investment opportunities

Relationship Maintenance:
✓ Quarterly lunch meetings scheduled
✓ Birthday noted (send gift)
✓ Holiday card list inclusion
✓ Conference co-attendance planned
✓ Introduction to other family members scheduled

Next Steps:
1. Schedule Q1 2025 meeting to discuss new fund
2. Invite to annual family office conference
3. Explore co-investment in climate tech deal
4. Facilitate introduction to portfolio CEO
5. Send market research report of interest

Notes:
- Prefers in-person meetings over video calls
- Appreciates follow-up within 48 hours
- Values confidentiality highly
- Interested in educational opportunities for children
- Considering board positions post-retirement

This relationship continues to be highly valuable for deal flow, market intelligence, and portfolio support. Maintain regular engagement and explore deepening the relationship through co-investment opportunities.`,
        },
        {
          id: 2,
          title: "Meeting Preparation Brief",
          date: "1 week ago",
          author: "Michael Chen",
          topic: `Q1 2025 quarterly review preparation with ${contact.firstName}`,
          content: `Meeting Brief - ${contact.firstName} ${contact.lastName}

Date: January 8, 2025
Purpose: Quarterly Relationship Review
Location: The Yale Club, NYC

Meeting Objectives:
1. Review Q4 2024 investment performance
2. Discuss Series D opportunity in portfolio company
3. Explore co-investment in sustainable infrastructure
4. Update on family office initiatives

Background Context:
Last meeting (October 2024) focused on:
- Exit strategy for mature investments
- Tax optimization strategies
- Next generation involvement

Key Updates Since Last Meeting:
• Portfolio Performance: +15.3% YTD
• Successful exit from Tech Investment II (3.5x return)
• Launched sustainable investment initiative
• Added 2 new family members to investment committee

Discussion Points:

1. Investment Updates:
   - Portfolio company ${contact.company} raised Series C at $500M valuation
   - Our position increased in value by 125%
   - Exit opportunities emerging for 2 holdings
   - New fund formation for AI/ML investments

2. Collaboration Opportunities:
   - ${contact.firstName}'s interest in climate tech aligns with new fund
   - Potential advisory role in portfolio company
   - Speaking opportunity at our annual conference
   - Co-investment structure proposals

3. Market Perspectives:
   - Get insights on ${contact.company} sector outlook
   - Discuss regulatory changes impact
   - Review competitive landscape shifts
   - Explore emerging technology trends

4. Personal Updates:
   - Congratulate on recent board appointment
   - Discuss succession planning thoughts
   - Family office services expansion
   - Educational trust opportunities

Materials to Share:
✓ Q4 2024 Performance Report
✓ New Fund Prospectus
✓ Co-investment Term Sheet Template
✓ Annual Conference Invitation

Sensitive Topics to Avoid:
- Recent competitor's legal issues
- Specific returns of other LPs
- Ongoing litigation matters

Follow-up Actions Planned:
1. Send meeting summary within 24 hours
2. Schedule follow-up call for deal specifics
3. Introduce to relevant portfolio CEOs
4. Provide requested market research

Gift/Gesture:
Book: "The Intelligent Investor" 75th Anniversary Edition (noted interest in classic investment literature)

Relationship Value Score: 9/10
Strategic Importance: HIGH
Engagement Level: VERY ACTIVE`,
        },
        {
          id: 3,
          title: "Due Diligence Reference Check",
          date: "2 weeks ago",
          author: "Jessica Martinez",
          topic: `Board appointment reference check for ${contact.firstName} ${contact.lastName}`,
          content: `Reference Check Summary - ${contact.firstName} ${contact.lastName}

Date: January 2, 2025
Context: Due diligence for potential board appointment
Conducted by: External advisory firm

Executive Summary:
${contact.firstName} ${contact.lastName} received uniformly positive feedback across all reference checks. Highly recommended for board positions and strategic advisory roles.

References Contacted:
1. Former CEO - Tech Unicorn
2. Current Board Chair - Public Company
3. Investment Partner - Top Tier VC
4. Long-term Business Associate
5. Nonprofit Board Member

Key Findings:

Professional Competencies:
• Strategic Thinking: "Exceptional ability to see around corners" - Ref #1
• Financial Acumen: "Deep understanding of complex financial structures" - Ref #3
• Leadership: "Natural leader who builds consensus effectively" - Ref #2
• Industry Knowledge: "One of the most connected people in the sector" - Ref #4
• Governance: "Exemplary board member, always prepared" - Ref #2

Character Assessment:
✓ Integrity: "Highest ethical standards, never compromises" - All refs
✓ Reliability: "If ${contact.firstName} commits, it's done" - Ref #1
✓ Judgment: "Sound decision-maker, especially under pressure" - Ref #3
✓ Discretion: "Absolutely trustworthy with sensitive information" - Ref #5

Working Style:
- Collaborative but decisive when needed
- Data-driven approach to decision making
- Excellent communicator across all levels
- Mentors junior team members actively
- Balances detail orientation with big picture

Value-Add Capabilities:
1. Network Access:
   - "Opens doors at the highest levels" - Ref #1
   - Facilitated $50M+ in business development
   - Connected companies to key customers/partners

2. Strategic Guidance:
   - Helped navigate 3 successful exits
   - Advised on major pivots and transformations
   - Strong pattern recognition across industries

3. Crisis Management:
   - "Calm under pressure, great in crisis" - Ref #2
   - Led company through COVID challenges
   - Managed sensitive PR situations effectively

Areas of Expertise:
• M&A transactions and integration
• International expansion strategies
• Digital transformation initiatives
• Governance and compliance
• Talent development and succession

Potential Considerations:
- High demand for time (selective about commitments)
- Prefers quality over quantity in board seats
- Direct communication style (some may find blunt)
- High expectations for management teams

Board Performance History:
Current Boards: 3 (1 public, 2 private)
Past Boards: 7 (4 successful exits)
Committee Experience: Audit, Compensation, Governance
Time Commitment: Exceptional attendance record

Compensation Expectations:
- Market rate for board positions
- Open to equity participation
- Values long-term alignment
- Philanthropic interest (may donate fees)

Cultural Fit Assessment:
✓ Aligns with family office values
✓ Long-term orientation
✓ Relationship-focused approach
✓ Discretion and confidentiality
✓ Multi-generational perspective

Recommendation:
HIGHLY RECOMMENDED for board positions, advisory roles, or deeper partnership opportunities. ${contact.firstName} would add significant value to any governance structure or strategic initiative.

Next Steps:
1. Proceed with board appointment discussions
2. Explore additional collaboration opportunities
3. Consider for other portfolio company boards
4. Maintain regular engagement schedule`,
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
          description: `Quarterly review of ${contact.firstName} ${contact.lastName} performance.`,
        },
      ]
    case "files":
      return [
        {
          id: 1,
          name: "Investment_Agreement.pdf",
          size: "2.4 MB",
          uploadedBy: "Jessica Martinez",
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
          role: "Investment Director",
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

const columns: ColumnDef<Contact>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="h-8 -ml-2 px-2">
        Name
        {column.getIsSorted() === "asc" ? (
          <SortAscIcon className="ml-2 h-3 w-3" />
        ) : column.getIsSorted() === "desc" ? (
          <SortDescIcon className="ml-2 h-3 w-3" />
        ) : null}
      </Button>
    ),
    cell: ({ row }) => <ContactNameCell contact={row.original} />,
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <span className="text-sm">{row.original.type || "-"}</span>,
  },
  {
    accessorKey: "jobTitle",
    header: "Job Title",
    cell: ({ row }) => <span className="text-sm">{row.original.jobTitle}</span>,
  },
  {
    accessorKey: "company",
    header: "Company",
    cell: ({ row }) => <span className="text-sm font-medium">{row.original.company}</span>,
  },
  {
    accessorKey: "associatedEntities",
    header: "Associated Entities",
    cell: ({ row }) => (
      <div className="text-sm">
        {row.original.associatedEntities && row.original.associatedEntities.length > 0
          ? row.original.associatedEntities.slice(0, 2).join(", ")
          : "-"}
        {row.original.associatedEntities && row.original.associatedEntities.length > 2 && (
          <span className="text-muted-foreground"> +{row.original.associatedEntities.length - 2}</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "relatedInvestments",
    header: "Related Investments",
    cell: ({ row }) => (
      <div className="text-sm">
        {row.original.relatedInvestments && row.original.relatedInvestments.length > 0
          ? row.original.relatedInvestments.slice(0, 2).join(", ")
          : "-"}
        {row.original.relatedInvestments && row.original.relatedInvestments.length > 2 && (
          <span className="text-muted-foreground"> +{row.original.relatedInvestments.length - 2}</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <a href={`mailto:${row.original.email}`} className="text-sm text-blue-600 hover:underline">
        {row.original.email}
      </a>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => <span className="text-sm">{row.original.phone}</span>,
  },
  {
    accessorKey: "linkedin",
    header: "LinkedIn",
    cell: ({ row }) => (
      row.original.linkedin ? (
        <a
          href={`https://linkedin.com/in/${row.original.linkedin}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline"
        >
          {row.original.linkedin}
        </a>
      ) : (
        <span className="text-sm">-</span>
      )
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => <span className="text-sm">{row.original.location}</span>,
  },
  {
    accessorKey: "internalOwner",
    header: "Internal Owner",
    cell: ({ row }) => <span className="text-sm">{row.original.internalOwner || "-"}</span>,
  },
  {
    accessorKey: "introducedBy",
    header: "Introduced By",
    cell: ({ row }) => <span className="text-sm">{row.original.introducedBy || "-"}</span>,
  },
  {
    accessorKey: "lastInteraction",
    header: "Last Interaction",
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.lastInteraction}</span>,
  },
  {
    accessorKey: "connectionStrength",
    header: "Connection",
    cell: ({ row }) => <span className="text-sm">{row.original.connectionStrength}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <span className="text-sm">{row.original.status}</span>,
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
          <DropdownMenuItem>Edit person</DropdownMenuItem>
          <DropdownMenuItem>Add to list</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

export function PeopleTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [addPersonOpen, setAddPersonOpen] = React.useState(false)
  const [columnOrder, setColumnOrder] = React.useState<string[]>([])
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor), useSensor(KeyboardSensor))

  const table = useReactTable({
    data: contactsData,
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
      columnOrder,
    },
    onColumnOrderChange: setColumnOrder,
  })

  // Initialize column order from table columns
  React.useEffect(() => {
    const allColumns = table.getAllColumns().map((column) => column.id)
    
    if (columnOrder.length === 0 && allColumns.length > 0) {
      setColumnOrder(allColumns)
    }
  }, [])

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

  return (
    <div className="space-y-4">
      {/* Add Person Dialog */}
      <AddPersonDialog open={addPersonOpen} onOpenChange={setAddPersonOpen} />

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search people..."
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
              <DropdownMenuItem>Active people</DropdownMenuItem>
              <DropdownMenuItem>VIP people</DropdownMenuItem>
              <DropdownMenuItem>By company</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Strong connections</DropdownMenuItem>
              <DropdownMenuItem>Recent interactions</DropdownMenuItem>
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
          <Button size="sm" onClick={() => setAddPersonOpen(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Person
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
        {table.getFilteredRowModel().rows.length} person(s) total.
      </div>
    </div>
  )
}
