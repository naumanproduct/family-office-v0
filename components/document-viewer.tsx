"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { formatDate } from "@/lib/utils"
import {
  ChevronLeftIcon,
  ExpandIcon,
  XIcon,
  ChevronDownIcon,
  DownloadIcon,
  PrinterIcon,
  ExternalLinkIcon,
  Share2Icon,
  FileTextIcon,
  ClockIcon,
  MessageSquareIcon,
  MailIcon,
  FolderIcon,
  PlusIcon,
  FileIcon,
  BuildingIcon,
  UserIcon,
  LayoutIcon,
  DollarSignIcon,
  TrendingUpIcon,
  CalendarIcon,
  MoreHorizontalIcon,
  EyeIcon,
  ChevronRightIcon,
  PanelRightCloseIcon,
  PanelRightOpenIcon,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UnifiedActivitySection } from "@/components/shared/unified-activity-section"
import { generateFileActivities } from "@/components/shared/activity-generators"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { ViewModeSelector } from "@/components/shared/view-mode-selector"
import { TabContentRenderer } from "@/components/shared/tab-content-renderer"
import { Label } from "@/components/ui/label"
import { UnifiedDetailsPanel, DetailSection, DetailField } from "@/components/shared/unified-details-panel"

interface Tab {
  id: string
  label: string
  count: number | null
  icon: React.ComponentType<{ className?: string }>
}

interface DocumentViewerProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  file: any // The file to display
  startInFullScreen?: boolean // Add this prop to control initial state
}

