// app/api/create-superadmin/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { config } from "@/lib/config";

export async function POST(req: Request) {
  const setupToken = config.security.initialSetupToken;

  // If setup token is not configured, endpoint is disabled
  if (!setupToken || setupToken === "CHANGE_THIS_TO_ENABLE") {
    return NextResponse.json(
      { error: "Initial setup endpoint is disabled. Use the admin dashboard to create new admins." },
      { status: 403 }
    );
  }

  const body = await req.json();
  const { email, password, name, token } = body;

  // Verify setup token
  if (token !== setupToken) {
    return NextResponse.json(
      { error: "Invalid setup token" },
      { status: 401 }
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    console.log(error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Now insert into your `admins` table to assign role
  const { data: admin, error: insertError } = await supabase
    .from("admins")
    .insert({
      id: data.user?.id,
      email:data.user?.email,
      name,
      role: "super_admin",
    })
    .select()
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ user: data.user, admin }, { status: 201 });
}
