"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const router = useRouter()

  // Redirect to home page since we're now using a modal for settings
  useEffect(() => {
    router.push("/")
  }, [router])

  return null
}
