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

export default function NotesClientPage() {
  const [selectedNote, setSelectedNote] = React.useState<any>(null)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  
  // Use a drawer/sheet for the note details
  const NoteDetailDrawer = () => {
    if (!selectedNote) return null
    
    if (isDesktop) {
      return (
        <Sheet open={!!selectedNote} onOpenChange={(open) => !open && setSelectedNote(null)}>
          <SheetContent side="right" className="flex w-full max-w-4xl flex-col p-0 sm:max-w-4xl [&>button]:hidden">
            <NoteDetailsView 
              note={selectedNote} 
              onBack={() => setSelectedNote(null)} 
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
      
      {/* Render the note detail drawer */}
      <NoteDetailDrawer />
    </SidebarProvider>
  )
}
