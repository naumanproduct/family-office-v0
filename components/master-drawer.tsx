"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { 
  ChevronLeftIcon, 
  ExpandIcon, 
  PlusIcon, 
  XIcon, 
  ChevronDownIcon, 
  ChevronRightIcon,
  EditIcon,
  ActivityIcon,
  CheckCircleIcon,
  FileTextIcon,
  CalendarIcon,
  MailIcon,
  FileIcon,
  MessageSquareIcon,
  SendIcon,
  InboxIcon,
  UserIcon,
  PaperclipIcon,
  DownloadIcon,
  ReplyIcon,
  ForwardIcon
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { TaskDetailsView } from "./task-details-view"
import { NoteDetailsView } from "./note-details-view"
import { MeetingDetailsView } from "./meeting-details-view"
import { EmailDetailsView } from "./email-details-view"
import { ViewModeSelector } from "@/components/shared/view-mode-selector"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TabContentRenderer } from "@/components/shared/tab-content-renderer"
import { UnifiedActivitySection } from "@/components/shared/unified-activity-section"
import { generateWorkflowActivities } from "@/components/shared/activity-generators"
import { TypableArea } from "@/components/typable-area"

interface Tab {
  id: string
  label: string
  count: number | null
  icon: React.ComponentType<{ className?: string }>
}

interface MasterDrawerProps {
  trigger: React.ReactNode
  title: string
  recordType: string
  subtitle?: string
  tabs: Tab[]
  children: (
    activeTab: string,
    viewMode: "card" | "list" | "table",
    setSelectedTask?: (task: any) => void,
    setSelectedNote?: (note: any) => void,
    setSelectedMeeting?: (meeting: any) => void,
    setSelectedEmail?: (email: any) => void,
  ) => React.ReactNode
  detailsPanel: (isFullScreen?: boolean) => React.ReactNode
  onComposeEmail?: () => void
  customActions?: React.ReactNode[]
  activityContent?: React.ReactNode
}

