// File: src/app/api/liff-login/route.ts
import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  const { lineUserId, name, avatar } = await req.json()

  if (!lineUserId || !name) {
    return NextResponse.json({ error: "Missing lineUserId or name" }, { status: 400 })
  }

  // Cek apakah user sudah ada
  const { data: existingUser, error: findError } = await supabase
    .from("users")
    .select("id")
    .eq("line_user_id", lineUserId)
    .single()

  if (findError && findError.code !== "PGRST116") {
    return NextResponse.json({ error: findError.message }, { status: 500 })
  }

  if (existingUser) {
    return NextResponse.json({ userId: existingUser.id })
  }

  // Buat user baru
  const { data: newUser, error: insertError } = await supabase
    .from("users")
    .insert({ line_user_id: lineUserId, name, avatar })
    .select("id")
    .single()

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  return NextResponse.json({ userId: newUser.id })
}
