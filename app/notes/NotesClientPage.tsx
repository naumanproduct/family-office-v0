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
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ChevronLeftIcon, 
  ExpandIcon, 
  XIcon,
  StickyNoteIcon, 
  FileTextIcon,
  AlertTriangleIcon,
  UserIcon,
  CalendarIcon,
  TagIcon,
  BuildingIcon
} from "lucide-react"
import { createPortal } from "react-dom"
import { Label } from "@/components/ui/label"

export default function NotesClientPage() {
  const [selectedNote, setSelectedNote] = React.useState<any>(null)
  const [isFullScreen, setIsFullScreen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("notes")
  const isDesktop = useMediaQuery("(min-width: 768px)")
  
  // Get priority color for the badge
  const getPriorityColor = (priority: string | undefined | null) => {
    if (!priority) return "bg-gray-100 text-gray-800"

    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Full screen component for notes
  const FullScreenNoteDrawer = () => {
    if (!selectedNote || !isFullScreen || typeof document === "undefined") return null

    return createPortal(
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

        {/* Two-column Layout in Full Screen Mode */}
        <div className="flex h-[calc(100vh-73px)]">
          {/* Left Panel - Note Details */}
          <div className="w-96 border-r bg-background overflow-y-auto">
            {/* Note Header */}
            <div className="border-b bg-background px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <StickyNoteIcon className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{selectedNote.title}</h2>
                  <p className="text-sm text-muted-foreground">Note • {selectedNote.id}</p>
                </div>
              </div>
            </div>
            
            {/* Note Details Content */}
            <div className="px-6 pt-4 pb-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Note Details</h4>
                <div className="rounded-lg border border-muted bg-muted/10 p-4">
                  <div className="space-y-4">
                    {/* Content */}
                    <div className="flex items-start gap-2">
                      <div className="mt-1"><FileTextIcon className="h-4 w-4 text-muted-foreground" /></div>
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground mt-1">Content</Label>
                        <div className="px-2 py-1 rounded text-sm">{selectedNote.content}</div>
                      </div>
                    </div>
                    
                    {/* Priority */}
                    <div className="flex items-start gap-2">
                      <div className="mt-1"><AlertTriangleIcon className="h-4 w-4 text-muted-foreground" /></div>
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground mt-1">Priority</Label>
                        <div className="px-2 py-1 rounded text-sm">
                          <Badge className={`text-xs ${getPriorityColor(selectedNote.priority)}`}>
                            {selectedNote.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    {/* Author */}
                    <div className="flex items-start gap-2">
                      <div className="mt-1"><UserIcon className="h-4 w-4 text-muted-foreground" /></div>
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground mt-1">Author</Label>
                        <div className="px-2 py-1 rounded text-sm">{selectedNote.author}</div>
                      </div>
                    </div>
                    
                    {/* Created */}
                    <div className="flex items-start gap-2">
                      <div className="mt-1"><CalendarIcon className="h-4 w-4 text-muted-foreground" /></div>
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground mt-1">Created</Label>
                        <div className="px-2 py-1 rounded text-sm">
                          {new Date(selectedNote.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    {/* Updated */}
                    <div className="flex items-start gap-2">
                      <div className="mt-1"><CalendarIcon className="h-4 w-4 text-muted-foreground" /></div>
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground mt-1">Updated</Label>
                        <div className="px-2 py-1 rounded text-sm">
                          {new Date(selectedNote.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex items-start gap-2">
                      <div className="mt-1"><TagIcon className="h-4 w-4 text-muted-foreground" /></div>
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground mt-1">Tags</Label>
                        <div className="px-2 py-1 rounded text-sm">
                          <div className="flex flex-wrap gap-1">
                            {selectedNote.tags && selectedNote.tags.map((tag: string) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Related To */}
                    <div className="flex items-start gap-2">
                      <div className="mt-1"><BuildingIcon className="h-4 w-4 text-muted-foreground" /></div>
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground mt-1">Related to</Label>
                        <div className="px-2 py-1 rounded text-sm">
                          <span>{selectedNote.relatedTo?.type || "N/A"} </span>
                          <span className="font-medium">{selectedNote.relatedTo?.name || "N/A"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Panel - Tabs Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Tabs */}
            <div className="border-b bg-background px-6">
              <div className="flex gap-8 overflow-x-auto">
                {/* We exclude the "details" tab since it's now on the left side */}
                {[
                  { id: "notes", label: "Notes", icon: FileTextIcon },
                  { id: "files", label: "Files", icon: FileTextIcon }
                ].map((tab) => {
                  const TabIcon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative whitespace-nowrap py-3 text-sm font-medium flex items-center gap-2 ${
                        activeTab === tab.id
                          ? "border-b-2 border-primary text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <TabIcon className="h-4 w-4" />
                      {tab.label}
                      {activeTab === tab.id && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"></span>}
                    </button>
                  )
                })}
              </div>
            </div>
            
            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "notes" && <div>Notes content will appear here</div>}
              {activeTab === "files" && <div>Files related to this note will appear here</div>}
            </div>
          </div>
        </div>
      </div>,
      document.body
    )
  }
  
  // Use a drawer/sheet for the note details
  const NoteDetailDrawer = () => {
    if (!selectedNote) return null
    
    if (isDesktop) {
      return (
        <Sheet open={!!selectedNote} onOpenChange={(open) => !open && setSelectedNote(null)}>
          <SheetContent side="right" className="flex w-full max-w-4xl flex-col p-0 sm:max-w-4xl [&>button]:hidden">
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
            <NoteDetailsView 
              note={selectedNote} 
              onBack={() => setSelectedNote(null)} 
              isFullScreen={false}
            />
          </SheetContent>
        </Sheet>
      )
    } else {
      return (
        <Dialog open={!!selectedNote} onOpenChange={(open) => !open && setSelectedNote(null)}>
          <DialogContent className="max-w-full h-[95vh] p-0">
            <NoteDetailsView 
              note={selectedNote} 
              onBack={() => setSelectedNote(null)} 
              isFullScreen={false}
            />
          </DialogContent>
        </Dialog>
      )
    }
  }

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
      
      {/* Render the note detail drawer in normal mode */}
      {!isFullScreen && <NoteDetailDrawer />}
      
      {/* Render the full screen drawer when in full screen mode */}
      <FullScreenNoteDrawer />
    </SidebarProvider>
  )
}
