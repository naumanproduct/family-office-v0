import * as React from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

interface FieldGroup {
  id: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
  fields: {
    label: string
    value: React.ReactNode
    isLink?: boolean
  }[]
}

interface MasterDetailsPanelProps {
  fieldGroups: FieldGroup[]
  isFullScreen?: boolean
  additionalContent?: React.ReactNode
}

/**
 * A shared component for rendering details panels across all entity types.
 * 
 * This component provides a consistent layout for displaying field groups
 * in details panels, with each field group optionally having an icon.
 */
export function MasterDetailsPanel({
  fieldGroups,
  isFullScreen = false,
  additionalContent,
}: MasterDetailsPanelProps) {
  return (
    <div className="px-6 pt-2 pb-6">
      <div className="space-y-4">
        {/* Field Groups */}
        {fieldGroups.map((group) => (
          <div key={group.id} className="rounded-lg border border-muted bg-muted/10 p-4">
            <div className="space-y-3">
              {group.fields.map((field, index) => (
                <div key={index} className="flex items-center gap-2">
                  {index === 0 && group.icon && <group.icon className="h-4 w-4 text-muted-foreground" />}
                  {index !== 0 && group.icon && <div className="w-4" />}
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">{field.label}</Label>
                    {field.isLink ? (
                      <p className="text-sm text-blue-600 cursor-pointer hover:bg-muted/50 px-2 py-0.5 rounded transition-colors inline-block">{field.value}</p>
                    ) : (
                      <p className="text-sm cursor-pointer hover:bg-muted/50 px-2 py-0.5 rounded transition-colors inline-block">{field.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Additional Content */}
        {additionalContent}
      </div>
    </div>
  )
}
