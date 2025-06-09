"use client"
import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export type ActivityItem = {
  id: number
  type: string
  actor: string
  action: string
  target: string
  timestamp: string
  date: string
  details: Record<string, any>
}

export type ActivityContentProps = {
  activities: ActivityItem[]
}

/**
 * A shared component for rendering activity sections across all entity types.
 * 
 * This component provides a consistent way to display activity items with
 * expandable details sections.
 */
export function ActivityContent({ activities }: ActivityContentProps) {
  const [expandedActivity, setExpandedActivity] = React.useState<number | null>(null);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "meeting":
        return <div className="h-2 w-2 rounded-full bg-blue-500"></div>;
      case "email":
        return <div className="h-2 w-2 rounded-full bg-green-500"></div>;
      case "note":
        return <div className="h-2 w-2 rounded-full bg-amber-500"></div>;
      case "call":
        return <div className="h-2 w-2 rounded-full bg-purple-500"></div>;
      case "change":
        return <div className="h-2 w-2 rounded-full bg-indigo-500"></div>;
      case "creation":
        return <div className="h-2 w-2 rounded-full bg-teal-500"></div>;
      case "document":
        return <div className="h-2 w-2 rounded-full bg-rose-500"></div>;
      case "contact":
        return <div className="h-2 w-2 rounded-full bg-orange-500"></div>;
      default:
        return <div className="h-2 w-2 rounded-full bg-gray-500"></div>;
    }
  };

  const formatActivityText = (activity: ActivityItem) => {
    return (
      <span>
        <span className="font-medium">{activity.actor}</span> {activity.action}{" "}
        <span className="font-medium">{activity.target}</span>
      </span>
    );
  };

  const renderExpandedDetails = (activity: ActivityItem) => {
    switch (activity.type) {
      case "meeting":
        return (
          <div className="mt-4 space-y-3">
            <div>
              <h5 className="text-sm font-medium mb-2">Meeting Details</h5>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Type:</span>{" "}
                  <span>{activity.details.meetingType || "Standard Meeting"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Duration:</span>{" "}
                  <span>{activity.details.duration || "1 hour"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Date:</span>{" "}
                  <span>{activity.date}</span>
                </div>
              </div>
            </div>
            {activity.details.participants && (
              <div>
                <h5 className="text-sm font-medium mb-1">Participants</h5>
                <div className="space-y-1">
                  {activity.details.participants.map((participant: string, index: number) => (
                    <div key={index} className="text-sm text-muted-foreground">
                      {participant}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activity.details.summary && (
              <div>
                <h5 className="text-sm font-medium mb-1">Summary</h5>
                <p className="text-sm text-muted-foreground">{activity.details.summary}</p>
              </div>
            )}
            {activity.details.nextSteps && (
              <div>
                <h5 className="text-sm font-medium mb-1">Next Steps</h5>
                <p className="text-sm text-muted-foreground">{activity.details.nextSteps}</p>
              </div>
            )}
          </div>
        );
      case "email":
        return (
          <div className="mt-4 space-y-3">
            <div>
              <h5 className="text-sm font-medium mb-2">Email Details</h5>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Subject:</span>{" "}
                  <span>{activity.details.subject || "No subject"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Date:</span>{" "}
                  <span>{activity.date}</span>
                </div>
              </div>
            </div>
            {activity.details.recipients && (
              <div>
                <h5 className="text-sm font-medium mb-1">Recipients</h5>
                <div className="space-y-1">
                  {activity.details.recipients.map((recipient: string, index: number) => (
                    <div key={index} className="text-sm text-blue-600">
                      {recipient}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activity.details.attachments && (
              <div>
                <h5 className="text-sm font-medium mb-1">Attachments</h5>
                <div className="space-y-1">
                  {activity.details.attachments.map((attachment: string, index: number) => (
                    <div key={index} className="text-sm text-blue-600">
                      {attachment}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activity.details.snippets && (
              <div>
                <h5 className="text-sm font-medium mb-1">Content Preview</h5>
                <p className="text-sm text-muted-foreground">{activity.details.snippets}</p>
              </div>
            )}
          </div>
        );
      case "note":
        return (
          <div className="mt-4 space-y-3">
            <div>
              <h5 className="text-sm font-medium mb-2">Note Details</h5>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Type:</span>{" "}
                  <span>{activity.details.noteType || "General Note"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Visibility:</span>{" "}
                  <span>{activity.details.visibility || "Private"}</span>
                </div>
              </div>
            </div>
            {activity.details.content && (
              <div>
                <h5 className="text-sm font-medium mb-1">Content</h5>
                <p className="text-sm text-muted-foreground">{activity.details.content}</p>
              </div>
            )}
            {activity.details.tags && (
              <div>
                <h5 className="text-sm font-medium mb-1">Tags</h5>
                <div className="flex flex-wrap gap-1">
                  {activity.details.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      default:
        if (Object.keys(activity.details).length > 0) {
          return (
            <div className="mt-4 space-y-3">
              <div>
                <h5 className="text-sm font-medium mb-2">Details</h5>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(activity.details).map(([key, value]) => {
                    if (typeof value === 'string') {
                      return (
                        <div key={key}>
                          <span className="text-muted-foreground">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>{" "}
                          <span>{value}</span>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            </div>
          );
        }
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id}>
          <button
            onClick={() => setExpandedActivity(expandedActivity === activity.id ? null : activity.id)}
            className="flex items-start gap-3 w-full text-left p-3 rounded-lg border hover:bg-muted/50 transition-colors"
          >
            <div className="mt-1">{getActivityIcon(activity.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm">{formatActivityText(activity)}</div>
              <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
            </div>
            <ChevronDownIcon
              className={`h-4 w-4 text-muted-foreground transition-transform ${
                expandedActivity === activity.id ? "rotate-180" : ""
              }`}
            />
          </button>
          {expandedActivity === activity.id && (
            <div className="ml-6 pl-3 border-l-2 border-muted">{renderExpandedDetails(activity)}</div>
          )}
        </div>
      ))}
    </div>
  );
} 