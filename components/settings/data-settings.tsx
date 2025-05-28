"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ObjectsManagement } from "./objects-management"
import { WorkflowsManagement } from "./workflows-management"

export function DataSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Management</CardTitle>
        <CardDescription>Manage your custom objects, fields, and workflows.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="objects" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="objects">Objects</TabsTrigger>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
          </TabsList>
          <TabsContent value="objects" className="space-y-4">
            <ObjectsManagement />
          </TabsContent>
          <TabsContent value="workflows" className="space-y-4">
            <WorkflowsManagement />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
