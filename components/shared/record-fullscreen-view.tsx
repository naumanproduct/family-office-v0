"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import {
  ChevronLeftIcon,
  XIcon,
  ActivityIcon,
  CheckCircleIcon,
  FileTextIcon,
  CalendarIcon,
  MailIcon,
  FileIcon,
  MessageSquareIcon,
  PlusIcon,
  PaperclipIcon,
  ChevronRight,
  DownloadIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { TaskDetailsView } from "@/components/task-details-view"
import { NoteDetailsView } from "@/components/note-details-view"
import { MeetingDetailsView } from "@/components/meeting-details-view"
import { EmailDetailsView, EmailContent, generateEmailThread } from "@/components/email-details-view"
import { ViewModeSelector } from "@/components/shared/view-mode-selector"
import { TabContentRenderer } from "@/components/shared/tab-content-renderer"
import { UnifiedActivitySection } from "@/components/shared/unified-activity-section"
import { generateWorkflowActivities } from "@/components/shared/activity-generators"
import { TypableArea } from "@/components/typable-area"
import { DocumentViewer } from "@/components/document-viewer"
import { Separator } from "@/components/ui/separator"

interface RecordFullscreenViewProps {
  recordType: 'Task' | 'Note' | 'Meeting' | 'Email'
  record: any
  parentContext: 'drawer' | 'entity-fullscreen'
  parentTitle?: string
  parentRecordType?: string
  onClose: () => void
  activityContent?: React.ReactNode
}

interface Tab {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  count?: number | null
}

