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
  CalendarIcon,
  UserIcon,
  MapPinIcon,
  FileTextIcon,
  FileIcon,
  UsersIcon,
  CheckCircleIcon,
  MailIcon,
  BuildingIcon,
  ChevronDownIcon,
  BriefcaseIcon,
  ClockIcon,
  AlertCircleIcon,
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
import { MasterDrawer } from "./master-drawer"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { TabContentRenderer } from "@/components/shared/tab-content-renderer"
import { UnifiedDetailsPanel } from "@/components/shared/unified-details-panel"
import { buildStandardDetailSections } from "@/components/shared/detail-section-builder"
import { UnifiedActivitySection } from "@/components/shared/unified-activity-section"
import { generateWorkflowActivities } from "@/components/shared/activity-generators"

interface Meeting {
  id: string
  contactName: string
  company: string
  meetingDate: string
  meetingType: string
  owner: string
  priority: string
  stage: string
  // Additional fields for detailed view
  description?: string
  location?: string
  agenda?: string
  attendees?: string[]
  materials?: string[]
  notes?: string
  followUpActions?: string[]
  contactEmail?: string
  contactPhone?: string
  contactRole?: string
  lastMeeting?: string
  relationshipStrength?: string
}

const initialMeetings: Meeting[] = [
  {
    id: "1",
    contactName: "James Wilson",
    company: "Blackstone Group",
    meetingDate: "2024-01-25",
    meetingType: "Investment Review",
    owner: "Sarah Johnson",
    priority: "High",
    stage: "scheduled",
    description: "Quarterly portfolio review and discussion of new co-investment opportunities",
    location: "Blackstone NYC Office",
    agenda: "Q4 portfolio performance, 2024 investment thesis, co-investment pipeline",
    attendees: ["Sarah Johnson", "Michael Chen", "James Wilson", "Patricia Lee"],
    materials: ["Portfolio Performance Report", "2024 Investment Thesis", "Co-investment Pipeline"],
    contactEmail: "james.wilson@blackstone.com",
    contactPhone: "+1 (212) 555-1234",
    contactRole: "Managing Director",
    lastMeeting: "2023-10-15",
    relationshipStrength: "Very Strong",
  },
  {
    id: "2",
    contactName: "Emily Zhang",
    company: "Sequoia Capital",
    meetingDate: "2024-01-28",
    meetingType: "Partnership Discussion",
    owner: "Michael Chen",
    priority: "High",
    stage: "research",
    description: "Explore potential partnership opportunities in Asia-Pacific markets",
    location: "Virtual Meeting",
    agenda: "APAC market overview, partnership structure, deal flow sharing",
    attendees: ["Michael Chen", "Emily Zhang", "David Park"],
    materials: ["APAC Market Analysis", "Partnership Framework"],
    contactEmail: "emily.zhang@sequoiacap.com",
    contactPhone: "+1 (650) 555-5678",
    contactRole: "Partner",
    lastMeeting: "2023-11-20",
    relationshipStrength: "Strong",
  },
  {
    id: "3",
    contactName: "Robert Kim",
    company: "Goldman Sachs",
    meetingDate: "2024-01-30",
    meetingType: "Deal Sourcing",
    owner: "Jessica Liu",
    priority: "Medium",
    stage: "agenda-prep",
    description: "Review potential acquisition targets in the technology sector",
    location: "Goldman Sachs SF Office",
    agenda: "Tech sector overview, target company profiles, valuation discussion",
    attendees: ["Jessica Liu", "Robert Kim", "Tech Team"],
    materials: ["Tech Sector Report", "Target Company Profiles"],
    contactEmail: "robert.kim@gs.com",
    contactPhone: "+1 (415) 555-9012",
    contactRole: "Vice President",
    lastMeeting: "2023-12-05",
    relationshipStrength: "Strong",
  },
  {
    id: "4",
    contactName: "Lisa Wang",
    company: "Morgan Stanley",
    meetingDate: "2024-02-02",
    meetingType: "Annual Review",
    owner: "David Park",
    priority: "High",
    stage: "materials-ready",
    description: "Annual relationship review and strategic planning session",
    location: "Family Office HQ",
    agenda: "2023 review, 2024 strategic priorities, new investment vehicles",
    attendees: ["David Park", "Lisa Wang", "Investment Committee"],
    materials: ["Annual Review Deck", "Strategic Plan 2024", "Investment Vehicle Overview"],
    contactEmail: "lisa.wang@morganstanley.com",
    contactPhone: "+1 (212) 555-3456",
    contactRole: "Managing Director",
    lastMeeting: "2023-02-01",
    relationshipStrength: "Very Strong",
  },
]

