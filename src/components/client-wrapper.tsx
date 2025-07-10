"use client"

import dynamic from "next/dynamic"

// Import komponen TapCloudClient secara dinamis
const TapCloudClient = dynamic(() => import("./TapCloudClient"), {
  ssr: false, // Nonaktifkan SSR, karena ini hanya jalan di client
})

export default function ClientWrapper() {
  return <TapCloudClient />
}
