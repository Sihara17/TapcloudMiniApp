"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { useDappSDK } from "@linenext/dapp-portal-sdk-react"

export default function TapCloudClient() {
  const supabase = createClient()
  const { user, sdk } = useDappSDK()
  const [points, setPoints] = useState(0)
  const [energy, setEnergy] = useState(200)
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Inisialisasi dari Supabase
  useEffect(() => {
    const init = async () => {
      if (!user) return
      const { id } = user
      setUserId(id)
      setIsLoggedIn(true)

      const { data, error } = await supabase
        .from("game_stats")
        .select("points, energy")
        .eq("user_id", id)
        .single()

      if (error || !data) {
        await supabase.from("game_stats").upsert({
          user_id: id,
          points: 0,
          energy: 200,
          auto_level: 1,
          click_level: 1,
          energy_level: 1,
        })
        setPoints(0)
        setEnergy(200)
      } else {
        setPoints(data.points)
        setEnergy(data.energy)
      }
    }

    init()
  }, [user, supabase])

  // Fungsi saat tap logo
  const handleClick = async () => {
    if (!userId || energy <= 0) return

    const newPoints = points + 1
    const newEnergy = energy - 1

    setPoints(newPoints)
    setEnergy(newEnergy)

    await supabase
      .from("game_stats")
      .update({ points: newPoints, energy: newEnergy })
      .eq("user_id", userId)
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold text-cyan-400 mb-2 mt-6">TapCloud</h1>
      <p className="text-lg">Points: {points.toFixed(2)}</p>
      <p className="text-lg mb-4">Energy: {energy} / 200</p>

      {/* TapCloud Logo */}
      <div
        onClick={handleClick}
        className="w-56 h-56 rounded-full bg-black border-4 border-cyan-400 flex items-center justify-center active:scale-95 transition-transform shadow-lg cursor-pointer"
      >
        <img
          src="/logo1.png"
          alt="TapCloud"
          className="w-44 h-44 object-cover rounded-full"
        />
      </div>

      {/* Login Button */}
      {!isLoggedIn && (
        <Button
          onClick={() => sdk?.login()}
          className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full"
        >
          Login with LINE
        </Button>
      )}
    </div>
  )
}