interface MeetingPreparationKanbanProps {
  workflowConfig?: {
    attributes: Array<{ id: string; name: string; type: string }>
    stages: Array<{ id: string; name: string; color: string }>
  }
  initialMeetings?: Meeting[]
}

// Default stages if no config provided
const defaultStages = [
  { id: "scheduled", name: "Scheduled", color: "bg-gray-100" },
  { id: "research", name: "Research", color: "bg-blue-100" },
  { id: "agenda-prep", name: "Agenda Prep", color: "bg-yellow-100" },
  { id: "materials-ready", name: "Materials Ready", color: "bg-purple-100" },
  { id: "briefing-complete", name: "Briefing Complete", color: "bg-orange-100" },
  { id: "meeting-held", name: "Meeting Held", color: "bg-green-100" },
  { id: "follow-up", name: "Follow-up", color: "bg-pink-100" },
]

// Default attributes if no config provided
const defaultAttributes = [
  { id: "contactName", name: "Contact Name", type: "text" },
  { id: "company", name: "Company", type: "text" },
  { id: "meetingDate", name: "Meeting Date", type: "date" },
  { id: "meetingType", name: "Meeting Type", type: "text" },
  { id: "owner", name: "Owner", type: "user" },
  { id: "priority", name: "Priority", type: "text" },
]

