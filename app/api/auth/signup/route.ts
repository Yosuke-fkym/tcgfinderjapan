import { supabaseAdmin } from "@/lib/supabase/admin";
import { createAuthClient } from "@/lib/supabase/serverAuth";

export async function POST(req: Request) {
  const supabase = await createAuthClient();
  const { email, password, name } = await req.json();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name
      }
    }
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  if (data.user) {
   const { data: userData, error: userError } = await supabaseAdmin
  .from("users")
  .insert({
    id: data.user.id,
    email: data.user.email,
    name: name || "user",
  });

if (userError) {
  console.log("USER INSERT ERROR:", userError);
}
  }

  return Response.json({ success: true });
}