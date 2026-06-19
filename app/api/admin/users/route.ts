import { NextResponse } from "next/server";

import { getAllProfiles, getCurrentUserProfile } from "@/lib/admin";

export async function GET() {
  const profile = await getCurrentUserProfile();

  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await getAllProfiles();

  return NextResponse.json(
    {
      admin: {
        auth_user_id: profile.auth_user_id,
        full_name: profile.full_name,
        email: profile.email,
      },
      users,
    },
    { status: 200 }
  );
}