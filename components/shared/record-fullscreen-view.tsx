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

// Function to generate contextual note content based on record and context
function getContextualNoteContent(record: any, parentContext?: string, parentTitle?: string) {
  // If record already has content, return it
  if (record?.content && record.content.trim() !== '') {
    return record.content;
  }
  
  // Generate content based on title and context
  const title = record?.title || record?.name || '';
  const context = parentContext || parentTitle || '';
  
  // TechVentures Fund III - Call rationale
  if (context.includes('TechVentures Fund III') && title.toLowerCase().includes('call rationale')) {
    return `TechVentures Fund III - Call #4 Rationale

Date: January 27, 2025
Fund: TechVentures Fund III
Call Amount: $2.5M (of $10M total commitment)

Investment Rationale:

1. Portfolio Support Requirements:
   • CloudTech Solutions requires $1.2M for Series B bridge funding
   • DataFlow Inc. needs $800K for international expansion
   • AI Robotics Corp. requesting $500K for R&D acceleration

2. Market Opportunity Assessment:
   ✓ Enterprise software sector showing 25% YoY growth
   ✓ Portfolio companies outperforming sector benchmarks
   ✓ Strong customer acquisition metrics across holdings
   ✓ Favorable exit environment with recent comparable transactions

3. Portfolio Performance Review:
   • CloudTech Solutions: 180% revenue growth, $15M ARR
   • DataFlow Inc: Expanded to 3 new markets, 45% gross margins
   • AI Robotics Corp: 2 major enterprise contracts signed
   • Overall portfolio IRR: 28% (target: 20%)

4. Capital Deployment Strategy:
   The Investment Committee approved this follow-on deployment based on:
   - Proven execution by portfolio management teams
   - Clear path to Series B/C rounds within 12-18 months
   - Maintained pro-rata rights protection
   - Risk-adjusted return projections exceed fund targets

5. Risk Mitigation:
   • Diversified across 3 portfolio companies
   • Reserved capital for potential down-rounds
   • Board representation maintained
   • Milestone-based funding releases

6. Expected Outcomes:
   - Bridge funding to achieve Series B milestones
   - Maintain ownership percentages
   - Position for potential exits in 18-24 months
   - Generate 3-5x returns on deployed capital

Next Steps:
- Execute capital call notice by February 1st
- Coordinate with portfolio companies on funding schedules
- Update LP reporting with deployment rationale
- Schedule quarterly portfolio review for April

This capital call aligns with fund strategy and LP expectations for follow-on support of high-performing portfolio companies.`;
  }
  
  // TechVentures Fund III - other notes
  if (context.includes('TechVentures Fund III')) {
    return `TechVentures Fund III - ${title}

Date: ${new Date().toLocaleDateString()}
Fund: TechVentures Fund III

Key Points:

1. Fund Overview:
   • Total Fund Size: $100M
   • Current Deployment: 65% ($65M)
   • Remaining Capital: $35M
   • Portfolio Companies: 12 active investments

2. Performance Metrics:
   • Net IRR: 28.5% (vs. 20% target)
   • Net Multiple: 2.1x (realized + unrealized)
   • Top Quartile Performance vs. Vintage Peers

3. Portfolio Highlights:
   • 3 companies preparing for Series B/C rounds
   • 2 potential exits identified for 2025
   • Strong revenue growth across portfolio (avg. 85% YoY)
   • No write-offs or significant down-rounds

4. Market Environment:
   • Venture funding environment stabilizing
   • Enterprise software multiples recovering
   • Strong M&A activity in target sectors
   • IPO market showing signs of improvement

5. Strategic Focus:
   • Support high-performing portfolio companies
   • Selective new investments in proven themes
   • Prepare for fund distribution opportunities
   • Maintain strong LP relationships

This analysis supports continued confidence in fund performance and strategy execution.`;
  }
  
  // Generic note content based on title
  if (title.toLowerCase().includes('meeting')) {
    return `Meeting Notes - ${title}

Date: ${new Date().toLocaleDateString()}

Attendees:
- Investment Committee Members
- Fund Management Team
- Advisory Board Representatives

Key Discussion Points:

1. Portfolio Review:
   • Performance metrics analysis
   • Company-specific updates
   • Market conditions assessment

2. Strategic Initiatives:
   • New investment opportunities
   • Portfolio support requirements
   • Exit planning considerations

3. Operational Updates:
   • Fund administration matters
   • LP communication schedule
   • Compliance requirements

4. Action Items:
   • Follow-up on specific investments
   • Schedule management presentations
   • Update investment memos

Next Meeting: [To be scheduled]

Notes prepared by: Investment Team`;
  }
  
  if (title.toLowerCase().includes('due diligence') || title.toLowerCase().includes('diligence')) {
    return `Due Diligence Notes - ${title}

Date: ${new Date().toLocaleDateString()}

Executive Summary:
Comprehensive due diligence review conducted for potential investment opportunity.

Key Findings:

1. Market Analysis:
   • Total addressable market size and growth
   • Competitive landscape assessment
   • Market positioning and differentiation

2. Financial Performance:
   • Revenue growth trajectory
   • Unit economics and margins
   • Cash flow and burn rate analysis

3. Management Team:
   • Leadership experience and track record
   • Team composition and capabilities
   • Reference checks and background verification

4. Technology/Product:
   • Product-market fit validation
   • Technical architecture review
   • Intellectual property assessment

5. Risk Factors:
   • Market risks and competitive threats
   • Operational and execution risks
   • Financial and regulatory considerations

Recommendation:
[To be completed based on findings]

Next Steps:
- Management presentation
- Reference calls
- Final investment committee review`;
  }
  
  // Default content for any other note
  return `${title}

Date: ${new Date().toLocaleDateString()}

Overview:
This note contains important information and analysis relevant to family office operations and investment activities.

Key Points:

1. Background:
   • Context and relevant background information
   • Previous related activities or decisions
   • Current status and developments

2. Analysis:
   • Detailed analysis of the situation
   • Key factors and considerations
   • Risk assessment and implications

3. Recommendations:
   • Proposed actions or decisions
   • Timeline and implementation steps
   • Resource requirements

4. Next Steps:
   • Immediate action items
   • Follow-up requirements
   • Review and monitoring schedule

Notes prepared by: Investment Team
Last updated: ${new Date().toLocaleDateString()}`;
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
                    value={getContextualNoteContent(record, parentContext, parentTitle)} 
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