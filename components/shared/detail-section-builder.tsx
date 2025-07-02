import { ReactNode } from "react"
import { DetailField, DetailSection, SectionData } from "./unified-details-panel"
import { BuildingIcon, UsersIcon, LandmarkIcon, BarChartIcon, TrendingUpIcon } from "lucide-react"

export interface StandardSectionArgs {
  /** Title for the information section – e.g. "Opportunity Information", "Asset Information" */
  infoTitle: string
  /** Icon for the information section (usually context-specific) */
  infoIcon: ReactNode
  /** Fields that describe the primary record */
  infoFields: DetailField[]

  /* Related record arrays. Omit or pass empty to skip if desired. */
  companies?: SectionData["items"]
  people?: SectionData["items"]
  entities?: SectionData["items"]
  investments?: SectionData["items"]
  opportunities?: SectionData["items"]
  /** If true, hide sections whose items array is empty. */
  hideWhenEmpty?: boolean
}

/**
 * Returns the canonical six-section detail layout expected by drawers.
 * Consumers can decide later to drop unused sections, but having a single
 * builder ensures wording & ordering stay consistent across record types.
 */
export function buildStandardDetailSections({
  infoTitle,
  infoIcon,
  infoFields,
  companies = [],
  people = [],
  entities = [],
  investments = [],
  opportunities = [],
  hideWhenEmpty = false,
}: StandardSectionArgs): DetailSection[] {
  const sections: DetailSection[] = [
    {
      id: "information",
      title: infoTitle,
      icon: infoIcon,
      fields: infoFields,
      hideWhenEmpty,
    },
    {
      id: "companies",
      title: "Companies",
      icon: <BuildingIcon className="h-4 w-4 text-muted-foreground" />,
      sectionData: { items: companies },
      hideWhenEmpty,
    },
    {
      id: "people",
      title: "People",
      icon: <UsersIcon className="h-4 w-4 text-muted-foreground" />,
      sectionData: { items: people },
      hideWhenEmpty,
    },
    {
      id: "entities",
      title: "Entities",
      icon: <LandmarkIcon className="h-4 w-4 text-muted-foreground" />,
      sectionData: { items: entities },
      hideWhenEmpty,
    },
    {
      id: "investments",
      title: "Investments",
      icon: <BarChartIcon className="h-4 w-4 text-muted-foreground" />,
      sectionData: { items: investments },
      hideWhenEmpty,
    },
    {
      id: "opportunities",
      title: "Opportunities",
      icon: <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />,
      sectionData: { items: opportunities },
      hideWhenEmpty,
    },
  ]

  return sections
} 