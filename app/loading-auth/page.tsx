"use client"

import Preloader from "@/components/ui/preloader"
import { useRouter } from "next/navigation"

export default function LoadingAuthPage() {
  const router = useRouter()

  const handleComplete = () => {
    router.push("/")
  }

  return <Preloader onComplete={handleComplete} />
} 