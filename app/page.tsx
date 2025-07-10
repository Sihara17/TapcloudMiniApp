"use client"

import TapCloudClient from "@/components/TapCloudClient"
import Link from "next/link"
import { Home, Zap, Target } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-blue light text-white flex flex-col items-center pb-24">
      {/* TapCloud Game UI */}
      <TapCloudClient />

      {/* Bottom Navigation */}
      <nav className="fixed bottom-4 inset-x-0 flex justify-around px-6">
        <Link href="/" className="text-white hover:text-cyan-400">
          <Home size={32} />
        </Link>
        <Link href="/boost" className="text-white hover:text-cyan-400">
          <Zap size={32} />
        </Link>
        <Link href="/quest" className="text-white hover:text-cyan-400">
          <Target size={32} />
        </Link>
      </nav>
    </div>
  )
}
