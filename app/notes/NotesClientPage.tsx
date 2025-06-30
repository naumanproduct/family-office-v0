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
import { ChevronLeftIcon, ExpandIcon, XIcon, FileTextIcon, ActivityIcon, PlusIcon, CheckSquareIcon } from "lucide-react"
import { createPortal } from "react-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TypableArea } from "@/components/typable-area"
import { FileContent } from "@/components/shared/file-content"
import { UnifiedTaskTable } from "@/components/shared/unified-task-table"

export default function NotesClientPage() {
  const [selectedNote, setSelectedNote] = React.useState<any>(null)
  const [isFullScreen, setIsFullScreen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [noteText, setNoteText] = React.useState("")
  const [activeTab, setActiveTab] = React.useState("activity")
  
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
        <div className="fixed inset-0 z-[9999] bg-background">
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

          {/* Full Screen Content */}
          <div className="flex h-[calc(100vh-73px)]">
            {/* Left Panel - Details (Persistent) - Exactly like MasterDrawer */}
            <div className="w-[672px] border-r bg-background">
              {/* Record Header */}
              <div className="border-b bg-background px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    {selectedNote.title?.charAt(0) || "N"}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">{selectedNote.title || "Untitled"}</h2>
                    <p className="text-sm text-muted-foreground">Note • {selectedNote.id}</p>
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
            
            {/* Right Panel - Main Content - Exactly like MasterDrawer */}
            <div className="flex-1 overflow-y-auto">
              {/* Tabs */}
              <div className="border-b bg-background px-6">
                <div className="flex relative overflow-x-auto">
                  <button
                    onClick={() => setActiveTab("activity")}
                    className={`relative whitespace-nowrap py-3 px-2 text-sm font-medium flex items-center gap-1 min-w-0 ${
                      activeTab === "activity"
                        ? "border-b-2 border-primary text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <ActivityIcon className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">Activity</span>
                    {activeTab === "activity" && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"></span>}
                  </button>
                  <button
                    onClick={() => setActiveTab("tasks")}
                    className={`relative whitespace-nowrap py-3 px-2 text-sm font-medium flex items-center gap-1 min-w-0 ${
                      activeTab === "tasks"
                        ? "border-b-2 border-primary text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <CheckSquareIcon className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">Tasks</span>
                    {activeTab === "tasks" && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"></span>}
                  </button>
                  <button
                    onClick={() => setActiveTab("notes")}
                    className={`relative whitespace-nowrap py-3 px-2 text-sm font-medium flex items-center gap-1 min-w-0 ${
                      activeTab === "notes"
                        ? "border-b-2 border-primary text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <FileTextIcon className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">Notes</span>
                    {activeTab === "notes" && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"></span>}
                  </button>
                  <button
                    onClick={() => setActiveTab("files")}
                    className={`relative whitespace-nowrap py-3 px-2 text-sm font-medium flex items-center gap-1 min-w-0 ${
                      activeTab === "files"
                        ? "border-b-2 border-primary text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <FileTextIcon className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">Files</span>
                    {activeTab === "files" && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"></span>}
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
                        <PlusIcon className="h-4 w-4 mr-1" />
                        Add meeting
                      </Button>
                    </div>
                  )}
                  {activeTab === "tasks" && (
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <PlusIcon className="h-4 w-4 mr-1" />
                        Add task
                      </Button>
                    </div>
                  )}
                </div>
                
                {activeTab === "activity" && (
                  <div className="space-y-4">
                    <p className="text-muted-foreground">No recent activity for this note.</p>
                  </div>
                )}
                
                {activeTab === "tasks" && (
                  <UnifiedTaskTable data={mockTasks} viewMode="table" />
                )}
                
                {activeTab === "notes" && (
                  <div className="space-y-4">
                    <TypableArea 
                      value={noteText} 
                      onChange={setNoteText} 
                      placeholder="Add notes..." 
                      showButtons={true}
                    />
                  </div>
                )}

                {activeTab === "files" && <FileContent />}
              </div>
            </div>
          </div>
        </div>
      )

      return typeof document !== "undefined" ? createPortal(content, document.body) : null
    }
    
    // For desktop mode
    if (isDesktop) {
      return (
        <Sheet open={!!selectedNote} onOpenChange={(open) => !open && setSelectedNote(null)}>
          <SheetContent side="right" className="flex w-full max-w-2xl flex-col p-0 sm:max-w-2xl [&>button]:hidden overflow-hidden">
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
                <Button variant="outline" size="icon" onClick={() => setIsFullScreen(true)}>
                  <ExpandIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              <NoteDetailsView 
                note={selectedNote} 
                onBack={() => setSelectedNote(null)} 
                hideAddNotes={false}
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
                <Button variant="outline" size="icon" onClick={() => setIsFullScreen(true)}>
                  <ExpandIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              <NoteDetailsView 
                note={selectedNote} 
                onBack={() => setSelectedNote(null)} 
                hideAddNotes={false}
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
