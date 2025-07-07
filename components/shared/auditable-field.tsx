"use client"

import * as React from "react"
import { SearchIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

interface FieldSource {
  documentName: string
  pageNumber: number
  confidence: "high" | "medium" | "low"
  extractedText: string
  sourceType: "document" | "manual" | "calculated"
  lastUpdated: string
}

interface AuditableFieldProps {
  children: React.ReactNode
  className?: string
  fieldName: string
  sources?: FieldSource[]
  onSourceClick?: (source: FieldSource) => void
}

export function AuditableField({ 
  children, 
  className, 
  fieldName, 
  sources = [], 
  onSourceClick 
}: AuditableFieldProps) {
  const [isHovered, setIsHovered] = React.useState(false)

  // Mock source data for demonstration
  const mockSource: FieldSource = {
    documentName: "KKR-NAFVII-Capital-Call-4-Notice.pdf",
    pageNumber: 1,
    confidence: "high",
    extractedText: "Your proportionate share of this capital call is $199,750 based on your commitment percentage of 2.35%.",
    sourceType: "document",
    lastUpdated: "2023-10-22T09:30:00Z"
  }

  const actualSources = sources.length > 0 ? sources : [mockSource]

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onSourceClick && actualSources.length > 0) {
      onSourceClick(actualSources[0])
    }
  }

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "high": return "text-green-600"
      case "medium": return "text-yellow-600"
      case "low": return "text-red-600"
      default: return "text-gray-600"
    }
  }

  const getSourceTypeLabel = (sourceType: string) => {
    switch (sourceType) {
      case "document": return "Document"
      case "manual": return "Manual Entry"
      case "calculated": return "Calculated"
      default: return "Unknown"
    }
  }

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <span
          className={cn(
            "group relative inline-flex items-center gap-1 transition-all duration-200 cursor-pointer px-1 py-0.5 rounded-sm w-fit",
            isHovered && "bg-blue-50",
            className
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleClick}
        >
          <span>{children}</span>
          <SearchIcon 
            className={cn(
              "h-3 w-3 text-muted-foreground transition-opacity duration-200 flex-shrink-0",
              isHovered ? "opacity-60" : "opacity-0"
            )}
          />
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="w-96 p-0" side="right" align="start">
        <div className="space-y-0">
          {/* Header */}
          <div className="px-4 py-3 border-b bg-muted/30">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Data Source</h4>
              <span className="text-xs text-muted-foreground">
                {fieldName}
              </span>
            </div>
          </div>
          
          {/* Content */}
          <div className="px-4 py-3 space-y-3">
            {actualSources.map((source, index) => (
              <div key={index} className="space-y-3">
                {/* Source info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate max-w-[200px]" title={source.documentName}>
                      {source.documentName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      p. {source.pageNumber}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn("text-xs font-medium", getConfidenceColor(source.confidence))}>
                      {source.confidence.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                {/* Extracted text snippet */}
                <div className="bg-muted/50 rounded-md p-3">
                  <p className="text-sm text-muted-foreground italic leading-relaxed">
                    "{source.extractedText}"
                  </p>
                </div>
                
                {/* Metadata */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{getSourceTypeLabel(source.sourceType)}</span>
                  <span>{new Date(source.lastUpdated).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Footer */}
          <div className="px-4 py-2 border-t bg-muted/20">
            <p className="text-xs text-muted-foreground">
              Click to view in document
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
} 