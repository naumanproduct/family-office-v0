"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ObjectsManagement } from "./objects-management"
import { WorkflowsManagement } from "./workflows-management"
import { AutomationsManagement } from "./automations-management"

export function DataSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Management</CardTitle>
        <CardDescription>Manage your custom objects, fields, and workflows.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="objects" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="objects">Objects</TabsTrigger>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="automations">Automations</TabsTrigger>
          </TabsList>
          <TabsContent value="objects" className="space-y-4">
            <ObjectsManagement />
          </TabsContent>
          <TabsContent value="workflows" className="space-y-4">
            <WorkflowsManagement />
          </TabsContent>
          <TabsContent value="automations" className="space-y-4">
            <AutomationsManagement />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
