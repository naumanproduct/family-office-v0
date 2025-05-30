"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import {
  ChevronLeftIcon,
  ExpandIcon,
  LayoutGridIcon,
  ListIcon,
  TableIcon,
  PlusIcon,
  XIcon,
  MailIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { TaskDetailsView } from "./task-details-view"
import { NoteDetailsView } from "./note-details-view"
import { MeetingDetailsView } from "./meeting-details-view"
import { EmailDetailsView } from "./email-details-view"

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

  React.useEffect(() => {
    if (isFullScreen && activeTab !== "activity") {
      setActiveTab("activity")
    } else if (!isFullScreen && activeTab === "activity") {
      setActiveTab("details")
    }
  }, [isFullScreen])

  const ViewModeSelector = () => {
    if (activeTab === "activity" || activeTab === "details") return null

    return (
      <div className="flex items-center gap-1 rounded-lg border p-1">
        <Button
          variant={viewMode === "card" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setViewMode("card")}
          className="h-7 px-2"
        >
          <LayoutGridIcon className="h-3 w-3" />
        </Button>
        <Button
          variant={viewMode === "list" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setViewMode("list")}
          className="h-7 px-2"
        >
          <ListIcon className="h-3 w-3" />
        </Button>
        <Button
          variant={viewMode === "table" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setViewMode("table")}
          className="h-7 px-2"
        >
          <TableIcon className="h-3 w-3" />
        </Button>
      </div>
    )
  }

  const renderTabContent = (activeTab: string, viewMode: "card" | "list" | "table") => {
    if (activeTab === "details") {
      return detailsPanel(false)
    }

    // Handle task details view
    if (activeTab === "tasks" && selectedTask) {
      return <TaskDetailsView task={selectedTask} onBack={() => setSelectedTask(null)} recordName={title} />
    }

    // Handle note details view
    if (activeTab === "notes" && selectedNote) {
      return <NoteDetailsView note={selectedNote} onBack={() => setSelectedNote(null)} />
    }

    // Handle meeting details view
    if (activeTab === "meetings" && selectedMeeting) {
      return <MeetingDetailsView meeting={selectedMeeting} onBack={() => setSelectedMeeting(null)} />
    }

    // Handle email details view
    if (activeTab === "emails" && selectedEmail) {
      return <EmailDetailsView email={selectedEmail} onBack={() => setSelectedEmail(null)} />
    }

    // For other tabs, return the children with the setSelectedTask and setSelectedNote callbacks
    return children(activeTab, viewMode, setSelectedTask, setSelectedNote, setSelectedMeeting, setSelectedEmail)
  }

  const FullScreenContent = () => {
    const content = (
      <div className="fixed inset-0 z-[9999] bg-background">
        {/* Full Screen Header */}
        <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
          <div className="flex items-center gap-3">
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
            {customActions.map((action, index) => (
              <React.Fragment key={index}>{action}</React.Fragment>
            ))}
            {onComposeEmail && (
              <Button variant="outline" size="sm" onClick={onComposeEmail}>
                <MailIcon className="h-4 w-4" />
                Compose email
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => setIsFullScreen(false)}>
              <XIcon className="h-4 w-4" />
              Close
            </Button>
          </div>
        </div>

        {/* Full Screen Content - Two Column Layout */}
        <div className="flex h-[calc(100vh-73px)]">
          {/* Left Panel - Details (Persistent) */}
          <div className="w-96 border-r bg-background">{detailsPanel(true)}</div>

          {/* Right Panel - Main Content */}
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
            <div className={selectedTask || selectedNote ? "flex-1" : "p-6"}>
              {!selectedTask && !selectedNote && (
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{tabs.find((tab) => tab.id === activeTab)?.label}</h3>
                  <div className="flex items-center gap-2">
                    <ViewModeSelector />
                    {activeTab !== "activity" && activeTab !== "company" && activeTab !== "details" && (
                      <Button variant="outline" size="sm">
                        <PlusIcon className="h-4 w-4" />
                        Add {activeTab === "team" ? "member" : activeTab.slice(0, -1)}
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
              {renderTabContent(activeTab, viewMode)}
            </div>
          </div>
        </div>
      </div>
    )

    return typeof document !== "undefined" ? createPortal(content, document.body) : null
  }

  if (isFullScreen) {
    return <FullScreenContent />
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
                  document.querySelector('[data-state="open"]')?.click()
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
            <Button variant="outline" size="sm" onClick={() => setIsFullScreen(true)}>
              <ExpandIcon className="h-4 w-4" />
              Full screen
            </Button>
            {customActions.map((action, index) => (
              <React.Fragment key={index}>{action}</React.Fragment>
            ))}
            {onComposeEmail && (
              <Button variant="outline" size="sm" onClick={onComposeEmail}>
                <MailIcon className="h-4 w-4" />
                Compose email
              </Button>
            )}
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
          <div className={selectedTask || selectedNote ? "flex-1" : "p-6"}>
            {!selectedTask && !selectedNote && (
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">{tabs.find((tab) => tab.id === activeTab)?.label}</h3>
                <div className="flex items-center gap-2">
                  <ViewModeSelector />
                  {activeTab !== "activity" && activeTab !== "company" && activeTab !== "details" && (
                    <Button variant="outline" size="sm">
                      <PlusIcon className="h-4 w-4" />
                      Add {activeTab === "team" ? "member" : activeTab.slice(0, -1)}
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
            {renderTabContent(activeTab, viewMode)}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
