"use client"

import * as React from "react"
import { ChevronRight, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface ActivityItem {
  id: number
  type: string
  actor: string
  action: string
  target: string
  timestamp: string
  date?: string
  content?: string
  details?: any
}

interface UnifiedActivitySectionProps {
  activities: ActivityItem[]
}

export function UnifiedActivitySection({ activities }: UnifiedActivitySectionProps) {
  const [expandedActivity, setExpandedActivity] = React.useState<number | null>(null)

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "update":
        return <div className="h-2 w-2 rounded-full bg-blue-500"></div>
      case "stage_change":
      case "status_change":
        return <div className="h-2 w-2 rounded-full bg-orange-500"></div>
      case "creation":
        return <div className="h-2 w-2 rounded-full bg-green-500"></div>
      case "distribution":
        return <div className="h-2 w-2 rounded-full bg-purple-500"></div>
      case "investment":
        return <div className="h-2 w-2 rounded-full bg-cyan-500"></div>
      case "meeting":
        return <div className="h-2 w-2 rounded-full bg-violet-500"></div>
      case "comment":
        return <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
      case "funding":
        return <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
      case "partnership":
        return <div className="h-2 w-2 rounded-full bg-pink-500"></div>
      default:
        return <div className="h-2 w-2 rounded-full bg-gray-500"></div>
    }
  }

  const formatActivityText = (activity: ActivityItem) => {
    return (
      <span className="text-sm">
        <span className="font-medium">{activity.actor}</span> <span>{activity.action}</span>{" "}
        <span className="font-medium">{activity.target}</span>
      </span>
    )
  }

  const renderExpandedDetails = (activity: ActivityItem) => {
    if (!activity.details && !activity.content) return null

    // Handle simple content activities
    if (activity.content) {
      return (
        <div className="mt-4 p-4 bg-muted/20 rounded-lg">
          <p className="text-sm">{activity.content}</p>
        </div>
      )
    }

    // Standardized expanded view for all activity types
    return (
      <div className="mt-4 space-y-4">
        {/* Key Details Grid - Always 2 columns for consistency */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 p-4 bg-muted/20 rounded-lg">
          {Object.entries(activity.details || {}).map(([key, value]) => {
            // Skip complex objects and arrays for the main grid
            if (typeof value === "object" && !Array.isArray(value)) return null
            if (Array.isArray(value)) return null

            const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")

            return (
              <div key={key} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">{label}:</span>
                <span className="text-sm font-medium">{value as string}</span>
              </div>
            )
          })}
        </div>

        {/* Additional Details - Lists and complex data */}
        {activity.details &&
          Object.entries(activity.details).map(([key, value]) => {
            if (!Array.isArray(value)) return null

            const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")

            return (
              <div key={key} className="space-y-2">
                <h5 className="text-sm font-medium">{label}</h5>
                <ul className="space-y-1 pl-4">
                  {(value as string[]).map((item, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-center">
                      <div className="w-1 h-1 bg-muted-foreground rounded-full mr-3 flex-shrink-0"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}

        {/* Quick Actions - Consistent across all types */}
        <div className="flex items-center gap-2 pt-2 border-t">
          <Button variant="outline" size="sm" className="h-7 text-xs">
            View Details
          </Button>
          {(activity.type === "investment" || activity.type === "distribution" || activity.type === "meeting") && (
            <Button variant="outline" size="sm" className="h-7 text-xs">
              Open Record
            </Button>
          )}
          <Button variant="ghost" size="sm" className="h-7 text-xs">
            Add Comment
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {activities.map((activity) => {
        const isExpanded = expandedActivity === activity.id

        return (
          <div key={activity.id} className={`${isExpanded ? "border rounded-lg overflow-hidden" : ""}`}>
            <div
              className={`flex items-center ${isExpanded ? "p-3 border-b bg-muted/20" : "py-2 px-3"} cursor-pointer`}
              onClick={() => setExpandedActivity(isExpanded ? null : activity.id)}
            >
              <div className="flex items-center flex-1">
                {getActivityIcon(activity.type)}
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <div>{formatActivityText(activity)}</div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{activity.timestamp}</span>
                  </div>
                </div>
              </div>
              <div className="ml-2">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>

            {isExpanded && <div className="p-3">{renderExpandedDetails(activity)}</div>}
          </div>
        )
      })}
    </div>
  )
}
