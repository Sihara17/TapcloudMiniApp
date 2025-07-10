// src/app/page.tsx
"use client"

import Image from "next/image"
import Link from "next/link"
import { Home, Zap, Target } from "lucide-react"

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center justify-between pb-24">
      {/* Background Clouds */}
      <Image
        src="/clouds.webp"
        alt="clouds"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 -z-10 opacity-40"
      />

      {/* Header */}
      <div className="mt-8 text-center">
        <h1 className="text-4xl font-bold text-cyan-300 drop-shadow-lg">TapCloud</h1>
        <p className="mt-2 text-lg">Points: <span className="font-mono">0.00</span></p>
        <p className="text-lg">Energy: <span className="font-mono">200 / 200</span></p>
      </div>

      {/* Logo */}
      <div className="mt-6">
        <Image
          src="/logo1.png"
          alt="TapCloud"
          width={240}
          height={240}
          className="rounded-full border-4 border-cyan-300 shadow-lg"
        />
      </div>

      {/* Login Button */}
      <Link
        href="/login"
        className="mt-8 px-6 py-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600"
      >
        Login with LINE
      </Link>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-4 inset-x-0 flex justify-around items-center px-4">
        <Link href="/" className="text-white hover:text-cyan-300">
          <Home size={32} />
        </Link>
        <Link href="/boost" className="text-white hover:text-cyan-300">
          <Zap size={32} />
        </Link>
        <Link href="/quest" className="text-white hover:text-cyan-300">
          <Target size={32} />
        </Link>
      </nav>
    </div>
  )
}
