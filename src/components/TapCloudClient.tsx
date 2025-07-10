"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

export default function TapCloudClient() {
  const [points, setPoints] = useState(0)
  const [energy, setEnergy] = useState(0)
  const [userId, setUserId] = useState<string | null>(null)

  // Ambil data user & game saat komponen mount
  useEffect(() => {
    const fetchData = async () => {
      const { data: userData } = await supabase.auth.getUser()
      const id = userData.user?.id
      if (!id) return

      setUserId(id)

      const { data, error } = await supabase
        .from("game_stats")
        .select("points, energy")
        .eq("user_id", id)
        .single()

      if (data) {
        setPoints(data.points)
        setEnergy(data.energy)
      }

      if (error) console.error("❌ Gagal fetch game_stats:", error)
    }

    fetchData()
  }, [])

  // Fungsi tap cloud
  const handleTap = async () => {
    if (!userId || energy <= 0) return

    const newPoints = points + 1
    const newEnergy = energy - 1

    setPoints(newPoints)
    setEnergy(newEnergy)

    const { error } = await supabase
      .from("game_stats")
      .update({ points: newPoints, energy: newEnergy })
      .eq("user_id", userId)

    if (error) console.error("❌ Gagal update game_stats:", error)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/bg.png')" }}>
      <div className="text-white text-lg mt-4">Points: {points}</div>
      <div className="text-white text-lg mb-4">Energy: {energy}</div>

      <button onClick={handleTap} disabled={energy <= 0}>
        <Image
          src="/logo1.png"
          alt="TapCloud Logo"
          width={200}
          height={200}
          className="rounded-full active:scale-95 transition"
        />
      </button>
    </div>
  )
}
