"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Cloud, Home, Zap, Target } from "lucide-react"

export default function TapCloudApp() {
  const [currentScreen, setCurrentScreen] = useState("main")
  const [points, setPoints] = useState(2.25)
  const [energy, setEnergy] = useState(200)
  const [maxEnergy, setMaxEnergy] = useState(200)
  const [autoPointsLevel, setAutoPointsLevel] = useState(1)
  const [energyPerDayLevel, setEnergyPerDayLevel] = useState(1)
  const [pointsPerClickLevel, setPointsPerClickLevel] = useState(1)

  // Auto points generation
  useEffect(() => {
    const interval = setInterval(() => {
      if (autoPointsLevel > 1) {
        setPoints((prev) => prev + 0.1)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [autoPointsLevel])

  // Energy regeneration
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy((prev) => Math.min(prev + 1, maxEnergy))
    }, 3000)
    return () => clearInterval(interval)
  }, [maxEnergy])

  const handleCloudClick = () => {
    if (energy > 0) {
      const pointsToAdd = pointsPerClickLevel > 1 ? 2.0 : 1.0
      setPoints((prev) => prev + pointsToAdd)
      setEnergy((prev) => prev - 1)
    }
  }

  const handleUpgrade = (type: string) => {
    if (points >= 5000) {
      setPoints((prev) => prev - 5000)
      switch (type) {
        case "auto":
          setAutoPointsLevel((prev) => prev + 1)
          break
        case "energy":
          setEnergyPerDayLevel((prev) => prev + 1)
          setMaxEnergy((prev) => prev + 100)
          break
        case "click":
          setPointsPerClickLevel((prev) => prev + 1)
          break
      }
    }
  }

  const MainScreen = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white p-4 relative overflow-hidden">
      {/* Background stars effect */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="z-10 flex flex-col items-center space-y-8">
        <h1 className="text-4xl font-bold text-cyan-400 mb-4">TapCloud</h1>

        <div className="text-center space-y-2">
          <div className="text-2xl text-cyan-300">Points: {points.toFixed(2)}</div>
          <div className="text-lg text-gray-300">
            Energy: {energy} / {maxEnergy}
          </div>
        </div>

        <div
          className="relative w-64 h-64 cursor-pointer transform transition-transform hover:scale-105 active:scale-95"
          onClick={handleCloudClick}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800 rounded-full opacity-80" />
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=256&width=256')] bg-cover bg-center rounded-full opacity-20" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Cloud className="w-16 h-16 text-cyan-400 mb-2" />
            <span className="text-xl font-bold text-cyan-300">TapCloud</span>
          </div>
        </div>

        <Button
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full text-lg font-semibold"
          onClick={() => alert("LINE login not implemented in demo")}
        >
          Login with LINE
        </Button>
      </div>
    </div>
  )

  const UpgradeScreen = () => (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white p-4">
      <div className="max-w-md mx-auto space-y-4 pt-8">
        <Card className="bg-slate-800/50 border-cyan-500/30">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-cyan-400 mb-2">Auto Points</h3>
                <p className="text-gray-300">
                  Level {autoPointsLevel} → {autoPointsLevel === 1 ? "0.00" : "0.10"} → 0.10 per sec
                </p>
              </div>
              <Button
                className="bg-cyan-600 hover:bg-cyan-700"
                onClick={() => handleUpgrade("auto")}
                disabled={points < 5000}
              >
                Upgrade (5000 pts)
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-cyan-500/30">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-cyan-400 mb-2">Energy Per Day</h3>
                <p className="text-gray-300">
                  Level {energyPerDayLevel} → {maxEnergy - 100}.00 → {maxEnergy}.00 max/day
                </p>
              </div>
              <Button
                className="bg-cyan-600 hover:bg-cyan-700"
                onClick={() => handleUpgrade("energy")}
                disabled={points < 5000}
              >
                Upgrade (5000 pts)
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-cyan-500/30">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-cyan-400 mb-2">Points Per Click</h3>
                <p className="text-gray-300">
                  Level {pointsPerClickLevel} → {pointsPerClickLevel === 1 ? "0.00" : "1.00"} → 2.00 per click
                </p>
              </div>
              <Button
                className="bg-cyan-600 hover:bg-cyan-700"
                onClick={() => handleUpgrade("click")}
                disabled={points < 5000}
              >
                Upgrade (5000 pts)
              </Button>
            </div>
          </CardContent>
        </Card>
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
