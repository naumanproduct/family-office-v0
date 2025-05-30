"use client"

import type * as React from "react"
import {
  ArrowUpCircleIcon,
  FileIcon,
  FileTextIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  SearchIcon,
  SettingsIcon,
  CheckCircleIcon,
  MailIcon,
  BuildingIcon,
  UsersIcon,
  Building2Icon,
  TrendingUpIcon,
  TargetIcon,
  PlusCircleIcon,
  GitBranchIcon,
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
import { ChevronsUpDownIcon } from "lucide-react"

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
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
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
      title: "Documents",
      url: "/documents",
      icon: FileTextIcon,
    },
    {
      title: "Notes",
      url: "/notes",
      icon: FileIcon,
    },
    {
      title: "Emails",
      url: "/emails",
      icon: MailIcon,
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
          title: "Contacts",
          url: "/contacts",
          icon: UsersIcon,
        },
      ],
    },
    {
      title: "Workflows",
      items: [
        {
          title: "Manage Workflows",
          url: "/workflows",
          icon: GitBranchIcon,
        },
        {
          title: "Deal Pipeline",
          url: "/deal-pipeline",
        },
        {
          title: "Capital Call Tracking",
          url: "/capital-call-tracking",
        },
        {
          title: "Tax Document Collection & Filing",
          url: "/tax-documents",
        },
        {
          title: "Entity Compliance & Legal Tasks",
          url: "/entity-compliance",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
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
                <DropdownMenuItem onClick={() => handleNavigation("/dashboard")}>
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <ArrowUpCircleIcon className="size-4 shrink-0" />
                  </div>
                  Acme Inc.
                  <DropdownMenuShortcut>⌘1</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigation("/dashboard")}>
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
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
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
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
