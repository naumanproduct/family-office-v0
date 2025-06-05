"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OpportunitiesTable } from "./opportunities-table"
import { OpportunitiesKanban } from "./opportunities-kanban"

export function OpportunitiesView() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Tabs defaultValue="table" className="w-full">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="table">Table</TabsTrigger>
              <TabsTrigger value="kanban">Kanban</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="table" className="mt-6">
            <OpportunitiesTable />
          </TabsContent>
          <TabsContent value="kanban" className="mt-6">
            <OpportunitiesKanban />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
