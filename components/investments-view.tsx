"use client"
import { AssetsTable, assetsData } from "./assets-table"
import { LiabilitiesTable, liabilitiesData } from "./liabilities-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react"
import * as React from "react"

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
            className="h-8 px-3 flex items-center gap-2"
          >
            <TrendingUpIcon className="h-4 w-4" />
            Assets
            <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
              {assetsData.length}
            </Badge>
          </Button>
          <Button
            variant={view === "liabilities" ? "default" : "ghost"}
            size="sm"
            onClick={() => setView("liabilities")}
            className="h-8 px-3 flex items-center gap-2"
          >
            <TrendingDownIcon className="h-4 w-4" />
            Liabilities
            <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
              {liabilitiesData.length}
            </Badge>
          </Button>
        </div>
      </div>

      {/* Content */}
      {view === "assets" ? <AssetsTable /> : <LiabilitiesTable />}
    </div>
  )
}
