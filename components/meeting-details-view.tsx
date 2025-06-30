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
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { TypableArea } from "@/components/typable-area"
import { UnifiedDetailsPanel, type DetailSection } from "@/components/shared/unified-details-panel"
import { ComboboxOption } from "@/components/ui/combobox"

interface MeetingDetailsViewProps {
  meeting: any
  onBack: () => void
}

// Meeting type options
const meetingTypeOptions: ComboboxOption[] = [
  { value: "video-call", label: "Video call" },
  { value: "in-person", label: "In person" },
  { value: "phone-call", label: "Phone call" },
  { value: "conference", label: "Conference" },
]

// Status options
const statusOptions: ComboboxOption[] = [
  { value: "scheduled", label: "Scheduled" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
]

// Recurring options
const recurringOptions: ComboboxOption[] = [
  { value: "none", label: "Does not repeat" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
]

// Reminder options
const reminderOptions: ComboboxOption[] = [
  { value: "5-minutes", label: "5 minutes before" },
  { value: "15-minutes", label: "15 minutes before" },
  { value: "30-minutes", label: "30 minutes before" },
  { value: "1-hour", label: "1 hour before" },
  { value: "1-day", label: "1 day before" },
]

// Visibility options
const visibilityOptions: ComboboxOption[] = [
  { value: "private", label: "Private" },
  { value: "public", label: "Public" },
  { value: "team", label: "Team only" },
]

// Show as options
const showAsOptions: ComboboxOption[] = [
  { value: "busy", label: "Busy" },
  { value: "free", label: "Free" },
  { value: "tentative", label: "Tentative" },
  { value: "out-of-office", label: "Out of office" },
]

export function MeetingDetailsView({ meeting, onBack }: MeetingDetailsViewProps) {
  const [meetingTitle, setMeetingTitle] = React.useState(meeting.title || "")
  const [isEditingTitle, setIsEditingTitle] = React.useState(false)
  const [fieldValues, setFieldValues] = React.useState({
    description: meeting?.description || meeting?.agenda || "",
    location: meeting?.location || "",
    startTime: meeting?.startTime || "",
    endTime: meeting?.endTime || "",
    attendees: meeting?.attendees || [],
    organizer: meeting?.organizer || "",
    meetingType: meeting?.meetingType || "video-call",
    status: meeting?.status || "scheduled",
    recurring: meeting?.recurring || "none",
    reminder: meeting?.reminder || "15-minutes",
    visibility: meeting?.visibility || "private",
    showAs: meeting?.showAs || "busy",
  })

  const [meetingNotes, setMeetingNotes] = React.useState("")

  const handleFieldEdit = (field: string, value: any) => {
    setFieldValues((prev) => ({ ...prev, [field]: value }))
    // Here you would typically make an API call to save the change
    console.log(`Updated ${field} to:`, value)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600"
      case "scheduled":
        return "text-blue-600"
      case "cancelled":
        return "text-red-600"
      case "in-progress":
        return "text-yellow-600"
      default:
        return "text-muted-foreground"
    }
  }

  // Define sections for the details panel
  const sections: DetailSection[] = [
    {
      id: "details",
      title: "Meeting Information",
      icon: <CalendarIcon className="h-4 w-4 text-muted-foreground" />,
      fields: [
        {
          label: "Description",
          value: fieldValues.description,
          editable: true,
          fieldType: "textarea",
          onChange: (value) => handleFieldEdit("description", value),
        },
        {
          label: "Start Time",
          value: fieldValues.startTime,
          editable: true,
          fieldType: "date",
          onChange: (value) => handleFieldEdit("startTime", value),
        },
        {
          label: "End Time",
          value: fieldValues.endTime,
          editable: true,
          fieldType: "date",
          onChange: (value) => handleFieldEdit("endTime", value),
          minDate: fieldValues.startTime ? new Date(fieldValues.startTime) : undefined,
        },
        {
          label: "Location",
          value: fieldValues.location,
          editable: true,
          fieldType: "text",
          onChange: (value) => handleFieldEdit("location", value),
        },
        {
          label: "Organizer",
          value: fieldValues.organizer,
          editable: true,
          fieldType: "text",
          onChange: (value) => handleFieldEdit("organizer", value),
        },
        {
          label: "Type",
          value: fieldValues.meetingType,
          editable: true,
          fieldType: "combobox",
          options: meetingTypeOptions,
          onChange: (value) => handleFieldEdit("meetingType", value),
          formatDisplay: (value) => {
            const option = meetingTypeOptions.find(opt => opt.value === value)
            return option?.label || value
          }
        },
        {
          label: "Status",
          value: fieldValues.status,
          editable: true,
          fieldType: "combobox",
          options: statusOptions,
          onChange: (value) => handleFieldEdit("status", value),
          formatDisplay: (value) => {
            const option = statusOptions.find(opt => opt.value === value)
            const label = option?.label || value
            return <span className={getStatusColor(value)}>{label}</span>
          }
        },
        {
          label: "Recurring",
          value: fieldValues.recurring,
          editable: true,
          fieldType: "combobox",
          options: recurringOptions,
          onChange: (value) => handleFieldEdit("recurring", value),
          formatDisplay: (value) => {
            const option = recurringOptions.find(opt => opt.value === value)
            return option?.label || value
          }
        },
        {
          label: "Reminder",
          value: fieldValues.reminder,
          editable: true,
          fieldType: "combobox",
          options: reminderOptions,
          onChange: (value) => handleFieldEdit("reminder", value),
          formatDisplay: (value) => {
            const option = reminderOptions.find(opt => opt.value === value)
            return option?.label || value
          }
        },
        {
          label: "Visibility",
          value: fieldValues.visibility,
          editable: true,
          fieldType: "combobox",
          options: visibilityOptions,
          onChange: (value) => handleFieldEdit("visibility", value),
          formatDisplay: (value) => {
            const option = visibilityOptions.find(opt => opt.value === value)
            return option?.label || value
          }
        },
        {
          label: "Show As",
          value: fieldValues.showAs,
          editable: true,
          fieldType: "combobox",
          options: showAsOptions,
          onChange: (value) => handleFieldEdit("showAs", value),
          formatDisplay: (value) => {
            const option = showAsOptions.find(opt => opt.value === value)
            return option?.label || value
          }
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col flex-1">
      {/* Meeting Header - Same placement as task header */}
      <div className="border-b bg-background px-6 py-2">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <VideoIcon className="h-4 w-4" />
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

      {/* Content with UnifiedDetailsPanel */}
      <UnifiedDetailsPanel
        sections={sections}
        additionalContent={
          <div className="rounded-lg border border-muted overflow-hidden">
            <button
              className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors"
            >
              <FileTextIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Meeting Notes</span>
            </button>
            
            <div className="px-4 pb-4 pt-1">
              <TypableArea
                value={meetingNotes}
                onChange={setMeetingNotes}
                placeholder="Add meeting notes..."
                showButtons={false}
              />
            </div>
          </div>
        }
      />
    </div>
  )
}
