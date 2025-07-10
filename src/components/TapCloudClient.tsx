"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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

  useEffect(() => {
    const initSdk = async () => {
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

    initSdk().catch(console.error)
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
      supabase
        .from("game_stats")
        .update({
          points,
          energy,
          auto_level: autoLevel,
          click_level: clickLevel,
          energy_level: energyLevel,
        })
        .eq("user_id", userId)
      setDirty(false)
    }, 10000)
    return () => clearInterval(interval)
  }, [dirty, userId, points, energy, autoLevel, clickLevel, energyLevel])

  const handleClick = () => {
    if (energy <= 0) return
    setPoints((p) => p + (clickLevel > 1 ? 2 : 1))
    setEnergy((e) => Math.max(0, e - 1))
    setDirty(true)
  }

  const handleUpgrade = (type: "auto" | "click" | "energy") => {
    if (points < 5000) return
    setPoints((p) => p - 5000)
    setDirty(true)

    if (type === "auto") setAutoLevel((l) => l + 1)
    if (type === "click") setClickLevel((l) => l + 1)
    if (type === "energy") {
      setEnergyLevel((l) => {
        const newLevel = l + 1
        setMaxEnergy(200 + 100 * (newLevel - 1))
        return newLevel
      })
    }
  }

  const BottomNav = () => (
    <div className="fixed bottom-0 w-full bg-slate-800 border-t border-slate-700 flex justify-around py-2">
      {["main", "upgrades", "quest"].map((s) => (
        <Button
          key={s}
          variant="ghost"
          size="sm"
          onClick={() => setScreen(s as any)}
          className={screen === s ? "text-cyan-400" : "text-gray-400"}
        >
          {s === "main" && <Home className="w-6 h-6" />}
          {s === "upgrades" && <Zap className="w-6 h-6" />}
          {s === "quest" && <Target className="w-6 h-6" />}
        </Button>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white p-4">
      {screen === "main" && (
        <div className="flex flex-col items-center space-y-4">
          <h1 className="text-3xl font-bold text-cyan-400">TapCloud</h1>
          <div>Points: {points.toFixed(2)}</div>
          <div>Energy: {energy}/{maxEnergy}</div>
          <div
            className="w-52 h-52 rounded-full bg-gradient-to-br from-blue-600 via-purple-500 to-indigo-700 flex items-center justify-center cursor-pointer shadow-lg"
            onClick={handleClick}
          >
            <Cloud className="w-12 h-12 text-white" />
          </div>
          <p className="text-sm text-cyan-500">@{userName}</p>
        </div>
      )}

      {screen === "upgrades" && (
        <div className="space-y-4">
          {[
            { type: "auto", label: "Auto Points", level: autoLevel },
            { type: "energy", label: "Energy Level", level: energyLevel },
            { type: "click", label: "Click Power", level: clickLevel },
          ].map((u) => (
            <Card key={u.type} className="bg-slate-800">
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="text-cyan-400 font-semibold">{u.label}</h3>
                  <p className="text-gray-400">Level {u.level}</p>
                </div>
                <Button onClick={() => handleUpgrade(u.type as any)} disabled={points < 5000}>
                  Upgrade (5000 pts)
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {screen === "quest" && (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <h2 className="text-2xl font-bold text-blue-300">Daily Quest</h2>
          <p className="text-gray-400 mt-2">Coming Soon...</p>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
