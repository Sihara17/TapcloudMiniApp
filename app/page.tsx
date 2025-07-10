import { ClientOnly } from "@/components/ClientOnly"
import TapCloudClient from "@/components/TapCloudClient"

export default function Page() {
  return (
    <ClientOnly>
      <TapCloudClient />
    </ClientOnly>
  )
}
