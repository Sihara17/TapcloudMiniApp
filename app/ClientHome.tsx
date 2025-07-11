"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"

export default function ClientHome() {
  const [username, setUsername] = useState("")

  useEffect(() => {
    const getProfile = async () => {
      if (!supabase) {
        console.error("Supabase client is undefined!")
        return
      }

      const { data, error } = await supabase
        .from("users")
        .select("name")
        .limit(1)
        .single()

      console.log("DATA:", data)
      console.log("ERROR:", error)

      if (data?.name) setUsername(data.name)
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
