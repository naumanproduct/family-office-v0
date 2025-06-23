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
  ExpandIcon,
  ChevronLeftIcon,
  MailIcon,
  DollarSignIcon,
  CalendarIcon,
  UserIcon,
  FileTextIcon,
  AlertCircleIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  UsersIcon,
  FolderIcon,
  BuildingIcon,
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
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { TaskDetailsView } from "@/components/task-details-view"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { MasterDrawer } from "./master-drawer"
import { TabContentRenderer } from "@/components/shared/tab-content-renderer"

interface CapitalCall {
  id: string
  fundName: string
  callNumber: string
  callAmount: string
  commitmentAmount: string
  dueDate: string
  noticeDate: string
  investor: string
  stage: string
  // Additional fields for detailed view
  description?: string
  fundManager?: string
  email?: string
  phone?: string
  website?: string
  fundType?: string
  vintage?: string
  totalFundSize?: string
  remainingCommitment?: string
  previousCalls?: string
  purpose?: string
}

const initialCapitalCalls: CapitalCall[] = [
  {
    id: "1",
    fundName: "TechVentures Fund III",
    callNumber: "Call #4",
    callAmount: "$2.5M",
    commitmentAmount: "$10M",
    dueDate: "2024-02-15",
    noticeDate: "2024-01-15",
    investor: "Pension Fund Alpha",
    stage: "new",
    description: "Capital call for follow-on investments in portfolio companies",
    fundManager: "TechVentures Management",
    email: "capital@techventures.com",
    phone: "+1 (555) 123-4567",
    website: "techventures.com",
    fundType: "Venture Capital",
    vintage: "2022",
    totalFundSize: "$100M",
    remainingCommitment: "$7.5M",
    previousCalls: "3",
    purpose: "Follow-on investments and management fees",
  },
  {
    id: "2",
    fundName: "Growth Equity Partners II",
    callNumber: "Call #2",
    callAmount: "$5M",
    commitmentAmount: "$25M",
    dueDate: "2024-02-20",
    noticeDate: "2024-01-20",
    investor: "Insurance Corp Beta",
    stage: "in-progress",
    description: "Capital call for new investment opportunities",
    fundManager: "Growth Equity Management",
    email: "calls@growthequity.com",
    phone: "+1 (555) 234-5678",
    website: "growthequity.com",
    fundType: "Growth Equity",
    vintage: "2023",
    totalFundSize: "$200M",
    remainingCommitment: "$20M",
    previousCalls: "1",
    purpose: "New investments and operating expenses",
  },
  {
    id: "3",
    fundName: "Real Estate Fund IV",
    callNumber: "Call #6",
    callAmount: "$3.2M",
    commitmentAmount: "$15M",
    dueDate: "2024-02-10",
    noticeDate: "2024-01-10",
    investor: "Endowment Fund Gamma",
    stage: "in-progress",
    description: "Capital call for property acquisition",
    fundManager: "Real Estate Partners",
    email: "capital@realestate.com",
    phone: "+1 (555) 345-6789",
    website: "realestate.com",
    fundType: "Real Estate",
    vintage: "2021",
    totalFundSize: "$150M",
    remainingCommitment: "$11.8M",
    previousCalls: "5",
    purpose: "Property acquisition and development",
  },
  {
    id: "4",
    fundName: "Infrastructure Fund I",
    callNumber: "Call #3",
    callAmount: "$8M",
    commitmentAmount: "$40M",
    dueDate: "2024-02-25",
    noticeDate: "2024-01-25",
    investor: "Sovereign Wealth Fund",
    stage: "in-progress",
    description: "Capital call for infrastructure project funding",
    fundManager: "Infrastructure Capital",
    email: "calls@infrastructure.com",
    phone: "+1 (555) 456-7890",
    website: "infrastructure.com",
    fundType: "Infrastructure",
    vintage: "2023",
    totalFundSize: "$300M",
    remainingCommitment: "$32M",
    previousCalls: "2",
    purpose: "Infrastructure project development",
  },
  {
    id: "5",
    fundName: "Private Credit Fund II",
    callNumber: "Call #5",
    callAmount: "$4.5M",
    commitmentAmount: "$20M",
    dueDate: "2024-01-30",
    noticeDate: "2024-01-01",
    investor: "Family Office Delta",
    stage: "done",
    description: "Capital call for credit facility deployment",
    fundManager: "Private Credit Partners",
    email: "capital@privatecredit.com",
    phone: "+1 (555) 567-8901",
    website: "privatecredit.com",
    fundType: "Private Credit",
    vintage: "2022",
    totalFundSize: "$180M",
    remainingCommitment: "$15.5M",
    previousCalls: "4",
    purpose: "Credit facility deployment and fees",
  },
  {
    id: "6",
    fundName: "Growth Fund III",
    callNumber: "Call #1",
    callAmount: "$6M",
    commitmentAmount: "$30M",
    dueDate: "2024-07-15",
    noticeDate: "2024-06-15",
    investor: "Institutional Investor Epsilon",
    stage: "new",
    description: "Initial capital call for Growth Fund III to finance early investments",
    fundManager: "Growth Equity Management",
    email: "calls@growthfund.com",
    phone: "+1 (555) 678-9012",
    website: "growthfund.com",
    fundType: "Growth Equity",
    vintage: "2024",
    totalFundSize: "$400M",
    remainingCommitment: "$24M",
    previousCalls: "0",
    purpose: "Initial investments and fees",
  },
]

