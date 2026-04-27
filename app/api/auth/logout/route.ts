import { createAuthClient } from "@/lib/supabase/serverAuth";
import { cookies } from "next/headers";

export async function POST() {
  const supabase = await createAuthClient();
  const cookieStore = await cookies();

  await supabase.auth.signOut();

  // 🔥 remove ALL supabase cookies dynamically
  cookieStore.getAll().forEach((cookie) => {
    if (cookie.name.startsWith("sb-")) {
      cookieStore.set(cookie.name, "", { path: "/" });
    }
  });

  return Response.json({ success: true });
}