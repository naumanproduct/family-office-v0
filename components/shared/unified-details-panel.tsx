"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, ChevronDown, ExternalLinkIcon, UnlinkIcon, ChevronUp, Maximize2 } from "lucide-react"

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
  onFocusSection?: (sectionId: string) => void
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
  onFocusSection,
  activityContent,
  additionalContent
}: UnifiedDetailsPanelProps) {
  // State for which sections are open
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    if (isFullScreen) {
      // In full screen view, expand "details" and "information" sections by default
      sections.forEach(section => {
        initialState[section.id] = section.id === 'details' || section.id === 'information';
      });
    } else {
      // Default to having the first section open
      if (sections.length > 0) {
        initialState[sections[0].id] = true;
      }
      // Also open workflow-info by default if it exists
      sections.forEach(section => {
        if (section.id === 'workflow-info') {
          initialState[section.id] = true;
        }
      });
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
        {fieldsToShow.map((field, index) => {
          const isEditable = field.isEditable !== false; // Default to true if not specified
          
          // Check if the field value is a textarea by examining the React element
          const isTextareaField = React.isValidElement(field.value) && 
            (field.value.type === 'textarea' ||
            (typeof field.value.props === 'object' && field.value.props !== null &&
             'className' in field.value.props &&
             typeof field.value.props.className === 'string' &&
             field.value.props.className.includes('resize-none')));
          
          return (
            <div key={index} className={`flex ${isTextareaField ? 'items-start' : 'items-center'}`}>
              <Label className="text-xs text-muted-foreground w-28 shrink-0 ml-2 mt-1">{field.label}</Label>
              <span className="flex-1 px-2 py-0.5">
                {field.isLink ? (
                  <p className={`text-sm text-blue-600 ${isEditable ? 'cursor-pointer hover:bg-muted/50' : ''} px-2 py-0.5 rounded transition-colors w-fit`}>{field.value}</p>
                ) : isTextareaField ? (
                  <div className="w-full">
                    {field.value}
                  </div>
                ) : (
                  <p className={`text-sm ${isEditable ? 'cursor-pointer hover:bg-muted/50' : ''} px-2 py-0.5 rounded transition-colors w-fit`}>{field.value}</p>
                )}
              </span>
            </div>
          );
        })}
        {showAllButton && fields.length > 7 && (
          <div className="flex items-center mt-2 ml-2">
            <button
              onClick={() => setShowingAllValues(prev => ({ ...prev, [sectionId]: !prev[sectionId] }))}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              {showingAllValues[sectionId] ? (
                <>Show less <ChevronUp className="h-3 w-3" /></>
              ) : (
                <>Show more <ChevronDown className="h-3 w-3" /></>
              )}
            </button>
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

  // Filter out empty sections if hideWhenEmpty is true
  const visibleSections = sections.filter(section => {
    if (!section.hideWhenEmpty) return true;
    
    const hasFields = section.fields && section.fields.length > 0;
    const hasItems = section.sectionData?.items && section.sectionData.items.length > 0;
    
    return hasFields || hasItems;
  });

  return (
    <div className="px-6 pt-2 pb-6">
      <div className="space-y-5">
        {/* Master Card for all sections */}
        {visibleSections.length > 0 && (
          <div className="rounded-lg border border-muted overflow-hidden">
            {visibleSections.map((section, index) => {
              const isOpen = openSections[section.id] || false;

              return (
                <React.Fragment key={section.id}>
                  {/* Divider between sections (except for the first one) */}
                  {index > 0 && (
                    <div className="h-px bg-muted mx-3" />
                  )}
                  
                  {/* Section Header */}
                  <div className="group">
                    <button 
                      onClick={() => toggleSection(section.id)}
                      className={`w-full flex items-center justify-between p-3 transition-colors ${isOpen ? 'bg-muted/20' : ''}`}
                    >
                      <div className="flex items-center">
                        {isOpen ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground mr-2" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground mr-2" /> 
                        )}
                        <div className="flex items-center gap-2">
                          {section.icon}
                          <span className="font-medium text-sm">{section.title}</span>
                          {section.sectionData?.items && section.sectionData.items.length > 0 && (
                            <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                              {section.sectionData.items.length}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {/* Focus button for details section - visible on hover */}
                      {section.id === 'details' && onFocusSection && (
                        <Button
                          variant="ghost" 
                          size="icon"
                          className="h-6 w-6 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            onFocusSection(section.id);
                          }}
                        >
                          <Maximize2 className="h-4 w-4" />
                        </Button>
                      )}
                      
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
                    </button>

                    {/* Section Content */}
                    {isOpen && (
                      <div className="px-3 pb-3 pt-2 group/section">
                        {section.fields && section.fields.length > 0 && 
                          renderFields(section.id, section.fields, section.fields.length > 7)}
                        
                        {section.sectionData && section.sectionData.items && 
                          renderItemsSection(section.id, section.sectionData.items)}
                      </div>
                    )}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* Additional Content (AI Assistance) - Remains as separate card */}
        {additionalContent && (
          <div>
            {additionalContent}
          </div>
        )}

        {/* Activity Section */}
        {activityContent && !isFullScreen && (
          <div className="mt-8 -mx-6 border-t bg-background">
            <div className="px-6 py-4">
              {activityContent}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
