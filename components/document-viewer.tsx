"use client"

import * as React from "react"
import { createPortal } from "react-dom"
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
}

export function DocumentViewer({ isOpen, onOpenChange, file }: DocumentViewerProps) {
  const [isFullScreen, setIsFullScreen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("details")
  const [viewMode, setViewMode] = React.useState<"card" | "list" | "table">("table")
  
  // Define tabs for the document viewer - define outside of render cycle
  const tabs = React.useMemo(() => [
    { id: "details", label: "Details", count: null, icon: FileIcon },
    { id: "tasks", label: "Tasks", count: 0, icon: ClockIcon },
    { id: "notes", label: "Notes", count: 0, icon: MessageSquareIcon },
  ], []);
  
  // Tab pagination state
  const [hiddenTabs, setHiddenTabs] = React.useState<Tab[]>([])
  const [visibleTabs, setVisibleTabs] = React.useState<Tab[]>([])
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = React.useState(false)
  
  // Full screen tab pagination state
  const [fullScreenVisibleTabs, setFullScreenVisibleTabs] = React.useState<Tab[]>([])
  const [fullScreenHiddenTabs, setFullScreenHiddenTabs] = React.useState<Tab[]>([])
  const [isFullScreenMoreDropdownOpen, setIsFullScreenMoreDropdownOpen] = React.useState(false)
  
  // Set up visible and hidden tabs - run only once on component mount
  React.useEffect(() => {
    // For regular drawer, show first 6 tabs as visible, rest as hidden
    const maxVisibleTabs = 6
    if (tabs.length > maxVisibleTabs) {
      setVisibleTabs(tabs.slice(0, maxVisibleTabs))
      setHiddenTabs(tabs.slice(maxVisibleTabs))
    } else {
      setVisibleTabs(tabs)
      setHiddenTabs([])
    }

    // For full screen, show all tabs including details tab
    const maxFullScreenVisibleTabs = 10
    if (tabs.length > maxFullScreenVisibleTabs) {
      setFullScreenVisibleTabs(tabs.slice(0, maxFullScreenVisibleTabs))
      setFullScreenHiddenTabs(tabs.slice(maxFullScreenVisibleTabs))
    } else {
      setFullScreenVisibleTabs(tabs)
      setFullScreenHiddenTabs([])
    }
  }, [tabs]) // Include tabs in dependency array to update when tabs change
  
  // Handle tab swapping for regular drawer
  const handleTabSwap = (selectedTab: Tab) => {
    if (visibleTabs.length === 0) return

    const lastVisibleTab = visibleTabs[visibleTabs.length - 1]
    const newVisibleTabs = [...visibleTabs.slice(0, -1), selectedTab]
    const newHiddenTabs = hiddenTabs.filter((tab) => tab.id !== selectedTab.id)
    newHiddenTabs.push(lastVisibleTab)

    setVisibleTabs(newVisibleTabs)
    setHiddenTabs(newHiddenTabs)
    setActiveTab(selectedTab.id)
    setIsMoreDropdownOpen(false)
  }

  // Handle tab swapping for full screen
  const handleFullScreenTabSwap = (selectedTab: Tab) => {
    if (fullScreenVisibleTabs.length === 0) return

    const lastVisibleTab = fullScreenVisibleTabs[fullScreenVisibleTabs.length - 1]
    const newVisibleTabs = [...fullScreenVisibleTabs.slice(0, -1), selectedTab]
    const newHiddenTabs = fullScreenHiddenTabs.filter((tab) => tab.id !== selectedTab.id)
    newHiddenTabs.push(lastVisibleTab)

    setFullScreenVisibleTabs(newVisibleTabs)
    setFullScreenHiddenTabs(newHiddenTabs)
    setActiveTab(selectedTab.id)
    setIsFullScreenMoreDropdownOpen(false)
  }

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
                  <PrinterIcon className="h-4 w-4 mr-1" />
                  Print
                </Button>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center bg-muted-foreground/10 p-4">
              <div className="max-w-md text-center">
                <FileTextIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">PDF Preview</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  This is a placeholder for the PDF viewer.
                </p>
                <Button variant="outline" size="sm">
                  <DownloadIcon className="h-4 w-4 mr-1" />
                  Download PDF
                </Button>
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

    // State for collapsible sections
    const [openSections, setOpenSections] = React.useState({
      details: true,
      company: false,
      people: false,
      entities: false,
      investments: false,
      opportunities: false,
    });

    // State for showing all values
    const [showingAllValues, setShowingAllValues] = React.useState(false);

    // Toggle function for collapsible sections
    const toggleSection = (section: 'details' | 'company' | 'people' | 'entities' | 'investments' | 'opportunities') => {
      setOpenSections(prev => ({
        ...prev,
        [section]: !prev[section],
      }));
    };

    // Basic fields for collapsed view
    const basicFields: {
      label: string;
      value: React.ReactNode;
      isLink?: boolean;
    }[] = [
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
    ];

    // Extended fields for "Show all" view
    const extendedFields: {
      label: string;
      value: React.ReactNode;
      isLink?: boolean;
    }[] = [
      ...basicFields,
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
        value: file.uploadedDate || (file.uploadedAt ? new Date(file.uploadedAt).toLocaleDateString() : "Unknown"),
      },
    ];

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

    // Render the detail fields
    const renderFields = (fields: typeof basicFields, showAllButton: boolean = false) => (
      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={index} className="flex items-center">
            <Label className="text-xs text-muted-foreground w-28 shrink-0 ml-2">{field.label}</Label>
            {field.isLink ? (
              <p className="text-sm text-blue-600 flex-1">{field.value}</p>
            ) : (
              <p className="text-sm flex-1">{field.value}</p>
            )}
          </div>
        ))}
        {showAllButton && (
          <div className="flex items-center mt-2">
            <Button 
              variant="link" 
              className="h-auto p-0 text-xs text-blue-600 ml-2"
              onClick={() => setShowingAllValues(true)}
            >
              Show all
            </Button>
          </div>
        )}
      </div>
    );

    // Items section for related data
    const ItemsSection = ({ 
      items 
    }: { 
      items: any[] 
    }) => {
      // Handler functions for related items
      const handleAddRecord = (e: React.MouseEvent) => {
        e.stopPropagation();
        console.log("Add new related record");
      };

      const handleUnlinkRecord = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        console.log("Unlink record", id);
      };

      const handleViewRecord = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        console.log("View record", id);
      };

      if (!items || items.length === 0) {
        return (
          <div className="flex items-center justify-between py-1 px-2">
            <p className="text-sm text-muted-foreground">No related records</p>
            <Button variant="ghost" size="sm" className="h-6 px-2" onClick={handleAddRecord}>
              <PlusIcon className="h-3 w-3" />
            </Button>
          </div>
        );
      }

      return (
        <div className="ml-2 group/section">
          <div className="flex flex-col space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between group">
                <Badge 
                  variant="outline" 
                  className="cursor-pointer hover:bg-muted/50 transition-colors flex items-center gap-1 py-1 w-fit font-normal"
                  onClick={() => console.log(`Navigate to ${item.type || item.role || ''} record with ID: ${item.id}`)}
                >
                  {item.name}
                </Badge>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontalIcon className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem onClick={(e) => handleViewRecord(e, item.id)}>
                      <ExternalLinkIcon className="mr-2 h-3.5 w-3.5" />
                      <span>View</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={(e) => handleUnlinkRecord(e, item.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <XIcon className="mr-2 h-3.5 w-3.5" />
                      <span>Unlink</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-2 text-xs text-muted-foreground opacity-0 group-hover/section:opacity-100 transition-opacity"
            onClick={handleAddRecord}
          >
            <PlusIcon className="h-3 w-3 mr-1" />
            Add
          </Button>
        </div>
      );
    };

    // Apple-style section headers and content
    const sections = [
      {
        id: 'details',
        title: 'Record Details',
        icon: FileIcon,
        content: renderFields(showingAllValues ? extendedFields : basicFields, !showingAllValues),
        count: null
      },
      {
        id: 'company',
        title: 'Company',
        icon: BuildingIcon,
        content: <ItemsSection items={relatedData.companies} />,
        count: relatedData.companies.length
      },
      {
        id: 'people',
        title: 'People',
        icon: UserIcon,
        content: <ItemsSection items={relatedData.people} />,
        count: relatedData.people.length
      },
      {
        id: 'entities',
        title: 'Entities',
        icon: LayoutIcon,
        content: <ItemsSection items={relatedData.entities} />,
        count: relatedData.entities.length
      },
      {
        id: 'investments',
        title: 'Investments',
        icon: DollarSignIcon,
        content: <ItemsSection items={relatedData.investments} />,
        count: relatedData.investments.length
      },
      {
        id: 'opportunities',
        title: 'Opportunities',
        icon: TrendingUpIcon,
        content: <ItemsSection items={relatedData.opportunities} />,
        count: relatedData.opportunities.length
      }
    ];

    // Mock activities for the file
    const activities = generateFileActivities()

    return (
      <div className="px-6 pt-2 pb-6">
        {/* Unified container with Apple-style cohesive design */}
        <div className="rounded-lg border border-muted overflow-hidden">
          {sections.map((section, index) => {
            const isOpen = openSections[section.id as keyof typeof openSections];
            const Icon = section.icon;
            
            return (
              <React.Fragment key={section.id}>
                {/* Divider between sections (except for the first one) */}
                {index > 0 && (
                  <div className="h-px bg-muted mx-3" />
                )}
                
                {/* Section Header */}
                <button 
                  onClick={() => toggleSection(section.id as 'details' | 'company' | 'people' | 'entities' | 'investments' | 'opportunities')}
                  className={`w-full flex items-center justify-between p-3 hover:bg-muted/20 transition-colors ${isOpen ? 'bg-muted/20' : ''}`}
                >
                  <div className="flex items-center">
                    <Icon className="h-4 w-4 text-muted-foreground ml-2" />
                    <h4 className="text-sm font-medium ml-2">{section.title}</h4>
                    
                    {/* Show count badge for sections that have counts */}
                    {section.count !== null && (
                      <Badge variant="secondary" className="ml-1 h-5 px-1.5 rounded-full text-xs">
                        {section.count}
                      </Badge>
                    )}
                  </div>
                  <ChevronDownIcon 
                    className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                  />
                </button>
                
                {/* Section Content with smooth height transition */}
                {isOpen && (
                  <div className="px-3 pb-3 pt-2 group/section">
                    {section.content}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Activity Section - Only in Drawer View */}
        {!isFullScreen && (
          <div className="mt-8">
            <div className="mb-4">
              <h4 className="text-sm font-medium">Activity</h4>
            </div>
            <FileActivityContent file={file} activities={activities} />
          </div>
        )}
      </div>
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
        <div className="fixed inset-0 z-[9999] bg-background">
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
                Document
              </Badge>
            </div>
            <div className="flex items-center gap-2">
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
          <div className="flex h-[calc(100vh-73px)]">
            {/* Left Panel - Document Preview (moved from right) */}
            <div className="flex-1 overflow-y-auto">
              <FilePreview file={file} />
            </div>

            {/* Right Panel - Details (moved from left) */}
            <div className="w-[672px] border-l bg-background flex flex-col">
              {/* Record Header */}
              <div className="border-b bg-background px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    {file && (file.title || file.name || "Untitled").charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">{file ? (file.title || file.name || "Untitled") : "Untitled"}</h2>
                    {file && file.fileType && (
                      <p className="text-sm text-muted-foreground">
                        {(file.fileType || file.type || "FILE").toUpperCase()} • {file.fileSize || file.size || "Unknown size"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Tabs */}
              <div className="border-b bg-background px-6">
                <div className="flex relative">
                  {fullScreenVisibleTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative whitespace-nowrap py-3 px-4 text-sm font-medium flex items-center gap-2 ${
                        activeTab === tab.id
                          ? "border-b-2 border-primary text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tab.icon && <tab.icon className="h-4 w-4" />}
                      <span>{tab.label}</span>
                      {tab.count !== null && (
                        <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                          {tab.count}
                        </Badge>
                      )}
                      {activeTab === tab.id && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"></span>}
                    </button>
                  ))}
                  {fullScreenHiddenTabs.length > 0 && (
                    <div className="relative">
                      <DropdownMenu open={isFullScreenMoreDropdownOpen} onOpenChange={setIsFullScreenMoreDropdownOpen}>
                        <DropdownMenuTrigger asChild>
                          <button className="relative whitespace-nowrap py-3 px-4 text-sm font-medium flex items-center gap-2 text-muted-foreground hover:text-foreground">
                            More
                            <ChevronDownIcon className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                          {fullScreenHiddenTabs.map((tab) => (
                            <DropdownMenuItem
                              key={tab.id}
                              onClick={() => handleFullScreenTabSwap(tab)}
                              className="flex items-center gap-2"
                            >
                              {tab.icon && <tab.icon className="h-4 w-4" />}
                              {tab.label}
                              {tab.count !== null && (
                                <Badge variant="secondary" className="ml-auto h-5 w-5 rounded-full p-0 text-xs">
                                  {tab.count}
                                </Badge>
                              )}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto">
                {activeTab === "details" && <FileDetailsPanel isFullScreen={true} />}
                {activeTab === "tasks" && renderEmptyTabContent("tasks")}
                {activeTab === "notes" && renderEmptyTabContent("notes")}
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
        <SheetContent side="right" className="flex w-full max-w-2xl flex-col p-0 sm:max-w-2xl [&>button]:hidden">
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
                Document
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setIsFullScreen(true)}>
                <ExpandIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Record Header */}
            <div className="border-b bg-background px-6 py-2">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  {file && (file.title || file.name || "Untitled").charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{file ? (file.title || file.name || "Untitled") : "Untitled"}</h2>
                  {file && file.fileType && (
                    <p className="text-sm text-muted-foreground">
                      {(file.fileType || file.type || "FILE").toUpperCase()} • {file.fileSize || file.size || "Unknown size"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b bg-background px-6">
              <div className="flex relative">
                {visibleTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative whitespace-nowrap py-3 px-4 text-sm font-medium flex items-center gap-2 ${
                      activeTab === tab.id
                        ? "border-b-2 border-primary text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.icon && <tab.icon className="h-4 w-4" />}
                    <span>{tab.label}</span>
                    {tab.count !== null && (
                      <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                        {tab.count}
                      </Badge>
                    )}
                    {activeTab === tab.id && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"></span>}
                  </button>
                ))}
                {hiddenTabs.length > 0 && (
                  <div className="relative">
                    <DropdownMenu open={isMoreDropdownOpen} onOpenChange={setIsMoreDropdownOpen}>
                      <DropdownMenuTrigger asChild>
                        <button className="relative whitespace-nowrap py-3 px-4 text-sm font-medium flex items-center gap-2 text-muted-foreground hover:text-foreground">
                          More
                          <ChevronDownIcon className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[200px]">
                        {hiddenTabs.map((tab) => (
                          <DropdownMenuItem
                            key={tab.id}
                            onClick={() => handleTabSwap(tab)}
                            className="flex items-center gap-2"
                          >
                            {tab.icon && <tab.icon className="h-4 w-4" />}
                            {tab.label}
                            {tab.count !== null && (
                              <Badge variant="secondary" className="ml-auto h-5 w-5 rounded-full p-0 text-xs">
                                {tab.count}
                              </Badge>
                            )}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-0">
              <div className="mb-4 px-6 pt-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {[...visibleTabs, ...hiddenTabs].find((tab) => tab.id === activeTab)?.label || ""}
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
              
              <div className="px-6 pb-6">
                {activeTab === "details" && <FileDetailsPanel />}
                {activeTab === "tasks" && renderEmptyTabContent("tasks")}
                {activeTab === "notes" && renderEmptyTabContent("notes")}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {isFullScreen && <FullScreenContent />}
    </>
  )
}
