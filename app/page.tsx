import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/investments')
  return null
} 