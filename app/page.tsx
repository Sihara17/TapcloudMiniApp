import dynamic from "next/dynamic"

const TapCloudClient = dynamic(() => import("@/components/TapCloudClient"), { ssr: false })

export default function Page() {
  return <TapCloudClient />
}
