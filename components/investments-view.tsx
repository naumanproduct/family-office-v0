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
import { TabContentRenderer } from "@/components/shared/tab-content-renderer"
import { ChartAreaInteractive } from "./chart-area-interactive"
import { SectionCards } from "./section-cards"

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
      
      {/* Metrics Cards */}
      <div className="px-0">
        <SectionCards viewType={view} />
      </div>
      
      {/* Chart */}
      <div className="px-0">
        <ChartAreaInteractive viewType={view} />
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
          children={(activeTab, viewMode, setSelectedTask, setSelectedNote, setSelectedMeeting, setSelectedEmail) => {
            // ---- Generate mock data per tab ----
            const tasks = [
              {
                id: 1,
                title: `Quarterly valuation for ${selectedInvestment.name}`,
                priority: "High",
                status: "pending",
                assignee: "You",
                dueDate: "2024-08-15",
                description: "Update fair-value marks and supporting memo.",
              },
              {
                id: 2,
                title: "Update IRR model",
                priority: "Medium",
                status: "pending",
                assignee: "Analyst Team",
                dueDate: "2024-08-20",
                description: "Incorporate latest actuals into return model.",
              },
            ]

            const notes = [
              { id: 1, title: "CEO update summary", author: "You", date: "2024-07-30", tags: ["update"] },
              { id: 2, title: "Board slides highlights", author: "Associate", date: "2024-06-15", tags: ["board"] },
            ]

            const emails = [
              { id: 1, subject: "Q2 KPIs", from: "cfo@company.com", date: "2024-07-25", status: "Read" },
              { id: 2, subject: "Follow-up items", from: "investor.relations@fund.com", date: "2024-07-28", status: "Unread" },
            ]

            const meetings = [
              { id: 1, title: "Portfolio review call", date: "2024-08-01", time: "10:00 AM", status: "Scheduled", attendees: ["You", "PM"] },
            ]

            const files = [
              { id: 1, name: `${selectedInvestment.name.replace(/ /g, "_")}_Q2_Report.pdf`, uploadedBy: "You", uploadedDate: "2024-07-26", size: "1.8 MB" },
            ]

            const performance = [
              { id: 1, metric: "MOIC", value: "1.23x" },
              { id: 2, metric: "IRR", value: "14.8%" },
              { id: 3, metric: "TVPI", value: "1.40x" },
            ]

            const dataMap: Record<string, any[]> = { tasks, notes, emails, meetings, files, performance }

            if (activeTab === "details") {
              return null // details handled by detailsPanel prop
            }

            // Custom simple renderer for performance tab
            if (activeTab === "performance") {
              return (
                <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {performance.map((p) => (
                    <div key={p.id} className="rounded-lg border p-4 text-center">
                      <p className="text-xs text-muted-foreground uppercase mb-1">{p.metric}</p>
                      <p className="text-xl font-semibold">{p.value}</p>
                    </div>
                  ))}
                </div>
              )
            }

            return (
              <TabContentRenderer
                activeTab={activeTab}
                viewMode={viewMode}
                data={dataMap[activeTab] || []}
                onTaskClick={setSelectedTask}
                onNoteClick={setSelectedNote}
                onMeetingClick={setSelectedMeeting}
                onEmailClick={setSelectedEmail}
              />
            )
          }}
        />
      )}
    </div>
  )
}
