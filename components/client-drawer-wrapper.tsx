"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"

// Dynamically import MasterDrawer with no SSR to prevent hydration issues
const DynamicMasterDrawer = dynamic(
  () => import("./master-drawer").then((mod) => ({ default: mod.MasterDrawer })),
  { ssr: false }
)

// This wrapper ensures proper client-side hydration for drawers
export function ClientDrawerWrapper(props: React.ComponentProps<typeof DynamicMasterDrawer>) {
  const [isOpen, setIsOpen] = React.useState(false)
  
  const handleTriggerClick = () => {
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
  }
  
  return (
    <>
      <div onClick={handleTriggerClick}>
        {props.trigger}
      </div>
      
      {isOpen && (
        <DynamicMasterDrawer 
          {...props} 
          // Add an additional close handler to the original props
          onClose={handleClose}
        />
      )}
    </>
  )
} 