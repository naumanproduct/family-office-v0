"use client"

import type * as React from "react"
import { useState } from "react"
import {
  ArrowUpCircleIcon,
  Building2Icon,
  BuildingIcon,
  CheckCircleIcon,
  ChevronsUpDownIcon,
  DollarSignIcon,
  FileIcon,
  FileTextIcon,
  GanttChartIcon,
  HelpCircleIcon,
  PlusCircleIcon,
  ScaleIcon,
  SearchIcon,
  SettingsIcon,
  TargetIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react"

import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { WorkflowTemplateDialog } from "./workflows/workflow-template-dialog"
import { SettingsModal } from "./settings-modal"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Investments",
      url: "/investments",
      icon: TrendingUpIcon,
    },
    {
      title: "Entities",
      url: "/entities",
      icon: Building2Icon,
    },
    {
      title: "Opportunities",
      url: "/opportunities",
      icon: TargetIcon,
    },
    {
      title: "Tasks",
      url: "/tasks",
      icon: CheckCircleIcon,
    },
    {
      title: "Files",
      url: "/documents",
      icon: FileTextIcon,
    },
    {
      title: "Notes",
      url: "/notes",
      icon: FileIcon,
    },
  ],
  navGroups: [
    {
      title: "Partners",
      items: [
        {
          title: "Companies",
          url: "/companies",
          icon: BuildingIcon,
        },
        {
          title: "People",
          url: "/contacts",
          icon: UsersIcon,
        },
      ],
    },
    {
      title: "Workflows",
      items: [
        {
          title: "Deal Pipeline",
          url: "/deal-pipeline",
          icon: GanttChartIcon,
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      action: "settings",
      icon: SettingsIcon,
    },
    {
      title: "Get Help",
      url: "#",
      icon: HelpCircleIcon,
    },
    {
      title: "Search",
      url: "#",
      icon: SearchIcon,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const handleNavigation = (url: string) => {
    window.location.href = url
  }

  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)

  const handleNavAction = (item: any) => {
    if (item.url) {
      handleNavigation(item.url)
    } else if (item.action === "settings") {
      setIsSettingsModalOpen(true)
    }
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <ArrowUpCircleIcon className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Acme Inc.</span>
                    <span className="truncate text-xs">Enterprise</span>
                  </div>
                  <ChevronsUpDownIcon className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                align="start"
                side="bottom"
                sideOffset={4}
              >
                <DropdownMenuLabel className="text-xs text-muted-foreground">Entity</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleNavigation("/investments")}>
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <ArrowUpCircleIcon className="size-4 shrink-0" />
                  </div>
                  Acme Inc.
                  <DropdownMenuShortcut>⌘1</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigation("/investments")}>
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <Building2Icon className="size-4 shrink-0" />
                  </div>
                  Acme Holdings
                  <DropdownMenuShortcut>⌘2</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-muted-foreground">
                  <PlusCircleIcon className="size-4 mr-2" />
                  Add Entity
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    onClick={() => handleNavigation(item.url)}
                    className="cursor-pointer"
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {data.navGroups.map((group) => (
          <SidebarGroup key={group.title}>
            <div className="relative group">
              <SidebarGroupLabel className="flex items-center justify-between">
                {group.title}
                {group.title === "Workflows" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setIsTemplateDialogOpen(true)}
                  >
                    <PlusCircleIcon className="h-3 w-3" />
                  </Button>
                )}
              </SidebarGroupLabel>
            </div>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      onClick={() => handleNavigation(item.url)}
                      className="cursor-pointer"
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navSecondary.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    onClick={() => handleNavAction(item)}
                    className="cursor-pointer"
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <WorkflowTemplateDialog isOpen={isTemplateDialogOpen} onClose={() => setIsTemplateDialogOpen(false)} />
      <SettingsModal open={isSettingsModalOpen} onOpenChange={setIsSettingsModalOpen} />
    </Sidebar>
  )
}
