"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { createClient } from "@supabase/ssr"
import { Home, Zap, Target } from "lucide-react"

const supabase = createClient()

export function TapCloudClient() {
  const [points, setPoints] = useState(0)
  const [energy, setEnergy] = useState(200)

  useEffect(() => {
    const fetchStats = async () => {
      const { data: session } = await supabase.auth.getSession()
      const user = session?.session?.user

      if (user) {
        const { data: stats } = await supabase
          .from("game_stats")
          .select("points, energy")
          .eq("user_id", user.id)
          .single()

        if (stats) {
          setPoints(Number(stats.points))
          setEnergy(Number(stats.energy))
        }
      }
    }

    fetchStats()
  }, [])

  const handleTap = async () => {
    if (energy <= 0) return
    setPoints((prev) => prev + 1)
    setEnergy((prev) => prev - 1)

    const { data: session } = await supabase.auth.getSession()
    const user = session?.session?.user

    if (user) {
      await supabase
        .from("game_stats")
        .update({
          points: points + 1,
          energy: energy - 1,
        })
        .eq("user_id", user.id)
    }
  }

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-black text-white pb-20 pt-10">
      <div className="text-center">
        <h1 className="text-cyan-400 font-bold text-3xl">TapCloud</h1>
        <p className="mt-2">Points: {points}</p>
        <p>Energy: {energy}</p>
      </div>

      <button onClick={handleTap} className="mt-8 active:scale-95 transition-transform">
        <Image
          src="/logo1.png"
          alt="TapCloud"
          width={200}
          height={200}
          className="rounded-full border-4 border-cyan-400"
        />
      </button>

      <a
        href="https://access.line.me/oauth2/v2.1/authorize?...isi-link-line-login..."
        className="bg-green-500 px-6 py-2 mt-8 rounded-full text-white text-sm font-medium"
      >
        Login with LINE
      </a>

      <div className="fixed bottom-4 flex justify-around w-full px-4">
        <Home size={28} />
        <Zap size={28} />
        <Target size={28} />
      </div>
    </div>
  )
}
