"use client"
import * as React from "react"
import { ActivityContent, type ActivityItem } from "./activity-content"

interface ActivitySectionProps {
  activities: ActivityItem[]
}

/**
 * A shared component for displaying activity sections in detail panels.
 * This component provides a consistent way to display the activity header and content.
 */
export function ActivitySection({ activities }: ActivitySectionProps) {
  return (
    <div className="mt-8">
      <div className="mb-4">
        <h4 className="text-sm font-medium">Activity</h4>
      </div>
      <ActivityContent activities={activities} />
    </div>
  )
} 