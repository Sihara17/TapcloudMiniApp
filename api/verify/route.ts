import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { accessToken } = await req.json()

  const res = await fetch("https://api.dappportal.io/auth/verify", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "X-Client-Secret": process.env.DAPP_CLIENT_SECRET!, // server only!
    }
  })

  if (!res.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await res.json()
  return NextResponse.json({ user })
}
