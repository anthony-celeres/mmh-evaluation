import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteOccupant, createOccupant } from "@/lib/occupant-actions";
import { getAllProfiles } from "@/lib/admin";
import { OccupantForm } from "@/components/admin/OccupantForm";

export default async function OccupantsPage() {
  const users = await getAllProfiles();

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
          Occupant Manager
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
          Manage authenticated users
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-500">
          Create, edit, and remove occupant accounts. Every change updates the Supabase Auth user and the public.users profile record.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-900">Add occupant</CardTitle>
            <CardDescription className="text-sm text-slate-500">
              Create an authenticated account and store the profile in the database.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OccupantForm action={createOccupant} submitLabel="Create occupant" requirePassword />
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-900">Current profiles</CardTitle>
            <CardDescription className="text-sm text-slate-500">
              Edit or remove existing records.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Full name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Program</th>
                    <th className="px-4 py-3">Year</th>
                    <th className="px-4 py-3">Room</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {users.map((user) => (
                    <tr key={user.auth_user_id} className="transition-colors hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-medium text-slate-900">{user.full_name}</td>
                      <td className="px-4 py-3 text-slate-600">{user.email}</td>
                      <td className="px-4 py-3 text-slate-600">{user.degree_program}</td>
                      <td className="px-4 py-3 text-slate-600">{user.year}</td>
                      <td className="px-4 py-3 text-slate-600">{user.room_number ?? "-"}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${user.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/occupants/${user.auth_user_id}/edit`}
                            className="inline-flex h-8 items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
                          >
                            Edit
                          </Link>
                          <form action={deleteOccupant}>
                            <input type="hidden" name="auth_user_id" value={user.auth_user_id} />
                            <Button
                              type="submit"
                              variant="destructive"
                              className="h-8 rounded-md px-3 text-xs font-medium"
                            >
                              Delete
                            </Button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}