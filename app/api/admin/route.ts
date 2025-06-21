// app/api/create-superadmin/route.ts
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
// import { createClient } from "@/lib/supabase/client"; // Make sure this uses your service role key securely


export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, name } = body;

  const supabase = await createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // ✅ This is crucial
  );

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
