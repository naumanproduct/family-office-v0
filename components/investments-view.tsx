"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react"
import { AssetsTable } from "./assets-table"
import { LiabilitiesTable } from "./liabilities-table"
import { MasterDrawer } from "./master-drawer"
import {
  FileTextIcon,
  ActivityIcon,
  CheckSquareIcon,
  StickyNoteIcon,
  PaperclipIcon,
  UsersIcon,
  BuildingIcon,
  DollarSignIcon,
} from "lucide-react"

export function InvestmentsView() {
  const [view, setView] = React.useState<"assets" | "liabilities">("assets")
  const [selectedInvestment, setSelectedInvestment] = React.useState<any>(null)

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
      {view === "assets" ? (
        <AssetsTable onAssetClick={setSelectedInvestment} />
      ) : (
        <LiabilitiesTable onLiabilityClick={setSelectedInvestment} />
      )}

      {/* Investment Drawer */}
      {selectedInvestment && (
        <MasterDrawer
          trigger={<div />}
          title={selectedInvestment.name}
          recordType="Investment"
          subtitle={selectedInvestment.type}
          tabs={[
            { id: "details", label: "Details", count: null, icon: FileTextIcon },
            { id: "activity", label: "Activity", count: 12, icon: ActivityIcon },
            { id: "tasks", label: "Tasks", count: 3, icon: CheckSquareIcon },
            { id: "notes", label: "Notes", count: 5, icon: StickyNoteIcon },
            { id: "files", label: "Files", count: 8, icon: PaperclipIcon },
            { id: "team", label: "Team", count: 4, icon: UsersIcon },
            { id: "companies", label: "Companies", count: 2, icon: BuildingIcon },
            { id: "investments", label: "Related", count: 1, icon: DollarSignIcon },
          ]}
          detailsPanel={(isFullScreen) => (
            <div className="p-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Investment Details</h4>
                  <div className="rounded-lg border border-muted bg-muted/10 p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="flex items-center gap-4">
                            <span className="text-xs text-muted-foreground">Amount</span>
                            <span className="text-sm">{selectedInvestment.amount || "$2.5M"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="flex items-center gap-4">
                            <span className="text-xs text-muted-foreground">Type</span>
                            <span className="text-sm">{selectedInvestment.type || "Equity Investment"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="flex items-center gap-4">
                            <span className="text-xs text-muted-foreground">Status</span>
                            <span className="text-sm">{selectedInvestment.status || "Active"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          children={(activeTab, viewMode) => {
            if (activeTab === "tasks") {
              return <div className="p-4 text-muted-foreground">Tasks related to this investment...</div>
            }
            if (activeTab === "notes") {
              return <div className="p-4 text-muted-foreground">Notes about this investment...</div>
            }
            if (activeTab === "files") {
              return <div className="p-4 text-muted-foreground">Files related to this investment...</div>
            }
            if (activeTab === "activity") {
              return <div className="p-4 text-muted-foreground">Recent activity for this investment...</div>
            }
            return <div className="p-4 text-muted-foreground">Content for {activeTab}</div>
          }}
        />
      )}
    </div>
  )
}
