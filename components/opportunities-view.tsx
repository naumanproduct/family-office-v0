"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { LayoutGridIcon, ListIcon } from "lucide-react"
import { OpportunitiesTable } from "./opportunities-table"
import { OpportunitiesKanban } from "./opportunities-kanban"

export function OpportunitiesView() {
  const [view, setView] = React.useState<"list" | "kanban">("list")

  return (
    <div className="space-y-4">
      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1 rounded-lg bg-muted p-1">
          <Button
            variant={view === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setView("list")}
            className="h-8 px-3"
          >
            <ListIcon className="h-4 w-4 mr-2" />
            List
          </Button>
          <Button
            variant={view === "kanban" ? "default" : "ghost"}
            size="sm"
            onClick={() => setView("kanban")}
            className="h-8 px-3"
          >
            <LayoutGridIcon className="h-4 w-4 mr-2" />
            Kanban
          </Button>
        </div>
      </div>

      {/* Content */}
      {view === "list" ? <OpportunitiesTable /> : <OpportunitiesKanban />}
    </div>
  )
}
