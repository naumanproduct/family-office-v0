"use client"

import * as React from "react"
import {
  FileTextIcon,
  FileIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PlusIcon,
  EditIcon,
  FolderIcon,
  CheckSquareIcon
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { TypableArea } from "@/components/typable-area"
import { FileContent, getContextualFiles } from "@/components/shared/file-content"
import { UnifiedActivitySection, ActivityItem } from "@/components/shared/unified-activity-section"
import { generateNoteActivities } from "@/components/shared/activity-generators"
import { UnifiedTaskTable } from "@/components/shared/unified-task-table"
import { TabContentRenderer } from "@/components/shared/tab-content-renderer"
import { ViewModeSelector } from "@/components/shared/view-mode-selector"
import { formatDate } from "@/lib/utils"
import { UnifiedDetailsPanel } from "@/components/shared/unified-details-panel"
import { buildStandardDetailSections } from "@/components/shared/detail-section-builder"

interface NoteDetailsViewProps {
  note: any
  onBack: () => void
  hideAddNotes?: boolean
  isFullScreen?: boolean
  onTabChange?: (tab: string) => void
}

export function NoteDetailsView({ note, onBack, hideAddNotes = false, isFullScreen = false, onTabChange }: NoteDetailsViewProps) {
  const [noteTitle, setNoteTitle] = React.useState(note.title || "")
  const [isEditingTitle, setIsEditingTitle] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("details")
  const [editingField, setEditingField] = React.useState<string | null>(null)
  const [fieldValues, setFieldValues] = React.useState({
    title: note?.title || "Untitled Note",
    topic: note?.topic || "",
    author: note?.author || "Unknown Author",
    createdAt: note?.createdAt || new Date().toISOString(),
    updatedAt: note?.updatedAt || new Date().toISOString(),
  })

  const [noteText, setNoteText] = React.useState(note?.content || `Investment Review Summary:
This note captures key insights from our quarterly portfolio review and strategic planning session.

Portfolio Analysis:
- Current AUM: $485M across 23 entities
- YTD Performance: +12.3% (outperforming benchmark by 280bps)
- Asset Allocation: 42% Private Equity, 35% Public Markets, 18% Fixed Income, 5% Alternatives
- Geographic Distribution: 60% North America, 25% Europe, 15% Asia-Pacific

Key Investment Decisions:
1. Approved $15M commitment to emerging markets growth fund
2. Initiated position reduction in technology sector (currently overweight at 32%)
3. Exploring co-investment opportunity in healthcare logistics platform
4. Evaluating secondary market opportunities for mature PE positions

Risk Management Considerations:
- Increasing hedge ratio on international equity exposure due to currency volatility
- Implementing stop-loss protocols for concentrated positions exceeding 5% of portfolio
- Enhanced due diligence procedures for new fund managers (minimum 5-year track record)
- Quarterly stress testing of portfolio under various market scenarios

Tax Optimization Strategies:
- Identified $2.3M in potential tax loss harvesting opportunities
- Restructuring Delaware entities to optimize state tax exposure
- Exploring Qualified Opportunity Zone investments for capital gains deferral
- Year-end charitable giving strategy to offset realized gains

Compliance Updates:
- All entities current with quarterly filings
- KYC documentation updated for international banking relationships
- New beneficial ownership reporting requirements effective Q1 2024
- Annual audit preparation commenced with target completion by March

Next Steps:
- Execute approved rebalancing trades by month-end
- Schedule due diligence calls with three prospective fund managers
- Review and update Investment Policy Statement
- Prepare detailed attribution analysis for board presentation

This note will be updated following next month's investment committee meeting.`)
  const [expandedActivity, setExpandedActivity] = React.useState<number | null>(null)
  const [filesViewMode, setFilesViewMode] = React.useState<"table" | "card" | "list">("table")
  const [tasksViewMode, setTasksViewMode] = React.useState<"table" | "card" | "list">(isFullScreen ? "table" : "list")

  // State for which sections are open
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({
    details: true,
    addNotes: true,
  })

  // Toggle section open/closed
  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  const tabs = [
    { id: "details", label: "Details", icon: FileTextIcon },
    { id: "files", label: "Files", icon: FolderIcon },
    { id: "tasks", label: "Tasks", icon: CheckSquareIcon }
  ]

  // Mock activities for activity section
  const activities = generateNoteActivities()

  // Mock data for tasks related to this note
  const mockTasks = [
    {
      id: 1,
      title: "Review note content for accuracy",
      status: "In Progress",
      priority: "High",
      assignee: "John Smith",
      dueDate: "2023-06-15",
      description: "Verify all information in the note is accurate and up-to-date."
    },
    {
      id: 2,
      title: "Follow up on action items from note",
      status: "To Do",
      priority: "Medium",
      assignee: "Sarah Johnson",
      dueDate: "2023-06-20",
      description: "Address all action items mentioned in the note."
    },
    {
      id: 3,
      title: "Share note with stakeholders",
      status: "Completed",
      priority: "Low",
      assignee: "Michael Brown",
      dueDate: "2023-06-10",
      description: "Distribute note to all relevant team members."
    },
    {
      id: 4,
      title: "Update note with feedback",
      status: "To Do",
      priority: "Medium",
      assignee: "John Smith",
      dueDate: "2023-06-25",
      description: "Incorporate feedback from stakeholders into the note."
    }
  ]

  const handleFieldEdit = (field: string, value: any) => {
    setFieldValues((prev) => ({ ...prev, [field]: value }))
    setEditingField(null)
  }

  // Activity content component
  const NoteActivityContent = () => {
    return <UnifiedActivitySection activities={activities} />;
  };

  // Custom content for tabs other than details
  const getTabContent = () => {
    if (activeTab === "tasks") {
      return (
        <>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Tasks</h3>
            <div className="flex items-center gap-2">
              <ViewModeSelector viewMode={tasksViewMode} onViewModeChange={setTasksViewMode} />
              <Button variant="outline" size="sm" onClick={() => console.log("Add task")}>
                <PlusIcon className="h-4 w-4" />
                Add task
              </Button>
            </div>
          </div>
          <UnifiedTaskTable data={mockTasks} viewMode={tasksViewMode} isInDrawer={!isFullScreen} />
        </>
      );
    } else if (activeTab === "files") {
      // Get contextual files
      const files = getContextualFiles(note?.title);
      
      // Transform files to match TabContentRenderer format
      const transformedFiles = files.map(file => ({
        ...file,
        name: file.name || file.fileName || file.title,
        uploadedBy: file.uploadedBy || "Unknown",
        uploadedDate: file.uploadedDate || (file.uploadedAt ? formatDate(new Date(file.uploadedAt)) : "Unknown"),
        size: file.size || file.fileSize || "Unknown",
      }));
      
      return (
        <>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Files</h3>
            <div className="flex items-center gap-2">
              <ViewModeSelector viewMode={filesViewMode} onViewModeChange={setFilesViewMode} />
              <Button variant="outline" size="sm" onClick={() => console.log("Add file")}>
                <PlusIcon className="h-4 w-4" />
                Add file
              </Button>
            </div>
          </div>
          <TabContentRenderer
            activeTab="files"
            viewMode={filesViewMode}
            data={transformedFiles}
          />
        </>
      );
    }
    return null;
  };

  // Call onTabChange when tab changes
  React.useEffect(() => {
    if (onTabChange) {
      onTabChange(activeTab)
    }
  }, [activeTab, onTabChange])

  return (
    <div className="flex flex-col flex-1">
      {/* Note Header - Only show when not in fullscreen mode */}
      {!isFullScreen && (
        <div className="border-b bg-background px-6 py-2">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <FileIcon className="h-4 w-4" />
            </div>
            <div className="flex-1">
              {isEditingTitle ? (
                <Input
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  onBlur={() => setIsEditingTitle(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setIsEditingTitle(false)
                    }
                    if (e.key === "Escape") {
                      setNoteTitle(note.title || "")
                      setIsEditingTitle(false)
                    }
                  }}
                  className="text-lg font-semibold border-none p-0 h-auto bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                  autoFocus
                />
              ) : (
                <h2
                  className="text-lg font-semibold cursor-pointer hover:bg-muted/50 px-1 py-0.5 rounded -ml-1"
                  onClick={() => setIsEditingTitle(true)}
                >
                  {noteTitle || "Untitled"}
                </h2>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tabs - hide in fullscreen to avoid duplication */}
      {!isFullScreen && (
        <div className="border-b bg-background px-6 py-1">
          <div className="flex gap-6 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 whitespace-nowrap py-2 text-sm font-medium transition-colors ${
                    activeTab === tab.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary rounded-full"></span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Tab Content */}
      {activeTab === "details" ? (
        <div className="flex flex-col flex-1">
          {/* Use UnifiedDetailsPanel to show all related sections */}
          <UnifiedDetailsPanel
            sections={buildStandardDetailSections({
              infoTitle: "Note Details",
              infoIcon: <FileTextIcon className="h-4 w-4 text-muted-foreground" />,
              infoFields: [
                { label: "Topic", value: fieldValues.topic },
                { label: "Author", value: fieldValues.author },
                { label: "Created", value: formatDate(new Date(fieldValues.createdAt)) },
                { label: "Updated", value: formatDate(new Date(fieldValues.updatedAt)) }
              ],
              // Add mock data for related sections
              companies: [
                { id: 1, name: "TechFlow Inc", type: "Investment Target", date: "2 days ago" },
                { id: 2, name: "Global Ventures", type: "Co-investor", date: "1 week ago" }
              ],
              people: [
                { id: 1, name: "Sarah Johnson", role: "Investment Manager", date: "2 hours ago" },
                { id: 2, name: "Michael Chen", role: "Analyst", date: "Yesterday" }
              ],
              entities: [
                { id: 1, name: "Johnson Family Trust", type: "Trust", date: "3 days ago" },
                { id: 2, name: "Tech Investment LLC", type: "LLC", date: "1 week ago" }
              ],
              investments: [
                { id: 1, name: "Series B - TechFlow", amount: "$10M", date: "Pending" },
                { id: 2, name: "Growth Fund III", amount: "$50M", date: "Active" }
              ],
              opportunities: [
                { id: 1, name: "SaaS Platform Acquisition", status: "Due Diligence", date: "In Progress" },
                { id: 2, name: "Healthcare Tech Investment", status: "Evaluating", date: "Q1 2024" }
              ]
            })}
            activityContent={<NoteActivityContent />}
            isFullScreen={isFullScreen}
          />
        </div>
      ) : (
        <div className={`${isFullScreen ? 'px-6 py-6' : 'p-6'}`}>
          {getTabContent()}
        </div>
      )}
    </div>
  )
}
