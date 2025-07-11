"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { ChevronLeftIcon, ExpandIcon, PlusIcon, XIcon, ChevronDownIcon, ActivityIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { TaskDetailsView } from "./task-details-view"
import { NoteDetailsView } from "./note-details-view"
import { MeetingDetailsView } from "./meeting-details-view"
import { EmailDetailsView } from "./email-details-view"
import { ViewModeSelector } from "@/components/shared/view-mode-selector"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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

        {/* Task Details Sheet/Drawer in Full Screen Mode */}
        {selectedTask && (
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
                  <Button variant="outline" size="icon">
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

        {/* Note Details Sheet/Drawer in Full Screen Mode */}
        {selectedNote && (
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
                  <Button variant="outline" size="icon">
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

        {/* Meeting Details Sheet/Drawer in Full Screen Mode */}
        {selectedMeeting && (
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
                  <Button variant="outline" size="icon">
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

        {/* Email Details Sheet/Drawer in Full Screen Mode */}
        {selectedEmail && (
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
                  <Button variant="outline" size="icon">
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
