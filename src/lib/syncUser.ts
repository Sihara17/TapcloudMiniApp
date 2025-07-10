// lib/syncUser.ts
import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

export async function syncUserToSupabase(user: {
  id: string
  name: string
  walletAddress: string
}) {
  const { data: existing, error } = await supabase
    .from("users")
    .select("id")
    .eq("id", user.id)
    .single()

  if (error && error.code !== "PGRST116") {
    console.error("❌ Error checking user:", error.message)
    return
  }

  if (!existing) {
    await supabase.from("users").insert({
      id: user.id,
      name: user.name,
      wallet_address: user.walletAddress,
    })

    await supabase.from("game_stats").insert({
      user_id: user.id,
      points: 0,
      energy: 200,
    })

    console.log("✅ User baru disimpan ke Supabase")
  } else {
    console.log("✅ User sudah ada di Supabase")
  }
}
