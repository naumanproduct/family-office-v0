"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, ChevronDown, ExternalLinkIcon, UnlinkIcon, ChevronUp, Maximize2Icon, ArrowLeftIcon } from "lucide-react"

export interface DetailField {
  label: string
  value: React.ReactNode
  isLink?: boolean
  isEditable?: boolean
}

export interface SectionData {
  items: Array<{
    id: number
    name: string
    type?: string
    role?: string
    amount?: string
    status?: string
  }>
}

export interface DetailSection {
  id: string
  title: string
  icon?: React.ReactNode
  fields?: DetailField[]
  sectionData?: SectionData
  hideWhenEmpty?: boolean
}

interface UnifiedDetailsPanelProps {
  sections: DetailSection[]
  activityContent?: React.ReactNode
  additionalContent?: React.ReactNode
  isFullScreen?: boolean
  onNavigateToRecord?: (recordType: string, id: number) => void
  onAddRecord?: (sectionId: string) => void
  onUnlinkRecord?: (sectionId: string, id: number) => void
}

export function UnifiedDetailsPanel({
  sections,
  activityContent,
  additionalContent,
  isFullScreen = false,
  onNavigateToRecord,
  onAddRecord,
  onUnlinkRecord,
}: UnifiedDetailsPanelProps) {
  // State for collapsible sections
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>(
    Object.fromEntries(sections.map(section => [section.id, section.id === "info"]))
  )

  // State for focused section
  const [focusedSection, setFocusedSection] = React.useState<string | null>(null)

  // Toggle section open/closed
  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  // Focus on a specific section
  const focusSection = (sectionId: string) => {
    setFocusedSection(sectionId)
  }

  // Exit focus mode
  const exitFocusMode = () => {
    setFocusedSection(null)
  }

  // Render a section with fields
  const renderFieldsSection = (section: DetailSection) => {
    // Skip empty sections if hideWhenEmpty is true
    if (section.hideWhenEmpty && (!section.fields || section.fields.length === 0)) {
      return null
    }

    return (
      <div key={section.id} className="rounded-lg border border-muted overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors">
          <button
            onClick={() => toggleSection(section.id)}
            className="flex items-center gap-3 flex-1 text-left"
          >
            {openSections[section.id] ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
            {section.icon}
            <span className="text-sm font-medium">{section.title}</span>
          </button>
          {/* Add focus button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              focusSection(section.id);
            }}
            title="Focus on this section"
          >
            <Maximize2Icon className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
        
        {openSections[section.id] && section.fields && section.fields.length > 0 && (
          <div className="px-4 pb-4 pt-1">
            <div className="grid grid-cols-1 gap-2">
              {section.fields.map((field, index) => (
                <div key={index} className="flex flex-col">
                  <Label className="text-xs text-muted-foreground">{field.label}</Label>
                  <span>{field.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Render a section with related records
  const renderRelatedSection = (section: DetailSection) => {
    // Skip empty sections if hideWhenEmpty is true
    if (
      section.hideWhenEmpty && 
      (!section.sectionData || !section.sectionData.items || section.sectionData.items.length === 0)
    ) {
      return null
    }

    return (
      <div key={section.id} className="rounded-lg border border-muted overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors">
          <button
            onClick={() => toggleSection(section.id)}
            className="flex items-center gap-3 flex-1 text-left"
          >
            {openSections[section.id] ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
            {section.icon}
            <span className="text-sm font-medium">{section.title}</span>
          </button>
          <div className="flex items-center gap-1">
            {/* Add focus button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                focusSection(section.id);
              }}
              title="Focus on this section"
            >
              <Maximize2Icon className="h-4 w-4 text-muted-foreground" />
            </Button>
            {onAddRecord && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onAddRecord(section.id)
                }}
              >
                +
              </Button>
            )}
          </div>
        </div>
        
        {openSections[section.id] && section.sectionData && section.sectionData.items && (
          <div className="px-4 pb-4 pt-1">
            {section.sectionData.items.length > 0 ? (
              <div className="space-y-2">
                {section.sectionData.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-md border border-muted p-2">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-sm">{item.name}</span>
                      {item.type && (
                        <Badge variant="outline" className="text-xs">
                          {item.type}
                        </Badge>
                      )}
                      {item.role && (
                        <Badge variant="outline" className="text-xs">
                          {item.role}
                        </Badge>
                      )}
                      {item.amount && (
                        <Badge variant="outline" className="text-xs">
                          {item.amount}
                        </Badge>
                      )}
                      {item.status && (
                        <Badge variant="outline" className="text-xs">
                          {item.status}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {onNavigateToRecord && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onNavigateToRecord(section.id, item.id)}
                        >
                          <ExternalLinkIcon className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      )}
                      {onUnlinkRecord && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onUnlinkRecord(section.id, item.id)}
                        >
                          <UnlinkIcon className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No {section.title.toLowerCase()} linked</p>
            )}
          </div>
        )}
      </div>
    )
  }

  // Render focused section view
  const renderFocusedSection = () => {
    const section = sections.find(s => s.id === focusedSection);
    if (!section) return null;

    return (
      <div className="space-y-4">
        {/* Back button */}
        <div className="flex items-center mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1 text-sm font-medium pl-0 -ml-2" 
            onClick={exitFocusMode}
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Details
          </Button>
        </div>

        {/* Section content */}
        <div className="rounded-lg border border-muted overflow-hidden">
          <div className="px-4 py-3 bg-muted/50">
            <div className="flex items-center gap-3">
              {section.icon}
              <span className="text-sm font-medium">{section.title}</span>
            </div>
          </div>
          
          {section.fields && section.fields.length > 0 && (
            <div className="px-4 pb-4 pt-3">
              <div className="grid grid-cols-1 gap-3">
                {section.fields.map((field, index) => (
                  <div key={index} className="flex flex-col">
                    <Label className="text-xs text-muted-foreground">{field.label}</Label>
                    <span className="text-sm">{field.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {section.sectionData && section.sectionData.items && (
            <div className="px-4 pb-4 pt-3">
              {section.sectionData.items.length > 0 ? (
                <div className="space-y-3">
                  {section.sectionData.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-md border border-muted p-3">
                      <div className="flex items-center gap-2 flex-1">
                        <span>{item.name}</span>
                        {item.type && (
                          <Badge variant="outline">
                            {item.type}
                          </Badge>
                        )}
                        {item.role && (
                          <Badge variant="outline">
                            {item.role}
                          </Badge>
                        )}
                        {item.amount && (
                          <Badge variant="outline">
                            {item.amount}
                          </Badge>
                        )}
                        {item.status && (
                          <Badge variant="outline">
                            {item.status}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {onNavigateToRecord && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onNavigateToRecord(section.id, item.id)}
                          >
                            <ExternalLinkIcon className="h-4 w-4" />
                          </Button>
                        )}
                        {onUnlinkRecord && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onUnlinkRecord(section.id, item.id)}
                          >
                            <UnlinkIcon className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No {section.title.toLowerCase()} linked</p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`px-6 py-4 space-y-6 ${isFullScreen ? 'overflow-y-auto max-h-[calc(100vh-73px)]' : ''}`}>
      {/* If a section is focused, only show that section */}
      {focusedSection ? (
        renderFocusedSection()
      ) : (
        <>
          {/* Render all sections */}
          {sections.map((section) => {
            if (section.fields) {
              return renderFieldsSection(section)
            } else if (section.sectionData) {
              return renderRelatedSection(section)
            }
            return null
          })}
          
          {/* Activity section */}
          {activityContent && (
            <div className="rounded-lg border border-muted overflow-hidden">
              <div className="px-4 py-3 bg-muted/50">
                <div className="flex items-center gap-3">
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Activity</span>
                </div>
              </div>
              <div className="px-4 pb-4 pt-1">
                {activityContent}
              </div>
            </div>
          )}
          
          {/* Additional content */}
          {additionalContent}
        </>
      )}
    </div>
  )
}
