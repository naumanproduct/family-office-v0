"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react"
import { AssetsTable } from "./assets-table"
import { LiabilitiesTable } from "./liabilities-table"

export function InvestmentsView() {
  const [view, setView] = React.useState<"assets" | "liabilities">("assets")

  return (
    <div className="space-y-4">
      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1 rounded-lg bg-muted p-1">
          <Button
            variant={view === "assets" ? "default" : "ghost"}
            size="sm"
            onClick={() => setView("assets")}
            className="h-8 px-3"
          >
            <TrendingUpIcon className="h-4 w-4 mr-2" />
            Assets
          </Button>
          <Button
            variant={view === "liabilities" ? "default" : "ghost"}
            size="sm"
            onClick={() => setView("liabilities")}
            className="h-8 px-3"
          >
            <TrendingDownIcon className="h-4 w-4 mr-2" />
            Liabilities
          </Button>
        </div>
      </div>

      {/* Content */}
      {view === "assets" ? <AssetsTable /> : <LiabilitiesTable />}
    </div>
  )
}
