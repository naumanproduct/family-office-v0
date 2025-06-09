"use client"

import { useState, useRef } from "react"
import { FileTextIcon, CalendarIcon, UserIcon, FileIcon } from "lucide-react"
import { MasterDrawer } from "@/components/master-drawer"
import { FileContent } from "@/components/shared/file-content"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MasterDetailsPanel } from "@/components/shared/master-details-panel"

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
        id: "basic-info",
        label: "Basic Information",
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
        ],
      },
      {
        id: "additional-info",
        label: "Additional Information",
        icon: FileTextIcon,
        fields: [
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

    return <MasterDetailsPanel fieldGroups={fieldGroups} isFullScreen={isFullScreen} />
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