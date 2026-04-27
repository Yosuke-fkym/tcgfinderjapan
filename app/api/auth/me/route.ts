import { createAuthClient } from "@/lib/supabase/serverAuth";

export async function GET() {
  const supabase = await createAuthClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const { data: userData, error: userError } = await supabase.from("users").select("role").eq("id", data.user.id).single();

  if (userError) {
    console.log("USER DATA ERROR:", userError);
    return Response.json({ error: "Failed to fetch user data" }, { status: 500 });
  }

  return Response.json({
    user: data.user,
    isAdmin: userData?.role === "admin",
  });
}