"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { ChevronLeftIcon, ExpandIcon, PlusIcon, XIcon } from "lucide-react"
import { MessageSquareIcon, FolderIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { TaskDetailsView } from "./task-details-view"
import { NoteDetailsView } from "./note-details-view"
import { MeetingDetailsView } from "./meeting-details-view"
import { EmailDetailsView } from "./email-details-view"
import { ViewModeSelector } from "@/components/shared/view-mode-selector"
import { NoteContent } from "@/components/shared/note-content"
import { FileContent } from "@/components/shared/file-content"

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
}: MasterDrawerProps) {
  const [isFullScreen, setIsFullScreen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState(isFullScreen ? "activity" : "details")
  const [viewMode, setViewMode] = React.useState<"card" | "list" | "table">("list")
  const [selectedTask, setSelectedTask] = React.useState<any>(null)
  const [selectedNote, setSelectedNote] = React.useState<any>(null)
  const [selectedMeeting, setSelectedMeeting] = React.useState<any>(null)
  const [selectedEmail, setSelectedEmail] = React.useState<any>(null)
  const [isRecordFullScreen, setIsRecordFullScreen] = React.useState(false)
  const [previousActiveTab, setPreviousActiveTab] = React.useState<string>("details")

  // ESC key handler for full screen mode
  React.useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isRecordFullScreen) {
          setIsRecordFullScreen(false)
        } else if (isFullScreen) {
          setIsFullScreen(false)
        }
      }
    }

    if (isFullScreen || isRecordFullScreen) {
      document.addEventListener("keydown", handleEscKey)
      return () => {
        document.removeEventListener("keydown", handleEscKey)
      }
    }
  }, [isFullScreen, isRecordFullScreen])

  React.useEffect(() => {
    // When switching to full screen mode, ensure we're not showing the "details" tab
    // which is redundant with the left panel
    if (isFullScreen && activeTab === "details") {
      // Find the first non-details tab to display instead
      const firstNonDetailsTab = tabs.find(tab => tab.id !== "details")
      if (firstNonDetailsTab) {
        setActiveTab(firstNonDetailsTab.id)
      } else {
        // Fallback if there's somehow no other tab
        setActiveTab("activity")
      }
    }
  }, [isFullScreen, activeTab, tabs])

  const renderTabContent = (activeTab: string, viewMode: "card" | "list" | "table", isCurrentFullScreen = false) => {
    if (activeTab === "details") {
      return detailsPanel(isCurrentFullScreen)
    }

    // Handle task details view (only in non-fullscreen mode)
    if (activeTab === "tasks" && selectedTask && !isFullScreen) {
      return <TaskDetailsView task={selectedTask} onBack={() => setSelectedTask(null)} recordName={title} />
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
    if (selectedTask) {
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
    if (selectedTask) {
      setSelectedTask(null)
    } else if (selectedNote) {
      setSelectedNote(null)
    } else if (selectedMeeting) {
      setSelectedMeeting(null)
    } else if (selectedEmail) {
      setSelectedEmail(null)
    }
  }

  // Handle entering full screen mode for a record
  const handleRecordFullScreen = (recordType: string) => {
    setPreviousActiveTab(activeTab);
    setIsRecordFullScreen(true);
  };

  // Record FullScreen Component
  const RecordFullScreenContent = () => {
    const headerInfo = getHeaderInfo();
    
    const content = (
      <div className="fixed inset-0 z-[99999] bg-background">
        {/* Full Screen Header */}
        <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (isRecordFullScreen) {
                  setIsRecordFullScreen(false);
                  setActiveTab(previousActiveTab);
                } else {
                  setIsFullScreen(false);
                  // Clear any selected items when exiting fullscreen
                  setSelectedTask(null);
                  setSelectedNote(null);
                  setSelectedMeeting(null);
                  setSelectedEmail(null);
                }
              }}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Badge variant="outline" className="bg-background">
              {isRecordFullScreen
                ? (selectedTask
                   ? "Task"
                   : selectedNote
                   ? "Note"
                   : selectedMeeting
                   ? "Meeting"
                   : selectedEmail
                   ? "Email"
                   : "Record")
                : recordType}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {!isRecordFullScreen && customActions.map((action, index) => (
              <React.Fragment key={index}>{action}</React.Fragment>
            ))}
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                if (isRecordFullScreen) {
                  setIsRecordFullScreen(false);
                  setActiveTab(previousActiveTab);
                } else {
                  setIsFullScreen(false);
                  // Clear any selected items when exiting fullscreen
                  setSelectedTask(null);
                  setSelectedNote(null);
                  setSelectedMeeting(null);
                  setSelectedEmail(null);
                }
              }}
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Full Screen Content - Two Column Layout */}
        <div className="flex h-[calc(100vh-73px)]">
          {/* Left Panel - Details (Persistent) */}
          <div className="w-96 border-r bg-background">
            {/* Record Header */}
            <div className="border-b bg-background px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  {isRecordFullScreen
                    ? (selectedTask
                      ? "T"
                      : selectedNote
                      ? "N"
                      : selectedMeeting
                      ? "M"
                      : selectedEmail
                      ? "E"
                      : "R")
                    : headerInfo.firstLetter}
                </div>
                <div>
                  <h2 className="text-lg font-semibold">
                    {isRecordFullScreen
                      ? (selectedTask?.title || 
                         selectedNote?.title || 
                         selectedMeeting?.title || 
                         selectedEmail?.subject || 
                         "Record Details")
                      : headerInfo.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {isRecordFullScreen
                      ? (selectedTask
                         ? `Task in ${title}`
                         : selectedNote
                         ? `Note in ${title}`
                         : selectedMeeting
                         ? `Meeting in ${title}`
                         : selectedEmail
                         ? `Email in ${title}`
                         : "Record Details")
                      : headerInfo.subtitle}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Details Panel Content */}
            {isRecordFullScreen ? (
              <div className="px-6 pt-4 pb-6">
                {selectedTask && (
                  <TaskDetailsView 
                    task={selectedTask} 
                    onBack={() => {}} 
                    recordName={title}
                    isInDrawer={false}
                  />
                )}
                {selectedNote && (
                  <NoteDetailsView 
                    note={selectedNote} 
                    onBack={() => {}}
                  />
                )}
                {selectedMeeting && (
                  <MeetingDetailsView 
                    meeting={selectedMeeting} 
                    onBack={() => {}}
                  />
                )}
                {selectedEmail && (
                  <EmailDetailsView 
                    email={selectedEmail} 
                    onBack={() => {}}
                  />
                )}
              </div>
            ) : (
              detailsPanel(true)
            )}
          </div>

          {/* Right Panel - Tab Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Tabs */}
            <div className="border-b bg-background px-6">
              <div className="flex gap-8 overflow-x-auto">
                {isRecordFullScreen ? (
                  /* Record Full Screen Tabs */
                  <>
                    {selectedTask && [
                      { id: "notes", label: "Notes", icon: MessageSquareIcon },
                      { id: "files", label: "Files", icon: FolderIcon }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative whitespace-nowrap py-3 text-sm font-medium flex items-center gap-2 ${
                          activeTab === tab.id
                            ? "border-b-2 border-primary text-primary"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {tab.icon && <tab.icon className="h-4 w-4" />}
                        {tab.label}
                        {activeTab === tab.id && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"></span>}
                      </button>
                    ))}
                    
                    {selectedNote && [
                      { id: "files", label: "Files", icon: FolderIcon }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative whitespace-nowrap py-3 text-sm font-medium flex items-center gap-2 ${
                          activeTab === tab.id
                            ? "border-b-2 border-primary text-primary"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {tab.icon && <tab.icon className="h-4 w-4" />}
                        {tab.label}
                        {activeTab === tab.id && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"></span>}
                      </button>
                    ))}
                    
                    {selectedMeeting && [
                      { id: "notes", label: "Notes", icon: MessageSquareIcon },
                      { id: "files", label: "Files", icon: FolderIcon }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative whitespace-nowrap py-3 text-sm font-medium flex items-center gap-2 ${
                          activeTab === tab.id
                            ? "border-b-2 border-primary text-primary"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {tab.icon && <tab.icon className="h-4 w-4" />}
                        {tab.label}
                        {activeTab === tab.id && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"></span>}
                      </button>
                    ))}
                    
                    {selectedEmail && [
                      { id: "files", label: "Files", icon: FolderIcon }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative whitespace-nowrap py-3 text-sm font-medium flex items-center gap-2 ${
                          activeTab === tab.id
                            ? "border-b-2 border-primary text-primary"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {tab.icon && <tab.icon className="h-4 w-4" />}
                        {tab.label}
                        {activeTab === tab.id && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"></span>}
                      </button>
                    ))}
                  </>
                ) : (
                  /* Regular Full Screen Tabs */
                  tabs
                    .filter(tab => tab.id !== "details") // Filter out the Details tab in full screen mode
                    .map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative whitespace-nowrap py-3 text-sm font-medium flex items-center gap-2 ${
                        activeTab === tab.id
                          ? "border-b-2 border-primary text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tab.icon && <tab.icon className="h-4 w-4" />}
                      {tab.label}
                      {tab.count !== null && (
                        <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                          {tab.count}
                        </Badge>
                      )}
                      {activeTab === tab.id && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"></span>}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {isRecordFullScreen ? (
                /* Record Full Screen Tab Content */
                <>
                  {selectedTask && activeTab === "notes" && <NoteContent title={`Notes for Task: ${selectedTask.title}`} />}
                  {selectedTask && activeTab === "files" && <FileContent title={`Files for Task: ${selectedTask.title}`} />}
                  
                  {selectedNote && activeTab === "files" && <FileContent title={`Files for Note: ${selectedNote.title}`} />}
                  
                  {selectedMeeting && activeTab === "notes" && <NoteContent title={`Notes for Meeting: ${selectedMeeting.title}`} />}
                  {selectedMeeting && activeTab === "files" && <FileContent title={`Files for Meeting: ${selectedMeeting.title}`} />}
                  
                  {selectedEmail && activeTab === "files" && <FileContent title={`Files for Email: ${selectedEmail.subject}`} />}
                </>
              ) : (
                /* Regular Full Screen Tab Content */
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{tabs.find((tab) => tab.id === activeTab)?.label}</h3>
                    <div className="flex items-center gap-2">
                      {shouldShowViewSelector && <ViewModeSelector viewMode={viewMode} onViewModeChange={setViewMode} />}
                      {activeTab !== "activity" && activeTab !== "company" && activeTab !== "details" && (
                        <Button variant="outline" size="sm">
                          <PlusIcon className="h-4 w-4" />
                          Add {activeTab === "team" ? "person" : activeTab.slice(0, -1)}
                        </Button>
                      )}
                      {activeTab === "activity" && (
                        <Button variant="outline" size="sm">
                          <PlusIcon className="h-4 w-4" />
                          Add meeting
                        </Button>
                      )}
                    </div>
                  </div>
                  {renderTabContent(activeTab, viewMode, true)}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );

    return typeof document !== "undefined" ? createPortal(content, document.body) : null;
  };

  // We will use this conditional check for both instances of ViewModeSelector
  const shouldShowViewSelector = !(activeTab === "activity" || activeTab === "details")

  if (isFullScreen || isRecordFullScreen) {
    return <RecordFullScreenContent />
  }

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="right" className="flex w-full max-w-4xl flex-col p-0 sm:max-w-4xl [&>button]:hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (selectedTask) {
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
              {selectedTask
                ? "Task"
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
          {!selectedTask && !selectedNote && !selectedMeeting && !selectedEmail && (
            <div className="border-b bg-background px-6 py-2">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  {title.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{title}</h2>
                  {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          {!selectedTask && !selectedNote && !selectedMeeting && !selectedEmail && (
            <div className="border-b bg-background px-6">
              <div className="flex gap-8 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative whitespace-nowrap py-3 text-sm font-medium flex items-center gap-2 ${
                      activeTab === tab.id
                        ? "border-b-2 border-primary text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.icon && <tab.icon className="h-4 w-4" />}
                    {tab.label}
                    {tab.count !== null && (
                      <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                        {tab.count}
                      </Badge>
                    )}
                    {activeTab === tab.id && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"></span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tab Content */}
          <div className={selectedTask || selectedNote || selectedEmail || selectedMeeting ? "flex-1" : "p-6"}>
            {!selectedTask && !selectedNote && !selectedEmail && !selectedMeeting && (
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">{tabs.find((tab) => tab.id === activeTab)?.label}</h3>
                <div className="flex items-center gap-2">
                  {shouldShowViewSelector && <ViewModeSelector viewMode={viewMode} onViewModeChange={setViewMode} />}
                  {activeTab !== "activity" && activeTab !== "company" && activeTab !== "details" && (
                    <Button variant="outline" size="sm">
                      <PlusIcon className="h-4 w-4" />
                      Add {activeTab === "team" ? "person" : activeTab.slice(0, -1)}
                    </Button>
                  )}
                  {activeTab === "activity" && (
                    <Button variant="outline" size="sm">
                      <PlusIcon className="h-4 w-4" />
                      Add meeting
                    </Button>
                  )}
                </div>
              </div>
            )}
            {renderTabContent(activeTab, viewMode, false)}
          </div>
        </div>

        {/* Task Details Sheet/Drawer in Full Screen Mode */}
        {selectedTask && isFullScreen && !isRecordFullScreen && (
          <Sheet open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
            <SheetContent
              side="right"
              className="flex w-full max-w-4xl flex-col p-0 sm:max-w-4xl [&>button]:hidden z-[10000]"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" onClick={handleDrawerBackClick}>
                    <ChevronLeftIcon className="h-4 w-4" />
                  </Button>
                  <Badge variant="outline" className="bg-background">
                    Task
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleRecordFullScreen("Task")}>
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
                  isInDrawer={true}
                />
              </div>
            </SheetContent>
          </Sheet>
        )}

        {/* Note Details Sheet/Drawer in Full Screen Mode */}
        {selectedNote && isFullScreen && !isRecordFullScreen && (
          <Sheet open={!!selectedNote} onOpenChange={(open) => !open && setSelectedNote(null)}>
            <SheetContent
              side="right"
              className="flex w-full max-w-4xl flex-col p-0 sm:max-w-4xl [&>button]:hidden z-[10000]"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" onClick={handleDrawerBackClick}>
                    <ChevronLeftIcon className="h-4 w-4" />
                  </Button>
                  <Badge variant="outline" className="bg-background">
                    Note
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleRecordFullScreen("Note")}>
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
        {selectedMeeting && isFullScreen && !isRecordFullScreen && (
          <Sheet open={!!selectedMeeting} onOpenChange={(open) => !open && setSelectedMeeting(null)}>
            <SheetContent
              side="right"
              className="flex w-full max-w-4xl flex-col p-0 sm:max-w-4xl [&>button]:hidden z-[10000]"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" onClick={handleDrawerBackClick}>
                    <ChevronLeftIcon className="h-4 w-4" />
                  </Button>
                  <Badge variant="outline" className="bg-background">
                    Meeting
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleRecordFullScreen("Meeting")}>
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
        {selectedEmail && isFullScreen && !isRecordFullScreen && (
          <Sheet open={!!selectedEmail} onOpenChange={(open) => !open && setSelectedEmail(null)}>
            <SheetContent
              side="right"
              className="flex w-full max-w-4xl flex-col p-0 sm:max-w-4xl [&>button]:hidden z-[10000]"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" onClick={handleDrawerBackClick}>
                    <ChevronLeftIcon className="h-4 w-4" />
                  </Button>
                  <Badge variant="outline" className="bg-background">
                    Email
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleRecordFullScreen("Email")}>
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
      </SheetContent>
    </Sheet>
  )
}
