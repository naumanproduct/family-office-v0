"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVerticalIcon } from "lucide-react"

export interface RecordListItemProps {
  title: string
  titleStatus?: "completed" | "normal"
  primaryMetadata: React.ReactNode[]
  secondaryMetadata: {
    left: React.ReactNode
    right: React.ReactNode
  }
  onClick?: () => void
  actions?: {
    label: string
    onClick: (e: React.MouseEvent) => void
    variant?: "default" | "destructive"
  }[]
  leadingElement?: React.ReactNode
}

/**
 * A standardized list item component for displaying record items consistently
 * across different content types (tasks, notes, meetings, emails, files).
 */
export function RecordListItem({
  title,
  titleStatus = "normal",
  primaryMetadata,
  secondaryMetadata,
  onClick,
  actions = [],
  leadingElement,
}: RecordListItemProps) {
  return (
    <div
      className={`py-4 ${onClick ? "cursor-pointer hover:bg-muted/50" : ""}`}
      onClick={onClick}
    >
      <div className="flex items-start">
        {/* Optional leading element (e.g. checkbox for tasks) */}
        {leadingElement && (
          <div onClick={(e) => e.stopPropagation()} className="mt-1 mr-4">
            {leadingElement}
          </div>
        )}
        
        <div className="flex-1">
          {/* Title row with actions dropdown */}
          <div className="flex items-start justify-between">
            <h3 
              className={`font-medium text-sm ${
                titleStatus === "completed" ? "line-through text-muted-foreground" : ""
              }`}
            >
              {title}
            </h3>
            
            {actions.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                    <MoreVerticalIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {actions.map((action, index) => (
                    <React.Fragment key={action.label}>
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          action.onClick(e);
                        }}
                        className={action.variant === "destructive" ? "text-red-600" : ""}
                      >
                        {action.label}
                      </DropdownMenuItem>
                      {index < actions.length - 1 && index % 2 === 1 && <DropdownMenuSeparator />}
                    </React.Fragment>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          
          {/* Primary metadata row (badges, status indicators) */}
          {primaryMetadata.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              {primaryMetadata.map((item, index) => (
                <React.Fragment key={index}>{item}</React.Fragment>
              ))}
            </div>
          )}
          
          {/* Secondary metadata row (assignee, dates, etc.) */}
          <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
            <div>{secondaryMetadata.left}</div>
            <div>{secondaryMetadata.right}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
