"use client"

import * as React from "react"
import { ChevronDownIcon, MessageSquareIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

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
  comments?: ActivityItem[]
  showHeader?: boolean
  onCommentSubmit?: (comment: string) => void
}

export function UnifiedActivitySection({ 
  activities, 
  comments = [],
  showHeader = true,
  onCommentSubmit
}: UnifiedActivitySectionProps) {
  const [activityFilter, setActivityFilter] = React.useState<"all" | "comments">("all")
  const [commentText, setCommentText] = React.useState("")
  const [isCommentExpanded, setIsCommentExpanded] = React.useState(false)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  // Combine activities and comments if showing all
  const displayedActivities = React.useMemo(() => {
    if (activityFilter === "comments") {
      return comments
    }
    // For "all", show both activities and comments, sorted by date
    const allItems = [...activities, ...comments]
    return allItems.sort((a, b) => {
      const dateA = new Date(a.date || a.timestamp).getTime()
      const dateB = new Date(b.date || b.timestamp).getTime()
      return dateB - dateA // Most recent first
    })
  }, [activities, comments, activityFilter])

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ')
    if (parts.length === 1) {
      // For single word names like "You", just use first two letters
      return parts[0].substring(0, 2).toUpperCase()
    }
    // For multi-word names, use first letter of first and last word
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
  }

  const formatActivityText = (activity: ActivityItem) => {
    // Special formatting for comments
    if (activity.type === "comment") {
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarFallback className="text-xs">
              {getInitials(activity.actor)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1 flex-1">
            <span className="text-sm">
              <span className="font-medium text-foreground">{activity.actor}</span>{" "}
              <span className="text-muted-foreground">commented</span>
            </span>
            {activity.content && (
              <div className="text-sm text-muted-foreground pl-0 mt-1">
                "{activity.content}"
              </div>
            )}
          </div>
        </div>
      )
    }

    // Default formatting for other activities
    return (
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback className="text-xs">
            {getInitials(activity.actor)}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm flex-1">
          <span className="font-medium text-foreground">{activity.actor}</span>{" "}
          <span className="text-muted-foreground">
            {activity.action}{" "}
            {activity.objectType && <>{activity.objectType}: </>}
          </span>
          {activity.url ? (
            <a
              href={activity.url}
              className="font-medium underline text-foreground hover:opacity-80"
              onClick={(e) => e.stopPropagation()}
            >
              {activity.target}
            </a>
          ) : (
            <span className="font-medium text-foreground">{activity.target}</span>
          )}
        </span>
      </div>
    )
  }

  const handleCommentSubmit = () => {
    if (commentText.trim() && onCommentSubmit) {
      onCommentSubmit(commentText.trim())
      setCommentText("")
      setIsCommentExpanded(false)
    }
  }

  const handleCommentCancel = () => {
    setCommentText("")
    setIsCommentExpanded(false)
  }

  const handleCommentFocus = () => {
    setIsCommentExpanded(true)
    // Small delay to ensure the textarea is rendered before focusing
    setTimeout(() => {
      textareaRef.current?.focus()
    }, 50)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleCommentSubmit()
    }
    if (e.key === 'Escape') {
      handleCommentCancel()
    }
  }

  return (
    <div className="space-y-2">
      {showHeader && (
        <div className="flex items-center justify-between mb-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 px-2 hover:bg-muted">
                <span className="text-sm font-medium">
                  {activityFilter === "all" ? "All Activity" : "Comments"}
                </span>
                <ChevronDownIcon className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => setActivityFilter("all")}>
                All Activity
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActivityFilter("comments")}>
                <MessageSquareIcon className="mr-2 h-4 w-4" />
                Comments
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Slack-style comment input */}
      <div className="px-3 mb-2">
        {!isCommentExpanded ? (
          <Input
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onFocus={handleCommentFocus}
            className="h-9 text-sm"
          />
        ) : (
          <div className="space-y-2">
            <Textarea
              ref={textareaRef}
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[80px] text-sm resize-none"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCommentCancel}
                className="h-8"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleCommentSubmit}
                disabled={!commentText.trim()}
                className="h-8"
              >
                Comment
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-1">
        {displayedActivities.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground text-sm">
            {activityFilter === "comments" ? "No comments yet" : "No activity yet"}
          </div>
        ) : (
          displayedActivities.map((activity) => (
            <div key={`${activity.type}-${activity.id}`} className="flex items-center justify-between py-1 px-3">
              <div className="flex-1">{formatActivityText(activity)}</div>
              <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                {activity.timestamp}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