// Separate the card UI from the sortable wrapper
function MeetingCard({
  meeting,
  attributes = defaultAttributes,
}: {
  meeting: Meeting
  attributes?: Array<{ id: string; name: string; type: string }>
}) {
  // Determine meeting status based on stage
  const meetingStatus =
    meeting.stage === "scheduled"
      ? "Scheduled"
      : meeting.stage === "research"
      ? "Research Phase"
      : meeting.stage === "agenda-prep"
      ? "Preparing Agenda"
      : meeting.stage === "materials-ready"
      ? "Materials Ready"
      : meeting.stage === "briefing-complete"
      ? "Briefing Complete"
      : meeting.stage === "meeting-held"
      ? "Meeting Held"
      : "Follow-up"

  // Create meeting title
  const meetingTitle = `${meeting.meetingType} - ${meeting.contactName}`

  // Create meeting subtitle
  const meetingSubtitle = `${meeting.company} • ${meetingStatus}`

  // Define tabs for the drawer
  const tabs = [
    { id: "details", label: "Details", count: null, icon: FileTextIcon },
    { id: "notes", label: "Notes", count: 3, icon: FileIcon },
    { id: "files", label: "Files", count: 4, icon: FileTextIcon },
    { id: "tasks", label: "Tasks", count: 5, icon: CheckCircleIcon },
    { id: "emails", label: "Emails", count: 8, icon: MailIcon },
    { id: "meetings", label: "Past Meetings", count: 2, icon: CalendarIcon },
    { id: "contacts", label: "Attendees", count: meeting.attendees?.length || 0, icon: UsersIcon },
  ]

  // Create details panel function using shared builder
  const detailsPanel = (isFullScreen = false) => {
    const infoFields = [
      { label: "Contact Name", value: meeting.contactName },
      { label: "Company", value: meeting.company },
      { label: "Meeting Date", value: meeting.meetingDate },
      { label: "Meeting Type", value: meeting.meetingType },
      { label: "Owner", value: meeting.owner },
      { label: "Priority", value: meeting.priority },
      { label: "Status", value: meetingStatus },
      { label: "Location", value: meeting.location || "TBD" },
      { label: "Relationship Strength", value: meeting.relationshipStrength || "N/A" },
    ]

    // Provide mock related records only for the showcase meeting
    const companies =
      meeting.contactName === "James Wilson"
        ? [{ id: 1, name: meeting.company, type: "Partner Firm" }]
        : []

    const people =
      meeting.contactName === "James Wilson"
        ? meeting.attendees?.map((name, index) => ({
            id: index + 1,
            name,
            role: index === 0 ? "Meeting Owner" : "Attendee",
          })) || []
        : []

    const investments =
      meeting.contactName === "James Wilson"
        ? [
            {
              id: 1,
              name: "Blackstone Real Estate Fund IX",
              amount: "$50M",
              status: "Active",
            },
            {
              id: 2,
              name: "Blackstone Growth Fund",
              amount: "$25M",
              status: "Active",
            },
          ]
        : []

    const sections = buildStandardDetailSections({
      infoTitle: "Meeting Information",
      infoIcon: <CalendarIcon className="h-4 w-4 text-muted-foreground" />,
      infoFields,
      companies,
      people,
      investments,
      entities: [],
      opportunities: [],
    })

    return (
      <UnifiedDetailsPanel
        sections={sections}
        isFullScreen={isFullScreen}
        activityContent={<UnifiedActivitySection activities={generateWorkflowActivities()} />}
      />
    )
  }

  // Create children function for tabs
  const renderTabContent = (
    activeTab: string,
    viewMode: "card" | "list" | "table",
    setSelectedTask?: (task: any) => void,
    setSelectedNote?: (note: any) => void,
    setSelectedMeeting?: (meeting: any) => void,
    setSelectedEmail?: (email: any) => void,
  ) => {
    // Provide rich mock content only for James Wilson meeting to showcase workflow container concept
    if (meeting.contactName === "James Wilson") {
      // ------------------------------
      // Mock data definitions
      // ------------------------------
      const tasks = [
        {
          id: 1,
          title: "Review Q4 portfolio performance",
          priority: "High",
          status: "pending",
          assignee: "You",
          dueDate: "2024-01-24",
          description: "Analyze Q4 performance metrics for Blackstone funds",
          relatedTo: { type: "Meeting", name: meeting.contactName },
        },
        {
          id: 2,
          title: "Prepare co-investment pipeline deck",
          priority: "High",
          status: "in-progress",
          assignee: "Michael Chen",
          dueDate: "2024-01-24",
          description: "Update pipeline with latest opportunities",
          relatedTo: { type: "Meeting", name: meeting.contactName },
        },
        {
          id: 3,
          title: "Send agenda to attendees",
          priority: "Medium",
          status: "completed",
          assignee: "Sarah Johnson",
          dueDate: "2024-01-23",
          description: "Distribute meeting agenda and pre-read materials",
          relatedTo: { type: "Meeting", name: meeting.contactName },
        },
        {
          id: 4,
          title: "Book conference room",
          priority: "Low",
          status: "completed",
          assignee: "Assistant",
          dueDate: "2024-01-20",
          description: "Reserve main conference room for 2 hours",
          relatedTo: { type: "Meeting", name: meeting.contactName },
        },
        {
          id: 5,
          title: "Compile investment thesis updates",
          priority: "High",
          status: "pending",
          assignee: "Jessica Liu",
          dueDate: "2024-01-24",
          description: "Update 2024 investment thesis based on market changes",
          relatedTo: { type: "Meeting", name: meeting.contactName },
        },
      ]

      const notes = [
        {
          id: 1,
          title: "Key discussion points - Q4 review",
          author: "Sarah Johnson",
          date: "2024-01-22",
          tags: ["meeting-prep", "portfolio"],
        },
        {
          id: 2,
          title: "Blackstone relationship history",
          author: "Michael Chen",
          date: "2024-01-20",
          tags: ["relationship", "background"],
        },
        {
          id: 3,
          title: "Co-investment opportunities analysis",
          author: "You",
          date: "2024-01-21",
          tags: ["opportunities", "analysis"],
        },
      ]

      const emails = [
        {
          id: 1,
          subject: "RE: Q4 Portfolio Review Meeting",
          from: "james.wilson@blackstone.com",
          date: "2024-01-22",
          status: "Read",
        },
        {
          id: 2,
          subject: "Meeting agenda and materials",
          from: "sarah.johnson@familyoffice.com",
          date: "2024-01-23",
          status: "Sent",
        },
        {
          id: 3,
          subject: "Updated co-investment pipeline",
          from: "michael.chen@familyoffice.com",
          date: "2024-01-23",
          status: "Read",
        },
        {
          id: 4,
          subject: "Q4 performance highlights",
          from: "patricia.lee@blackstone.com",
          date: "2024-01-21",
          status: "Read",
        },
        {
          id: 5,
          subject: "Conference room confirmation",
          from: "facilities@blackstone.com",
          date: "2024-01-20",
          status: "Read",
        },
      ]

      const pastMeetings = [
        {
          id: 1,
          title: "Q3 Portfolio Review",
          date: "2023-10-15",
          time: "2:00 PM",
          status: "Completed",
          attendees: ["Sarah Johnson", "James Wilson", "Patricia Lee"],
        },
        {
          id: 2,
          title: "Mid-year Strategy Session",
          date: "2023-07-10",
          time: "10:00 AM",
          status: "Completed",
          attendees: ["Full Investment Committee", "Blackstone Team"],
        },
      ]

      const files = [
        {
          id: 1,
          name: "Q4_Portfolio_Performance.pdf",
          uploadedBy: "Sarah Johnson",
          uploadedDate: "2024-01-22",
          size: "3.2 MB",
        },
        {
          id: 2,
          name: "2024_Investment_Thesis.pptx",
          uploadedBy: "Jessica Liu",
          uploadedDate: "2024-01-23",
          size: "5.8 MB",
        },
        {
          id: 3,
          name: "Co-investment_Pipeline.xlsx",
          uploadedBy: "Michael Chen",
          uploadedDate: "2024-01-23",
          size: "450 KB",
        },
        {
          id: 4,
          name: "Meeting_Agenda.docx",
          uploadedBy: "Sarah Johnson",
          uploadedDate: "2024-01-23",
          size: "125 KB",
        },
      ]

      const attendees = meeting.attendees?.map((name, index) => ({
        id: index + 1,
        name,
        role: index === 0 ? "Meeting Owner" : index < 3 ? "Internal" : "External",
        email: `${name.toLowerCase().replace(" ", ".")}@${index < 3 ? "familyoffice" : "blackstone"}.com`,
        phone: "+1 (555) 555-" + (1000 + index),
      })) || []

      const dataMap: Record<string, any[]> = {
        tasks,
        notes,
        emails,
        meetings: pastMeetings,
        files,
        contacts: attendees,
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

    // Default placeholder for other meetings
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No {activeTab} found for this meeting</p>
        <p className="text-sm">Add some {activeTab} to get started</p>
      </div>
    )
  }

  // Function to get the appropriate icon for each attribute type
  const getAttributeIcon = (type: string, id: string) => {
    if (id === "meetingDate") return CalendarIcon
    if (id === "priority") return AlertCircleIcon
    if (id === "meetingType") return BriefcaseIcon
    
    switch (type) {
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

    // Special handling for priority
    if (attribute.id === "priority") {
      return (
        <Badge variant="outline" className="text-xs capitalize">
          {value}
        </Badge>
      )
    }

    switch (attribute.type) {
      case "date":
        return (
          <span
            className="outline-none hover:bg-primary/10 rounded-sm px-0.5 cursor-text transition-colors text-sm"
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

  return (
    <MasterDrawer
      trigger={
        <Card className="cursor-pointer hover:shadow-md transition-all duration-200 border-gray-200 hover:border-gray-300 group"
          onClick={(e) => e.stopPropagation()}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-gray-900 truncate cursor-pointer group-hover:underline">
                  {meeting.contactName}
                </h4>
                <p className="text-xs text-gray-500 mt-1">{meeting.company}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-600">
                    <MoreVerticalIcon className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent
            className="pt-0 space-y-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-2">
              {attributes
                .slice(0, 3) // Show only first 3 attributes
                .map((attribute) => {
                  const Icon = getAttributeIcon(attribute.type, attribute.id)
                  const value = (meeting as any)[attribute.id]

                  if (!value || attribute.id === "contactName" || attribute.id === "company") return null

                  return (
                    <div key={attribute.id} className="flex items-center gap-2 text-xs">
                      <Icon className="h-3 w-3 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-500 truncate">{attribute.name}:</span>
                      <span className="truncate">{renderAttributeValue(attribute, value)}</span>
                    </div>
                  )
                })}
              {attributes.filter(attr => {
                const value = (meeting as any)[attr.id]
                return value && attr.id !== "contactName" && attr.id !== "company"
              }).length > 3 && (
                <div className="text-xs text-gray-400 pl-5">
                  +{attributes.filter(attr => {
                    const value = (meeting as any)[attr.id]
                    return value && attr.id !== "contactName" && attr.id !== "company"
                  }).length - 3} more
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      }
      title={meetingTitle}
      recordType="Workflow"
      subtitle={meetingSubtitle}
      tabs={tabs}
      children={renderTabContent}
      detailsPanel={detailsPanel}
      onComposeEmail={() => {}}
      activityContent={<UnifiedActivitySection activities={generateWorkflowActivities()} />}
    />
  )
}

// Sortable wrapper component
function SortableMeetingCard({
  meeting,
  attributes,
}: {
  meeting: Meeting
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
    id: meeting.id,
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
      <MeetingCard meeting={meeting} attributes={attributes} />
    </div>
  )
}

// Droppable column component
function DroppableColumn({
  stage,
  meetings,
  attributes,
}: {
  stage: { id: string; name: string; color: string }
  meetings: Meeting[]
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
            <Badge variant="secondary" className="h-5 w-5 rounded-full p-0 text-xs bg-white/80 text-gray-700 flex items-center justify-center">
              {meetings.length}
            </Badge>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-500 hover:text-gray-700">
            <PlusIcon className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="flex-1 bg-gray-50/50 rounded-b-xl border-l border-r border-b border-gray-200 p-3 space-y-3">
        <SortableContext items={meetings.map((m) => m.id)} strategy={verticalListSortingStrategy}>
          {meetings.map((meeting) => (
            <SortableMeetingCard key={meeting.id} meeting={meeting} attributes={attributes} />
          ))}
        </SortableContext>
      </div>
    </div>
  )
}

// Add column button component
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
        <PlusIcon className="h-5 w-5 text-gray-400" />
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
  const [name, setName] = React.useState("")
  const [color, setColor] = React.useState("bg-gray-100")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onAddColumn(name, color)
      setName("")
      onOpenChange(false)
    }
  }

  const colorOptions = [
    { value: "bg-gray-100", label: "Gray" },
    { value: "bg-blue-100", label: "Blue" },
    { value: "bg-green-100", label: "Green" },
    { value: "bg-yellow-100", label: "Yellow" },
    { value: "bg-purple-100", label: "Purple" },
    { value: "bg-red-100", label: "Red" },
    { value: "bg-orange-100", label: "Orange" },
    { value: "bg-pink-100", label: "Pink" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Column</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="column-name">Column Name</Label>
            <Input
              id="column-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., In Review"
              autoFocus
              className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <Label>Column Color</Label>
            <div className="grid grid-cols-4 gap-2">
              {colorOptions.map((option) => (
                <div
                  key={option.value}
                  className={`h-10 rounded-lg cursor-pointer ${option.value} border-2 transition-all ${
                    color === option.value
                      ? "border-blue-500 scale-105 shadow-sm"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setColor(option.value)}
                  title={option.label}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim()} className="bg-blue-600 hover:bg-blue-700">
              Add Column
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function MeetingPreparationKanban({ workflowConfig, initialMeetings: propMeetings }: MeetingPreparationKanbanProps) {
  const [meetings, setMeetings] = React.useState(propMeetings || initialMeetings)
  const [activeMeeting, setActiveMeeting] = React.useState<Meeting | null>(null)
  const [stagesList, setStagesList] = React.useState(workflowConfig?.stages || defaultStages)
  const [addColumnDialogOpen, setAddColumnDialogOpen] = React.useState(false)

  // Update stages when workflow config changes
  React.useEffect(() => {
    if (workflowConfig?.stages) {
      setStagesList(workflowConfig.stages)
    }
  }, [workflowConfig?.stages])

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor),
  )

  function handleDragStart(event: any) {
    const { active } = event
    const activeId = active.id as string
    const meeting = meetings.find((m) => m.id === activeId)
    if (meeting) {
      setActiveMeeting(meeting)
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveMeeting(null)
    const { active, over } = event

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeMeeting = meetings.find((m) => m.id === activeId)
    if (!activeMeeting) return

    // Find which stage the item is being dropped on
    let targetStage = overId

    // If dropping on another meeting, find its stage
    if (!stagesList.some((s) => s.id === overId)) {
      const targetMeeting = meetings.find((m) => m.id === overId)
      if (targetMeeting) {
        targetStage = targetMeeting.stage
      }
    }

    // Update the meeting's stage if it's different
    if (activeMeeting.stage !== targetStage && stagesList.some((s) => s.id === targetStage)) {
      setMeetings(meetings.map((meeting) => (meeting.id === activeId ? { ...meeting, stage: targetStage } : meeting)))
    }
  }

  const handleAddColumn = (name: string, color: string) => {
    const newStage = {
      id: `stage-${Date.now()}`,
      name: name,
      color: color,
    }
    setStagesList([...stagesList, newStage])
  }

  const meetingsByStage = stagesList.map((stage) => ({
    stage,
    meetings: meetings.filter((meeting) => meeting.stage === stage.id),
  }))

  const attributes = workflowConfig?.attributes || defaultAttributes

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {meetingsByStage.map(({ stage, meetings }) => (
          <DroppableColumn key={stage.id} stage={stage} meetings={meetings} attributes={attributes} />
        ))}
        <AddColumnButton onAddColumn={() => setAddColumnDialogOpen(true)} />
      </div>
      <DragOverlay>
        {activeMeeting ? (
          <div className="w-80 opacity-80 shadow-lg">
            <MeetingCard meeting={activeMeeting} attributes={attributes} />
          </div>
        ) : null}
      </DragOverlay>
      <AddColumnDialog open={addColumnDialogOpen} onOpenChange={setAddColumnDialogOpen} onAddColumn={handleAddColumn} />
    </DndContext>
  )
} 