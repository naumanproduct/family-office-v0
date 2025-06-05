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
function EmailContent({ emailItem }: { emailItem: any }) {
  const isOriginal = emailItem.isOriginal
  const formattedDate = new Date(emailItem.date).toLocaleString()

  return (
    <div className={`mb-6 ${isOriginal ? "" : "opacity-80"}`}>
      <div className="flex items-start gap-3 mb-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback>{emailItem.from.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between">
            <div>
              <p className="font-medium">{emailItem.from}</p>
              <p className="text-xs text-muted-foreground">
                To: {Array.isArray(emailItem.to) ? emailItem.to.join(", ") : emailItem.to}
                {emailItem.cc && emailItem.cc.length > 0 && ` • CC: ${emailItem.cc.join(", ")}`}
              </p>
            </div>
            <div className="text-xs text-muted-foreground">{formattedDate}</div>
          </div>
        </div>
      </div>

      {/* Email body with proper formatting */}
      <div className="pl-11">
        <div className="prose prose-sm max-w-none">
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

      {!isOriginal && <Separator className="my-6" />}
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
  const [activeTab, setActiveTab] = React.useState("details")
  const [editingField, setEditingField] = React.useState<string | null>(null)
  const [replyText, setReplyText] = React.useState("")
  const [isReplying, setIsReplying] = React.useState(false)

  // Simplified mock data
  const mockAttachments = [
    { name: "proposal.pdf", size: "2.4 MB", type: "PDF" },
    { name: "budget.xlsx", size: "156 KB", type: "Excel" },
  ]

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
    from: emailThread[0]?.from || "sender@example.com",
    to: emailThread[0]?.to || ["recipient@example.com"],
    cc: emailThread[0]?.cc || [],
    sentAt: emailThread[0]?.date || new Date().toISOString(),
    priority: email?.priority || "Normal",
    status: email?.status || "Received",
    attachments: emailThread[0]?.attachments || [],
  })

  // Tabs for email details
  const tabs = [{ id: "details", label: "Details", icon: FileTextIcon }]

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "sent":
        return "bg-green-100 text-green-800"
      case "received":
        return "bg-blue-100 text-blue-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

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
            <p className="text-sm text-muted-foreground">
              Email from {fieldValues.from}
            </p>
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

      {/* Tab Content */}
      <div className="p-6 space-y-6 overflow-y-auto">
        {activeTab === "details" && (
          <div className="space-y-6">
            {/* Email metadata */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Email Details</h4>

              <div className="rounded-lg border border-muted bg-muted/10 p-4">
                <div className="space-y-4">
                  {/* From field */}
                  <div className="flex items-start gap-2">
                    <div className="mt-1">
                      <SendIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <Label className="text-xs text-muted-foreground mt-1">From</Label>
                        <div className="text-sm">{fieldValues.from}</div>
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
                        <Label className="text-xs text-muted-foreground mt-1">To</Label>
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
                          <Label className="text-xs text-muted-foreground mt-1">CC</Label>
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
                        <Label className="text-xs text-muted-foreground mt-1">Sent</Label>
                        <div className="text-sm">{new Date(fieldValues.sentAt).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>

                  {/* Priority */}
                  <div className="flex items-start gap-2">
                    <div className="mt-1">
                      <TagIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <Label className="text-xs text-muted-foreground mt-1">Priority</Label>
                        <Badge className={`text-xs ${getPriorityColor(fieldValues.priority)}`}>
                          {fieldValues.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-start gap-2">
                    <div className="mt-1">
                      <MailIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <Label className="text-xs text-muted-foreground mt-1">Status</Label>
                        <Badge className={`text-xs ${getStatusColor(fieldValues.status)}`}>{fieldValues.status}</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Attachments */}
                  {fieldValues.attachments && fieldValues.attachments.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <PaperclipIcon className="h-4 w-4 text-muted-foreground" />
                        <Label className="text-xs text-muted-foreground">
                          Attachments ({fieldValues.attachments.length})
                        </Label>
                      </div>
                      <div className="pl-6 space-y-2">
                        {fieldValues.attachments.map((attachment: any, i: number) => (
                          <EmailAttachment key={i} attachment={attachment} index={i} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Email content section */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Email Thread ({emailThread.length} messages)</h4>

              {/* Email content with proper formatting */}
              <div className="rounded-lg border border-muted p-4 space-y-6">
                {emailThread.map((emailItem, index) => (
                  <div key={emailItem.id}>
                    <EmailContent emailItem={emailItem} />
                    {index < emailThread.length - 1 && <Separator className="my-6" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Reply section */}
            <div className="space-y-4">
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
  )
}
