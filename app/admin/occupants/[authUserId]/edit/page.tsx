import { notFound } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OccupantForm } from "@/components/admin/OccupantForm";
import { getProfileByAuthId } from "@/lib/admin";
import { updateOccupant } from "@/lib/occupant-actions";

type EditPageProps = {
  params: {
    authUserId: string;
  };
};

export default async function EditOccupantPage({ params }: EditPageProps) {
  const { authUserId } = params;
  const profile = await getProfileByAuthId(authUserId);

  if (!profile) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-accent">
          Occupant Manager
        </p>
        <h1 className="mt-1 text-2xl font-bold text-foreground md:text-3xl">
          Edit occupant
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Update the authenticated user and sync the profile row in public.users.
        </p>
      </section>

      <Card className="max-w-2xl border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-foreground">Update profile</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Password is optional. Leave it blank to keep the current password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OccupantForm
            action={updateOccupant}
            submitLabel="Save changes"
            values={{
              authUserId: profile.auth_user_id,
              fullName: profile.full_name,
              email: profile.email,
              degreeProgram: profile.degree_program,
              year: profile.year,
              roomNumber: profile.room_number,
              role: profile.role,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}