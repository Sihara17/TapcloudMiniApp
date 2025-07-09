"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Cloud, Home, Zap, Target } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function TapCloudApp() {
  const liffId = "2007685380-qx5MEZd9"

  const [currentScreen, setCurrentScreen] = useState("main")
  const [points, setPoints] = useState(0)
  const [energy, setEnergy] = useState(200)
  const [maxEnergy, setMaxEnergy] = useState(200)
  const [autoPointsLevel, setAutoPointsLevel] = useState(1)
  const [energyPerDayLevel, setEnergyPerDayLevel] = useState(1)
  const [pointsPerClickLevel, setPointsPerClickLevel] = useState(1)
  const [userId, setUserId] = useState("")
  const [userName, setUserName] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [dirty, setDirty] = useState(false)

  // LINE Login
  useEffect(() => {
    if (typeof window === "undefined") return
    import("@line/liff").then((liff) => {
      liff.default.init({ liffId }).then(() => {
        if (!liff.default.isLoggedIn()) {
          liff.default.login()
        } else {
          setIsLoggedIn(true)
          liff.default.getProfile().then(async (profile) => {
            setUserName(profile.displayName)

            const res = await fetch("/api/liff-login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                lineUserId: profile.userId,
                name: profile.displayName,
                avatar: profile.pictureUrl,
              }),
            })

            const data = await res.json()
            if (data.userId) {
              setUserId(data.userId)
              const { data: stats } = await supabase
                .from("game_stats")
                .select("points, energy, auto_level, click_level, energy_level")
                .eq("user_id", data.userId)
                .single()

              if (stats) {
                setPoints(stats.points)
                setEnergy(stats.energy)
                setAutoPointsLevel(stats.auto_level)
                setPointsPerClickLevel(stats.click_level)
                setEnergyPerDayLevel(stats.energy_level)
                setMaxEnergy(200 + 100 * (stats.energy_level - 1))
              } else {
                await supabase.from("game_stats").insert({
                  user_id: data.userId,
                  points: 0,
                  energy: 200,
                  auto_level: 1,
                  click_level: 1,
                  energy_level: 1,
                })
              }
            }
          })
        }
      })
    })
  }, [])

  // Auto points generation
  useEffect(() => {
    const interval = setInterval(() => {
      if (autoPointsLevel > 1) {
        setPoints((prev) => {
          const updated = prev + 0.1
          setDirty(true)
          return updated
        })
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [autoPointsLevel])

  // Energy regeneration
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy((prev) => {
        const updated = Math.min(prev + 1, maxEnergy)
        if (updated !== prev) setDirty(true)
        return updated
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [maxEnergy])

  // Auto save
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!dirty || !userId) return
      await supabase.from("game_stats").update({
        points,
        energy,
        auto_level: autoPointsLevel,
        click_level: pointsPerClickLevel,
        energy_level: energyPerDayLevel,
      }).eq("user_id", userId)
      setDirty(false)
    }, 10000)
    return () => clearInterval(interval)
  }, [dirty, userId, points, energy, autoPointsLevel, pointsPerClickLevel, energyPerDayLevel])

  const handleCloudClick = () => {
    if (energy <= 0) return
    const pointsToAdd = pointsPerClickLevel > 1 ? 2.0 : 1.0
    setPoints((prev) => prev + pointsToAdd)
    setEnergy((prev) => prev - 1)
    setDirty(true)
  }

  const handleUpgrade = (type: string) => {
    if (points < 5000) return
    setPoints((prev) => prev - 5000)
    switch (type) {
      case "auto":
        setAutoPointsLevel((prev) => prev + 1)
        break
      case "energy":
        setEnergyPerDayLevel((prev) => {
          const newLevel = prev + 1
          setMaxEnergy(200 + 100 * (newLevel - 1))
          return newLevel
        })
        break
      case "click":
        setPointsPerClickLevel((prev) => prev + 1)
        break
    }
    setDirty(true)
  }

  const MainScreen = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white p-4">
      <h1 className="text-4xl font-bold text-cyan-400 mb-4">TapCloud</h1>
      <div className="text-center">
        <div className="text-2xl text-cyan-300">Points: {points.toFixed(2)}</div>
        <div className="text-lg text-gray-300">Energy: {energy} / {maxEnergy}</div>
      </div>
      <div
        className="w-64 h-64 bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800 rounded-full flex items-center justify-center text-lg font-bold shadow-lg mt-6 cursor-pointer"
        onClick={handleCloudClick}
      >
        <Cloud className="w-12 h-12 text-cyan-300" />
      </div>
      <p className="mt-4 text-sm text-cyan-500">@{userName}</p>
    </div>
  )

  const UpgradeScreen = () => (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white p-4">
      <div className="max-w-md mx-auto space-y-4 pt-8">
        {[
          { label: "Auto Points", level: autoPointsLevel, type: "auto" },
          { label: "Energy Per Day", level: energyPerDayLevel, type: "energy" },
          { label: "Points Per Click", level: pointsPerClickLevel, type: "click" },
        ].map(({ label, level, type }) => (
          <Card key={type} className="bg-slate-800/50 border-cyan-500/30">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-cyan-400 mb-2">{label}</h3>
                  <p className="text-gray-300">Level {level}</p>
                </div>
                <Button
                  className="bg-cyan-600 hover:bg-cyan-700"
                  onClick={() => handleUpgrade(type)}
                  disabled={points < 5000}
                >
                  Upgrade (5000 pts)
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const QuestScreen = () => (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-blue-400 mb-8">Daily Login Quest</h1>
      <p className="text-gray-400 text-lg italic">coming Soon ....</p>
    </div>
  )

  return (
    <div className="relative">
      {currentScreen === "main" && <MainScreen />}
      {currentScreen === "upgrades" && <UpgradeScreen />}
      {currentScreen === "quest" && <QuestScreen />}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-800/90 backdrop-blur-sm border-t border-slate-700">
        <div className="flex justify-around items-center py-3">
          <Button
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center space-y-1 ${currentScreen === "main" ? "text-cyan-400" : "text-gray-400"}`}
            onClick={() => setCurrentScreen("main")}
          >
            <Home className="w-6 h-6" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center space-y-1 ${currentScreen === "upgrades" ? "text-cyan-400" : "text-gray-400"}`}
            onClick={() => setCurrentScreen("upgrades")}
          >
            <Zap className="w-6 h-6" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center space-y-1 ${currentScreen === "quest" ? "text-cyan-400" : "text-gray-400"}`}
            onClick={() => setCurrentScreen("quest")}
          >
            <Target className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  )
}
