// app/ClientHome.tsx
"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"

export default function ClientHome() {
  const [username, setUsername] = useState("")

  useEffect(() => {
    const getProfile = async () => {
      const { data, error } = await supabase.from("users").select("name").limit(1).single()
      if (data) setUsername(data.name)
    }
    getProfile()
  }, [])

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold">Welcome to TapCloud</h1>
      <p className="mt-2">Logged in as: {username || "..."}</p>
    </main>
  )
}
