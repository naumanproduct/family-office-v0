"use client"

import * as React from "react"
import {
  MailIcon,
  UserIcon,
  CalendarIcon,
  PaperclipIcon,
  FileTextIcon,
  TagIcon,
  InfoIcon,
  SendIcon,
  InboxIcon,
  ReplyIcon,
  ForwardIcon,
  DownloadIcon,
  ChevronRight,
  ChevronDown,
  MessageSquareIcon,
  FileIcon,
  CheckCircleIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"

// Attachment component to reduce main component complexity
function EmailAttachment({ attachment, index }: { attachment: any; index: number }) {
  return (
    <div
      key={index}
      className="flex items-center justify-between p-3 border rounded-lg bg-background hover:bg-muted/50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-muted">
          <FileTextIcon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium">{attachment.name || `Attachment ${index + 1}`}</p>
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
  )
}

// Email content component to reduce main component complexity
function EmailContent({ emailItem, isExpanded, onToggle }: { emailItem: any; isExpanded: boolean; onToggle: () => void }) {
  const isOriginal = emailItem.isOriginal
  
  // Format date as "Jun 28, 2025, 3:48 PM"
  const formatEmailDate = (dateString: string) => {
    const date = new Date(dateString)
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
              <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
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

interface EmailDetailsViewProps {
  email: any
  onBack: () => void
}

export function EmailDetailsView({ email, onBack }: EmailDetailsViewProps) {
  const [emailSubject, setEmailSubject] = React.useState(email?.subject || "No Subject")
  const [isEditingSubject, setIsEditingSubject] = React.useState(false)
  const [editingField, setEditingField] = React.useState<string | null>(null)
  const [replyText, setReplyText] = React.useState("")
  const [isReplying, setIsReplying] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("details")
  const [expandedEmails, setExpandedEmails] = React.useState<Set<string>>(new Set())
  
  // Define tabs - only Details tab for emails
  const tabs = [
    { id: "details", label: "Details", icon: FileTextIcon },
  ]
  
  // State for which sections are open
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({
    details: true,
    attachments: true,
    threads: true,
  })

  // Toggle section open/closed
  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  // Create email thread with multiple emails
  const emailThread = React.useMemo(
    () => [
      {
        id: email?.id || "email-1",
        from: email?.from || "sarah.johnson@company.com",
        to: email?.to || ["john.doe@client.com"],
        cc: email?.cc || [],
        subject: email?.subject || "Project Proposal Discussion",
        date: email?.sentAt || new Date().toISOString(),
        body:
          email?.body ||
          email?.preview ||
          `Hi John,

I hope this email finds you well. I wanted to follow up on our conversation from last week regarding the new project proposal.

I've attached the updated proposal document with the revisions we discussed. The key changes include:
- Updated timeline reflecting the Q2 delivery date
- Revised budget allocation for the development phase
- Additional resources for the testing phase

Please review the document and let me know if you have any questions or need further clarification on any of the points.

Looking forward to your feedback.

Best regards,
Sarah`,
        attachments: email?.attachments || [
          { name: "proposal-v2.pdf", size: "2.4 MB", type: "PDF" },
          { name: "budget-breakdown.xlsx", size: "156 KB", type: "Excel" },
        ],
        isOriginal: true,
      },
      {
        id: "email-2",
        from: "john.doe@client.com",
        to: ["sarah.johnson@company.com"],
        cc: [],
        subject: "Re: Project Proposal Discussion",
        date: new Date(new Date(email?.sentAt || new Date()).getTime() - 86400000).toISOString(),
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
      },
      {
        id: "email-3",
        from: "sarah.johnson@company.com",
        to: ["john.doe@client.com"],
        cc: ["mike.wilson@company.com"],
        subject: "Re: Project Proposal Discussion",
        date: new Date(new Date(email?.sentAt || new Date()).getTime() - 172800000).toISOString(),
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
      },
    ],
    [email],
  )

  // Simplified field values
  const [fieldValues, setFieldValues] = React.useState({
    from: email?.from || "john.doe@example.com",
    to: email?.to || ["me@familyoffice.com"],
    cc: email?.cc || [],
    subject: email?.subject || "Q3 Investment Performance Report",
    date: email?.date || "2023-05-15 10:30 AM",
    attachments: emailThread[0]?.attachments || [],
  })

  const handleFieldEdit = (field: string, value: string) => {
    setFieldValues((prev) => ({ ...prev, [field]: value }))
    setEditingField(null)
  }

  return (
    <div className="flex flex-col flex-1">
      {/* Email Header - Similar to the task header */}
      <div className="border-b bg-background px-6 py-2">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <MailIcon className="h-4 w-4" />
          </div>
          <div className="flex-1">
            {isEditingSubject ? (
              <Input
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                onBlur={() => setIsEditingSubject(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setIsEditingSubject(false)
                  }
                  if (e.key === "Escape") {
                    setEmailSubject(email.subject || "No Subject")
                    setIsEditingSubject(false)
                  }
                }}
                className="text-lg font-semibold border-none p-0 h-auto bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                autoFocus
              />
            ) : (
              <h2
                className="text-lg font-semibold cursor-pointer hover:bg-muted/50 px-1 py-0.5 rounded -ml-1"
                onClick={() => setIsEditingSubject(true)}
              >
                {emailSubject || "No Subject"}
              </h2>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b bg-background px-6 py-1">
        <div className="flex gap-6 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 whitespace-nowrap py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary rounded-full"></span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content with expandable sections */}
      <div className="p-6 space-y-4 overflow-y-auto">
        {/* Email Details Section */}
        <div className="rounded-lg border border-muted overflow-hidden">
          <button
            onClick={() => toggleSection('details')}
            className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors"
          >
            {openSections.details ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
            <MailIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Email Details</span>
          </button>
          
          {openSections.details && (
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
                      <div className="text-sm">{fieldValues.from}</div>
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
                      <div className="text-sm font-medium">{fieldValues.subject}</div>
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
                        {Array.isArray(fieldValues.to) ? fieldValues.to.join(", ") : fieldValues.to}
                      </div>
                    </div>
                  </div>
                </div>

                {/* CC field if present */}
                {fieldValues.cc && fieldValues.cc.length > 0 && (
                  <div className="flex items-start gap-2">
                    <div className="mt-1">
                      <UserIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <Label className="text-xs text-muted-foreground mt-1 w-16">CC</Label>
                        <div className="text-sm">
                          {Array.isArray(fieldValues.cc) ? fieldValues.cc.join(", ") : fieldValues.cc}
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
                        {(() => {
                          const date = new Date(fieldValues.date)
                          return date.toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          }) + ', ' + date.toLocaleTimeString('en-US', { 
                            hour: 'numeric', 
                            minute: '2-digit',
                            hour12: true 
                          })
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Attachments Section */}
        {fieldValues.attachments && fieldValues.attachments.length > 0 && (
          <div className="rounded-lg border border-muted overflow-hidden">
            <button
              onClick={() => toggleSection('attachments')}
              className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors"
            >
              {openSections.attachments ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
              <PaperclipIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Attachments ({fieldValues.attachments.length})</span>
            </button>
            
            {openSections.attachments && (
              <div className="px-4 pb-4 pt-1">
                <div className="space-y-2">
                  {fieldValues.attachments.map((attachment: any, i: number) => (
                    <EmailAttachment key={i} attachment={attachment} index={i} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Email Thread Section */}
        <div className="rounded-lg border border-muted overflow-hidden">
          <button
            onClick={() => toggleSection('threads')}
            className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors"
          >
            {openSections.threads ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
            <MessageSquareIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Email Thread ({emailThread.length} messages)</span>
          </button>
          
          {openSections.threads && (
            <div className="px-4 pb-4 pt-1">
              <div className="space-y-4">
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
              </div>

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
                          <span className="text-muted-foreground">To:</span> {fieldValues.from}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setIsReplying(false)}>
                        Cancel
                      </Button>
                    </div>

                    <Textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
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
          )}
        </div>
      </div>
    </div>
  )
}
