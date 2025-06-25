"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, ChevronDown, ExternalLinkIcon, UnlinkIcon } from "lucide-react"

export interface DetailField {
  label: string
  value: React.ReactNode
  isLink?: boolean
}

export interface SectionData {
  items: Array<{
    id: number
    name: string
    type?: string
    role?: string
    amount?: string
    status?: string
    [key: string]: any
  }>
}

export interface DetailSection {
  id: string
  title: string
  icon: React.ReactNode
  fields?: DetailField[]
  sectionData?: SectionData
  hideWhenEmpty?: boolean
}

interface UnifiedDetailsPanelProps {
  sections: DetailSection[]
  isFullScreen?: boolean
  onNavigateToRecord?: (recordType: string, id: number) => void
  onAddRecord?: (sectionId: string) => void
  onUnlinkRecord?: (sectionId: string, id: number) => void
  activityContent?: React.ReactNode
  additionalContent?: React.ReactNode
}

/**
 * A unified details panel component that can be used across all record types.
 * Features collapsible sections, show more/less controls, and related records.
 */
export function UnifiedDetailsPanel({
  sections,
  isFullScreen = false,
  onNavigateToRecord,
  onAddRecord,
  onUnlinkRecord,
  activityContent,
  additionalContent
}: UnifiedDetailsPanelProps) {
  // State for which sections are open
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>(() => {
    // Default to having the first section open
    const initialState: Record<string, boolean> = {};
    if (sections.length > 0) {
      initialState[sections[0].id] = true;
    }
    return initialState;
  });

  // State for showing all field values
  const [showingAllValues, setShowingAllValues] = React.useState<Record<string, boolean>>({});

  // Toggle a section open/closed
  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Toggle showing all values for a section
  const toggleShowAllValues = (sectionId: string) => {
    setShowingAllValues(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Render the fields for a section
  const renderFields = (sectionId: string, fields: DetailField[], showAllButton = true) => {
    // If showing all values or no need for "show more", render all fields
    const fieldsToShow = showingAllValues[sectionId] || !showAllButton 
      ? fields 
      : fields.slice(0, Math.min(7, fields.length));
    
    return (
      <div className="space-y-3">
        {fieldsToShow.map((field, index) => (
          <div key={index} className="flex items-center">
            <Label className="text-xs text-muted-foreground w-28 shrink-0 ml-2">{field.label}</Label>
            {field.isLink ? (
              <p className="text-sm text-blue-600 flex-1">{field.value}</p>
            ) : (
              <p className="text-sm flex-1">{field.value}</p>
            )}
          </div>
        ))}
        
        {showAllButton && fields.length > 7 && (
          <div className="flex items-center mt-2">
            <Button 
              variant="link" 
              className="h-auto p-0 text-xs text-blue-600 ml-2"
              onClick={() => toggleShowAllValues(sectionId)}
            >
              {showingAllValues[sectionId] ? "Show less" : "Show all"}
            </Button>
          </div>
        )}
      </div>
    );
  };

  // Render items section for related records
  const renderItemsSection = (sectionId: string, items: SectionData['items']) => {
    if (!items || items.length === 0) return null;

    return (
      <div className="mt-2 space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center">
            <div className="flex items-center gap-2 ml-2">
              <div 
                className="cursor-pointer text-blue-600 hover:underline text-sm"
                onClick={() => onNavigateToRecord && onNavigateToRecord(sectionId, item.id)}
              >
                {item.name}
              </div>
              {item.type && <span className="text-xs text-muted-foreground">{item.type}</span>}
              {item.role && <span className="text-xs text-muted-foreground">{item.role}</span>}
              {item.amount && <span className="text-xs text-muted-foreground">{item.amount}</span>}
              {item.status && <span className="text-xs text-muted-foreground">{item.status}</span>}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="px-6 pt-2 pb-6">
      <div className="space-y-5">
        {sections.map(section => {
          // Skip empty sections if hideWhenEmpty is true
          if (section.hideWhenEmpty && 
              (!section.fields || section.fields.length === 0) && 
              (!section.sectionData || !section.sectionData.items || section.sectionData.items.length === 0)) {
            return null;
          }

          const isOpen = openSections[section.id] || false;

          return (
            <div key={section.id} className="rounded-lg border border-muted p-3 group">
              {/* Section Header */}
              <div className="flex items-center justify-between">
                <div 
                  className="flex items-center cursor-pointer" 
                  onClick={() => toggleSection(section.id)}
                >
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground mr-2" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground mr-2" /> 
                  )}
                  <div className="flex items-center gap-2">
                    {section.icon}
                    <span className="font-medium text-sm">{section.title}</span>
                  </div>
                </div>
                
                {/* Add button - visible on hover */}
                {section.sectionData && isOpen && (
                  <Button 
                    variant="ghost" 
                    className="h-auto p-0 text-xs text-muted-foreground hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddRecord && onAddRecord(section.id);
                    }}
                  >
                    + Add
                  </Button>
                )}
              </div>

              {/* Section Content */}
              {isOpen && (
                <div className="mt-3">
                  {section.fields && section.fields.length > 0 && 
                    renderFields(section.id, section.fields, section.fields.length > 7)}
                  
                  {section.sectionData && section.sectionData.items && 
                    renderItemsSection(section.id, section.sectionData.items)}
                </div>
              )}
            </div>
          );
        })}

        {/* Additional Content (AI Assistance) */}
        {additionalContent && (
          <div className="mt-8">
            {additionalContent}
          </div>
        )}

        {/* Activity Section - Only in Drawer View */}
        {!isFullScreen && activityContent && (
          <div className="mt-8">
            <div className="space-y-2">
              {activityContent}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
