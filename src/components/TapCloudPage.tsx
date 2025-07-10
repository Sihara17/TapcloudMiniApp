// app/_components/TapCloudPage.tsx
"use client"

import { useEffect } from "react"
import { DappSDK } from "@linenext/dapp-portal-sdk" // pastikan ini benar
import { useRouter } from "next/navigation"

export default function TapCloudPage() {
  const router = useRouter()

  useEffect(() => {
    const sdk = new DappSDK({
      dappId: "YOUR_DAPP_ID", // Ganti ini dengan ID dari LINE NEXT
      channelId: "YOUR_CHANNEL_ID", // Ganti sesuai setup kamu
      liffId: "YOUR_LIFF_ID", // opsional, jika pakai LIFF
    })

    sdk.init().then(async () => {
      const profile = await sdk.getProfile()
      if (!profile) {
        sdk.login()
      } else {
        console.log("User profile:", profile)
        // simpan ke zustand/supabase, dll
      }
    })
  }, [])

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold">🌥️ TapCloud</h1>
      <p className="mt-2 text-lg">Welcome to the cloud-tapping world!</p>
      {/* Tambahkan game UI kamu di sini */}
    </main>
  )
}
