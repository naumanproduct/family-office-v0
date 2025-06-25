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
})

type Contact = z.infer<typeof contactSchema>

const contactsData: Contact[] = [
  {
    id: 1,
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@craftventures.com",
    phone: "+1 (555) 123-4567",
    jobTitle: "CEO",
    company: "Craft Ventures",
    companyId: 1,
    location: "San Francisco, CA",
    tags: ["Investor", "Decision Maker", "VIP"],
    lastInteraction: "2 days ago",
    connectionStrength: "Very strong",
    linkedin: "sarahjohnson",
    twitter: "@sarahjohnson",
    twitterFollowers: 15600,
    bio: "Sarah is the CEO of Craft Ventures with over 15 years of experience in venture capital...",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "Active",
  },
  {
    id: 2,
    firstName: "Michael",
    lastName: "Chen",
    email: "michael.chen@falconx.io",
    phone: "+1 (555) 234-5678",
    jobTitle: "CTO",
    company: "FalconX",
    companyId: 2,
    location: "San Mateo, CA",
    tags: ["Technical", "Engineering"],
    lastInteraction: "1 week ago",
    connectionStrength: "Strong",
    linkedin: "michaelchen",
    twitter: "@mchen",
    twitterFollowers: 8700,
    bio: "Michael leads the technical team at FalconX, focusing on blockchain infrastructure...",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "Active",
  },
  {
    id: 3,
    firstName: "Lisa",
    lastName: "Wang",
    email: "lisa.wang@google.com",
    phone: "+1 (555) 345-6789",
    jobTitle: "VP of Product",
    company: "Google",
    companyId: 3,
    location: "Mountain View, CA",
    tags: ["Product", "Decision Maker"],
    lastInteraction: "3 days ago",
    connectionStrength: "Very strong",
    linkedin: "lisawang",
    twitter: "@lwang",
    twitterFollowers: 12400,
    bio: "Lisa oversees product strategy and development at Google's cloud division...",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "Active",
  },
  {
    id: 4,
    firstName: "David",
    lastName: "Kim",
    email: "david.kim@amplitude.com",
    phone: "+1 (555) 456-7890",
    jobTitle: "Head of Sales",
    company: "Amplitude",
    companyId: 4,
    location: "San Francisco, CA",
    tags: ["Sales", "Business Development"],
    lastInteraction: "1 month ago",
    connectionStrength: "Medium",
    linkedin: "davidkim",
    bio: "David leads the enterprise sales team at Amplitude, focusing on Fortune 500 clients...",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "Prospect",
  },
  {
    id: 5,
    firstName: "Emma",
    lastName: "Garcia",
    email: "emma.garcia@stripe.com",
    phone: "+1 (555) 567-8901",
    jobTitle: "CFO",
    company: "Stripe",
    companyId: 5,
    location: "San Francisco, CA",
    tags: ["Finance", "Decision Maker"],
    lastInteraction: "2 weeks ago",
    connectionStrength: "Strong",
    linkedin: "emmagarcia",
    twitter: "@egarcia",
    twitterFollowers: 5600,
    bio: "Emma oversees all financial operations at Stripe, with a background in investment banking...",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "Active",
  },
  {
    id: 6,
    firstName: "James",
    lastName: "Wilson",
    email: "james.wilson@notion.so",
    phone: "+1 (555) 678-9012",
    jobTitle: "Head of Marketing",
    company: "Notion",
    companyId: 6,
    location: "San Francisco, CA",
    tags: ["Marketing", "Content"],
    lastInteraction: "5 days ago",
    connectionStrength: "Very strong",
    linkedin: "jameswilson",
    twitter: "@jwilson",
    twitterFollowers: 9800,
    bio: "James leads Notion's global marketing strategy, focusing on community-driven growth...",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "Active",
  },
  {
    id: 7,
    firstName: "Sophia",
    lastName: "Martinez",
    email: "sophia.martinez@figma.com",
    phone: "+1 (555) 789-0123",
    jobTitle: "Design Director",
    company: "Figma",
    companyId: 7,
    location: "San Francisco, CA",
    tags: ["Design", "Creative"],
    lastInteraction: "3 weeks ago",
    connectionStrength: "Medium",
    linkedin: "sophiamartinez",
    twitter: "@smartinez",
    twitterFollowers: 14300,
    bio: "Sophia oversees the design team at Figma, with expertise in product and interface design...",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "Inactive",
  },
  {
    id: 8,
    firstName: "Alex",
    lastName: "Thompson",
    email: "alex.thompson@airtable.com",
    phone: "+1 (555) 890-1234",
    jobTitle: "Product Manager",
    company: "Airtable",
    companyId: 8,
    location: "San Francisco, CA",
    tags: ["Product", "Technical"],
    lastInteraction: "1 week ago",
    connectionStrength: "Strong",
    linkedin: "alexthompson",
    twitter: "@athompson",
    twitterFollowers: 7200,
    bio: "Alex leads product development for Airtable's enterprise solutions...",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "Active",
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
              <AvatarImage
                src={contact.avatar || "/placeholder.svg"}
                alt={`${contact.firstName} ${contact.lastName}`}
              />
              <AvatarFallback>
                {contact.firstName.charAt(0)}
                {contact.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">
              {contact.firstName} {contact.lastName}
            </span>
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
          title: "Investment thesis review",
          date: "3 days ago",
          author: "Emily Davis",
          content: `Strong performance in ${contact.company} sector. Key growth drivers remain intact.`,
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
          description: `Quarterly review of ${contact.firstName} ${contact.lastName} performance.`,
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

const columns: ColumnDef<Contact>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="h-8 px-2">
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
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => <span className="text-sm">{row.original.location}</span>,
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1 max-w-[200px]">
        {row.original.tags.slice(0, 2).map((tag) => (
          <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
            {tag}
          </Badge>
        ))}
        {row.original.tags.length > 2 && (
          <Badge variant="outline" className="text-xs px-1 py-0">
            +{row.original.tags.length - 2}
          </Badge>
        )}
      </div>
    ),
  },
  {
    accessorKey: "lastInteraction",
    header: "Last Interaction",
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.lastInteraction}</span>,
  },
  {
    accessorKey: "connectionStrength",
    header: "Connection",
    cell: ({ row }) => (
      <Badge className={`text-xs ${getConnectionStrengthColor(row.original.connectionStrength)}`}>
        {row.original.connectionStrength}
      </Badge>
    ),
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
