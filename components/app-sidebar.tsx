"use client"

import * as React from "react"
import { useState, useEffect } from "react"
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
  HomeIcon,
  PlusCircleIcon,
  ScaleIcon,
  SearchIcon,
  SettingsIcon,
  TargetIcon,
  TrendingUpIcon,
  UsersIcon,
  CalendarIcon,
  BarChartIcon,
  ReceiptIcon,
  WalletIcon,
  RocketIcon,
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
    name: "Gordon Gekko",
    email: "gordon@gekko.com",
    avatar: "/avatars/gekko.jpg",
  },
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: HomeIcon,
    },
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
        {
          title: "Capital Calls",
          url: "/capital-calls",
          icon: DollarSignIcon,
        },
        {
          title: "Distributions Tracking",
          url: "/distributions-tracking",
          icon: ArrowUpCircleIcon,
        },
        {
          title: "Meeting Preparation",
          url: "/meeting-preparation",
          icon: CalendarIcon,
        },
        {
          title: "Quarterly Monitoring",
          url: "/quarterly-monitoring",
          icon: BarChartIcon,
        },
        {
          title: "K-1 Review & Tax Docs",
          url: "/k1-review",
          icon: ReceiptIcon,
        },
        {
          title: "Cash Forecasting",
          url: "/cash-forecasting",
          icon: WalletIcon,
        },
        {
          title: "Investment Onboarding",
          url: "/investment-onboarding",
          icon: RocketIcon,
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
  
  // Always start with the same value on server and client to avoid hydration mismatch
  const [selectedEntity, setSelectedEntity] = useState("Gekko Family Office")
  const [isHydrated, setIsHydrated] = useState(false)

  // Update from localStorage after hydration
  useEffect(() => {
    setIsHydrated(true)
    const savedEntity = localStorage.getItem("selectedEntity")
    if (savedEntity) {
      setSelectedEntity(savedEntity)
    }
  }, [])

  const handleNavAction = (item: any) => {
    if (item.url) {
      handleNavigation(item.url)
    } else if (item.action === "settings") {
      setIsSettingsModalOpen(true)
    }
  }

  const handleEntitySelect = (entityName: string) => {
    setSelectedEntity(entityName)
    // Save to localStorage to persist across page navigations
    localStorage.setItem("selectedEntity", entityName)
    handleNavigation("/entities")
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
                    <Building2Icon className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{selectedEntity}</span>
                    <span className="truncate text-xs">Gekko Family Office</span>
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
                <DropdownMenuLabel className="text-xs text-muted-foreground">Gekko Family Office</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleEntitySelect("Gekko 2020 Dynasty Trust")}>
                  Gekko 2020 Dynasty Trust
                  <DropdownMenuShortcut>⌘1</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEntitySelect("Gekko Holdings LLC")}>
                  Gekko Holdings LLC
                  <DropdownMenuShortcut>⌘2</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEntitySelect("Gekko Family Office LLC")}>
                  Gekko Family Office LLC
                  <DropdownMenuShortcut>⌘3</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEntitySelect("Gekko SPV I, LLC")}>
                  Gekko SPV I, LLC
                  <DropdownMenuShortcut>⌘4</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEntitySelect("Gekko Foundation")}>
                  Gekko Foundation
                  <DropdownMenuShortcut>⌘5</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEntitySelect("Gekko Global Holdings Ltd. (Cayman)")}>
                  Gekko Global Holdings Ltd. (Cayman)
                  <DropdownMenuShortcut>⌘6</DropdownMenuShortcut>
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
