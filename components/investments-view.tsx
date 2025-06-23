"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react"
import { AssetsTable, type Asset } from "./assets-table"
import { LiabilitiesTable } from "./liabilities-table"
import { MasterDrawer } from "./master-drawer"
import {
  FileTextIcon,
  CheckSquareIcon,
  StickyNoteIcon,
  PaperclipIcon,
  DollarSignIcon,
  BarChartIcon,
} from "lucide-react"
import { UnifiedDetailsPanel } from "@/components/shared/unified-details-panel"
import { buildStandardDetailSections } from "@/components/shared/detail-section-builder"
import { UnifiedActivitySection } from "@/components/shared/unified-activity-section"
import { generateInvestmentActivities } from "@/components/shared/activity-generators"

export function InvestmentsView() {
  const [view, setView] = React.useState<"assets" | "liabilities">("assets")
  const [selectedInvestment, setSelectedInvestment] = React.useState<any>(null)

  const handleAssetClick = (asset: Asset) => {
    setSelectedInvestment(asset)
  }

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
        <AssetsTable onAssetClick={handleAssetClick} />
      ) : (
        <LiabilitiesTable />
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
            { id: "performance", label: "Performance", count: null, icon: TrendingUpIcon },
            { id: "tasks", label: "Tasks", count: 3, icon: CheckSquareIcon },
            { id: "notes", label: "Notes", count: 5, icon: StickyNoteIcon },
            { id: "files", label: "Files", count: 8, icon: PaperclipIcon },
          ]}
          detailsPanel={(isFullScreen) => (
            (() => {
              // ----- Info fields -----
              const infoFields = [
                { label: "Name", value: selectedInvestment.name },
                { label: "Type", value: selectedInvestment.type ?? "Equity Investment" },
                { label: "Status", value: selectedInvestment.status ?? "Active" },
                { label: "Amount", value: selectedInvestment.currentValue ?? "$2.5M" },
              ]

              // ----- Mock related data -----
              const companies = [
                {
                  id: 1,
                  name: selectedInvestment.name.split(" ")[0] + " Corp",
                  type: "Portfolio Company",
                },
                {
                  id: 2,
                  name: "Example Holdings",
                  type: "Co-Investor",
                },
              ]

              // Optional: simple activity feed (can be expanded later)
              const activities = generateInvestmentActivities()

              const sections = buildStandardDetailSections({
                infoTitle: "Investment Information",
                infoIcon: <BarChartIcon className="h-4 w-4 text-muted-foreground" />,
                infoFields,
                companies,
              })

              // Stubs – hook up navigation later if needed
              const navigateToRecord = (recordType: string, id: number) => {
                console.log(`Navigate to ${recordType} ${id}`)
              }
              const handleAddRecord = (sectionId: string) => {
                console.log(`Add record to ${sectionId}`)
              }
              const handleUnlinkRecord = (sectionId: string, id: number) => {
                console.log(`Unlink ${sectionId} ${id}`)
              }

              return (
                <UnifiedDetailsPanel
                  sections={sections}
                  isFullScreen={isFullScreen}
                  onNavigateToRecord={navigateToRecord}
                  onAddRecord={handleAddRecord}
                  onUnlinkRecord={handleUnlinkRecord}
                  activityContent={<UnifiedActivitySection activities={activities} />}
                />
              )
            })()
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
            return <div className="p-4 text-muted-foreground">Content for {activeTab}</div>
          }}
        />
      )}
    </div>
  )
}
