"use client"
import {
  CalendarIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  CircleIcon,
  ClockIcon,
  DotIcon as DotsHorizontalIcon,
  SearchIcon,
  SortAscIcon,
  TagIcon,
  UserIcon,
  BuildingIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const tasks = [
  {
    id: "TASK-1234",
    title: "Review Acme Corp Investment Proposal",
    description: "Complete detailed review of the investment proposal for Acme Corp Series B funding",
    dueDate: "2023-05-20T17:00:00Z",
    assignee: "John Smith",
    status: "To Do",
    priority: "High",
    relatedTo: { type: "Company", name: "Acme Corp" },
    workflow: "Deal Pipeline",
  },
  {
    id: "TASK-1235",
    title: "Prepare Due Diligence Report",
    description: "Compile findings from the due diligence process for XYZ Holdings acquisition",
    dueDate: "2023-05-25T17:00:00Z",
    assignee: "Sarah Johnson",
    status: "In Progress",
    priority: "Medium",
    relatedTo: { type: "Entity", name: "XYZ Holdings" },
    workflow: "Entity Compliance & Legal Tasks",
  },
  {
    id: "TASK-1236",
    title: "Schedule Q2 Planning Meeting",
    description: "Coordinate with stakeholders to schedule the Q2 planning meeting for Tech Innovations Inc",
    dueDate: "2023-05-18T12:00:00Z",
    assignee: "Michael Brown",
    status: "To Do",
    priority: "Low",
    relatedTo: { type: "Company", name: "Tech Innovations Inc" },
    workflow: null,
  },
  {
    id: "TASK-1237",
    title: "Follow up on Partnership Agreement",
    description: "Contact Global Ventures legal team regarding the partnership agreement revisions",
    dueDate: "2023-05-16T15:00:00Z",
    assignee: "Emily Davis",
    status: "Completed",
    priority: "Medium",
    relatedTo: { type: "Entity", name: "Global Ventures" },
    workflow: null,
  },
  {
    id: "TASK-1238",
    title: "Finalize Acquisition Terms",
    description: "Review and finalize the terms for the Sunrise Manufacturing acquisition",
    dueDate: "2023-05-30T17:00:00Z",
    assignee: "Robert Wilson",
    status: "In Progress",
    priority: "High",
    relatedTo: { type: "Company", name: "Sunrise Manufacturing" },
    workflow: "Deal Pipeline",
  },
]

export function TasksTable() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full max-w-sm">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search tasks..." className="w-full bg-background pl-8" />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <SortAscIcon className="mr-2 h-3.5 w-3.5" />
                Sort
                <ChevronDownIcon className="ml-2 h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>Due Date (soonest first)</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Due Date (latest first)</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Title (A-Z)</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Title (Z-A)</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Priority (High-Low)</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Priority (Low-High)</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <TagIcon className="mr-2 h-3.5 w-3.5" />
                Filter
                <ChevronDownIcon className="ml-2 h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs">Status</DropdownMenuLabel>
              <DropdownMenuCheckboxItem>To Do</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>In Progress</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Completed</DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs">Priority</DropdownMenuLabel>
              <DropdownMenuCheckboxItem>High</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Medium</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Low</DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs">Workflow</DropdownMenuLabel>
              <DropdownMenuCheckboxItem>Deal Pipeline</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Entity Compliance & Legal Tasks</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Capital Call Tracking</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Tax Document Collection & Filing</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Related To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">{task.description}</div>
                      {task.workflow && (
                        <div className="mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {task.workflow}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4 text-muted-foreground" />
                      <span>{task.assignee}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {task.relatedTo.type === "Company" ? (
                        <BuildingIcon className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <BuildingIcon className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span>{task.relatedTo.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {task.status === "To Do" && <CircleIcon className="h-4 w-4 text-muted-foreground" />}
                      {task.status === "In Progress" && <ClockIcon className="h-4 w-4 text-blue-500" />}
                      {task.status === "Completed" && <CheckCircleIcon className="h-4 w-4 text-green-500" />}
                      <span>{task.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        task.priority === "High" ? "destructive" : task.priority === "Medium" ? "default" : "outline"
                      }
                    >
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <DotsHorizontalIcon className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Mark as Completed</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