export function MasterDrawer({
  trigger,
  title,
  recordType,
  subtitle,
  tabs,
  children,
  detailsPanel,
  onComposeEmail,
  customActions = [],
  activityContent,
}: MasterDrawerProps) {
  const [isFullScreen, setIsFullScreen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("details")
  const [viewMode, setViewMode] = React.useState<"card" | "list" | "table">(isFullScreen ? "table" : "list")
  const [selectedTask, setSelectedTask] = React.useState<any>(null)
  const [selectedNote, setSelectedNote] = React.useState<any>(null)
  const [selectedMeeting, setSelectedMeeting] = React.useState<any>(null)
  const [selectedEmail, setSelectedEmail] = React.useState<any>(null)
  const [selectedSubtask, setSelectedSubtask] = React.useState<any>(null)
  const [parentTaskForSubtask, setParentTaskForSubtask] = React.useState<any>(null)
  
  // States for individual record full screen views
  const [taskFullScreen, setTaskFullScreen] = React.useState(false)
  const [noteFullScreen, setNoteFullScreen] = React.useState(false)
  const [meetingFullScreen, setMeetingFullScreen] = React.useState(false)
  const [emailFullScreen, setEmailFullScreen] = React.useState(false)

  // Check if we should add Activity tab for specific record types in full screen
  const shouldAddActivityTab = React.useMemo(() => {
    return isFullScreen && [
      "Investment", 
      "Entity", 
      "Opportunity", 
      "Opportunities", 
      "Company", 
      "People", 
      "Person", 
      "Contact", 
      "Workflow",
      "Investment Onboarding",
      "Cash Forecast",
      "Capital Calls", 
      "Distributions",
      "Tax Documents",
      "Compliance Items"
    ].includes(recordType)
  }, [isFullScreen, recordType])

  // Create tabs for full screen mode
  const fullScreenTabs = React.useMemo(() => {
    const excludedTabIds = ["contacts", "people", "team", "company"]
    let baseTabs = tabs.filter((tab) => !excludedTabIds.includes(tab.id.toLowerCase()))
    
    // Add Activity tab as first tab if needed
    if (shouldAddActivityTab) {
      const activityTab: Tab = {
        id: "activity",
        label: "Activity",
        count: null,
        icon: ActivityIcon
      }
      baseTabs = [activityTab, ...baseTabs]
    }
    
    return baseTabs
  }, [tabs, shouldAddActivityTab])

  // Exclude specific tab ids across all drawers
  const excludedTabIds = ["contacts", "people", "team", "company"]
  const filteredTabs = React.useMemo(
    () => tabs.filter((tab) => !excludedTabIds.includes(tab.id.toLowerCase())),
    [tabs],
  )

  // ESC key handler for full screen mode
  React.useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isFullScreen) {
        setIsFullScreen(false)
      }
    }

    if (isFullScreen) {
      document.addEventListener("keydown", handleEscKey)
      return () => {
        document.removeEventListener("keydown", handleEscKey)
      }
    }
  }, [isFullScreen])

  // Lock body scroll when full screen is active
  React.useEffect(() => {
    if (isFullScreen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Add styles to prevent scrolling
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restore scroll position and remove styles
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      };
    }
  }, [isFullScreen]);

  React.useEffect(() => {
    // When switching to full screen mode and should add activity tab, set it as default
    if (isFullScreen && shouldAddActivityTab && activeTab === "details") {
      setActiveTab("activity")
    }
    // When switching back from full screen, if on activity tab, switch to details
    if (!isFullScreen && activeTab === "activity") {
      setActiveTab("details")
    }
  }, [isFullScreen, shouldAddActivityTab, activeTab])

  // Add this effect to update viewMode when isFullScreen changes
  React.useEffect(() => {
    // Update viewMode based on isFullScreen state
    setViewMode(isFullScreen ? "table" : "list")
  }, [isFullScreen])

  const renderTabContent = (activeTab: string, viewMode: "card" | "list" | "table", isCurrentFullScreen = false) => {
    if (activeTab === "details") {
      return detailsPanel(isCurrentFullScreen)
    }

    // Handle activity tab in full screen mode
    if (activeTab === "activity" && isCurrentFullScreen && shouldAddActivityTab) {
      // Use the activityContent prop if provided
      if (activityContent) {
        return (
          <div className="-mx-6 -mt-6">
            <div className="px-6 py-4 bg-background">
              {activityContent}
            </div>
          </div>
        )
      }
      return <div className="text-muted-foreground">No activity available</div>
    }

    // Handle subtask details view (highest priority)
    if (activeTab === "tasks" && selectedSubtask && parentTaskForSubtask && !isFullScreen) {
      return (
        <TaskDetailsView 
          task={selectedSubtask} 
          onBack={() => {
            setSelectedSubtask(null)
            // Don't clear parentTaskForSubtask here, we'll use it to show parent
          }}
          recordName={title} 
          recordType={recordType}
          parentTask={parentTaskForSubtask}
          onBackToParent={() => {
            setSelectedSubtask(null)
            setSelectedTask(parentTaskForSubtask)
            setParentTaskForSubtask(null)
          }}
          isInDrawer={true}
        />
      )
    }

    // Handle task details view (only in non-fullscreen mode)
    if (activeTab === "tasks" && selectedTask && !isFullScreen) {
      return (
        <TaskDetailsView 
          task={selectedTask} 
          onBack={() => setSelectedTask(null)} 
          recordName={title} 
          recordType={recordType}
          isInDrawer={true}
          onSubtaskClick={(subtask) => {
            setSelectedSubtask(subtask)
            setParentTaskForSubtask(selectedTask)
          }}
        />
      )
    }

    // Handle note details view (only in non-fullscreen mode)
    if (activeTab === "notes" && selectedNote && !isFullScreen) {
      return <NoteDetailsView note={selectedNote} onBack={() => setSelectedNote(null)} />
    }

    // Handle meeting details view (only in non-fullscreen mode)
    if (activeTab === "meetings" && selectedMeeting && !isFullScreen) {
      return <MeetingDetailsView meeting={selectedMeeting} onBack={() => setSelectedMeeting(null)} />
    }

    // Handle email details view (only in non-fullscreen mode)
    if (activeTab === "emails" && selectedEmail && !isFullScreen) {
      return <EmailDetailsView email={selectedEmail} onBack={() => setSelectedEmail(null)} />
    }

    // For other tabs, return the children with the setSelectedTask and setSelectedNote callbacks
    return children(activeTab, viewMode, setSelectedTask, setSelectedNote, setSelectedMeeting, setSelectedEmail)
  }

  // Get the appropriate title and subtitle - only change for non-fullscreen mode
  const getHeaderInfo = () => {
    // In fullscreen mode, always show the original record info in the left panel
    if (isFullScreen) {
      return {
        title: title,
        subtitle: subtitle,
        firstLetter: title.charAt(0),
      }
    }

    // In non-fullscreen mode, show selected item info
    if (selectedSubtask) {
      return {
        title: selectedSubtask.title || "Subtask Details",
        subtitle: selectedSubtask.description ? selectedSubtask.description.substring(0, 60) + "..." : null,
        firstLetter: "S",
      }
    } else if (selectedTask) {
      return {
        title: selectedTask.title || "Task Details",
        subtitle: selectedTask.description ? selectedTask.description.substring(0, 60) + "..." : null,
        firstLetter: "T",
      }
    } else if (selectedNote) {
      return {
        title: selectedNote.title || "Note Details",
        subtitle: selectedNote.content ? selectedNote.content.substring(0, 60) + "..." : null,
        firstLetter: "N",
      }
    } else if (selectedMeeting) {
      return {
        title: selectedMeeting.title || "Meeting Details",
        subtitle: selectedMeeting.description ? selectedMeeting.description.substring(0, 60) + "..." : null,
        firstLetter: "M",
      }
    } else if (selectedEmail) {
      return {
        title: selectedEmail.subject || "Email Details",
        subtitle: selectedEmail.preview ? selectedEmail.preview.substring(0, 60) + "..." : null,
        firstLetter: "E",
      }
    } else {
      return {
        title: title,
        subtitle: subtitle,
        firstLetter: title.charAt(0),
      }
    }
  }

  // Handle back navigation in the drawer
  const handleDrawerBackClick = () => {
    if (selectedSubtask) {
      // If viewing a subtask, go back to parent task
      setSelectedSubtask(null)
      setSelectedTask(parentTaskForSubtask)
      setParentTaskForSubtask(null)
    } else if (selectedTask) {
      setSelectedTask(null)
    } else if (selectedNote) {
      setSelectedNote(null)
    } else if (selectedMeeting) {
      setSelectedMeeting(null)
    } else if (selectedEmail) {
      setSelectedEmail(null)
    }
  }

  // Individual Record Full Screen Component - matches page view full screen UX
  const RecordFullScreenContent = ({ recordType, record, onClose, activityContent }: { recordType: string; record: any; onClose: () => void; activityContent?: React.ReactNode }) => {
    // Local state for tabs in the full screen view
    const [localActiveTab, setLocalActiveTab] = React.useState("activity") // Default to activity like page views
    const [localViewMode, setLocalViewMode] = React.useState<"card" | "list" | "table">("table")
    const [tasksViewMode, setTasksViewMode] = React.useState<"card" | "list" | "table">("table")
    const [filesViewMode, setFilesViewMode] = React.useState<"card" | "list" | "table">("table")
    const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({
      notes: true,
    })
    
    // Email thread states - must be declared at top level to avoid hooks order issues
    const [expandedEmails, setExpandedEmails] = React.useState<Set<string>>(new Set())
    const [isReplying, setIsReplying] = React.useState(false)
    const [replyText, setReplyText] = React.useState("")
    
    // Get appropriate icon for record type
    const getRecordIcon = () => {
      switch(recordType) {
        case "Task": return CheckCircleIcon
        case "Note": return FileTextIcon
        case "Meeting": return CalendarIcon
        case "Email": return MailIcon
        default: return FileTextIcon
      }
    }
    
    const RecordIcon = getRecordIcon()
    
    // Define tabs based on record type - matching page view structure
    const recordTabs = React.useMemo(() => {
      const baseTabs = []
      
      // Activity tab for all record types (first)
      baseTabs.push({ id: "activity", label: "Activity", icon: ActivityIcon })
      
      // Additional tabs based on record type
      if (recordType === "Task") {
        baseTabs.push({ id: "tasks", label: "Subtasks", icon: CheckCircleIcon }) // Moved to 2nd position after Activity
        baseTabs.push({ id: "notes", label: "Notes", icon: FileTextIcon })
        baseTabs.push({ id: "files", label: "Files", icon: FileIcon })
      } else if (recordType === "Note") {
        baseTabs.push({ id: "notes", label: "Notes", icon: FileTextIcon }) // For editing the note
        baseTabs.push({ id: "files", label: "Files", icon: FileIcon })
        baseTabs.push({ id: "tasks", label: "Tasks", icon: CheckCircleIcon })
      } else if (recordType === "Meeting") {
        baseTabs.push({ id: "notes", label: "Notes", icon: FileTextIcon })
        baseTabs.push({ id: "files", label: "Files", icon: FileIcon })
        baseTabs.push({ id: "tasks", label: "Tasks", icon: CheckCircleIcon })
      } else if (recordType === "Email") {
        baseTabs.push({ id: "threads", label: "Email Threads", icon: MessageSquareIcon }) // Email threads moved to tab
        baseTabs.push({ id: "tasks", label: "Tasks", icon: CheckCircleIcon })
      }
      
      return baseTabs
    }, [recordType])
    
    // Mock data for demonstration - same as page views
    const mockTasks = [
      {
        id: 1,
        title: `Review ${recordType.toLowerCase()} content for accuracy`,
        status: "In Progress",
        priority: "High",
        assignee: "John Smith",
        dueDate: "2023-06-15",
        description: `Verify all information in the ${recordType.toLowerCase()} is accurate and up-to-date.`
      },
      {
        id: 2,
        title: `Follow up on action items from ${recordType.toLowerCase()}`,
        status: "To Do",
        priority: "Medium",
        assignee: "Sarah Johnson",
        dueDate: "2023-06-20",
        description: `Address all action items mentioned in the ${recordType.toLowerCase()}.`
      },
    ]
    
    const mockFiles = [
      {
        id: 1,
        name: "Related Document.pdf",
        uploadedBy: "John Smith",
        uploadedDate: "2024-01-20",
        size: "2.3 MB"
      },
      {
        id: 2,
        name: "Supporting Materials.docx",
        uploadedBy: "Sarah Johnson",
        uploadedDate: "2024-01-19",
        size: "1.5 MB"
      },
    ]
    
    // Mock notes data for Task full screen
    const mockNotes = [
      {
        id: 1,
        title: "Initial task assessment",
        content: "Task requires careful review of all documentation...",
        author: "John Smith",
        createdAt: "2024-01-18",
        tags: ["review", "priority"]
      },
      {
        id: 2,
        title: "Progress update",
        content: "Completed initial review phase, moving to implementation...",
        author: "Sarah Johnson",
        createdAt: "2024-01-19",
        tags: ["update", "progress"]
      },
    ]
    
    // Mock email threads for Email full screen - using actual email data
    const mockEmailThreads = React.useMemo(() => {
      // Helper function to safely parse date
      const getValidDate = (dateValue: any): Date => {
        if (!dateValue) return new Date()
        const parsed = new Date(dateValue)
        return isNaN(parsed.getTime()) ? new Date() : parsed
      }
      
      // Get base date from the record
      const baseDate = getValidDate(record.sentAt || record.date)
      
      // Create email thread based on the actual email record
      const baseThread = [
        {
          id: record.id || "email-1",
          from: record.from || "sarah.johnson@company.com",
          to: record.to || ["john.doe@client.com"],
          cc: record.cc || [],
          subject: record.subject || "Project Proposal Discussion",
          date: baseDate.toISOString(),
          body: record.body || record.preview || `Hi John,

I hope this email finds you well. I wanted to follow up on our conversation from last week regarding the new project proposal.

I've attached the updated proposal document with the revisions we discussed. The key changes include:
- Updated timeline reflecting the Q2 delivery date
- Revised budget allocation for the development phase
- Additional resources for the testing phase

Please review the document and let me know if you have any questions or need further clarification on any of the points.

Looking forward to your feedback.

Best regards,
Sarah`,
          attachments: record.attachments || [
            { name: "proposal-v2.pdf", size: "2.4 MB", type: "PDF" },
            { name: "budget-breakdown.xlsx", size: "156 KB", type: "Excel" },
          ],
          isOriginal: true,
        }
      ]
      
      // Add reply emails if this is part of a thread
      const isReplyEmail = record.subject && (record.subject.includes("Re:") || record.subject.includes("RE:"))
      if (isReplyEmail) {
        // This is already a reply, so add the original email before it
        const originalSender = Array.isArray(record.to) ? record.to[0] : record.to
        baseThread.unshift({
          id: "email-0",
          from: originalSender || "john.doe@client.com",
          to: [record.from || "sarah.johnson@company.com"],
          cc: [],
          subject: record.subject?.replace(/^(Re:|RE:)\s*/g, '') || "Original Subject",
          date: new Date(baseDate.getTime() - 172800000).toISOString(),
          body: `Dear Sarah,

I wanted to discuss the upcoming project proposal with you. Could you please prepare an updated version with the following considerations:

1. Updated timeline to reflect Q2 delivery
2. Budget breakdown for each phase
3. Resource allocation details

Let me know if you need any additional information from my end.

Best regards,
John`,
          attachments: [],
          isOriginal: false,
        })
      } else {
        // This is an original email, add mock replies
        baseThread.push({
          id: "email-2",
          from: Array.isArray(record.to) ? record.to[0] : record.to || "john.doe@client.com",
          to: [record.from || "sarah.johnson@company.com"],
          cc: [],
          subject: `Re: ${record.subject || "Project Proposal Discussion"}`,
          date: new Date(baseDate.getTime() - 86400000).toISOString(),
          body: `Hi Sarah,

Thank you for sending the updated proposal. I've had a chance to review it with my team.

Overall, we're very pleased with the revisions. The timeline looks much more realistic, and the budget breakdown is exactly what we needed to see.

I do have a couple of questions:
1. Can we discuss the testing phase timeline in more detail?
2. What's the process for change requests during development?

Would you be available for a call this Thursday to discuss these points?

Best,
John`,
          attachments: [],
          isOriginal: false,
        })
        
        // Add a second reply
        baseThread.push({
          id: "email-3",
          from: record.from || "sarah.johnson@company.com",
          to: Array.isArray(record.to) ? record.to : record.to ? [record.to] : ["john.doe@client.com"],
          cc: ["mike.wilson@company.com"],
          subject: `Re: ${record.subject || "Project Proposal Discussion"}`,
          date: new Date(baseDate.getTime() - 43200000).toISOString(),
          body: `Hi John,

Great to hear that you're pleased with the revisions!

To answer your questions:
1. The testing phase is structured in three stages: unit testing (week 1), integration testing (week 2), and user acceptance testing (week 3). I'll send you a detailed testing plan separately.
2. We have a formal change request process that includes impact assessment and approval workflow. Minor changes can usually be accommodated within the existing timeline.

Thursday works perfectly for me. How about 2 PM EST? I'll send a calendar invite.

I'm also CC'ing Mike Wilson, our project manager, who will be your main point of contact during the development phase.

Best regards,
Sarah`,
                      attachments: [{ name: "testing-plan.pdf", size: "890 KB", type: "PDF" }],
            isOriginal: false,
          })
        }
        
        return baseThread
      }, [record])
    
    const content = (
      <>
        {/* Semi-transparent overlay */}
        <div className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm" onClick={onClose} />
        
        <div className="fixed inset-4 z-[9999] bg-background rounded-xl shadow-xl overflow-hidden">
          {/* Full Screen Header */}
          <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={onClose}>
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <Badge variant="outline" className="bg-background">
                {recordType}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={onClose}>
                <XIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Full Screen Content - Two Column Layout (matching page view) */}
          <div className="flex h-[calc(100%-73px)]">
            {/* Left Panel - Details (Persistent) */}
            <div className="w-[672px] border-r bg-background overflow-y-auto">
              {/* Record Header - no bottom border to align with tab line */}
              <div className="bg-background px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    {record.title?.charAt(0) || recordType.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">
                      {record.title || record.subject || record.name || "Untitled"}
                    </h2>
                    {/* No subtitle per page view design */}
                  </div>
                </div>
              </div>
              
              {/* Details Content */}
              <div className="flex-1">
                {recordType === "Task" && (
                  <TaskDetailsView
                    task={record}
                    onBack={onClose}
                    recordName={title}
                    recordType={recordType}
                    isFullScreen={true}
                    hideSubtasks={true}
                  />
                )}
                {recordType === "Note" && (
                  <NoteDetailsView 
                    note={record} 
                    onBack={onClose}
                    hideAddNotes={true}
                    isFullScreen={true}
                  />
                )}
                {recordType === "Meeting" && (
                  <MeetingDetailsView 
                    meeting={record} 
                    onBack={onClose}
                    isFullScreen={true}
                  />
                )}
                {recordType === "Email" && (() => {
                  // State for expandable sections
                  const [emailOpenSections, setEmailOpenSections] = React.useState<Record<string, boolean>>({
                    details: true,
                    attachments: true,
                  })
                  
                  const toggleEmailSection = (sectionId: string) => {
                    setEmailOpenSections(prev => ({
                      ...prev,
                      [sectionId]: !prev[sectionId]
                    }))
                  }
                  
                  return (
                    <div className="p-6 space-y-4">
                      {/* Email Details Section - matching drawer styling */}
                      <div className="rounded-lg border border-muted overflow-hidden">
                        <button
                          onClick={() => toggleEmailSection('details')}
                          className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors"
                        >
                          {emailOpenSections.details ? (
                            <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />
                          )}
                          <MailIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Email Details</span>
                        </button>
                        
                        {emailOpenSections.details && (
                          <div className="px-4 pb-4 pt-1">
                            <div className="space-y-3">
                              {/* From field */}
                              <div className="flex items-start gap-2">
                                <div className="mt-1">
                                  <SendIcon className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-start gap-4">
                                    <Label className="text-xs text-muted-foreground mt-1 w-16">From</Label>
                                    <div className="text-sm">{record.from || "sender@example.com"}</div>
                                  </div>
                                </div>
                              </div>

                              {/* Subject field */}
                              <div className="flex items-start gap-2">
                                <div className="mt-1">
                                  <MailIcon className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-start gap-4">
                                    <Label className="text-xs text-muted-foreground mt-1 w-16">Subject</Label>
                                    <div className="text-sm font-medium">{record.subject || "No subject"}</div>
                                  </div>
                                </div>
                              </div>

                              {/* To field */}
                              <div className="flex items-start gap-2">
                                <div className="mt-1">
                                  <InboxIcon className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-start gap-4">
                                    <Label className="text-xs text-muted-foreground mt-1 w-16">To</Label>
                                    <div className="text-sm">
                                      {Array.isArray(record.to) ? record.to.join(", ") : record.to || "recipient@example.com"}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* CC field if present */}
                              {record.cc && record.cc.length > 0 && (
                                <div className="flex items-start gap-2">
                                  <div className="mt-1">
                                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-start gap-4">
                                      <Label className="text-xs text-muted-foreground mt-1 w-16">CC</Label>
                                      <div className="text-sm">
                                        {Array.isArray(record.cc) ? record.cc.join(", ") : record.cc}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Sent date */}
                              <div className="flex items-start gap-2">
                                <div className="mt-1">
                                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-start gap-4">
                                    <Label className="text-xs text-muted-foreground mt-1 w-16">Sent</Label>
                                    <div className="text-sm">
                                      {new Date(record.date || Date.now()).toLocaleDateString('en-US', { 
                                        month: 'short', 
                                        day: 'numeric', 
                                        year: 'numeric' 
                                      }) + ', ' + new Date(record.date || Date.now()).toLocaleTimeString('en-US', { 
                                        hour: 'numeric', 
                                        minute: '2-digit',
                                        hour12: true 
                                      })}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Attachments Section - aggregates all attachments from email thread */}
                      {(() => {
                        // Aggregate all attachments from the email thread
                        const allAttachments: any[] = []
                        mockEmailThreads.forEach((email) => {
                          if (email.attachments && email.attachments.length > 0) {
                            email.attachments.forEach((attachment: any) => {
                              allAttachments.push({
                                ...attachment,
                                fromEmail: email.from,
                                emailDate: email.date
                              })
                            })
                          }
                        })
                        
                        return (
                          <div className="rounded-lg border border-muted overflow-hidden">
                            <button
                              onClick={() => toggleEmailSection('attachments')}
                              className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors"
                            >
                              {emailOpenSections.attachments ? (
                                <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />
                              )}
                              <PaperclipIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">Attachments ({allAttachments.length})</span>
                            </button>
                            
                            {emailOpenSections.attachments && (
                              <div className="px-4 pb-4 pt-1">
                                <div className="space-y-2">
                                  {allAttachments.map((attachment: any, i: number) => (
                                    <div
                                      key={i}
                                      className="flex items-center justify-between p-3 border rounded-lg bg-background hover:bg-muted/50 transition-colors"
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded bg-muted">
                                          <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium">{attachment.name || `Attachment ${i + 1}`}</p>
                                          <p className="text-xs text-muted-foreground">
                                            {attachment.size || "Unknown size"} • {attachment.type || "Unknown type"}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                          <DownloadIcon className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )})()}
                      </div>
                  )
                })()}
              </div>
            </div>

            {/* Right Panel - Main Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Tabs */}
              <div className="border-b bg-background px-6">
                <div className="flex relative overflow-x-auto">
                  {recordTabs.map((tab, index) => (
                    <button
                      key={tab.id}
                      onClick={() => setLocalActiveTab(tab.id)}
                      className={`relative whitespace-nowrap py-3 px-3 text-sm font-medium flex items-center gap-1 flex-shrink-0 ${
                        localActiveTab === tab.id
                          ? "border-b-2 border-primary text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      } ${index === 0 ? 'pl-0' : ''}`}
                    >
                      {tab.icon && <tab.icon className="h-4 w-4 flex-shrink-0" />}
                      <span>{tab.label}</span>
                      {localActiveTab === tab.id && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"></span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    {recordTabs.find((tab) => tab.id === localActiveTab)?.label}
                  </h3>
                  <div className="flex items-center gap-2">
                    {localActiveTab === "activity" && (
                      <Button variant="outline" size="sm">
                        <PlusIcon className="h-4 w-4" />
                        Add meeting
                      </Button>
                    )}
                    {localActiveTab === "tasks" && (
                      <>
                        <ViewModeSelector viewMode={tasksViewMode} onViewModeChange={setTasksViewMode} />
                        <Button variant="outline" size="sm">
                          <PlusIcon className="h-4 w-4" />
                          Add task
                        </Button>
                      </>
                    )}
                    {localActiveTab === "notes" && recordType !== "Note" && (
                      <Button variant="outline" size="sm">
                        <PlusIcon className="h-4 w-4" />
                        Add note
                      </Button>
                    )}
                    {localActiveTab === "files" && (
                      <>
                        <ViewModeSelector viewMode={filesViewMode} onViewModeChange={setFilesViewMode} />
                        <Button variant="outline" size="sm">
                          <PlusIcon className="h-4 w-4" />
                          Add file
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Activity content */}
                {localActiveTab === "activity" && (
                  activityContent || <UnifiedActivitySection activities={generateWorkflowActivities()} />
                )}
                
                {/* Tasks content */}
                {localActiveTab === "tasks" && (
                  <TabContentRenderer
                    activeTab="tasks"
                    viewMode={tasksViewMode}
                    data={mockTasks}
                  />
                )}
                
                {/* Notes content - editable for Note type */}
                {localActiveTab === "notes" && recordType === "Note" && (
                  <div className="space-y-5">
                    <div className="rounded-lg border border-muted overflow-hidden">
                      <div className="group">
                        <button 
                          onClick={() => setOpenSections(prev => ({ ...prev, notes: !prev.notes }))}
                          className={`w-full flex items-center justify-between p-3 hover:bg-muted/20 transition-colors ${openSections.notes ? 'bg-muted/20' : ''}`}
                        >
                          <div className="flex items-center">
                            {openSections.notes ? (
                              <ChevronDownIcon className="h-4 w-4 text-muted-foreground mr-2" />
                            ) : (
                              <ChevronRightIcon className="h-4 w-4 text-muted-foreground mr-2" /> 
                            )}
                            <div className="flex items-center gap-2">
                              <EditIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium text-sm">Notes</span>
                            </div>
                          </div>
                        </button>

                        {/* Section Content */}
                        {openSections.notes && (
                          <div className="px-5 pb-3 pt-2">
                            <TypableArea 
                              value={record?.content || ''} 
                              onChange={(value) => {
                                // Update the note content
                                if (record) {
                                  record.content = value;
                                }
                              }} 
                              placeholder="Start typing to add your thoughts..." 
                              showButtons={false}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Notes content - list for other types */}
                {localActiveTab === "notes" && recordType !== "Note" && (
                  <TabContentRenderer
                    activeTab="notes"
                    viewMode={filesViewMode}
                    data={mockNotes}
                  />
                )}
                
                {/* Files content */}
                {localActiveTab === "files" && (
                  <TabContentRenderer
                    activeTab="files"
                    viewMode={filesViewMode}
                    data={mockFiles}
                  />
                )}
                
                {/* Email threads content - matching drawer view exactly */}
                {localActiveTab === "threads" && recordType === "Email" && (() => {
                  // Email content component - same as drawer
                  const EmailThreadItem = ({ emailItem, isExpanded, onToggle }: { emailItem: any; isExpanded: boolean; onToggle: () => void }) => {
                    const isOriginal = emailItem.isOriginal
                    
                    // Format date as "Jun 28, 2025, 3:48 PM"
                    const formatEmailDate = (dateString: string) => {
                      const date = new Date(dateString)
                      // Check if date is valid
                      if (isNaN(date.getTime())) {
                        return "Date unavailable"
                      }
                      return date.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      }) + ', ' + date.toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit',
                        hour12: true 
                      })
                    }
                    
                    const formattedDate = formatEmailDate(emailItem.date)
                    
                    // Get first line of email body for collapsed view
                    const firstLine = emailItem.body.split('\n')[0]

                    return (
                      <div className={`${isOriginal ? "" : "opacity-80"}`}>
                        <div 
                          className="flex items-start gap-3 mb-3 cursor-pointer hover:bg-muted/30 rounded-lg p-2 -m-2 transition-colors"
                          onClick={onToggle}
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{emailItem.from.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <div className="flex-1">
                                <p className="text-sm font-medium">{emailItem.from}</p>
                                {isExpanded ? (
                                  <p className="text-xs text-muted-foreground">
                                    To: {Array.isArray(emailItem.to) ? emailItem.to.join(", ") : emailItem.to}
                                    {emailItem.cc && emailItem.cc.length > 0 && ` • CC: ${emailItem.cc.join(", ")}`}
                                  </p>
                                ) : (
                                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                                    {firstLine}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="text-xs text-muted-foreground">{formattedDate}</div>
                                <ChevronRightIcon className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Email body with proper formatting - only show when expanded */}
                        {isExpanded && (
                          <div className="pl-11">
                            <div className="text-sm text-foreground">
                              {emailItem.body.split("\n").map((paragraph: string, i: number) => (
                                <p key={i} className="my-2">
                                  {paragraph}
                                </p>
                              ))}
                            </div>

                            {/* Attachments if any */}
                            {emailItem.attachments && emailItem.attachments.length > 0 && (
                              <div className="mt-4 p-3 border rounded-lg bg-muted/20">
                                <div className="flex items-center gap-2 mb-3">
                                  <PaperclipIcon className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm font-medium">Attachments ({emailItem.attachments.length})</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {emailItem.attachments.map((attachment: any, i: number) => (
                                    <div
                                      key={i}
                                      className="flex items-center gap-2 p-2 border rounded bg-background hover:bg-muted/50 transition-colors"
                                    >
                                      <div className="flex h-6 w-6 items-center justify-center rounded bg-muted">
                                        <FileTextIcon className="h-3 w-3 text-muted-foreground" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium truncate">{attachment.name || `Attachment ${i + 1}`}</p>
                                        <p className="text-xs text-muted-foreground">{attachment.size || "Unknown size"}</p>
                                      </div>
                                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 flex-shrink-0">
                                        <DownloadIcon className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  }
                  
                  return (
                    <div className="space-y-4">
                      {mockEmailThreads
                        .slice()
                        .reverse()
                        .map((emailItem, index, reversedArray) => {
                          // The most recent email is the last one in reversed array (originally first)
                          const isLatest = index === reversedArray.length - 1
                          const isExpanded = isLatest || expandedEmails.has(emailItem.id)
                          
                          return (
                            <div key={emailItem.id}>
                              <EmailThreadItem 
                                emailItem={emailItem}
                                isExpanded={isExpanded}
                                onToggle={() => {
                                  const newExpanded = new Set(expandedEmails)
                                  if (isExpanded && !isLatest) {
                                    newExpanded.delete(emailItem.id)
                                  } else {
                                    newExpanded.add(emailItem.id)
                                  }
                                  setExpandedEmails(newExpanded)
                                }}
                              />
                              {index < reversedArray.length - 1 && <Separator className="my-4" />}
                            </div>
                          )
                        })}

                      {/* Reply section */}
                      <div className="mt-6 space-y-4">
                        <div className="flex items-center gap-2">
                          {!isReplying ? (
                            <>
                              <Button variant="outline" size="sm" className="h-8" onClick={() => setIsReplying(true)}>
                                <ReplyIcon className="h-3 w-3 mr-2" />
                                Reply
                              </Button>
                              <Button variant="outline" size="sm" className="h-8">
                                <ForwardIcon className="h-3 w-3 mr-2" />
                                Forward
                              </Button>
                            </>
                          ) : (
                            <h4 className="text-sm font-medium">Reply</h4>
                          )}
                        </div>

                        {isReplying && (
                          <div className="rounded-lg border border-muted p-4 bg-background">
                            <div className="mb-2 flex justify-between">
                              <div>
                                <p className="text-sm">
                                  <span className="text-muted-foreground">To:</span> {mockEmailThreads[0].from}
                                </p>
                              </div>
                              <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setIsReplying(false)}>
                                Cancel
                              </Button>
                            </div>

                            <Textarea
                              value={replyText}
                              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReplyText(e.target.value)}
                              placeholder="Type your reply here..."
                              className="min-h-[120px] text-sm"
                            />

                            <div className="mt-3 flex justify-between">
                              <div className="flex gap-2">
                                <Button size="sm">
                                  <SendIcon className="h-3 w-3 mr-2" />
                                  Send
                                </Button>
                                <Button variant="outline" size="sm">
                                  <PaperclipIcon className="h-3 w-3 mr-2" />
                                  Attach
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })()}
              </div>
            </div>
          </div>
        </div>
      </>
    )

    return typeof document !== "undefined" ? createPortal(content, document.body) : null
  }

  const FullScreenContent = () => {
    const headerInfo = getHeaderInfo()

    const content = (
      <>
        {/* Semi-transparent overlay */}
        <div className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm" onClick={() => {
          setIsFullScreen(false)
          // Clear any selected items when exiting fullscreen
          setSelectedTask(null)
          setSelectedNote(null)
          setSelectedMeeting(null)
          setSelectedEmail(null)
          setSelectedSubtask(null)
          setParentTaskForSubtask(null)
        }} />
        
        <div className="fixed inset-4 z-[9999] bg-background rounded-xl shadow-xl overflow-hidden">
          {/* Full Screen Header */}
          <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsFullScreen(false)
                  // Clear any selected items when exiting fullscreen
                  setSelectedTask(null)
                  setSelectedNote(null)
                  setSelectedMeeting(null)
                  setSelectedEmail(null)
                  setSelectedSubtask(null)
                  setParentTaskForSubtask(null)
                }}
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <Badge variant="outline" className="bg-background">
                {recordType}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              {customActions.map((action, index) => (
                <React.Fragment key={index}>{action}</React.Fragment>
              ))}
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setIsFullScreen(false)
                  // Clear any selected items when exiting fullscreen
                  setSelectedTask(null)
                  setSelectedNote(null)
                  setSelectedMeeting(null)
                  setSelectedEmail(null)
                  setSelectedSubtask(null)
                  setParentTaskForSubtask(null)
                }}
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Full Screen Content - Two Column Layout */}
          <div className="flex h-[calc(100%-73px)]">
            {/* Left Panel - Details (Persistent) */}
            <div className="w-[672px] border-r bg-background overflow-y-auto">
              {/* Record Header - Always show original record info in left panel (no bottom border to align with tab line) */}
              <div className="bg-background px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    {headerInfo.firstLetter}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">{headerInfo.title}</h2>
                    {/* Subtitle removed in full screen mode */}
                  </div>
                </div>
              </div>
              {detailsPanel(true)}
            </div>

            {/* Right Panel - Main Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Tabs */}
              <div className="border-b bg-background px-6">
                <div className="flex relative">
                  <div className="flex flex-1 overflow-x-auto scrollbar-none">
                    {fullScreenTabs.filter(tab => tab.id !== "details").map((tab, index) => (
                      <button
                        key={tab.id}
                        data-tab-button
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative whitespace-nowrap py-3 px-3 text-sm font-medium flex items-center gap-1 flex-shrink-0 ${
                          activeTab === tab.id
                            ? "border-b-2 border-primary text-primary"
                            : "text-muted-foreground hover:text-foreground"
                        } ${index === 0 ? 'pl-0' : ''}`}
                      >
                        {tab.icon && <tab.icon className="h-4 w-4 flex-shrink-0" />}
                        <span>{tab.label}</span>
                        {tab.count !== null && (
                          <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                            {tab.count}
                          </Badge>
                        )}
                        {activeTab === tab.id && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"></span>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    {fullScreenTabs.find((tab) => tab.id === activeTab)?.label}
                  </h3>
                  <div className="flex items-center gap-2">
                    {shouldShowViewSelector && <ViewModeSelector viewMode={viewMode} onViewModeChange={setViewMode} />}
                    {activeTab !== "activity" && activeTab !== "details" && (
                      <Button variant="outline" size="sm">
                        <PlusIcon className="h-4 w-4" />
                        Add {activeTab === "team" ? "person" : activeTab.slice(0, -1)}
                      </Button>
                    )}
                  </div>
                </div>
                {renderTabContent(activeTab, viewMode, true)}
              </div>
            </div>
          </div>
        </div>

        {/* Task Details Sheet/Drawer in Full Screen Mode - Only show if not in individual record full screen */}
        {selectedTask && !taskFullScreen && !noteFullScreen && !meetingFullScreen && !emailFullScreen && (
          <Sheet open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
            <SheetContent
              side="right"
              className="flex w-full max-w-[30vw] flex-col p-0 sm:max-w-[30vw] [&>button]:hidden z-[10000] overflow-hidden"
            >
              <SheetTitle className="sr-only">Task Details</SheetTitle>
              {/* Header */}
              <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" onClick={handleDrawerBackClick}>
                    <ChevronLeftIcon className="h-4 w-4" />
                  </Button>
                  <Badge variant="outline" className="bg-background">
                    {selectedTask
                      ? selectedTask.parentTask ? "Subtask" : "Task"
                      : selectedNote
                        ? "Note"
                        : selectedMeeting
                          ? "Meeting"
                          : selectedEmail
                            ? "Email"
                            : recordType}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => setTaskFullScreen(true)}>
                    <ExpandIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {/* Task Details Content */}
              <div className="flex-1 overflow-auto">
                <TaskDetailsView
                  task={selectedTask}
                  onBack={handleDrawerBackClick}
                  recordName={title}
                  recordType={recordType}
                  isInDrawer={true}
                />
              </div>
            </SheetContent>
          </Sheet>
        )}

        {/* Note Details Sheet/Drawer in Full Screen Mode - Only show if not in individual record full screen */}
        {selectedNote && !taskFullScreen && !noteFullScreen && !meetingFullScreen && !emailFullScreen && (
          <Sheet open={!!selectedNote} onOpenChange={(open) => !open && setSelectedNote(null)}>
            <SheetContent
              side="right"
              className="flex w-full max-w-[30vw] flex-col p-0 sm:max-w-[30vw] [&>button]:hidden z-[10000] overflow-hidden"
            >
              <SheetTitle className="sr-only">Note Details</SheetTitle>
              {/* Header */}
              <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" onClick={handleDrawerBackClick}>
                    <ChevronLeftIcon className="h-4 w-4" />
                  </Button>
                  <Badge variant="outline" className="bg-background">
                    {selectedTask
                      ? selectedTask.parentTask ? "Subtask" : "Task"
                      : selectedNote
                        ? "Note"
                        : selectedMeeting
                          ? "Meeting"
                          : selectedEmail
                            ? "Email"
                            : recordType}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => setNoteFullScreen(true)}>
                    <ExpandIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {/* Note Details Content */}
              <div className="flex-1 overflow-auto">
                <NoteDetailsView note={selectedNote} onBack={handleDrawerBackClick} />
              </div>
            </SheetContent>
          </Sheet>
        )}

        {/* Meeting Details Sheet/Drawer in Full Screen Mode - Only show if not in individual record full screen */}
        {selectedMeeting && !taskFullScreen && !noteFullScreen && !meetingFullScreen && !emailFullScreen && (
          <Sheet open={!!selectedMeeting} onOpenChange={(open) => !open && setSelectedMeeting(null)}>
            <SheetContent
              side="right"
              className="flex w-full max-w-[30vw] flex-col p-0 sm:max-w-[30vw] [&>button]:hidden z-[10000] overflow-hidden"
            >
              <SheetTitle className="sr-only">Meeting Details</SheetTitle>
              {/* Header */}
              <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" onClick={handleDrawerBackClick}>
                    <ChevronLeftIcon className="h-4 w-4" />
                  </Button>
                  <Badge variant="outline" className="bg-background">
                    {selectedTask
                      ? selectedTask.parentTask ? "Subtask" : "Task"
                      : selectedNote
                        ? "Note"
                        : selectedMeeting
                          ? "Meeting"
                          : selectedEmail
                            ? "Email"
                            : recordType}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => setMeetingFullScreen(true)}>
                    <ExpandIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {/* Meeting Details Content */}
              <div className="flex-1 overflow-auto">
                <MeetingDetailsView meeting={selectedMeeting} onBack={handleDrawerBackClick} />
              </div>
            </SheetContent>
          </Sheet>
        )}

        {/* Email Details Sheet/Drawer in Full Screen Mode - Only show if not in individual record full screen */}
        {selectedEmail && !taskFullScreen && !noteFullScreen && !meetingFullScreen && !emailFullScreen && (
          <Sheet open={!!selectedEmail} onOpenChange={(open) => !open && setSelectedEmail(null)}>
            <SheetContent
              side="right"
              className="flex w-full max-w-[30vw] flex-col p-0 sm:max-w-[30vw] [&>button]:hidden z-[10000] overflow-hidden"
            >
              <SheetTitle className="sr-only">Email Details</SheetTitle>
              {/* Header */}
              <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" onClick={handleDrawerBackClick}>
                    <ChevronLeftIcon className="h-4 w-4" />
                  </Button>
                  <Badge variant="outline" className="bg-background">
                    {selectedTask
                      ? selectedTask.parentTask ? "Subtask" : "Task"
                      : selectedNote
                        ? "Note"
                        : selectedMeeting
                          ? "Meeting"
                          : selectedEmail
                            ? "Email"
                            : recordType}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => setEmailFullScreen(true)}>
                    <ExpandIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {/* Email Details Content */}
              <div className="flex-1 overflow-auto">
                <EmailDetailsView email={selectedEmail} onBack={handleDrawerBackClick} />
              </div>
            </SheetContent>
          </Sheet>
        )}
      </>
    )

    return typeof document !== "undefined" ? createPortal(content, document.body) : null
  }

  // We will use this conditional check for both instances of ViewModeSelector
  const shouldShowViewSelector = !(activeTab === "activity" || activeTab === "details")

  // Render individual record full screens
  if (taskFullScreen && selectedTask) {
    return <RecordFullScreenContent 
      recordType="Task" 
      record={selectedTask} 
      activityContent={activityContent}
      onClose={() => {
        setTaskFullScreen(false)
        setSelectedTask(null) // Clear to close drawer when returning to entity full screen
        setSelectedSubtask(null) // Clear subtask state as well
        setParentTaskForSubtask(null)
      }} 
    />
  }
  if (noteFullScreen && selectedNote) {
    return <RecordFullScreenContent 
      recordType="Note" 
      record={selectedNote} 
      activityContent={activityContent}
      onClose={() => {
        setNoteFullScreen(false)
        setSelectedNote(null) // Clear to close drawer when returning to entity full screen
      }} 
    />
  }
  if (meetingFullScreen && selectedMeeting) {
    return <RecordFullScreenContent 
      recordType="Meeting" 
      record={selectedMeeting} 
      activityContent={activityContent}
      onClose={() => {
        setMeetingFullScreen(false)
        setSelectedMeeting(null) // Clear to close drawer when returning to entity full screen
      }} 
    />
  }
  if (emailFullScreen && selectedEmail) {
    return <RecordFullScreenContent 
      recordType="Email" 
      record={selectedEmail} 
      activityContent={activityContent}
      onClose={() => {
        setEmailFullScreen(false)
        setSelectedEmail(null) // Clear to close drawer when returning to entity full screen
      }} 
    />
  }

  // Only show entity full screen if no individual records are in full screen
  if (isFullScreen && !taskFullScreen && !noteFullScreen && !meetingFullScreen && !emailFullScreen) {
    return <FullScreenContent />
  }

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent 
        side="right" 
        className="flex w-full max-w-[30vw] flex-col p-0 sm:max-w-[30vw] [&>button]:hidden overflow-hidden"
        onInteractOutside={() => {
          // Clear all selection states when closing
          setSelectedTask(null)
          setSelectedNote(null)
          setSelectedMeeting(null)
          setSelectedEmail(null)
          setSelectedSubtask(null)
          setParentTaskForSubtask(null)
        }}
      >
        <SheetTitle className="sr-only">{recordType} Details</SheetTitle>
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (selectedSubtask) {
                  // Go back to parent task
                  setSelectedSubtask(null)
                  setSelectedTask(parentTaskForSubtask)
                  setParentTaskForSubtask(null)
                } else if (selectedTask) {
                  setSelectedTask(null)
                } else if (selectedNote) {
                  setSelectedNote(null)
                } else if (selectedMeeting) {
                  setSelectedMeeting(null)
                } else if (selectedEmail) {
                  setSelectedEmail(null)
                } else {
                  const openElement = document.querySelector('[data-state="open"]')
                  if (openElement && "click" in openElement) {
                    ;(openElement as HTMLElement).click()
                  }
                }
              }}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Badge variant="outline" className="bg-background">
              {selectedSubtask
                ? "Subtask"
                : selectedTask
                  ? selectedTask.parentTask ? "Subtask" : "Task"
                  : selectedNote
                    ? "Note"
                    : selectedMeeting
                      ? "Meeting"
                      : selectedEmail
                        ? "Email"
                        : recordType}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setIsFullScreen(true)}>
              <ExpandIcon className="h-4 w-4" />
            </Button>
            {customActions.map((action, index) => (
              <React.Fragment key={index}>{action}</React.Fragment>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Record Header */}
          {!selectedTask && !selectedNote && !selectedMeeting && !selectedEmail && !selectedSubtask && (
            <div className="border-b bg-background px-6 py-2">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  {title.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{title}</h2>
                  {/* Subtitle removed per design update */}
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          {!selectedTask && !selectedNote && !selectedMeeting && !selectedEmail && (
            <div className="border-b bg-background px-6">
              <div className="flex relative">
                <div className="flex flex-1 overflow-x-auto scrollbar-none">
                  {filteredTabs.map((tab, index) => (
                    <button
                      key={tab.id}
                      data-tab-button
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative whitespace-nowrap py-3 px-3 text-sm font-medium flex items-center gap-1 flex-shrink-0 ${
                        activeTab === tab.id
                          ? "border-b-2 border-primary text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      } ${index === 0 ? 'pl-0' : ''}`}
                    >
                      {tab.icon && <tab.icon className="h-4 w-4 flex-shrink-0" />}
                      <span>{tab.label}</span>
                      {tab.count !== null && (
                        <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                          {tab.count}
                        </Badge>
                      )}
                      {activeTab === tab.id && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"></span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab Content */}
          <div className={selectedTask || selectedNote || selectedEmail || selectedMeeting ? "flex-1" : ""}>
            {!selectedTask && !selectedNote && !selectedEmail && !selectedMeeting && activeTab !== "details" && (
              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    {filteredTabs.find((tab) => tab.id === activeTab)?.label}
                  </h3>
                  <div className="flex items-center gap-2">
                    {shouldShowViewSelector && <ViewModeSelector viewMode={viewMode} onViewModeChange={setViewMode} />}
                    {activeTab !== "activity" && activeTab !== "details" && (
                      <Button variant="outline" size="sm">
                        <PlusIcon className="h-4 w-4" />
                        Add {activeTab === "team" ? "person" : activeTab.slice(0, -1)}
                      </Button>
                    )}
                  </div>
                </div>
                {renderTabContent(activeTab, viewMode, false)}
              </div>
            )}
            {!selectedTask && !selectedNote && !selectedEmail && !selectedMeeting && activeTab === "details" && (
              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Details</h3>
                  <div className="flex items-center gap-2">
                    {/* No actions for details tab */}
                  </div>
                </div>
                <div className="-mx-6">
                  {renderTabContent(activeTab, viewMode, false)}
                </div>
              </div>
            )}
            {(selectedTask || selectedNote || selectedEmail || selectedMeeting) && renderTabContent(activeTab, viewMode, false)}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
