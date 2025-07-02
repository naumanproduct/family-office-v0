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
        <div className="flex items-start gap-3">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarFallback className="text-xs bg-muted">
              {getInitials(activity.actor)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1 flex-1 min-w-0">
            <div className="text-sm">
              <span className="font-medium text-foreground">{activity.actor}</span>{" "}
              <span className="text-muted-foreground">commented</span>
            </div>
            {activity.content && (
              <div className="text-sm text-muted-foreground">
                <span className="inline-block bg-muted/50 rounded-md px-2 py-1 mt-1">
                  "{activity.content}"
                </span>
              </div>
            )}
          </div>
        </div>
      )
    }

    // Default formatting for other activities
    return (
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback className="text-xs bg-muted">
            {getInitials(activity.actor)}
          </AvatarFallback>
        </Avatar>
        <div className="text-sm flex-1 min-w-0">
          <span className="font-medium text-foreground">{activity.actor}</span>{" "}
          <span className="text-muted-foreground">
            {activity.action}{" "}
            {activity.objectType && <>{activity.objectType}: </>}
          </span>
          {activity.url ? (
            <a
              href={activity.url}
              className="font-medium text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              {activity.target}
            </a>
          ) : (
            <span className="font-medium text-foreground">{activity.target}</span>
          )}
        </div>
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
    <div className="space-y-4">
      {showHeader && (
        <div className="flex items-center justify-between mb-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <ChevronDownIcon className="h-4 w-4 mr-1" />
                {activityFilter === "all" ? "All Activity" : "Comments"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => setActivityFilter("all")}>
                All Activity
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActivityFilter("comments")}>
                Comments
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Slack-style comment input with increased spacing */}
      {onCommentSubmit && (
        <div className="px-3 pb-2">
          {!isCommentExpanded ? (
            <Input
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onFocus={handleCommentFocus}
              className="h-9 text-sm border-muted focus:border-primary/50 transition-colors"
            />
          ) : (
            <div className="space-y-2 animate-in slide-in-from-top-1 duration-200">
              <Textarea
                ref={textareaRef}
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-h-[80px] text-sm resize-none border-primary/50 focus:border-primary transition-colors"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCommentCancel}
                  className="h-8 text-muted-foreground hover:text-foreground"
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
      )}

      {/* Activity stream with proper spacing */}
      <div className="space-y-0.5">
        {displayedActivities.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-sm mb-2">
              {activityFilter === "comments" ? "No comments yet" : "No activity yet"}
            </div>
            <div className="text-xs text-muted-foreground">
              {activityFilter === "comments" 
                ? "Be the first to add a comment" 
                : "Activities will appear here as they happen"}
            </div>
          </div>
        ) : (
          displayedActivities.map((activity, index) => (
            <div 
              key={`${activity.type}-${activity.id}`} 
              className="group flex items-start justify-between py-3 px-3 hover:bg-muted/30 rounded-lg transition-all duration-200 animate-in fade-in slide-in-from-bottom-1"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex-1 min-w-0">{formatActivityText(activity)}</div>
              <span className="text-xs text-muted-foreground whitespace-nowrap ml-3 mt-0.5 opacity-70 group-hover:opacity-100 transition-opacity">
                {activity.timestamp}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