interface CapitalCallKanbanProps {
  workflowConfig?: {
    attributes: Array<{ id: string; name: string; type: string }>
    stages: Array<{ id: string; name: string; color: string }>
  }
  initialCalls?: CapitalCall[]
}

// Default stages if no config provided
const defaultStages = [
  { id: "new", name: "New", color: "bg-gray-100" },
  { id: "in-progress", name: "In Progress", color: "bg-blue-100" },
  { id: "done", name: "Done", color: "bg-green-100" },
]

// Default attributes if no config provided
const defaultAttributes = [
  { id: "fundName", name: "Fund Name", type: "text" },
  { id: "callAmount", name: "Call Amount", type: "currency" },
  { id: "investor", name: "Investor", type: "text" },
  { id: "dueDate", name: "Due Date", type: "date" },
  { id: "noticeDate", name: "Notice Date", type: "date" },
]

// Replace the CapitalCallCard component with this new implementation that opens the task drawer
function CapitalCallCard({
  capitalCall,
  attributes = defaultAttributes,
}: {
  capitalCall: CapitalCall
  attributes?: Array<{ id: string; name: string; type: string }>
}) {
  // Check if call is overdue
  const isOverdue = new Date(capitalCall.dueDate) < new Date() && capitalCall.stage !== "done"

  // Define tabs for the drawer
  const tabs = [
    { id: "details", label: "Details", count: null, icon: FileTextIcon },
    { id: "contacts", label: "Contacts", count: 3, icon: UsersIcon },
    { id: "emails", label: "Emails", count: 2, icon: MailIcon },
    { id: "tasks", label: "Tasks", count: 2, icon: CheckCircleIcon },
    { id: "notes", label: "Notes", count: 2, icon: FileTextIcon },
    { id: "meetings", label: "Meetings", count: 2, icon: CalendarIcon },
    { id: "files", label: "Files", count: 2, icon: FolderIcon },
    { id: "activity", label: "Activity", count: null, icon: CalendarIcon },
  ]

  // Move state hooks outside of detailsPanel
  const [openSections, setOpenSections] = React.useState<{
    details: boolean;
    fund: boolean;
    contacts: boolean;
    financials: boolean;
  }>({
    details: true, // Details expanded by default
    fund: false,
    contacts: false,
    financials: false,
  });

  // Add state for showing all values
  const [showingAllValues, setShowingAllValues] = React.useState(false);

  // Function to get the appropriate icon for each attribute type
  const getAttributeIcon = (type: string) => {
    switch (type) {
      case "currency":
        return DollarSignIcon
      case "date":
        return CalendarIcon
      case "user":
      case "relation":
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
      case "date":
        const isOverdueDate = attribute.id === "dueDate" && new Date(value) < new Date() && capitalCall.stage !== "done"
        return <span className={isOverdueDate ? "text-red-600 font-medium" : ""}>{value}</span>
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

  // Create details panel function
  const detailsPanel = (isFullScreen = false) => {
    // Toggle function for collapsible sections
    const toggleSection = (section: 'details' | 'fund' | 'contacts' | 'financials') => {
      setOpenSections(prev => ({
        ...prev,
        [section]: !prev[section],
      }));
    };

    // Basic fields for collapsed view
    const basicFields = [
      {
        label: "Fund Name",
        value: capitalCall.fundName,
      },
      {
        label: "Call Number",
        value: capitalCall.callNumber,
      },
      {
        label: "Call Amount",
        value: capitalCall.callAmount,
      },
      {
        label: "Due Date",
        value: capitalCall.dueDate,
      },
      {
        label: "Investor",
        value: capitalCall.investor,
      },
    ] as Array<{
      label: string;
      value: React.ReactNode;
      isLink?: boolean;
    }>;

    // Extended fields for "Show all" view
    const extendedFields = [
      {
        label: "Fund Name",
        value: capitalCall.fundName,
      },
      {
        label: "Call Number",
        value: capitalCall.callNumber,
      },
      {
        label: "Call Amount",
        value: capitalCall.callAmount,
      },
      {
        label: "Commitment Amount",
        value: capitalCall.commitmentAmount,
      },
      {
        label: "Due Date",
        value: capitalCall.dueDate,
      },
      {
        label: "Notice Date",
        value: capitalCall.noticeDate,
      },
      {
        label: "Investor",
        value: capitalCall.investor,
      },
      {
        label: "Stage",
        value: capitalCall.stage,
      },
      {
        label: "Fund Manager",
        value: capitalCall.fundManager || "N/A",
      },
      {
        label: "Email",
        value: capitalCall.email || "N/A",
        isLink: true,
      },
      {
        label: "Purpose",
        value: capitalCall.purpose || "N/A",
      },
    ] as Array<{
      label: string;
      value: React.ReactNode;
      isLink?: boolean;
    }>;

    // Mock data for related entities
    const relatedData = {
      contacts: [
        { id: 1, name: "Fund Manager", value: capitalCall.fundManager || "N/A" },
        { id: 2, name: "Investor Relations", value: "Sarah Johnson" },
      ],
      fundInfo: [
        { id: 1, name: "Fund Type", value: capitalCall.fundType || "Private Equity" },
        { id: 2, name: "Vintage", value: capitalCall.vintage || "2022" },
        { id: 3, name: "Website", value: capitalCall.website || "N/A", isLink: true },
      ],
      financials: [
        { id: 1, name: "Total Fund Size", value: capitalCall.totalFundSize || "$100M" },
        { id: 2, name: "Remaining Commitment", value: capitalCall.remainingCommitment || "$25M" },
        { id: 3, name: "Previous Calls", value: capitalCall.previousCalls || "3 calls ($15M)" },
      ],
    };

    // Render the detail fields
    const renderFields = (fields: typeof basicFields, showAllButton: boolean = false) => (
      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={index} className="flex items-center">
            <Label className="text-xs text-muted-foreground w-28 shrink-0 ml-2">{field.label}</Label>
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
    );

    // Items section for related data
    const ItemsSection = ({ 
      items 
    }: { 
      items: any[] 
    }) => {
      return (
        <div className="ml-2 group/section">
          <div className="flex flex-col space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between group">
                <Badge 
                  variant="outline" 
                  className="cursor-pointer hover:bg-muted/50 transition-colors flex items-center gap-1 py-1 w-fit font-normal"
                >
                  {item.name}
                  {item.role && <span className="text-muted-foreground"> - {item.role}</span>}
                  {item.value && <span className="ml-2">{item.value}</span>}
                </Badge>
              </div>
            ))}
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-2 text-xs text-muted-foreground opacity-0 group-hover/section:opacity-100 transition-opacity"
          >
            <PlusIcon className="h-3 w-3 mr-1" />
            Add
          </Button>
        </div>
      );
    };

    // Apple-style section headers and content
    const sections = [
      {
        id: 'details',
        title: 'Capital Call Details',
        icon: FileTextIcon,
        content: renderFields(showingAllValues ? extendedFields : basicFields, !showingAllValues),
        count: null
      },
      {
        id: 'fund',
        title: 'Fund Information',
        icon: BuildingIcon,
        content: <ItemsSection items={relatedData.fundInfo} />,
        count: relatedData.fundInfo.length
      },
      {
        id: 'contacts',
        title: 'Contacts',
        icon: UsersIcon,
        content: <ItemsSection items={relatedData.contacts} />,
        count: relatedData.contacts.length
      },
      {
        id: 'financials',
        title: 'Financial Information',
        icon: DollarSignIcon,
        content: <ItemsSection items={relatedData.financials} />,
        count: relatedData.financials.length
      },
    ];

    // Mock activity data
    const activities = [
      {
        id: 1,
        type: "notice",
        actor: "Fund Admin",
        action: "sent capital call notice for",
        target: capitalCall.fundName,
        timestamp: "2 weeks ago",
      },
      {
        id: 2,
        type: "reminder",
        actor: "System",
        action: "sent payment reminder for",
        target: capitalCall.fundName,
        timestamp: "1 week ago",
      },
      {
        id: 3,
        type: "update",
        actor: "Sarah Johnson",
        action: "processed payment for",
        target: capitalCall.fundName,
        timestamp: isOverdue ? "Pending" : "3 days ago",
      },
    ];

    return (
      <div className="px-6 pt-2 pb-6">
        {/* Unified container with Apple-style cohesive design */}
        <div className="rounded-lg border border-muted overflow-hidden">
          {sections.map((section, index) => {
            const isOpen = openSections[section.id as keyof typeof openSections];
            const Icon = section.icon;
            
            return (
              <React.Fragment key={section.id}>
                {/* Divider between sections (except for the first one) */}
                {index > 0 && (
                  <div className="h-px bg-muted mx-3" />
                )}
                
                {/* Section Header */}
                <button 
                  onClick={() => toggleSection(section.id as 'details' | 'fund' | 'contacts' | 'financials')}
                  className={`w-full flex items-center justify-between p-3 hover:bg-muted/20 transition-colors ${isOpen ? 'bg-muted/20' : ''}`}
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
                    className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                  />
                </button>
                
                {/* Section Content with smooth height transition */}
                {isOpen && (
                  <div className="px-3 pb-3 pt-2 group/section">
                    {section.content}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Activity Section - Only in Drawer View */}
        {!isFullScreen && (
          <div className="mt-8">
            <div className="mb-4">
              <h4 className="text-sm font-medium">Activity</h4>
            </div>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="mt-1">
                    <div className={`h-2 w-2 rounded-full ${
                      activity.type === "notice" ? "bg-blue-500" : 
                      activity.type === "reminder" ? "bg-yellow-500" : "bg-green-500"
                    }`}></div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm">
                        <span className="font-medium">{activity.actor}</span>{" "}
                        <span className="text-muted-foreground">{activity.action}</span>{" "}
                        <Badge variant="outline" className="text-xs mx-1">
                          {activity.target}
                        </Badge>
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Create children function for tabs
  const renderTabContent = (
    activeTab: string,
    viewMode: "card" | "list" | "table",
    setSelectedTask?: (task: any) => void,
    setSelectedNote?: (note: any) => void,
    setSelectedMeeting?: (meeting: any) => void,
    setSelectedEmail?: (email: any) => void,
  ) => {
    if (capitalCall.fundName === "Growth Fund III") {
      // ---------------- Mock data for Growth Fund III ----------------
      const tasks = [
        {
          id: 1,
          title: "Prepare investor notice",
          priority: "High",
          status: "pending",
          assignee: "You",
          dueDate: "2024-06-20",
          description: "Draft and review the capital call notice for Growth Fund III.",
          relatedTo: { type: "Capital Call", name: "Growth Fund III" },
        },
        {
          id: 2,
          title: "Update capital schedule",
          priority: "Medium",
          status: "pending",
          assignee: "Finance Team",
          dueDate: "2024-06-22",
          description: "Reflect the new call in the fund's capital schedule.",
          relatedTo: { type: "Capital Call", name: "Growth Fund III" },
        },
      ]

      const notes = [
        { id: 1, title: "Initial call rationale", author: "You", date: "2024-06-15", tags: ["call", "growth"] },
        { id: 2, title: "Fee breakdown", author: "Controller", date: "2024-06-16", tags: ["fees"] },
      ]

      const emails = [
        { id: 1, subject: "Capital call draft", from: "admin@growthfund.com", date: "2024-06-17", status: "Read" },
        { id: 2, subject: "Questions on commitment", from: "investor@epsilon.com", date: "2024-06-18", status: "Unread" },
      ]

      const meetings = [
        { id: 1, title: "Internal review meeting", date: "2024-06-19", time: "9:00 AM", status: "Scheduled", attendees: ["You", "Finance Team"] },
        { id: 2, title: "Investor Q&A", date: "2024-06-23", time: "11:00 AM", status: "Planned", attendees: ["Investor Relations"] },
      ]

      const files = [
        { id: 1, name: "GrowthFundIII_CallNotice.pdf", uploadedBy: "You", uploadedDate: "2024-06-17", size: "1.2 MB" },
        { id: 2, name: "CapitalSchedule.xlsx", uploadedBy: "Finance Team", uploadedDate: "2024-06-18", size: "550 KB" },
      ]

      const contacts = [
        { id: 1, name: "Laura Kim", role: "Investor Relations", email: "laura@growthfund.com", phone: "+1 (555) 321-6547" },
        { id: 2, name: "Michael Chen", role: "Fund Manager", email: "mchen@growthfund.com", phone: "+1 (555) 987-1234" },
        { id: 3, name: "James Wilson", role: "Investor", email: "jwilson@epsilon.com", phone: "+1 (555) 555-0011" },
      ]

      const dataMap: Record<string, any[]> = {
        tasks,
        notes,
        emails,
        meetings,
        files,
        contacts,
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

    // Default placeholder for other calls
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No {activeTab} found for this capital call</p>
        <p className="text-sm">Add some {activeTab} to get started</p>
      </div>
    )
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
                <h4 className="font-semibold text-sm text-gray-900 truncate cursor-pointer group-hover:underline">{capitalCall.fundName}</h4>
                <p className="text-xs text-gray-500 mt-1">{capitalCall.callNumber}</p>
                {isOverdue && (
                  <Badge variant="destructive" className="mt-2 text-xs">
                    <AlertCircleIcon className="h-3 w-3 mr-1" />
                    Overdue
                  </Badge>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-600">
                    <MoreVerticalIcon className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">Cancel Call</DropdownMenuItem>
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
                const Icon = getAttributeIcon(attribute.type)
                const value = (capitalCall as any)[attribute.id]

                if (!value) return null

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
      title={capitalCall.fundName}
      recordType="Capital Calls"
      subtitle={`${capitalCall.callNumber} • ${capitalCall.callAmount}`}
      tabs={tabs}
      detailsPanel={detailsPanel}
    >
      {renderTabContent}
    </MasterDrawer>
  )
}

function SortableCapitalCallCard({
  capitalCall,
  attributes,
}: {
  capitalCall: CapitalCall
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
    id: capitalCall.id,
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
      <CapitalCallCard capitalCall={capitalCall} attributes={attributes} />
    </div>
  )
}

function DroppableColumn({
  stage,
  capitalCalls,
  attributes,
}: {
  stage: { id: string; name: string; color: string }
  capitalCalls: CapitalCall[]
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
            <Badge variant="secondary" className="h-5 w-5 rounded-full p-0 text-xs bg-white/80 text-gray-700">
              {capitalCalls.length}
            </Badge>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-500 hover:text-gray-700">
            <PlusIcon className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="flex-1 bg-gray-50/50 rounded-b-xl border-l border-r border-b border-gray-200 p-3 space-y-3">
        <SortableContext items={capitalCalls.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {capitalCalls.map((capitalCall) => (
            <SortableCapitalCallCard key={capitalCall.id} capitalCall={capitalCall} attributes={attributes} />
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
        <PlusIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

// Add column dialog
function AddColumnDialog({
  open,
  onOpenChange,
  onAddColumn,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddColumn: (name: string, color: string) => void
}) {
  const [columnName, setColumnName] = React.useState("")
  const [columnColor, setColumnColor] = React.useState("bg-gray-100")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (columnName.trim()) {
      onAddColumn(columnName.trim(), columnColor)
      setColumnName("")
      onOpenChange(false)
    }
  }

  const colorOptions = [
    { id: "bg-gray-100", label: "Gray" },
    { id: "bg-blue-100", label: "Blue" },
    { id: "bg-green-100", label: "Green" },
    { id: "bg-yellow-100", label: "Yellow" },
    { id: "bg-purple-100", label: "Purple" },
    { id: "bg-red-100", label: "Red" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Column</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="column-name">Column Name</Label>
            <Input
              id="column-name"
              placeholder="Enter column name"
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label>Column Color</Label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <div
                  key={color.id}
                  className={`w-8 h-8 rounded-full cursor-pointer border-2 ${color.id} ${
                    columnColor === color.id ? "border-primary" : "border-transparent"
                  }`}
                  onClick={() => setColumnColor(color.id)}
                  title={color.label}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit">Add Column</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Main component export
export function CapitalCallKanban({ workflowConfig, initialCalls }: CapitalCallKanbanProps) {
  const [capitalCalls, setCapitalCalls] = React.useState(initialCalls || initialCapitalCalls)
  const [activeId, setActiveId] = React.useState<string | null>(null)
  const [addColumnDialogOpen, setAddColumnDialogOpen] = React.useState(false)
  
  // Use config or defaults
  const stages = workflowConfig?.stages || defaultStages
  const attributes = workflowConfig?.attributes || defaultAttributes
  
  // Get capital calls grouped by stage
  const capitalCallsByStage = stages.map((stage) => ({
    stage,
    capitalCalls: capitalCalls.filter((call) => call.stage === stage.id),
  }))
  
  // Get the active capital call for drag overlay
  const activeCapitalCall = activeId ? capitalCalls.find((call) => call.id === activeId) : null
  
  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  )
  
  // Handle drag start
  const handleDragStart = (event: DragEndEvent) => {
    const { active } = event
    setActiveId(active.id as string)
  }
  
  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (over && active.id !== over.id) {
      // Find the stage that was dropped on
      const targetStage = stages.find((stage) => stage.id === over.id)
      
      if (targetStage) {
        // Update the capital call's stage
        setCapitalCalls((prev) =>
          prev.map((call) => (call.id === active.id ? { ...call, stage: targetStage.id } : call))
        )
      }
    }
    
    setActiveId(null)
  }
  
  // Handle adding a new column
  const handleAddColumn = (name: string, color: string) => {
    const newStageId = name.toLowerCase().replace(/\s+/g, '-')
    const newStage = {
      id: newStageId,
      name,
      color,
    }
    
    if (workflowConfig && workflowConfig.stages) {
      workflowConfig.stages.push(newStage)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {capitalCallsByStage.map(({ stage, capitalCalls }) => (
          <DroppableColumn key={stage.id} stage={stage} capitalCalls={capitalCalls} attributes={attributes} />
        ))}
        <AddColumnButton onAddColumn={() => setAddColumnDialogOpen(true)} />
      </div>
      <DragOverlay>
        {activeCapitalCall ? (
          <div className="w-80 opacity-80 shadow-lg">
            <CapitalCallCard capitalCall={activeCapitalCall} attributes={attributes} />
          </div>
        ) : null}
      </DragOverlay>
      <AddColumnDialog 
        open={addColumnDialogOpen} 
        onOpenChange={setAddColumnDialogOpen} 
        onAddColumn={handleAddColumn} 
      />
    </DndContext>
  )
}
