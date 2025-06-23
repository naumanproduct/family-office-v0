import { ReactNode } from "react"
import { buildStandardDetailSections, StandardSectionArgs } from "./detail-section-builder"
import { UnifiedDetailsPanel } from "./unified-details-panel"
import { FileTextIcon } from "lucide-react"
import { UnifiedActivitySection, ActivityItem } from "./unified-activity-section"

/**
 * Convenience wrapper used by multiple Kanban components.
 * Accepts the same args as `buildStandardDetailSections` and returns a renderer
 * that matches the `(isFullScreen?: boolean) => React.ReactNode` signature
 * expected by <MasterDrawer />.
 */
export function buildWorkflowDetailsPanel({
  infoTitle,
  infoIcon = <FileTextIcon className="h-4 w-4 text-muted-foreground" />, // default icon
  infoFields,
  companies = [],
  people = [],
  entities = [],
  investments = [],
  opportunities = [],
  hideWhenEmpty = false,
  activities = [],
}: Omit<StandardSectionArgs, "infoIcon"> & { infoIcon?: ReactNode; activities?: ActivityItem[] }) {
  const sections = buildStandardDetailSections({
    infoTitle,
    infoIcon,
    infoFields,
    companies,
    people,
    entities,
    investments,
    opportunities,
    hideWhenEmpty,
  })

  // Return renderer function consumed by MasterDrawer
  return (isFullScreen: boolean = false) => (
    <UnifiedDetailsPanel
      sections={sections}
      isFullScreen={!!isFullScreen}
      activityContent={activities.length > 0 ? <UnifiedActivitySection activities={activities} /> : undefined}
    />
  )
} 