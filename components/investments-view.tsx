"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AssetsTable, assetsData } from "./assets-table"
import { LiabilitiesTable, liabilitiesData } from "./liabilities-table"
import { Badge } from "@/components/ui/badge"

export function InvestmentsView() {
  return (
    <Tabs defaultValue="assets" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="assets" className="flex items-center gap-2">
          Assets
          <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
            {assetsData.length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="liabilities" className="flex items-center gap-2">
          Liabilities
          <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
            {liabilitiesData.length}
          </Badge>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="assets" className="space-y-4">
        <AssetsTable />
      </TabsContent>

      <TabsContent value="liabilities" className="space-y-4">
        <LiabilitiesTable />
      </TabsContent>
    </Tabs>
  )
}
