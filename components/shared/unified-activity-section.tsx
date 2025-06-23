"use client"

import * as React from "react"

export interface ActivityItem {
  id: number
  type: string
  actor: string
  action: string
  /**
   * Optional object type (e.g. "task", "investment", "file") that will be
   * rendered just before the target with a trailing colon to match the desired
   * "You created a new task: Review Q1 Fund Statement" format.  Kept optional so
   * existing usages that don't provide this field continue to compile.
   */
  objectType?: string
  target: string
  timestamp: string
  date?: string
  content?: string
  details?: any
  /**
   * When provided the target will be rendered as an anchor tag pointing to this
   * url so that clicking the activity opens the relevant record drawer / page.
   */
  url?: string
}

interface UnifiedActivitySectionProps {
  activities: ActivityItem[]
}

export function UnifiedActivitySection({ activities }: UnifiedActivitySectionProps) {
  const formatActivityText = (activity: ActivityItem) => {
    return (
      <span className="text-sm">
        <span className="font-medium">{activity.actor}</span>{" "}
        <span>{activity.action}</span>{" "}
        {activity.objectType && <span>{activity.objectType}: </span>}
        {activity.url ? (
          <a
            href={activity.url}
            className="font-medium underline text-primary hover:opacity-80"
            onClick={(e) => e.stopPropagation()}
          >
            {activity.target}
          </a>
        ) : (
          <span className="font-medium">{activity.target}</span>
        )}
      </span>
    )
  }

  return (
    <div className="space-y-1">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center justify-between py-1 px-3">
          <div>{formatActivityText(activity)}</div>
          <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
            {activity.timestamp}
          </span>
        </div>
      ))}
    </div>
  )
}
