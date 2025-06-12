"use client"

import * as React from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { MasterDrawer } from "./master-drawer"

// This wrapper ensures proper client-side hydration for drawers
// It fixes the React 19/Next.js 15 compatibility issues
export function ClientDrawerWrapper(props: React.ComponentProps<typeof MasterDrawer>) {
  const [isClient, setIsClient] = React.useState(false)
  
  React.useEffect(() => {
    // This ensures hydration is complete before rendering the drawer
    setIsClient(true)
  }, [])

  // Render only the trigger during server-side rendering
  if (!isClient) {
    return <>{props.trigger}</>
  }
  
  // Once hydrated on client, render full MasterDrawer
  return <MasterDrawer {...props} />
} 