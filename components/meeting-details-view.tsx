"use client"

import * as React from "react"
import {
  CalendarIcon,
  UserIcon,
  MapPinIcon,
  ClockIcon,
  FileTextIcon,
  VideoIcon,
  InfoIcon,
  UsersIcon,
  RepeatIcon,
  BellIcon,
  EyeIcon,
  CalendarCheckIcon,
  ChevronRight,
  ChevronDown,
  FileIcon,
  CheckCircleIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { TypableArea } from "@/components/typable-area"

interface MeetingDetailsViewProps {
  meeting: any
  onBack: () => void
  isFullScreen?: boolean
  isInDrawer?: boolean
}

export function MeetingDetailsView({ meeting, onBack, isFullScreen = false, isInDrawer = false }: MeetingDetailsViewProps) {
  const [meetingTitle, setMeetingTitle] = React.useState(meeting.title || "")
  const [isEditingTitle, setIsEditingTitle] = React.useState(false)
  const [editingField, setEditingField] = React.useState<string | null>(null)
  const [activeTab, setActiveTab] = React.useState("details")
  const [fieldValues, setFieldValues] = React.useState({
    description: meeting?.description || meeting?.agenda || "",
    location: meeting?.location || "",
    startTime: meeting?.startTime || "",
    endTime: meeting?.endTime || "",
    attendees: meeting?.attendees || [],
    organizer: meeting?.organizer || "",
    meetingType: meeting?.meetingType || "Video call",
    status: meeting?.status || "Scheduled",
    recurring: meeting?.recurring || "Does not repeat",
    reminder: meeting?.reminder || "15 minutes before",
    visibility: meeting?.visibility || "Private",
    showAs: meeting?.showAs || "Busy",
  })

  const [meetingNotes, setMeetingNotes] = React.useState(`Meeting Summary:
The quarterly investment review meeting covered portfolio performance, risk assessment, and strategic allocation decisions for Q4 2023.

Key Discussion Points:
1. Portfolio Performance Review:
   - Total portfolio value: $485M (up 12.3% YTD)
   - Private equity allocation at 42% (target range: 40-45%)
   - Fixed income allocation at 18% (below target of 20%)
   - Alternative investments performing above benchmark

2. Risk Management Update:
   - Currency hedging strategy reviewed for international holdings
   - Concentration risk identified in technology sector (32% of public equity)
   - Recommendation to diversify across emerging markets

3. New Investment Opportunities:
   - Series B opportunity in FinTech startup ($5M allocation proposed)
   - Real estate development project in Miami ($15M commitment)
   - Infrastructure fund targeting renewable energy projects

4. Tax Planning Considerations:
   - Year-end loss harvesting opportunities identified
   - Trust structure modifications proposed for estate planning
   - International tax treaty benefits to be explored

5. Compliance and Regulatory:
   - Updated KYC documentation required for three entities
   - New beneficial ownership reporting requirements discussed
   - Quarterly filing deadlines confirmed with fund administrators

Action Items:
- Rebalance fixed income allocation by month-end
- Complete due diligence on FinTech opportunity
- Schedule follow-up with tax advisors
- Update investment policy statement to reflect ESG criteria

Next meeting scheduled for January 15, 2024.`)
  
  // Define tabs
  const tabs = [
    { id: "details", label: "Details", icon: FileTextIcon },
    { id: "notes", label: "Notes", icon: FileIcon },
    { id: "files", label: "Files", icon: FileTextIcon },
    { id: "tasks", label: "Tasks", icon: CheckCircleIcon },
  ]
  
  // State for which sections are open
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({
    details: true,
    notes: true,
  })

  // Toggle section open/closed
  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  const getStatusColor = (status: string | undefined | null) => {
    if (!status) return "bg-gray-100 text-gray-800"

    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "in progress":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleFieldEdit = (field: string, value: string) => {
    setFieldValues((prev) => ({ ...prev, [field]: value }))
    setEditingField(null)
  }

  const renderEditableField = (
    field: string,
    value: string,
    icon: React.ReactNode,
    label: string,
    isBadge = false,
    isTextarea = false,
  ) => {
    const isEditing = editingField === field

    return (
      <div className="flex items-start gap-2">
        <div className="mt-1">{icon}</div>
        <div className="flex-1">
          <div className="flex items-start gap-4">
            <Label className="text-xs text-muted-foreground mt-1 w-24">{label}</Label>
            {isEditing ? (
              isTextarea ? (
                <Textarea
                  value={value}
                  onChange={(e) => setFieldValues((prev) => ({ ...prev, [field]: e.target.value }))}
                  onBlur={() => handleFieldEdit(field, value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setEditingField(null)
                    }
                  }}
                  className="text-sm min-h-[80px]"
                  autoFocus
                />
              ) : (
                <Input
                  value={value}
                  onChange={(e) => setFieldValues((prev) => ({ ...prev, [field]: e.target.value }))}
                  onBlur={() => handleFieldEdit(field, value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleFieldEdit(field, value)
                    }
                    if (e.key === "Escape") {
                      setEditingField(null)
                    }
                  }}
                  className="h-6 text-sm w-32"
                  autoFocus
                />
              )
            ) : (
              <div
                className="cursor-pointer hover:bg-muted/50 px-2 py-1 rounded text-sm flex-1"
                onClick={() => setEditingField(field)}
              >
                {isBadge ? (
                  <Badge className="text-xs capitalize">{value}</Badge>
                ) : field === "attendees" ? (
                  <div className="flex flex-wrap gap-1">
                    {Array.isArray(value) ? (
                      value.map((attendee) => (
                        <Badge key={attendee} variant="secondary" className="text-xs">
                          {attendee}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        {value}
                      </Badge>
                    )}
                  </div>
                ) : field === "startTime" || field === "endTime" ? (
                  new Date(value).toLocaleString()
                ) : (
                  value
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1">
      {/* Meeting Header - Only show when not in fullscreen mode */}
      {!isFullScreen && (
        <div className="border-b bg-background px-6 py-2">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <CalendarIcon className="h-4 w-4" />
            </div>
            <div className="flex-1">
              {isEditingTitle ? (
                <Input
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  onBlur={() => setIsEditingTitle(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setIsEditingTitle(false)
                    }
                    if (e.key === "Escape") {
                      setMeetingTitle(meeting.title || "")
                      setIsEditingTitle(false)
                    }
                  }}
                  className="text-lg font-semibold border-none p-0 h-auto bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                  autoFocus
                />
              ) : (
                <h2
                  className="text-lg font-semibold cursor-pointer hover:bg-muted/50 px-1 py-0.5 rounded -ml-1"
                  onClick={() => setIsEditingTitle(true)}
                >
                  {meetingTitle || "Untitled"}
                </h2>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tabs - hide in fullscreen and in drawer mode */}
      {!isFullScreen && !isInDrawer && (
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
      )}

      {/* Content based on active tab - when in drawer mode, always show details */}
      {(isInDrawer || activeTab === "details") ? (
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Meeting Details Section */}
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
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Meeting Information</span>
            </button>
            
            {openSections.details && (
              <div className="px-4 pb-4 pt-1">
                <div className="space-y-3">
                  {renderEditableField(
                    "description",
                    fieldValues.description,
                    <FileTextIcon className="h-4 w-4 text-muted-foreground" />,
                    "Description",
                    false,
                    true,
                  )}

                  {renderEditableField(
                    "startTime",
                    fieldValues.startTime,
                    <ClockIcon className="h-4 w-4 text-muted-foreground" />,
                    "Start Time",
                  )}

                  {renderEditableField(
                    "endTime",
                    fieldValues.endTime,
                    <ClockIcon className="h-4 w-4 text-muted-foreground" />,
                    "End Time",
                  )}

                  {renderEditableField(
                    "location",
                    fieldValues.location,
                    <MapPinIcon className="h-4 w-4 text-muted-foreground" />,
                    "Location",
                  )}

                  {renderEditableField(
                    "organizer",
                    fieldValues.organizer,
                    <UserIcon className="h-4 w-4 text-muted-foreground" />,
                    "Organizer",
                  )}

                  {renderEditableField(
                    "attendees",
                    fieldValues.attendees,
                    <UsersIcon className="h-4 w-4 text-muted-foreground" />,
                    "Attendees",
                  )}

                  {renderEditableField(
                    "meetingType",
                    fieldValues.meetingType,
                    <VideoIcon className="h-4 w-4 text-muted-foreground" />,
                    "Type",
                  )}

                  {renderEditableField(
                    "status",
                    fieldValues.status,
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />,
                    "Status",
                    true,
                  )}

                  {renderEditableField(
                    "recurring",
                    fieldValues.recurring,
                    <RepeatIcon className="h-4 w-4 text-muted-foreground" />,
                    "Recurring",
                  )}

                  {renderEditableField(
                    "reminder",
                    fieldValues.reminder,
                    <BellIcon className="h-4 w-4 text-muted-foreground" />,
                    "Reminder",
                  )}

                  {renderEditableField(
                    "visibility",
                    fieldValues.visibility,
                    <EyeIcon className="h-4 w-4 text-muted-foreground" />,
                    "Visibility",
                  )}

                  {renderEditableField(
                    "showAs",
                    fieldValues.showAs,
                    <CalendarCheckIcon className="h-4 w-4 text-muted-foreground" />,
                    "Show As",
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Meeting Notes Section */}
          <div className="rounded-lg border border-muted overflow-hidden">
            <button
              onClick={() => toggleSection('notes')}
              className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors"
            >
              {openSections.notes ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
              <FileTextIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Meeting Notes</span>
            </button>
            
            {openSections.notes && (
              <div className="px-4 pb-4 pt-1">
                <TypableArea
                  value={meetingNotes}
                  onChange={setMeetingNotes}
                  placeholder="Add meeting notes..."
                  showButtons={false}
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        // For other tabs (notes, files, tasks), show placeholder content
        <div className="p-6">
          <div className="text-center py-8 text-muted-foreground">
            <p>No {activeTab} found for this meeting</p>
            <p className="text-sm mt-2">Add some {activeTab} to get started</p>
          </div>
        </div>
      )}
    </div>
  )
}
