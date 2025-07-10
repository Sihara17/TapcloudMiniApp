// app/TapCloudClient.tsx
"use client"

import { useEffect, useState } from "react"
import TapCloudPage from "./_components/TapCloudPage"

export default function TapCloudClient() {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  if (!hydrated) return null
  return <TapCloudPage />
}
