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
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { TypableArea } from "@/components/typable-area"

interface MeetingDetailsViewProps {
  meeting: any
  onBack: () => void
}

export function MeetingDetailsView({ meeting, onBack }: MeetingDetailsViewProps) {
  const [meetingTitle, setMeetingTitle] = React.useState(meeting.title || "")
  const [isEditingTitle, setIsEditingTitle] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("details")
  const [editingField, setEditingField] = React.useState<string | null>(null)
  const [fieldValues, setFieldValues] = React.useState({
    agenda: meeting?.agenda || "",
    location: meeting?.location || "",
    startTime: meeting?.startTime || "",
    endTime: meeting?.endTime || "",
    attendees: meeting?.attendees || [],
    organizer: meeting?.organizer || "",
    meetingType: meeting?.meetingType || "In-person",
    status: meeting?.status || "Scheduled",
  })

  const [meetingNotes, setMeetingNotes] = React.useState("")

  const tabs = [{ id: "details", label: "Details", icon: InfoIcon }]

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
            <Label className="text-xs text-muted-foreground mt-1">{label}</Label>
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
                className="cursor-pointer hover:bg-muted/50 px-2 py-1 rounded text-sm"
                onClick={() => setEditingField(field)}
              >
                {isBadge ? (
                  <Badge className={`text-xs ${getStatusColor(value)}`}>{value}</Badge>
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
            <p className="text-sm text-muted-foreground">Meeting • {meeting.id}</p>
          </div>
        </div>
      </div>

      {/* Tabs - Same styling as task tabs */}
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
      <div className="p-6 space-y-6">
        {activeTab === "details" && (
          <div className="space-y-4">
            <div className="rounded-lg border border-muted bg-muted/10 p-4">
              <div className="space-y-4">
                {renderEditableField(
                  "agenda",
                  fieldValues.agenda,
                  <FileTextIcon className="h-4 w-4 text-muted-foreground" />,
                  "Agenda",
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
              </div>
            </div>

            {/* Typable Area */}
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
  )
}
