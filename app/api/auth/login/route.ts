import { createAuthClient } from "@/lib/supabase/serverAuth";
import { cookies } from "next/headers";

export async function POST(req: Request) {

  const supabase = await createAuthClient()

  const { email, password } = await req.json();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  

  if (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  return Response.json({ success: true });
}