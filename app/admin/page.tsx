import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllProfiles } from "@/lib/admin";

export default async function AdminPage() {
  const users = await getAllProfiles();
  const total = users.length;
  const admins = users.filter((user) => user.role === "admin").length;
  const occupants = users.filter((user) => user.role === "occupant").length;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
          Dashboard
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
          Admin overview
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-500">
          Use the sidebar to manage occupants, create authenticated accounts,
          and keep the database in sync.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-slate-200 bg-slate-50 shadow-none">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-medium uppercase tracking-wider text-slate-500">Total profiles</CardDescription>
              <CardTitle className="text-3xl font-bold text-slate-900">{total}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-slate-200 bg-slate-50 shadow-none">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-medium uppercase tracking-wider text-slate-500">Admins</CardDescription>
              <CardTitle className="text-3xl font-bold text-slate-900">{admins}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-slate-200 bg-slate-50 shadow-none sm:col-span-2 lg:col-span-1">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-medium uppercase tracking-wider text-slate-500">Occupants</CardDescription>
              <CardTitle className="text-3xl font-bold text-slate-900">{occupants}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/admin/occupants"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Open Occupant Manager
          </Link>
          <Link
            href="/api/admin/users"
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
          >
            View JSON route
          </Link>
        </div>
      </section>
    </div>
  );
}