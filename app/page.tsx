'use client'

import { ThemeProvider } from "@/components/theme-provider"
import { TapCloudClient } from "@/components/TapCloudClient"

export default function Page() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="tapcloud-theme">
      <TapCloudClient />
    </ThemeProvider>
  )
}
