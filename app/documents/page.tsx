import { redirect } from "next/navigation"

export default function DocumentsPage() {
  redirect("/files")
  return null
}
