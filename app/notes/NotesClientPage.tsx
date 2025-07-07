"use client"
import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { NoteContent } from "@/components/shared/note-content"
import { NoteDetailsView } from "@/components/note-details-view"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useMediaQuery } from "../../hooks/use-media-query"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeftIcon, ExpandIcon, XIcon, FileTextIcon, ActivityIcon, PlusIcon, CheckSquareIcon, ChevronDownIcon, ChevronRightIcon, EditIcon } from "lucide-react"
import { createPortal } from "react-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TypableArea } from "@/components/typable-area"
import { FileContent, getContextualFiles } from "@/components/shared/file-content"
import { UnifiedTaskTable } from "@/components/shared/unified-task-table"
import { UnifiedActivitySection } from "@/components/shared/unified-activity-section"
import { generateNoteActivities } from "@/components/shared/activity-generators"
import { ViewModeSelector } from "@/components/shared/view-mode-selector"
import { TabContentRenderer } from "@/components/shared/tab-content-renderer"
import { getContextualNoteContent } from "@/components/shared/note-content"
import { formatDate } from "@/lib/utils"

export default function NotesClientPage() {
  const [selectedNote, setSelectedNote] = React.useState<any>(null)
  const [isFullScreen, setIsFullScreen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [noteText, setNoteText] = React.useState("")
  const [activeTab, setActiveTab] = React.useState("notes")
  const [drawerActiveTab, setDrawerActiveTab] = React.useState("details")
  const noteDetailsRef = React.useRef<{ getActiveTab: () => string } | null>(null)
  const [tasksViewMode, setTasksViewMode] = React.useState<"table" | "card" | "list">("table")
  const [filesViewMode, setFilesViewMode] = React.useState<"table" | "card" | "list">("table")
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({
    notes: true,
  })
  
  // Generate activities for this note
  const activities = generateNoteActivities()
  
  // Mock data for tasks related to notes
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
  
  // Use a drawer/sheet for the note details
  const NoteDetailDrawer = () => {
    if (!selectedNote) return null
    
    // For fullscreen mode
    if (isFullScreen) {
      const content = (
        <>
          {/* Semi-transparent overlay */}
          <div className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm" onClick={() => {
            setIsFullScreen(false)
            setSelectedNote(null)
          }} />
          
          <div className="fixed inset-4 z-[9999] bg-background rounded-xl shadow-xl overflow-hidden">
            {/* Full Screen Header */}
            <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setIsFullScreen(false);
                    setSelectedNote(null);
                  }}
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <Badge variant="outline" className="bg-background">
                  Note
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setIsFullScreen(false);
                    setSelectedNote(null);
                  }}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Full Screen Content - Two Column Layout */}
            <div className="flex h-[calc(100%-73px)]">
              {/* Left Panel - Details (Persistent) */}
              <div className="w-[672px] border-r bg-background overflow-y-auto">
                {/* Record Header - no bottom border to align with tab line */}
                <div className="bg-background px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                      {selectedNote.title?.charAt(0) || "N"}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">{selectedNote.title || "Untitled"}</h2>
                      {/* Removed subtitle per requirements */}
                    </div>
                  </div>
                </div>
                {/* Details Panel Content */}
                <NoteDetailsView 
                  note={selectedNote} 
                  onBack={() => setSelectedNote(null)}
                  hideAddNotes={true}
                  isFullScreen={true}
                />
              </div>
              
              {/* Right Panel - Main Content */}
              <div className="flex-1 overflow-y-auto">
                {/* Tabs */}
                <div className="border-b bg-background px-6">
                  <div className="flex relative overflow-x-auto">
                    <button
                      onClick={() => setActiveTab("activity")}
                      className={`relative whitespace-nowrap py-3 px-3 text-sm font-medium flex items-center gap-1 flex-shrink-0 ${
                        activeTab === "activity"
                          ? "border-b-2 border-primary text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      } pl-0`}
                    >
                      <ActivityIcon className="h-4 w-4 flex-shrink-0" />
                      <span>Activity</span>
                      {activeTab === "activity" && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"></span>}
                    </button>
                    <button
                      onClick={() => setActiveTab("notes")}
                      className={`relative whitespace-nowrap py-3 px-3 text-sm font-medium flex items-center gap-1 flex-shrink-0 ${
                        activeTab === "notes"
                          ? "border-b-2 border-primary text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <FileTextIcon className="h-4 w-4 flex-shrink-0" />
                      <span>Notes</span>
                      {activeTab === "notes" && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"></span>}
                    </button>
                    <button
                      onClick={() => setActiveTab("files")}
                      className={`relative whitespace-nowrap py-3 px-3 text-sm font-medium flex items-center gap-1 flex-shrink-0 ${
                        activeTab === "files"
                          ? "border-b-2 border-primary text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <FileTextIcon className="h-4 w-4 flex-shrink-0" />
                      <span>Files</span>
                      {activeTab === "files" && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"></span>}
                    </button>
                    <button
                      onClick={() => setActiveTab("tasks")}
                      className={`relative whitespace-nowrap py-3 px-3 text-sm font-medium flex items-center gap-1 flex-shrink-0 ${
                        activeTab === "tasks"
                          ? "border-b-2 border-primary text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <CheckSquareIcon className="h-4 w-4 flex-shrink-0" />
                      <span>Tasks</span>
                      {activeTab === "tasks" && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"></span>}
                    </button>
                  </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      {activeTab === "activity" ? "Activity" : 
                       activeTab === "tasks" ? "Tasks" : 
                       activeTab === "notes" ? "Notes" : "Files"}
                    </h3>
                    {activeTab === "activity" && (
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <PlusIcon className="h-4 w-4" />
                          Add meeting
                        </Button>
                      </div>
                    )}
                    {activeTab === "tasks" && (
                      <div className="flex items-center gap-2">
                        <ViewModeSelector viewMode={tasksViewMode} onViewModeChange={setTasksViewMode} />
                        <Button variant="outline" size="sm">
                          <PlusIcon className="h-4 w-4" />
                          Add task
                        </Button>
                      </div>
                    )}
                    {activeTab === "notes" && (
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <PlusIcon className="h-4 w-4" />
                          Add note
                        </Button>
                      </div>
                    )}
                    {activeTab === "files" && (
                      <div className="flex items-center gap-2">
                        <ViewModeSelector viewMode={filesViewMode} onViewModeChange={setFilesViewMode} />
                        <Button variant="outline" size="sm">
                          <PlusIcon className="h-4 w-4" />
                          Add file
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {activeTab === "activity" && (
                    <UnifiedActivitySection activities={activities} />
                  )}
                  
                  {activeTab === "tasks" && (
                    <UnifiedTaskTable data={mockTasks} viewMode={tasksViewMode} />
                  )}
                  
                  {activeTab === "notes" && (
                    <div className="space-y-5">
                      <div className="rounded-lg border border-muted overflow-hidden">
                        <div className="group">
                          <button 
                            onClick={() => setOpenSections(prev => ({ ...prev, notes: !prev.notes }))}
                            className={`w-full flex items-center justify-between p-3 hover:bg-muted/20 transition-colors ${openSections.notes ? 'bg-muted/20' : ''}`}
                          >
                            <div className="flex items-center">
                              {openSections.notes ? (
                                <ChevronDownIcon className="h-4 w-4 text-muted-foreground mr-2" />
                              ) : (
                                <ChevronRightIcon className="h-4 w-4 text-muted-foreground mr-2" /> 
                              )}
                              <div className="flex items-center gap-2">
                                <EditIcon className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium text-sm">Notes</span>
                              </div>
                            </div>
                          </button>

                          {/* Section Content */}
                          {openSections.notes && (
                            <div className="px-5 pb-3 pt-2">
                              <TypableArea 
                                value={selectedNote?.content || getContextualNoteContent(selectedNote, 'TechVentures Fund III')} 
                                onChange={(value) => {
                                  // Update the note content
                                  if (selectedNote) {
                                    selectedNote.content = value;
                                  }
                                }} 
                                placeholder="Start typing to add your thoughts..." 
                                showButtons={false}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "files" && (() => {
                    const files = getContextualFiles(selectedNote?.title);
                    const transformedFiles = files.map(file => ({
                      ...file,
                      name: file.name || file.fileName || file.title,
                      uploadedBy: file.uploadedBy || "Unknown",
                      uploadedDate: file.uploadedDate || (file.uploadedAt ? formatDate(new Date(file.uploadedAt)) : "Unknown"),
                      size: file.size || file.fileSize || "Unknown",
                    }));
                    
                    return (
                      <TabContentRenderer
                        activeTab="files"
                        viewMode={filesViewMode}
                        data={transformedFiles}
                      />
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </>
      )

      return typeof document !== "undefined" ? createPortal(content, document.body) : null
    }
    
    // For desktop mode
    if (isDesktop) {
      return (
        <Sheet open={!!selectedNote} onOpenChange={(open) => !open && setSelectedNote(null)}>
          <SheetContent side="right" className="flex w-full max-w-[30vw] flex-col p-0 sm:max-w-[30vw] [&>button]:hidden overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => setSelectedNote(null)}>
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <Badge variant="outline" className="bg-background">
                  Note
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => {
                  // For notes, always default to "notes" tab in full screen
                  setActiveTab('notes');
                  setIsFullScreen(true);
                }}>
                  <ExpandIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              <NoteDetailsView 
                note={selectedNote} 
                onBack={() => setSelectedNote(null)} 
                hideAddNotes={false}
                onTabChange={(tab) => setDrawerActiveTab(tab)}
              />
            </div>
          </SheetContent>
        </Sheet>
      )
    } else {
      // For mobile mode
      return (
        <Dialog open={!!selectedNote} onOpenChange={(open) => !open && setSelectedNote(null)}>
          <DialogContent className="max-w-full h-[95vh] p-0">
            <DialogTitle className="sr-only">Note Details</DialogTitle>
            <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => setSelectedNote(null)}>
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <Badge variant="outline" className="bg-background">
                  Note
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => {
                  // For notes, always default to "notes" tab in full screen
                  setActiveTab('notes');
                  setIsFullScreen(true);
                }}>
                  <ExpandIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              <NoteDetailsView 
                note={selectedNote} 
                onBack={() => setSelectedNote(null)} 
                hideAddNotes={false}
                onTabChange={(tab) => setDrawerActiveTab(tab)}
              />
            </div>
          </DialogContent>
        </Dialog>
      )
    }
  }

  // ESC key handler for full screen mode
  React.useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isFullScreen) {
        setIsFullScreen(false);
      }
    };

    if (isFullScreen) {
      document.addEventListener("keydown", handleEscKey);
      return () => {
        document.removeEventListener("keydown", handleEscKey);
      };
    }
  }, [isFullScreen]);

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

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center border-b">
          <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Notes</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-semibold">Notes</h1>
                    <p className="text-muted-foreground">Manage and organize all your notes and documentation</p>
                  </div>
                </div>
                <NoteContent onNoteSelect={setSelectedNote} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
      
      {/* Render the note detail drawer */}
      <NoteDetailDrawer />
    </SidebarProvider>
  )
}
