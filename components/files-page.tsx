"use client"

import { useState, useRef } from "react"
import { FileTextIcon, CalendarIcon, UserIcon, FileIcon, PlusIcon, ChevronDownIcon } from "lucide-react"
import { MasterDrawer } from "@/components/master-drawer"
import { FileContent } from "@/components/shared/file-content"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MasterDetailsPanel } from "@/components/shared/master-details-panel"
import { ActivitySection } from "@/components/shared/activity-section"
import { type ActivityItem } from "@/components/shared/activity-content"

// Default tabs for the file details drawer
const fileTabs = [
  {
    id: "details",
    label: "Details",
    count: null,
    icon: FileTextIcon,
  },
  {
    id: "notes",
    label: "Notes",
    count: null,
    icon: FileTextIcon,
  },
]

export function FilesPage() {
  const [selectedFile, setSelectedFile] = useState<any>(null)
  const drawerTriggerRef = useRef<HTMLButtonElement>(null)

  // Function to handle file selection
  const handleFileSelect = (file: any) => {
    setSelectedFile(file)
    // Simulate a click on the drawer trigger to open it
    setTimeout(() => {
      if (drawerTriggerRef.current) {
        drawerTriggerRef.current.click()
      }
    }, 0)
  }

  // Function to render the file details panel
  const renderFileDetailsPanel = (isFullScreen = false) => {
    if (!selectedFile) return null

    // Define field groups for the MasterDetailsPanel
    const fieldGroups = [
      {
        id: "file-info",
        label: "File Information",
        icon: FileTextIcon,
        fields: [
          {
            label: "Title",
            value: selectedFile.title || selectedFile.name,
          },
          {
            label: "File Name",
            value: selectedFile.fileName || selectedFile.name,
          },
          {
            label: "File Type",
            value: (
              <Badge variant="secondary" className="text-xs">
                {(selectedFile.fileType || selectedFile.type || "FILE").toUpperCase()}
              </Badge>
            ),
          },
          {
            label: "Upload Date",
            value: selectedFile.uploadedAt || "N/A",
          },
          {
            label: "File Size",
            value: selectedFile.fileSize || "N/A",
          },
          {
            label: "Uploaded By",
            value: selectedFile.uploadedBy || "N/A",
          },
          {
            label: "Category",
            value: selectedFile.category ? (
              <Badge variant="outline">{selectedFile.category}</Badge>
            ) : "N/A",
          },
          {
            label: "Status",
            value: selectedFile.status ? (
              <Badge
                variant={
                  selectedFile.status === "Final" ? "default" : 
                  selectedFile.status === "Draft" ? "secondary" : "outline"
                }
              >
                {selectedFile.status}
              </Badge>
            ) : "N/A",
          },
          {
            label: "Tags",
            value: selectedFile.tags && selectedFile.tags.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {selectedFile.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : "No tags",
          },
          {
            label: "Related To",
            value: selectedFile.relatedTo ? `${selectedFile.relatedTo.type}: ${selectedFile.relatedTo.name}` : "N/A",
            isLink: selectedFile.relatedTo !== undefined,
          },
        ],
      },
    ]

    // Define activities for this file
    const activities: ActivityItem[] = [
      {
        id: 1,
        type: "upload",
        actor: "Sarah Johnson",
        action: "uploaded",
        target: selectedFile.title || selectedFile.name,
        timestamp: "2 days ago",
        date: "2023-05-18",
        details: {
          fileSize: selectedFile.fileSize || "2.4 MB",
          version: "1.0",
          location: "Documents/Client Files/",
          deviceInfo: "Web Browser (Chrome)",
        },
      },
      {
        id: 2,
        type: "share",
        actor: "Michael Chen",
        action: "shared",
        target: selectedFile.title || selectedFile.name,
        timestamp: "1 week ago",
        date: "2023-05-13",
        details: {
          sharedWith: ["David Wilson", "Emma Rodriguez", "Legal Team"],
          permissions: "View and Comment",
          message: "Please review this document before our meeting on Friday.",
        },
      },
      {
        id: 3,
        type: "modify",
        actor: "Emma Rodriguez",
        action: "modified",
        target: selectedFile.title || selectedFile.name,
        timestamp: "2 weeks ago",
        date: "2023-05-06",
        details: {
          previousVersion: "v1.2",
          currentVersion: "v1.3",
          changedSections: ["Introduction", "Financial Summary", "Conclusion"],
          changes: "Updated financial projections and added new market analysis section.",
        },
      },
    ];

    // Define additional content with Activity section
    const additionalContent = (
      <>
        {/* Show all values button */}
        <Button variant="link" className="h-auto p-0 text-xs text-blue-600">
          Show all values
        </Button>

        {/* Activity Section - Always shown, regardless of mode */}
        <ActivitySection activities={activities} />
      </>
    );

    return <MasterDetailsPanel fieldGroups={fieldGroups} isFullScreen={isFullScreen} additionalContent={additionalContent} />
  }

  // Function to render content for each tab
  const renderTabContent = (activeTab: string, viewMode: "card" | "list" | "table") => {
    switch (activeTab) {
      case "details":
        return renderFileDetailsPanel()
      case "notes":
        return (
          <Card className="border-none shadow-none">
            <CardHeader className="px-0 pt-0">
              <p className="text-sm text-muted-foreground">No notes attached to this file yet.</p>
            </CardHeader>
          </Card>
        )
      default:
        return null
    }
  }

  return (
    <>
      <FileContent onFileSelect={handleFileSelect} />
      
      <MasterDrawer
        trigger={<button ref={drawerTriggerRef} className="hidden" />}
        title={selectedFile?.title || selectedFile?.name || "File Details"}
        recordType="Files"
        subtitle={selectedFile ? `${selectedFile.fileType || selectedFile.type || "File"} • ${selectedFile.category || "Document"}` : ""}
        tabs={fileTabs}
        detailsPanel={renderFileDetailsPanel}
      >
        {renderTabContent}
      </MasterDrawer>
    </>
  )
} 