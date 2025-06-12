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
import { ChevronLeftIcon, ExpandIcon, XIcon } from "lucide-react"
import { createPortal } from "react-dom"

export default function NotesClientPage() {
  const [selectedNote, setSelectedNote] = React.useState<any>(null)
  const [isFullScreen, setIsFullScreen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  
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
          <div className="flex-1 overflow-auto h-[calc(100vh-73px)]">
            <NoteDetailsView 
              note={selectedNote} 
              onBack={() => setSelectedNote(null)} 
            />
          </div>
        </div>
      )

      return typeof document !== "undefined" ? createPortal(content, document.body) : null
    }
    
    // For desktop mode
    if (isDesktop) {
      return (
        <Sheet open={!!selectedNote} onOpenChange={(open) => !open && setSelectedNote(null)}>
          <SheetContent side="right" className="flex w-full max-w-2xl flex-col p-0 sm:max-w-2xl [&>button]:hidden">
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
        setIsFullScreen(false)
        setSelectedNote(null)
      }
    }

    if (isFullScreen) {
      document.addEventListener("keydown", handleEscKey)
      return () => {
        document.removeEventListener("keydown", handleEscKey)
      }
    }
  }, [isFullScreen])

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
