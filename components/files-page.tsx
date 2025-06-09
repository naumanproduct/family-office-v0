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

    // Define additional content with Activity section
    const additionalContent = (
      <>
        {/* Show all values button */}
        <Button variant="link" className="h-auto p-0 text-xs text-blue-600">
          Show all values
        </Button>

        {/* Activity Section - Always shown, regardless of mode */}
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-sm font-medium">Activity</h4>
            <Button variant="outline" size="sm">
              <PlusIcon className="h-4 w-4" />
              Add activity
            </Button>
          </div>
          <FileActivityContent file={selectedFile} />
        </div>
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

// File Activity component
function FileActivityContent({ file }: { file: any }) {
  const [expandedActivity, setExpandedActivity] = useState<number | null>(null);

  const activities = [
    {
      id: 1,
      type: "upload",
      actor: file.uploadedBy || "John Doe",
      action: "uploaded",
      target: file.title || file.name,
      timestamp: "2 days ago",
      date: "2023-01-15",
      details: {
        fileSize: file.fileSize || "2.4 MB",
        version: "1.0",
        location: "Documents > Legal",
        deviceInfo: "Web Browser (Chrome)",
        ipAddress: "192.168.1.1",
      },
    },
    {
      id: 2,
      type: "share",
      actor: "Sarah Wilson",
      action: "shared",
      target: file.title || file.name,
      timestamp: "1 week ago",
      date: "2023-01-10",
      details: {
        sharedWith: ["Jane Smith", "Robert Johnson"],
        permissions: "View Only",
        message: "Please review this document before our meeting on Tuesday.",
        notificationSent: true,
      },
    },
    {
      id: 3,
      type: "modify",
      actor: "James Miller",
      action: "modified",
      target: file.title || file.name,
      timestamp: "2 weeks ago",
      date: "2023-01-03",
      details: {
        previousVersion: "1.2",
        currentVersion: "1.3",
        changes: "Updated formatting and fixed typos in section 3.2",
        changedSections: ["3.2", "Appendix B"],
      },
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "upload":
        return <div className="h-2 w-2 rounded-full bg-green-500"></div>;
      case "share":
        return <div className="h-2 w-2 rounded-full bg-blue-500"></div>;
      case "modify":
        return <div className="h-2 w-2 rounded-full bg-amber-500"></div>;
      case "download":
        return <div className="h-2 w-2 rounded-full bg-purple-500"></div>;
      default:
        return <div className="h-2 w-2 rounded-full bg-gray-500"></div>;
    }
  };

  const formatActivityText = (activity: any) => {
    return (
      <span>
        <span className="font-medium">{activity.actor}</span> {activity.action}{" "}
        <span className="font-medium">{activity.target}</span>
      </span>
    );
  };

  const renderExpandedDetails = (activity: any) => {
    switch (activity.type) {
      case "upload":
        return (
          <div className="mt-4 space-y-3">
            <div>
              <h5 className="text-sm font-medium mb-2">Upload Details</h5>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">File Size:</span>{" "}
                  <span>{activity.details.fileSize}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Version:</span>{" "}
                  <span>{activity.details.version}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Location:</span>{" "}
                  <span>{activity.details.location}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Device:</span>{" "}
                  <span>{activity.details.deviceInfo}</span>
                </div>
              </div>
            </div>
          </div>
        );
      case "share":
        return (
          <div className="mt-4 space-y-3">
            <div>
              <h5 className="text-sm font-medium mb-2">Share Details</h5>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Shared With:</span>{" "}
                  <div className="mt-1">
                    {activity.details.sharedWith.map((person: string, index: number) => (
                      <div key={index} className="text-blue-600">{person}</div>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Permissions:</span>{" "}
                  <span>{activity.details.permissions}</span>
                </div>
              </div>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-1">Message</h5>
              <p className="text-sm text-muted-foreground">{activity.details.message}</p>
            </div>
          </div>
        );
      case "modify":
        return (
          <div className="mt-4 space-y-3">
            <div>
              <h5 className="text-sm font-medium mb-2">Modification Details</h5>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Previous Version:</span>{" "}
                  <span>{activity.details.previousVersion}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Current Version:</span>{" "}
                  <span>{activity.details.currentVersion}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Changed Sections:</span>{" "}
                  <span>{activity.details.changedSections.join(", ")}</span>
                </div>
              </div>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-1">Changes Made</h5>
              <p className="text-sm text-muted-foreground">{activity.details.changes}</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id}>
          <button
            onClick={() => setExpandedActivity(expandedActivity === activity.id ? null : activity.id)}
            className="flex items-start gap-3 w-full text-left p-3 rounded-lg border hover:bg-muted/50 transition-colors"
          >
            <div className="mt-1">{getActivityIcon(activity.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm">{formatActivityText(activity)}</div>
              <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
            </div>
            <ChevronDownIcon
              className={`h-4 w-4 text-muted-foreground transition-transform ${
                expandedActivity === activity.id ? "rotate-180" : ""
              }`}
            />
          </button>
          {expandedActivity === activity.id && (
            <div className="ml-6 pl-3 border-l-2 border-muted">{renderExpandedDetails(activity)}</div>
          )}
        </div>
      ))}
    </div>
  );
} 