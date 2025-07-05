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
import { DocumentViewer } from "@/components/document-viewer"
import { UnifiedTaskTable } from "@/components/shared/unified-task-table"
import { RecordFullscreenView } from "@/components/shared/record-fullscreen-view"

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
    setDocumentViewerFile?: (file: any) => void,
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
  const [activeTab, setActiveTab] = React.useState(tabs[0].id)
  const [viewMode, setViewMode] = React.useState<"card" | "list" | "table">("list")
  const [isFullScreen, setIsFullScreen] = React.useState(false)
  const [selectedTask, setSelectedTask] = React.useState<any>(null)
  const [selectedNote, setSelectedNote] = React.useState<any>(null)
  const [selectedMeeting, setSelectedMeeting] = React.useState<any>(null)
  const [selectedEmail, setSelectedEmail] = React.useState<any>(null)
  const [localActiveTab, setLocalActiveTab] = React.useState("activity")
  const [tasksViewMode, setTasksViewMode] = React.useState<"card" | "list" | "table">("table")
  const [filesViewMode, setFilesViewMode] = React.useState<"card" | "list" | "table">("table")
  const [expandedEmails, setExpandedEmails] = React.useState<Set<string>>(new Set())
  const [isReplying, setIsReplying] = React.useState(false)
  const [replyText, setReplyText] = React.useState("")
  const [selectedSubtask, setSelectedSubtask] = React.useState<any>(null)
  const [parentTaskForSubtask, setParentTaskForSubtask] = React.useState<any>(null)
  
  // Add state for document viewer
  const [documentViewerFile, setDocumentViewerFile] = React.useState<any>(null)
  
  // State for individual record fullscreen
  const [recordFullscreen, setRecordFullscreen] = React.useState<{
    type: 'Task' | 'Note' | 'Meeting' | 'Email' | null
    record: any
    parentContext: 'drawer' | 'entity-fullscreen'
  }>({ type: null, record: null, parentContext: 'drawer' })

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
    
    // Additional tabs based on record type
    if (recordType === "Task") {
      baseTabs.push({ id: "tasks", label: "Subtasks", icon: CheckCircleIcon, count: null }) // Moved to 2nd position after Activity
      baseTabs.push({ id: "notes", label: "Notes", icon: FileTextIcon, count: null })
      baseTabs.push({ id: "files", label: "Files", icon: FileIcon, count: null })
    } else if (recordType === "Note") {
      baseTabs.push({ id: "notes", label: "Notes", icon: FileTextIcon, count: null }) // For editing the note
      baseTabs.push({ id: "files", label: "Files", icon: FileIcon, count: null })
      baseTabs.push({ id: "tasks", label: "Tasks", icon: CheckCircleIcon, count: null })
    } else if (recordType === "Meeting") {
      baseTabs.push({ id: "notes", label: "Notes", icon: FileTextIcon, count: null })
      baseTabs.push({ id: "files", label: "Files", icon: FileIcon, count: null })
      baseTabs.push({ id: "tasks", label: "Tasks", icon: CheckCircleIcon, count: null })
    } else if (recordType === "Email") {
      baseTabs.push({ id: "threads", label: "Email Threads", icon: MessageSquareIcon, count: null }) // Email threads moved to tab
      baseTabs.push({ id: "notes", label: "Notes", icon: FileTextIcon, count: null })
      baseTabs.push({ id: "files", label: "Files", icon: FileIcon, count: null })
      baseTabs.push({ id: "tasks", label: "Tasks", icon: CheckCircleIcon, count: null })
    }
    
    return baseTabs
  }, [tabs, shouldAddActivityTab, recordType])

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
          setDocumentViewerFile={setDocumentViewerFile}
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
          setDocumentViewerFile={setDocumentViewerFile}
          onSubtaskClick={(subtask) => {
            setSelectedSubtask(subtask)
            setParentTaskForSubtask(selectedTask)
          }}
        />
      )
    }

    // Handle note details view (only in non-fullscreen mode)
    if (activeTab === "notes" && selectedNote && !isFullScreen) {
      return <NoteDetailsView note={selectedNote} onBack={() => setSelectedNote(null)} setDocumentViewerFile={setDocumentViewerFile} />
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
    return children(activeTab, viewMode, setSelectedTask, setSelectedNote, setSelectedMeeting, setSelectedEmail, setDocumentViewerFile)
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

  const FullScreenContent = () => {
    const headerInfo = getHeaderInfo()
    
    // Local state for selected items in fullscreen mode
    const [fullscreenSelectedTask, setFullscreenSelectedTask] = React.useState<any>(null)
    const [fullscreenSelectedNote, setFullscreenSelectedNote] = React.useState<any>(null)
    const [fullscreenSelectedMeeting, setFullscreenSelectedMeeting] = React.useState<any>(null)
    const [fullscreenSelectedEmail, setFullscreenSelectedEmail] = React.useState<any>(null)
    const [fullscreenSelectedSubtask, setFullscreenSelectedSubtask] = React.useState<any>(null)
    const [fullscreenParentTaskForSubtask, setFullscreenParentTaskForSubtask] = React.useState<any>(null)

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
                    {activeTab !== "activity" && activeTab !== "details" && activeTab !== "external-data" && (
                      <Button variant="outline" size="sm">
                        <PlusIcon className="h-4 w-4" />
                        Add {activeTab === "team" ? "person" : activeTab.slice(0, -1)}
                      </Button>
                    )}
                  </div>
                </div>
                {(() => {
                  // Special handling for fullscreen mode - pass fullscreen-specific setters
                  if (activeTab === "details") {
                    return detailsPanel(true)
                  }

                  // Handle activity tab in full screen mode
                  if (activeTab === "activity" && shouldAddActivityTab) {
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

                  // For other tabs, pass fullscreen-specific setters
                  return children(activeTab, viewMode, setFullscreenSelectedTask, setFullscreenSelectedNote, setFullscreenSelectedMeeting, setFullscreenSelectedEmail, setDocumentViewerFile)
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Task Details Sheet in Full Screen Mode */}
        {fullscreenSelectedTask && (
          <Sheet open={!!fullscreenSelectedTask} onOpenChange={(open) => !open && setFullscreenSelectedTask(null)}>
            <SheetContent
              side="right"
              className="flex w-full max-w-[30vw] flex-col p-0 sm:max-w-[30vw] [&>button]:hidden z-[10000] overflow-hidden"
            >
              <SheetTitle className="sr-only">Task Details</SheetTitle>
              {/* Header */}
              <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" onClick={() => {
                    if (fullscreenSelectedSubtask) {
                      setFullscreenSelectedSubtask(null)
                      setFullscreenSelectedTask(fullscreenParentTaskForSubtask)
                      setFullscreenParentTaskForSubtask(null)
                    } else {
                      setFullscreenSelectedTask(null)
                    }
                  }}>
                    <ChevronLeftIcon className="h-4 w-4" />
                  </Button>
                  <Badge variant="outline" className="bg-background">
                    {fullscreenSelectedSubtask ? "Subtask" : "Task"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setRecordFullscreen({
                        type: 'Task',
                        record: fullscreenSelectedTask,
                        parentContext: 'entity-fullscreen'
                      })
                    }}
                  >
                    <ExpandIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {/* Task Details Content */}
              <div className="flex-1 overflow-auto">
                <TaskDetailsView
                  task={fullscreenSelectedTask}
                  onBack={() => setFullscreenSelectedTask(null)}
                  recordName={title}
                  recordType={recordType}
                  isInDrawer={true}
                  setDocumentViewerFile={setDocumentViewerFile}
                  onSubtaskClick={(subtask) => {
                    setFullscreenSelectedSubtask(subtask)
                    setFullscreenParentTaskForSubtask(fullscreenSelectedTask)
                  }}
                />
              </div>
            </SheetContent>
          </Sheet>
        )}

        {/* Note Details Sheet in Full Screen Mode */}
        {fullscreenSelectedNote && (
          <Sheet open={!!fullscreenSelectedNote} onOpenChange={(open) => !open && setFullscreenSelectedNote(null)}>
            <SheetContent
              side="right"
              className="flex w-full max-w-[30vw] flex-col p-0 sm:max-w-[30vw] [&>button]:hidden z-[10000] overflow-hidden"
            >
              <SheetTitle className="sr-only">Note Details</SheetTitle>
              {/* Header */}
              <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" onClick={() => setFullscreenSelectedNote(null)}>
                    <ChevronLeftIcon className="h-4 w-4" />
                  </Button>
                  <Badge variant="outline" className="bg-background">
                    Note
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setRecordFullscreen({
                        type: 'Note',
                        record: fullscreenSelectedNote,
                        parentContext: 'entity-fullscreen'
                      })
                    }}
                  >
                    <ExpandIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {/* Note Details Content */}
              <div className="flex-1 overflow-auto">
                <NoteDetailsView note={fullscreenSelectedNote} onBack={() => setFullscreenSelectedNote(null)} setDocumentViewerFile={setDocumentViewerFile} />
              </div>
            </SheetContent>
          </Sheet>
        )}

        {/* Meeting Details Sheet in Full Screen Mode */}
        {fullscreenSelectedMeeting && (
          <Sheet open={!!fullscreenSelectedMeeting} onOpenChange={(open) => !open && setFullscreenSelectedMeeting(null)}>
            <SheetContent
              side="right"
              className="flex w-full max-w-[30vw] flex-col p-0 sm:max-w-[30vw] [&>button]:hidden z-[10000] overflow-hidden"
            >
              <SheetTitle className="sr-only">Meeting Details</SheetTitle>
              {/* Header */}
              <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" onClick={() => setFullscreenSelectedMeeting(null)}>
                    <ChevronLeftIcon className="h-4 w-4" />
                  </Button>
                  <Badge variant="outline" className="bg-background">
                    Meeting
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setRecordFullscreen({
                        type: 'Meeting',
                        record: fullscreenSelectedMeeting,
                        parentContext: 'entity-fullscreen'
                      })
                    }}
                  >
                    <ExpandIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {/* Meeting Details Content */}
              <div className="flex-1 overflow-auto">
                <MeetingDetailsView meeting={fullscreenSelectedMeeting} onBack={() => setFullscreenSelectedMeeting(null)} />
              </div>
            </SheetContent>
          </Sheet>
        )}

        {/* Email Details Sheet in Full Screen Mode */}
        {fullscreenSelectedEmail && (
          <Sheet open={!!fullscreenSelectedEmail} onOpenChange={(open) => !open && setFullscreenSelectedEmail(null)}>
            <SheetContent
              side="right"
              className="flex w-full max-w-[30vw] flex-col p-0 sm:max-w-[30vw] [&>button]:hidden z-[10000] overflow-hidden"
            >
              <SheetTitle className="sr-only">Email Details</SheetTitle>
              {/* Header */}
              <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" onClick={() => setFullscreenSelectedEmail(null)}>
                    <ChevronLeftIcon className="h-4 w-4" />
                  </Button>
                  <Badge variant="outline" className="bg-background">
                    Email
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setRecordFullscreen({
                        type: 'Email',
                        record: fullscreenSelectedEmail,
                        parentContext: 'entity-fullscreen'
                      })
                    }}
                  >
                    <ExpandIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {/* Email Details Content */}
              <div className="flex-1 overflow-auto">
                <EmailDetailsView email={fullscreenSelectedEmail} onBack={() => setFullscreenSelectedEmail(null)} />
              </div>
            </SheetContent>
          </Sheet>
        )}

        {/* Subtask Details Sheet in Full Screen Mode */}
        {fullscreenSelectedSubtask && (
          <Sheet open={!!fullscreenSelectedSubtask} onOpenChange={(open) => !open && setFullscreenSelectedSubtask(null)}>
            <SheetContent
              side="right"
              className="flex w-full max-w-[30vw] flex-col p-0 sm:max-w-[30vw] [&>button]:hidden z-[10001] overflow-hidden"
            >
              <SheetTitle className="sr-only">Subtask Details</SheetTitle>
              {/* Header */}
              <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" onClick={() => {
                    setFullscreenSelectedSubtask(null)
                    // Don't clear parent task - let user return to it
                  }}>
                    <ChevronLeftIcon className="h-4 w-4" />
                  </Button>
                  <Badge variant="outline" className="bg-background">
                    Subtask
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  {/* Subtasks don't need individual fullscreen */}
                </div>
              </div>
              {/* Subtask Details Content */}
              <div className="flex-1 overflow-auto">
                <TaskDetailsView 
                  task={fullscreenSelectedSubtask} 
                  onBack={() => {
                    setFullscreenSelectedSubtask(null)
                  }}
                  recordName={title} 
                  recordType={recordType}
                  parentTask={fullscreenParentTaskForSubtask}
                  onBackToParent={() => {
                    setFullscreenSelectedSubtask(null)
                    setFullscreenSelectedTask(fullscreenParentTaskForSubtask)
                    setFullscreenParentTaskForSubtask(null)
                  }}
                  isInDrawer={true}
                  setDocumentViewerFile={setDocumentViewerFile}
                />
              </div>
            </SheetContent>
          </Sheet>
        )}

      </>
    )

    // Handle record fullscreen from entity fullscreen
    if (recordFullscreen.type && recordFullscreen.record && recordFullscreen.parentContext === 'entity-fullscreen') {
      return (
        <RecordFullscreenView
          recordType={recordFullscreen.type}
          record={recordFullscreen.record}
          parentContext={recordFullscreen.parentContext}
          parentTitle={title}
          parentRecordType={recordType}
          onClose={() => {
            setRecordFullscreen({ type: null, record: null, parentContext: 'drawer' })
            // Clear fullscreen states
            setFullscreenSelectedTask(null)
            setFullscreenSelectedNote(null)
            setFullscreenSelectedMeeting(null)
            setFullscreenSelectedEmail(null)
            setFullscreenSelectedSubtask(null)
            setFullscreenParentTaskForSubtask(null)
          }}
          activityContent={activityContent}
        />
      )
    }

    return typeof document !== "undefined" ? createPortal(content, document.body) : null
  }

  // We will use this conditional check for both instances of ViewModeSelector
  const shouldShowViewSelector = !(activeTab === "activity" || activeTab === "details" || activeTab === "external-data")

  // Show record fullscreen if requested
  if (recordFullscreen.type && recordFullscreen.record) {
    return (
      <RecordFullscreenView
        recordType={recordFullscreen.type}
        record={recordFullscreen.record}
        parentContext={recordFullscreen.parentContext}
        parentTitle={title}
        parentRecordType={recordType}
        onClose={() => {
          setRecordFullscreen({ type: null, record: null, parentContext: 'drawer' })
          // Clear drawer states when closing record fullscreen
          if (recordFullscreen.parentContext === 'drawer') {
            setSelectedTask(null)
            setSelectedNote(null)
            setSelectedMeeting(null)
            setSelectedEmail(null)
            setSelectedSubtask(null)
            setParentTaskForSubtask(null)
          }
        }}
        activityContent={activityContent}
      />
    )
  }

  // Only show entity full screen
  if (isFullScreen) {
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
            {/* Fullscreen button for all records */}
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => {
                if (selectedTask) {
                  setRecordFullscreen({
                    type: 'Task',
                    record: selectedTask,
                    parentContext: 'drawer'
                  })
                } else if (selectedNote) {
                  setRecordFullscreen({
                    type: 'Note',
                    record: selectedNote,
                    parentContext: 'drawer'
                  })
                } else if (selectedMeeting) {
                  setRecordFullscreen({
                    type: 'Meeting',
                    record: selectedMeeting,
                    parentContext: 'drawer'
                  })
                } else if (selectedEmail) {
                  setRecordFullscreen({
                    type: 'Email',
                    record: selectedEmail,
                    parentContext: 'drawer'
                  })
                } else {
                  // Main record fullscreen
                  setIsFullScreen(true)
                }
              }}
            >
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
                    {activeTab !== "activity" && activeTab !== "details" && activeTab !== "external-data" && (
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
      
      {/* Document Viewer - Always rendered, visibility controlled by the file state */}
      {documentViewerFile && (
        <DocumentViewer
          isOpen={!!documentViewerFile}
          onOpenChange={(open) => {
            if (!open) {
              setDocumentViewerFile(null)
            }
          }}
          file={documentViewerFile}
          startInFullScreen={true}
        />
      )}
      

    </Sheet>
  )
}