export function RecordFullscreenView({
  recordType,
  record,
  parentContext,
  parentTitle,
  parentRecordType,
  onClose,
  activityContent,
}: RecordFullscreenViewProps) {
  // State management
  const [activeTab, setActiveTab] = React.useState("activity")
  const [tasksViewMode, setTasksViewMode] = React.useState<"card" | "list" | "table">("table")
  const [filesViewMode, setFilesViewMode] = React.useState<"card" | "list" | "table">("table")
  const [notesViewMode, setNotesViewMode] = React.useState<"card" | "list" | "table">("table")
  
  // Add state for nested record navigation
  const [nestedRecord, setNestedRecord] = React.useState<{
    type: 'Task' | 'Note' | 'Meeting' | 'Email' | null
    record: any
  }>({ type: null, record: null })
  
  // Add state for document viewer
  const [documentViewerFile, setDocumentViewerFile] = React.useState<any>(null)
  
  // Add state for expanded emails
  const [expandedEmails, setExpandedEmails] = React.useState<Set<string>>(new Set())
  
  // ESC key handler
  React.useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscKey)
    return () => {
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [onClose])

  // Lock body scroll
  React.useEffect(() => {
    const scrollY = window.scrollY
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
    document.body.style.overflow = 'hidden'
    
    return () => {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.overflow = ''
      window.scrollTo(0, scrollY)
    }
  }, [])

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
  
  // Define tabs based on record type
  const recordTabs = React.useMemo(() => {
    const baseTabs: Tab[] = []
    
    // Activity tab for all record types (first)
    baseTabs.push({ id: "activity", label: "Activity", icon: ActivityIcon })
    
    // Additional tabs based on record type
    if (recordType === "Task") {
      baseTabs.push({ id: "tasks", label: "Subtasks", icon: CheckCircleIcon, count: null })
      baseTabs.push({ id: "notes", label: "Notes", icon: FileTextIcon, count: null })
      baseTabs.push({ id: "files", label: "Files", icon: FileIcon, count: null })
    } else if (recordType === "Note") {
      baseTabs.push({ id: "notes", label: "Notes", icon: FileTextIcon, count: null })
      baseTabs.push({ id: "files", label: "Files", icon: FileIcon, count: null })
      baseTabs.push({ id: "tasks", label: "Tasks", icon: CheckCircleIcon, count: null })
    } else if (recordType === "Meeting") {
      baseTabs.push({ id: "notes", label: "Notes", icon: FileTextIcon, count: null })
      baseTabs.push({ id: "files", label: "Files", icon: FileIcon, count: null })
      baseTabs.push({ id: "tasks", label: "Tasks", icon: CheckCircleIcon, count: null })
      baseTabs.push({ id: "emails", label: "Emails", icon: MailIcon, count: null })
    } else if (recordType === "Email") {
      baseTabs.push({ id: "threads", label: "Email Threads", icon: MessageSquareIcon, count: null })
      baseTabs.push({ id: "notes", label: "Notes", icon: FileTextIcon, count: null })
      baseTabs.push({ id: "files", label: "Files", icon: FileIcon, count: null })
      baseTabs.push({ id: "tasks", label: "Tasks", icon: CheckCircleIcon, count: null })
    }
    
    return baseTabs
  }, [recordType])
  
  // Mock data - in real app this would come from props or API
  const getMockData = (tabId: string) => {
    switch (tabId) {
      case 'tasks':
        return [
          {
            id: 1,
            title: `Review ${recordType.toLowerCase()} content for accuracy`,
            status: "In Progress",
            priority: "High",
            assignee: "John Smith",
            dueDate: "2023-06-15",
          },
          {
            id: 2,
            title: `Follow up on action items from ${recordType.toLowerCase()}`,
            status: "To Do",
            priority: "Medium",
            assignee: "Sarah Johnson",
            dueDate: "2023-06-20",
          },
        ]
      case 'notes':
        return [
          {
            id: 1,
            title: "Initial assessment",
            content: "Requires careful review of all documentation...",
            author: "John Smith",
            createdAt: "2024-01-18",
            tags: ["review", "priority"]
          },
          {
            id: 2,
            title: "Progress update",
            content: "Completed initial review phase...",
            author: "Sarah Johnson",
            createdAt: "2024-01-19",
            tags: ["update", "progress"]
          },
        ]
      case 'emails':
        return [
          {
            id: 1,
            subject: "Meeting follow-up",
            from: "john@example.com",
            date: "2024-01-20",
            preview: "Thanks for the meeting today. Here are the action items...",
          },
          {
            id: 2,
            subject: "Document review request",
            from: "sarah@example.com", 
            date: "2024-01-19",
            preview: "Please review the attached documents and provide feedback...",
          },
        ]
      case 'meetings':
        return [
          {
            id: 1,
            title: "Strategy Session",
            date: "2024-02-01",
            time: "2:00 PM",
            attendees: ["John Smith", "Sarah Johnson"],
          },
          {
            id: 2,
            title: "Weekly Review",
            date: "2024-02-05",
            time: "10:00 AM",
            attendees: ["Team Members"],
          },
        ]
      case 'files':
        return [
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
      default:
        return []
    }
  }

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
            {parentTitle && parentRecordType && (
              <>
                <span className="text-muted-foreground text-sm">from</span>
                <Badge variant="secondary" className="bg-background">
                  {parentRecordType} • {parentTitle}
                </Badge>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={onClose}>
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Full Screen Content - Two Column Layout */}
        <div className="flex h-[calc(100%-73px)]">
          {/* Left Panel - Details (Persistent) */}
          <div className="w-[672px] border-r bg-background overflow-y-auto">
            {/* Record Header */}
            <div className="bg-background px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  {record.title?.charAt(0) || recordType.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-semibold">
                    {record.title || record.subject || record.name || "Untitled"}
                  </h2>
                </div>
              </div>
            </div>
            
            {/* Details Content */}
            <div className="flex-1">
              {recordType === "Task" && (
                <TaskDetailsView
                  task={record}
                  onBack={onClose}
                  recordName={parentTitle || ""}
                  recordType={parentRecordType || ""}
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
              {recordType === "Email" && (
                <EmailDetailsView 
                  email={record} 
                  onBack={onClose}
                  isFullScreen={true}
                />
              )}
            </div>
          </div>

          {/* Right Panel - Tabs */}
          <div className="flex-1 overflow-y-auto">
            {/* Tabs */}
            <div className="border-b bg-background px-6">
              <div className="flex relative overflow-x-auto">
                {recordTabs.map((tab, index) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative whitespace-nowrap py-3 px-3 text-sm font-medium flex items-center gap-1 flex-shrink-0 ${
                      activeTab === tab.id
                        ? "border-b-2 border-primary text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    } ${index === 0 ? 'pl-0' : ''}`}
                  >
                    {tab.icon && <tab.icon className="h-4 w-4 flex-shrink-0" />}
                    <span>{tab.label}</span>
                    {activeTab === tab.id && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"></span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {recordTabs.find((tab) => tab.id === activeTab)?.label}
                </h3>
                <div className="flex items-center gap-2">
                  {activeTab === "activity" && (
                    <Button variant="outline" size="sm">
                      <PlusIcon className="h-4 w-4" />
                      Add activity
                    </Button>
                  )}
                  {activeTab === "tasks" && (
                    <>
                      <ViewModeSelector viewMode={tasksViewMode} onViewModeChange={setTasksViewMode} />
                      <Button variant="outline" size="sm">
                        <PlusIcon className="h-4 w-4" />
                        Add {recordType === "Task" ? "subtask" : "task"}
                      </Button>
                    </>
                  )}
                  {activeTab === "notes" && recordType !== "Note" && (
                    <>
                      <ViewModeSelector viewMode={notesViewMode} onViewModeChange={setNotesViewMode} />
                      <Button variant="outline" size="sm">
                        <PlusIcon className="h-4 w-4" />
                        Add note
                      </Button>
                    </>
                  )}
                  {activeTab === "files" && (
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
              
              {/* Tab content rendering */}
              {activeTab === "activity" && (
                activityContent || <UnifiedActivitySection activities={generateWorkflowActivities()} />
              )}
              
              {activeTab === "tasks" && (
                <TabContentRenderer
                  activeTab="tasks"
                  viewMode={tasksViewMode}
                  data={getMockData('tasks')}
                  onTaskClick={(task) => {
                    setNestedRecord({ type: 'Task', record: task })
                  }}
                />
              )}
              
              {activeTab === "notes" && recordType === "Note" && (
                <div className="space-y-5">
                  <TypableArea 
                    value={record?.content || ''} 
                    onChange={(value) => {
                      // Update the note content
                      if (record) {
                        record.content = value
                      }
                    }} 
                    placeholder="Start typing to add your thoughts..." 
                    showButtons={false}
                  />
                </div>
              )}
              
              {activeTab === "notes" && recordType !== "Note" && (
                <TabContentRenderer
                  activeTab="notes"
                  viewMode={notesViewMode}
                  data={getMockData('notes')}
                  onNoteClick={(note) => {
                    setNestedRecord({ type: 'Note', record: note })
                  }}
                />
              )}
              
              {activeTab === "files" && (
                <TabContentRenderer
                  activeTab="files"
                  viewMode={filesViewMode}
                  data={getMockData('files')}
                  onFileClick={(file) => {
                    setDocumentViewerFile(file)
                  }}
                />
              )}
              
              {activeTab === "threads" && recordType === "Email" && (
                <div className="space-y-4">
                  {(() => {
                    // Generate email thread using the same function as drawer view
                    const emailThread = generateEmailThread(record)
                    
                    return (
                      <>
                        {emailThread
                          .slice()
                          .reverse()
                          .map((emailItem, index, reversedArray) => {
                            // The most recent email is the last one in reversed array (originally first)
                            const isLatest = index === reversedArray.length - 1
                            const isExpanded = isLatest || expandedEmails.has(emailItem.id)
                            
                            return (
                              <div key={emailItem.id}>
                                <EmailContent 
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
                      </>
                    )
                  })()}
                </div>
              )}
              
              {activeTab === "emails" && (
                <TabContentRenderer
                  activeTab="emails"
                  viewMode={notesViewMode}
                  data={getMockData('emails')}
                  onEmailClick={(email) => {
                    setNestedRecord({ type: 'Email', record: email })
                  }}
                />
              )}
              
              {activeTab === "meetings" && (
                <TabContentRenderer
                  activeTab="meetings"
                  viewMode={notesViewMode}
                  data={getMockData('meetings')}
                  onMeetingClick={(meeting) => {
                    setNestedRecord({ type: 'Meeting', record: meeting })
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )

  // Show nested record if one is selected
  if (nestedRecord.type && nestedRecord.record) {
    return (
      <RecordFullscreenView
        recordType={nestedRecord.type}
        record={nestedRecord.record}
        parentContext={parentContext}
        parentTitle={record.title || record.subject || record.name || "Parent Record"}
        parentRecordType={recordType}
        onClose={() => setNestedRecord({ type: null, record: null })}
        activityContent={null}
      />
    )
  }

  return (
    <>
      {typeof document !== "undefined" ? createPortal(content, document.body) : null}
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
    </>
  )
} 