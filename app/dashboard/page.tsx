"use client"

import * as React from "react"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const taskData = [
  {
    id: "728ed52f",
    title: "Draft monthly newsletter",
    status: "todo",
    label: "Marketing",
  },
  {
    id: "8069372f",
    title: "Finalize purchase list",
    status: "in progress",
    label: "Finance",
  },
  {
    id: "92ced6cb",
    title: "Submit monthly report",
    status: "done",
    label: "Finance",
  },
]

const listData = [
  {
    id: "728ed52f",
    title: "Grocery List",
    items: ["Milk", "Eggs", "Bread"],
  },
  {
    id: "8069372f",
    title: "To-Do List",
    items: ["Laundry", "Dishes", "Vacuum"],
  },
]

const recentActivityData = [
  {
    id: "1",
    user: "John Doe",
    action: "created",
    item: "Task 1",
    timestamp: "2024-01-01 10:00",
  },
  {
    id: "2",
    user: "Jane Smith",
    action: "updated",
    item: "Task 2",
    timestamp: "2024-01-01 10:05",
  },
  {
    id: "3",
    user: "John Doe",
    action: "deleted",
    item: "Task 3",
    timestamp: "2024-01-01 10:10",
  },
]

function Task({ task }: { task: (typeof taskData)[0] }) {
  return (
    <TableRow>
      <TableCell className="font-medium">{task.title}</TableCell>
      <TableCell>{task.label}</TableCell>
      <TableCell>
        <Badge
          variant="outline"
          className={cn(
            task.status === "todo" && "bg-secondary text-secondary-foreground",
            task.status === "in progress" && "bg-primary text-primary-foreground",
            task.status === "done" && "bg-muted text-muted-foreground",
          )}
        >
          {task.status}
        </Badge>
      </TableCell>
    </TableRow>
  )
}

function List({ list }: { list: (typeof listData)[0] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{list.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul>
          {list.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

function RecentActivity({ activity }: { activity: (typeof recentActivityData)[0] }) {
  return (
    <div>
      <p>
        {activity.user} {activity.action} {activity.item}
      </p>
      <p className="text-sm text-muted-foreground">{activity.timestamp}</p>
      <Separator className="my-2" />
    </div>
  )
}

function DetailsPanel() {
  return (
    <div>
      <section className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Record Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Name</CardTitle>
            </CardHeader>
            <CardContent>John Doe</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Email</CardTitle>
            </CardHeader>
            <CardContent>john.doe@example.com</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Phone</CardTitle>
            </CardHeader>
            <CardContent>123-456-7890</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Address</CardTitle>
            </CardHeader>
            <CardContent>123 Main St, Anytown</CardContent>
          </Card>
        </div>
      </section>

      <section className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Lists</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {listData.map((list) => (
            <List key={list.id} list={list} />
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
        <div>
          {recentActivityData.map((activity) => (
            <RecentActivity key={activity.id} activity={activity} />
          ))}
        </div>
      </section>
    </div>
  )
}

function DashboardDrawer() {
  const [open, setOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()

  async function onSubmit(event: React.BaseSyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)
    // Simulate api call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    toast({
      title: "Success!",
      description: "Your task has been added.",
    })
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Dashboard Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Dashboard</DrawerTitle>
          <DrawerDescription>Make changes to your profile here. Click save when you're done.</DrawerDescription>
        </DrawerHeader>
        <div className="p-4">
          <Accordion type="single" collapsible>
            <AccordionItem value="tasks">
              <AccordionTrigger>Tasks</AccordionTrigger>
              <AccordionContent>
                <Table>
                  <TableCaption>A list of your tasks.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Label</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {taskData.map((task) => (
                      <Task key={task.id} task={task} />
                    ))}
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="details">
              <AccordionTrigger>Details</AccordionTrigger>
              <AccordionContent>
                <DetailsPanel />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="billing">
              <AccordionTrigger>Billing</AccordionTrigger>
              <AccordionContent>Make changes to your billing details here.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <DrawerFooter>
          <Button>Save changes</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">Dashboard Page</h1>
      <DashboardDrawer />
    </div>
  )
}
