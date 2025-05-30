import type { Metadata } from "next"
import NotesClientPage from "./NotesClientPage"

export const metadata: Metadata = {
  title: "Notes",
  description: "Manage and organize all your notes in one place.",
}

export default function NotesPage() {
  return <NotesClientPage />
}
