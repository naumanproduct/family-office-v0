import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { ChevronDownIcon } from "lucide-react"

export type SectionConfig = {
  id: string
  title: string
  icon: React.ComponentType<any>
  content: React.ReactNode
  count?: number | null
  defaultOpen?: boolean
}

export interface RecordDetailsPanelProps {
  sections: SectionConfig[]
  /**
   * Provide activity timeline (or any JSX) to render below the sections in non-fullscreen mode.
   */
  activity?: React.ReactNode
  /** Drawer vs fullscreen */
  isFullScreen?: boolean
}

/**
 * Generic collapsible sections panel (matches Investment/Asset design).
 * Pass pre-rendered section.content JSX – the component only handles chrome/toggling.
 */
export function RecordDetailsPanel({ sections, activity, isFullScreen = false }: RecordDetailsPanelProps) {
  const initialState = React.useMemo(() => {
    const state: Record<string, boolean> = {}
    sections.forEach((s) => {
      state[s.id] = s.defaultOpen ?? s.id === "details"
    })
    return state
  }, [sections])

  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>(initialState)

  const toggleSection = (id: string) =>
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="px-6 pt-2 pb-6">
      {/* Collapsible container */}
      <div className="rounded-lg border border-muted overflow-hidden">
        {sections.map((section, idx) => {
          const Icon = section.icon
          const isOpen = openSections[section.id]
          return (
            <React.Fragment key={section.id}>
              {idx > 0 && <div className="h-px bg-muted mx-3" />}

              {/* Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className={`w-full flex items-center justify-between p-3 hover:bg-muted/20 transition-colors ${
                  isOpen ? "bg-muted/20" : ""
                }`}
              >
                <div className="flex items-center">
                  <Icon className="h-4 w-4 text-muted-foreground ml-2" />
                  <h4 className="text-sm font-medium ml-2">{section.title}</h4>
                  {section.count !== undefined && section.count !== null && (
                    <Badge variant="secondary" className="ml-1 h-5 px-1.5 rounded-full text-xs">
                      {section.count}
                    </Badge>
                  )}
                </div>
                <ChevronDownIcon
                  className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isOpen && <div className="px-3 pb-3 pt-2 group/section">{section.content}</div>}
            </React.Fragment>
          )
        })}
      </div>

      {/* Activity below */}
      {!isFullScreen && activity && <div className="mt-8">{activity}</div>}
    </div>
  )
} 