export function DocumentViewer({ isOpen, onOpenChange, file, startInFullScreen = false }: DocumentViewerProps) {
  const [isFullScreen, setIsFullScreen] = React.useState(startInFullScreen)
  const [activeTab, setActiveTab] = React.useState("details")
  const [viewMode, setViewMode] = React.useState<"card" | "list" | "table">("table")
  const [isRightPanelCollapsed, setIsRightPanelCollapsed] = React.useState(false)
  
  // Reset to startInFullScreen when opening
  React.useEffect(() => {
    if (isOpen) {
      setIsFullScreen(startInFullScreen)
    }
  }, [isOpen, startInFullScreen])
  
  // Define tabs for the document viewer - define outside of render cycle
  const tabs = React.useMemo(() => [
    { id: "details", label: "Details", count: null, icon: FileIcon },
    { id: "tasks", label: "Tasks", count: 0, icon: ClockIcon },
    { id: "notes", label: "Notes", count: 0, icon: FileIcon },
  ], []);
  
  // ESC key handler for full screen mode
  React.useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isFullScreen) {
        setIsFullScreen(false)
        onOpenChange(false) // Close the drawer entirely
      }
    }

    if (isFullScreen) {
      document.addEventListener("keydown", handleEscKey)
      return () => {
        document.removeEventListener("keydown", handleEscKey)
      }
    }
  }, [isFullScreen, onOpenChange])
  
  // Cmd/Ctrl+B handler for toggling right panel in fullscreen
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isFullScreen && (event.metaKey || event.ctrlKey) && event.key === 'b') {
        event.preventDefault()
        setIsRightPanelCollapsed(prev => !prev)
      }
    }

    if (isFullScreen) {
      document.addEventListener("keydown", handleKeyDown)
      return () => {
        document.removeEventListener("keydown", handleKeyDown)
      }
    }
  }, [isFullScreen])
  
  // Lock body scroll when full screen is active
  React.useEffect(() => {
    if (isFullScreen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Add styles to prevent scrolling
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restore scroll position and remove styles
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      };
    }
  }, [isFullScreen]);
  
  // Handle tab switching between full screen and regular mode
  React.useEffect(() => {
    // When switching to full screen mode, keep the current tab
    // No need to switch away from details tab anymore
    
    // When switching back from full screen, if current tab doesn't exist in regular tabs, switch to details
    if (!isFullScreen && activeTab !== "details" && !tabs.some(tab => tab.id === activeTab)) {
      setActiveTab("details")
    }
  }, [isFullScreen, activeTab, tabs]) // Include tabs in dependency array

  // File preview component based on file type
  const FilePreview = ({ file }: { file: any }) => {
    if (!file) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">No file selected</p>
        </div>
      )
    }

    const getFileType = () => {
      const fileType = (file.fileType || file.type || "").toLowerCase()
      if (fileType.includes("pdf")) return "pdf"
      if (fileType.includes("doc")) return "doc"
      if (fileType.includes("xls")) return "excel"
      if (fileType.includes("ppt")) return "powerpoint"
      if (fileType.includes("jpg") || fileType.includes("jpeg") || fileType.includes("png") || fileType.includes("gif")) return "image"
      return "other"
    }
    
    const fileType = getFileType()
    
    // Mock file URLs for demonstration - in a real app, you would use actual file URLs
    const fileUrl = file.url || `https://example.com/files/${file.id}`
    
    switch (fileType) {
      case "pdf":
        return (
          <div className="w-full h-full bg-gray-100 overflow-y-auto">
            {/* Mock PDF pages */}
            <div className="max-w-4xl mx-auto py-8 space-y-8">
              {/* Page 1 */}
              <div className="bg-white shadow-lg mx-4" style={{ aspectRatio: '8.5/11' }}>
                <div className="p-16 h-full flex flex-col">
                  <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-4">Investment Agreement</h1>
                    <p className="text-gray-600">Document ID: {file.id || 'DOC-001'}</p>
                  </div>
                  
                  <div className="space-y-4 text-gray-700">
                    <p className="leading-relaxed">
                      This Investment Agreement ("Agreement") is entered into as of the date last signed below (the "Effective Date") by and between the parties identified below.
                    </p>
                    
                    <h2 className="text-xl font-semibold mt-6">1. Parties</h2>
                    <p className="leading-relaxed">
                      This Agreement is between Family Office Holdings LLC ("Investor") and Portfolio Company Inc. ("Company"), collectively referred to as the "Parties."
                    </p>
                    
                    <h2 className="text-xl font-semibold mt-6">2. Investment Terms</h2>
                    <p className="leading-relaxed">
                      Subject to the terms and conditions set forth in this Agreement, Investor agrees to invest the principal amount specified in Schedule A attached hereto.
                    </p>
                    
                    <h2 className="text-xl font-semibold mt-6">3. Representations and Warranties</h2>
                    <p className="leading-relaxed">
                      Each Party represents and warrants to the other Party that: (a) it has full corporate power and authority to enter into this Agreement; (b) the execution and delivery of this Agreement has been duly authorized by all necessary corporate action.
                    </p>
                  </div>
                  
                  <div className="mt-auto text-center text-gray-400 text-sm">
                    Page 1 of 3
                  </div>
                </div>
              </div>
              
              {/* Page 2 */}
              <div className="bg-white shadow-lg mx-4" style={{ aspectRatio: '8.5/11' }}>
                <div className="p-16 h-full flex flex-col">
                  <div className="space-y-4 text-gray-700">
                    <h2 className="text-xl font-semibold">4. Use of Proceeds</h2>
                    <p className="leading-relaxed">
                      The Company shall use the proceeds from the investment solely for the purposes set forth in the business plan previously provided to the Investor and for general working capital purposes.
                    </p>
                    
                    <h2 className="text-xl font-semibold mt-6">5. Governance</h2>
                    <p className="leading-relaxed">
                      Following the closing of the investment, the Investor shall have the right to appoint one (1) member to the Company's Board of Directors. The Company agrees to take all necessary actions to effectuate such appointment.
                    </p>
                    
                    <h2 className="text-xl font-semibold mt-6">6. Information Rights</h2>
                    <p className="leading-relaxed">
                      The Company shall provide to the Investor: (a) quarterly unaudited financial statements within forty-five (45) days after the end of each fiscal quarter; (b) annual audited financial statements within ninety (90) days after the end of each fiscal year; and (c) such other information as the Investor may reasonably request.
                    </p>
                    
                    <h2 className="text-xl font-semibold mt-6">7. Transfer Restrictions</h2>
                    <p className="leading-relaxed">
                      The securities acquired pursuant to this Agreement may not be transferred without the prior written consent of the Company, except for transfers to affiliates of the Investor.
                    </p>
                  </div>
                  
                  <div className="mt-auto text-center text-gray-400 text-sm">
                    Page 2 of 3
                  </div>
                </div>
              </div>
              
              {/* Page 3 */}
              <div className="bg-white shadow-lg mx-4" style={{ aspectRatio: '8.5/11' }}>
                <div className="p-16 h-full flex flex-col">
                  <div className="space-y-4 text-gray-700">
                    <h2 className="text-xl font-semibold">8. Confidentiality</h2>
                    <p className="leading-relaxed">
                      Each Party agrees to maintain the confidentiality of all non-public information received from the other Party in connection with this Agreement and the transactions contemplated hereby.
                    </p>
                    
                    <h2 className="text-xl font-semibold mt-6">9. Miscellaneous</h2>
                    <p className="leading-relaxed">
                      This Agreement shall be governed by the laws of the State of Delaware. Any disputes arising under this Agreement shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.
                    </p>
                  </div>
                  
                  <div className="mt-auto space-y-8">
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <p className="font-semibold mb-2">INVESTOR:</p>
                        <div className="border-b border-gray-400 mb-2"></div>
                        <p className="text-sm">Family Office Holdings LLC</p>
                        <p className="text-sm">By: _______________________</p>
                        <p className="text-sm">Name:</p>
                        <p className="text-sm">Title:</p>
                        <p className="text-sm">Date:</p>
                      </div>
                      <div>
                        <p className="font-semibold mb-2">COMPANY:</p>
                        <div className="border-b border-gray-400 mb-2"></div>
                        <p className="text-sm">Portfolio Company Inc.</p>
                        <p className="text-sm">By: _______________________</p>
                        <p className="text-sm">Name:</p>
                        <p className="text-sm">Title:</p>
                        <p className="text-sm">Date:</p>
                      </div>
                    </div>
                    
                    <div className="text-center text-gray-400 text-sm">
                      Page 3 of 3
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      case "image":
        return (
          <div className="w-full h-full flex flex-col">
            <div className="bg-muted p-2 flex items-center justify-between">
              <div>
                <span className="text-sm font-medium">{file.title || file.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <DownloadIcon className="h-4 w-4 mr-1" />
                  Download
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2Icon className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center bg-muted-foreground/10 p-4">
              <div className="relative max-w-md max-h-[80vh] flex items-center justify-center">
                <img
                  src={fileUrl}
                  alt={file.title || file.name}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://placehold.co/600x400?text=Image+Preview";
                  }}
                />
              </div>
            </div>
          </div>
        )
      default:
        return (
          <div className="w-full h-full flex items-center justify-center bg-muted-foreground/10 p-4">
            <div className="max-w-md text-center">
              <FileTextIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">{file.title || file.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Preview not available for this file type.
              </p>
              <Button variant="outline" size="sm">
                <DownloadIcon className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
        )
    }
  }

  // File details panel component for the drawer
  const FileDetailsPanel = ({ isFullScreen = false }: { isFullScreen?: boolean }) => {
    // Guard against null file
    if (!file) {
      return (
        <div className={`px-6 py-4 flex items-center justify-center ${isFullScreen ? 'h-[calc(100vh-73px)]' : 'h-[300px]'}`}>
          <p className="text-muted-foreground">Select a file to view details</p>
        </div>
      );
    }

    // Mock data for related entities
    const relatedData = {
      companies: [
        { id: 1, name: "TechFlow Inc.", type: "Portfolio Company" },
        { id: 2, name: "Meridian Capital", type: "Investment Fund" },
      ],
      people: [
        { id: 1, name: "Sarah Johnson", role: "CEO" },
        { id: 2, name: "Michael Chen", role: "Investment Manager" },
        { id: 3, name: "David Williams", role: "Board Member" },
      ],
      entities: [
        { id: 1, name: "Trust #1231", type: "Family Trust" },
        { id: 2, name: "Offshore Holdings LLC", type: "Holding Company" },
      ],
      investments: [
        { id: 1, name: "Series B Round", amount: "$5M" },
        { id: 2, name: "Series C Round", amount: "$10M" },
      ],
      opportunities: [
        { id: 1, name: "Expansion Funding", status: "In Discussion" },
        { id: 2, name: "Strategic Partnership", status: "Initial Review" },
      ],
    };

    // Define sections for UnifiedDetailsPanel
    const sections: DetailSection[] = [
      {
        id: "details",
        title: "File Details",
        icon: <FileIcon className="h-4 w-4 text-muted-foreground" />,
        fields: [
          {
            label: "File Name",
            value: file.fileName || file.name || "Untitled",
          },
          {
            label: "Title",
            value: file.title || file.name || "Untitled",
          },
          {
            label: "Description",
            value: file.description || "No description provided",
          },
          {
            label: "Category",
            value: file.category || "Uncategorized",
          },
          {
            label: "Status",
            value: file.status || "Unknown",
          },
          {
            label: "File Type",
            value: (file.fileType || file.type || "FILE").toUpperCase(),
          },
          {
            label: "Size",
            value: file.fileSize || file.size || "Unknown",
          },
          {
            label: "Uploaded By",
            value: file.uploadedBy || "Unknown",
          },
          {
            label: "Upload Date",
            value: file.uploadedDate || (file.uploadedAt ? formatDate(new Date(file.uploadedAt)) : "Unknown"),
          },
        ],
      },
      {
        id: "companies",
        title: "Companies",
        icon: <BuildingIcon className="h-4 w-4 text-muted-foreground" />,
        sectionData: {
          items: relatedData.companies
        },
      },
      {
        id: "people",
        title: "People",
        icon: <UserIcon className="h-4 w-4 text-muted-foreground" />,
        sectionData: {
          items: relatedData.people
        },
      },
      {
        id: "entities",
        title: "Entities",
        icon: <LayoutIcon className="h-4 w-4 text-muted-foreground" />,
        sectionData: {
          items: relatedData.entities
        },
      },
      {
        id: "investments",
        title: "Investments",
        icon: <DollarSignIcon className="h-4 w-4 text-muted-foreground" />,
        sectionData: {
          items: relatedData.investments
        },
      },
      {
        id: "opportunities",
        title: "Opportunities",
        icon: <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />,
        sectionData: {
          items: relatedData.opportunities
        },
      },
    ];

    // Handler functions for related items
    const handleAddRecord = (sectionId: string) => {
      console.log("Add new related record for section:", sectionId);
    };

    const handleUnlinkRecord = (sectionId: string, id: number) => {
      console.log("Unlink record", id, "from section", sectionId);
    };

    const navigateToRecord = (recordType: string, id: number) => {
      console.log(`Navigate to ${recordType} record with ID: ${id}`);
    };

    // Mock activities for the file
    const activities = generateFileActivities()

    return (
      <UnifiedDetailsPanel
        sections={sections}
        isFullScreen={isFullScreen}
        onNavigateToRecord={navigateToRecord}
        onAddRecord={handleAddRecord}
        onUnlinkRecord={handleUnlinkRecord}
        activityContent={
          <UnifiedActivitySection activities={activities} />
        }
      />
    );
  };

  // File activity content component
  const FileActivityContent = ({ file, activities }: { file: any; activities: any[] }) => {
    return <UnifiedActivitySection activities={activities} />;
  };

  // Render empty tab content for tasks, notes, etc.
  const renderEmptyTabContent = (tabId: string) => {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] p-6">
        <p className="text-muted-foreground mb-4">No {tabId} associated with this document</p>
        <Button variant="outline" size="sm">
          <PlusIcon className="h-4 w-4 mr-1" />
          Add {tabId === "tasks" ? "Task" : tabId === "notes" ? "Note" : "Item"}
        </Button>
      </div>
    )
  }

  // FullScreen Content
  const FullScreenContent = () => {
    const content = (
      <>
        {/* Semi-transparent overlay */}
        <div className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm" onClick={() => {
          setIsFullScreen(false)
          onOpenChange(false)
        }} />
        
        {/* Main container with rounded corners and spacing */}
        <div className="fixed inset-4 z-[9999] bg-background rounded-xl shadow-xl overflow-hidden">
          {/* Full Screen Header */}
          <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsFullScreen(false)
                  onOpenChange(false)
                }}
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <Badge variant="outline" className="bg-background">
                File
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <DownloadIcon className="h-4 w-4 mr-1" />
                Download
              </Button>
              <Button variant="outline" size="sm">
                <PrinterIcon className="h-4 w-4 mr-1" />
                Print
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setIsFullScreen(false)
                  onOpenChange(false)
                }}
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Full Screen Content - Two Column Layout */}
          <div className="flex h-[calc(100%-73px)] relative">
            {/* Left Panel - Document Preview */}
            <div className="flex-1 overflow-y-auto">
              <FilePreview file={file} />
            </div>

            {/* Collapse/Expand Button on Divider */}
            <div className="relative">
              <button
                onClick={() => setIsRightPanelCollapsed(!isRightPanelCollapsed)}
                className={`absolute ${isRightPanelCollapsed ? '-left-4' : 'left-0'} top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 flex h-7 w-7 items-center justify-center rounded-full border bg-background shadow-md hover:bg-accent transition-all`}
                title={isRightPanelCollapsed ? "Show details panel (⌘B)" : "Hide details panel (⌘B)"}
              >
                {isRightPanelCollapsed ? (
                  <PanelRightOpenIcon className="h-4 w-4" />
                ) : (
                  <PanelRightCloseIcon className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Right Panel - Details (same width as drawer to prevent jumping) */}
            <div className={`${isRightPanelCollapsed ? 'w-0' : 'w-[672px]'} border-l bg-background flex flex-col transition-all duration-300 overflow-hidden`}>
              {/* Record Header */}
              <div className="border-b bg-background px-6 py-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    {file && (file.title || file.name || "Untitled").charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">{file ? (file.title || file.name || "Untitled") : "Untitled"}</h2>
                  </div>
                </div>
              </div>
              
              {/* Tabs */}
              <div className="border-b bg-background px-6">
                <div className="flex relative">
                  <div className="flex flex-1 overflow-x-auto scrollbar-none">
                    {tabs.map((tab, index) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative whitespace-nowrap py-3 px-3 text-sm font-medium flex items-center gap-1 flex-shrink-0 ${
                          activeTab === tab.id
                            ? "border-b-2 border-primary text-primary"
                            : "text-muted-foreground hover:text-foreground"
                        } ${index === 0 ? 'pl-0' : ''}`}
                      >
                        {tab.icon && <tab.icon className="h-4 w-4 flex-shrink-0" />}
                        <span>{tab.label}</span>
                        {tab.count !== null && (
                          <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                            {tab.count}
                          </Badge>
                        )}
                        {activeTab === tab.id && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"></span>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Tab Content - matching drawer layout */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-0">
                  <div className="mb-4 px-6 pt-6 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      {tabs.find((tab) => tab.id === activeTab)?.label || ""}
                    </h3>
                    {activeTab === "tasks" && (
                      <Button variant="outline" size="sm">
                        <PlusIcon className="h-4 w-4 mr-1" />
                        Add Task
                      </Button>
                    )}
                    {activeTab === "notes" && (
                      <Button variant="outline" size="sm">
                        <PlusIcon className="h-4 w-4 mr-1" />
                        Add Note
                      </Button>
                    )}
                  </div>
                  
                  {activeTab === "details" && <FileDetailsPanel isFullScreen={true} />}
                  {activeTab === "tasks" && <div className="px-6 pb-6">{renderEmptyTabContent("tasks")}</div>}
                  {activeTab === "notes" && <div className="px-6 pb-6">{renderEmptyTabContent("notes")}</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )

    return typeof document !== "undefined" ? createPortal(content, document.body) : null
  }

  return (
    <>
      <Sheet open={isOpen && !isFullScreen} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="flex w-full max-w-[30vw] flex-col p-0 sm:max-w-[30vw] [&>button]:hidden overflow-hidden">
          {/* Add SheetTitle to fix Radix UI Dialog warning */}
          <SheetTitle className="sr-only">Document Viewer</SheetTitle>
          
          {/* Header */}
          <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <Badge variant="outline" className="bg-background">
                File
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <DownloadIcon className="h-4 w-4 mr-1" />
                Download
              </Button>
              <Button variant="outline" size="sm">
                <PrinterIcon className="h-4 w-4 mr-1" />
                Print
              </Button>
              <Button variant="outline" size="icon" onClick={() => setIsFullScreen(true)}>
                <ExpandIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Tabs - no record header anymore */}
            <div className="border-b bg-background px-6">
              <div className="flex relative">
                <div className="flex flex-1 overflow-x-auto scrollbar-none">
                  {tabs.map((tab, index) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative whitespace-nowrap py-3 px-3 text-sm font-medium flex items-center gap-1 flex-shrink-0 ${
                        activeTab === tab.id
                          ? "border-b-2 border-primary text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      } ${index === 0 ? 'pl-0' : ''}`}
                    >
                      {tab.icon && <tab.icon className="h-4 w-4 flex-shrink-0" />}
                      <span>{tab.label}</span>
                      {tab.count !== null && (
                        <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                          {tab.count}
                        </Badge>
                      )}
                      {activeTab === tab.id && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"></span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-0">
              <div className="mb-4 px-6 pt-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {tabs.find((tab) => tab.id === activeTab)?.label || ""}
                </h3>
                {activeTab === "details" && (
                  <Button variant="default" size="sm" onClick={() => setIsFullScreen(true)}>
                    <EyeIcon className="h-4 w-4 mr-1" />
                    Read
                  </Button>
                )}
                {activeTab === "tasks" && (
                  <Button variant="outline" size="sm">
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add Task
                  </Button>
                )}
                {activeTab === "notes" && (
                  <Button variant="outline" size="sm">
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add Note
                  </Button>
                )}
              </div>
              
              {activeTab === "details" && <FileDetailsPanel />}
              {activeTab === "tasks" && <div className="px-6 pb-6">{renderEmptyTabContent("tasks")}</div>}
              {activeTab === "notes" && <div className="px-6 pb-6">{renderEmptyTabContent("notes")}</div>}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {isOpen && isFullScreen && <FullScreenContent />}
    </>
  )
}
