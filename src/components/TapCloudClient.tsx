"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import DappSDK from "@linenext/dapp-portal-sdk"
import { Cloud, Home, Zap, Target } from "lucide-react"

export default function TapCloudClient() {
  const [sdk, setSdk] = useState<DappSDK | null>(null)
  const [userId, setUserId] = useState("")
  const [userName, setUserName] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [points, setPoints] = useState(0)
  const [energy, setEnergy] = useState(200)
  const [maxEnergy, setMaxEnergy] = useState(200)
  const [autoLevel, setAutoLevel] = useState(1)
  const [clickLevel, setClickLevel] = useState(1)
  const [energyLevel, setEnergyLevel] = useState(1)
  const [dirty, setDirty] = useState(false)
  const [screen, setScreen] = useState<"main" | "upgrades" | "quest">("main")

  // Init SDK + sync data
  useEffect(() => {
    const init = async () => {
      const instance = new DappSDK({
        clientId: process.env.NEXT_PUBLIC_CLIENT_ID!,
        dappId: process.env.NEXT_PUBLIC_DAPP_ID!,
      })
      await instance.init()
      const profile = await instance.getUserProfile()
      const id = profile.userId
      const name = profile.name || "Guest"

      setSdk(instance)
      setUserId(id)
      setUserName(name)
      setIsLoggedIn(true)

      const { data: existing } = await supabase
        .from("game_stats")
        .select("*")
        .eq("user_id", id)
        .single()

      if (existing) {
        setPoints(existing.points)
        setEnergy(existing.energy)
        setAutoLevel(existing.auto_level)
        setClickLevel(existing.click_level)
        setEnergyLevel(existing.energy_level)
        setMaxEnergy(200 + (existing.energy_level - 1) * 100)
      } else {
        await supabase.from("game_stats").insert({
          user_id: id,
          points: 0,
          energy: 200,
          auto_level: 1,
          click_level: 1,
          energy_level: 1,
        })
      }
    }

    init().catch(console.error)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (autoLevel > 1) {
        setPoints((p) => p + 0.1)
        setDirty(true)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [autoLevel])

  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy((e) => {
        const updated = Math.min(e + 1, maxEnergy)
        if (updated !== e) setDirty(true)
        return updated
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [maxEnergy])

  useEffect(() => {
    const interval = setInterval(() => {
      if (!dirty || !userId) return
      supabase.from("game_stats").update({
        points,
        energy,
        auto_level: autoLevel,
        click_level: clickLevel,
        energy_level: energyLevel,
      }).eq("user_id", userId)
      setDirty(false)
    }, 10000)
    return () => clearInterval(interval)
  }, [dirty, userId, points, energy, autoLevel, clickLevel, energyLevel])

  const handleClick = () => {
    if (energy <= 0) return
    setPoints(p => p + (clickLevel > 1 ? 2 : 1))
    setEnergy(e => Math.max(0, e - 1))
    setDirty(true)
  }

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Background awan */}
      <div className="absolute inset-0 z-0">
        <img src="/clouds.webp" alt="clouds" className="w-full h-full object-cover opacity-40" />
      </div>

      {/* Konten utama */}
      <div className="relative z-10 flex flex-col items-center justify-center py-12 px-4 space-y-6">
        <h1 className="text-4xl font-bold text-cyan-300 drop-shadow-md">TapCloud</h1>
        <p className="text-xl text-cyan-200">Points: {points.toFixed(2)}</p>
        <p className="text-lg text-cyan-100">Energy: {energy} / {maxEnergy}</p>

        <div onClick={handleClick} className="mt-4 w-52 h-52 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-full flex items-center justify-center shadow-2xl border-4 border-white cursor-pointer">
          <img src="/logo1.png" alt="TapCloud Logo" className="w-36 h-36 rounded-full object-cover" />
        </div>

        {isLoggedIn && <p className="text-sm text-cyan-400 mt-2">@{userName}</p>}

        {!isLoggedIn && (
          <Button className="mt-4 bg-green-600 hover:bg-green-700 text-white">
            Login with LINE
          </Button>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 w-full bg-black/60 backdrop-blur border-t border-white/10 flex justify-around py-2 z-20">
        {[["main", <Home className="w-6 h-6" />], ["upgrades", <Zap className="w-6 h-6" />], ["quest", <Target className="w-6 h-6" />]].map(([key, icon]) => (
          <Button
            key={key}
            variant="ghost"
            size="sm"
            onClick={() => setScreen(key as any)}
            className={screen === key ? "text-cyan-400" : "text-white/60"}
          >
            {icon}
          </Button>
        ))}
      </div>
    </div>
  )
}

