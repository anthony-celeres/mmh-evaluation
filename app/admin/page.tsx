import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllProfiles } from "@/lib/admin";
import { Users, UserCheck, ArrowRight, Database, Shield, PlusCircle } from "lucide-react";

export default async function AdminPage() {
  const users = await getAllProfiles();
  const total = users.length;
  const admins = users.filter((user) => user.role === "admin").length;
  const occupants = users.filter((user) => user.role === "occupant").length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Greeting */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-accent">System Control Panel</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground mt-1">Admin Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your dormitory evaluations, occupant registers, and security settings.
          </p>
        </div>
        <div className="text-xs text-muted-foreground font-medium md:text-right">
          System Date: <span className="font-bold text-foreground">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Grid of Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Profiles */}
        <Card className="border-border bg-card shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 group hover:-translate-y-0.5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Accounts</CardDescription>
            <div className="p-2 rounded-lg bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              <Users className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-foreground">{total}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Registered profiles in database</p>
          </CardContent>
        </Card>

        {/* Admins */}
        <Card className="border-border bg-card shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 group hover:-translate-y-0.5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Administrators</CardDescription>
            <div className="p-2 rounded-lg bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              <Shield className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-foreground">{admins}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Full control access profiles</p>
          </CardContent>
        </Card>

        {/* Occupants */}
        <Card className="border-border bg-card shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 group hover:-translate-y-0.5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Occupants</CardDescription>
            <div className="p-2 rounded-lg bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              <UserCheck className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-foreground">{occupants}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Dormitory residents under evaluation</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Control Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Core Actions Card */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-foreground">Quick Management Actions</CardTitle>
            <CardDescription className="text-xs">Direct links to manage your primary dormitory records.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/admin/occupants"
                className="group flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/10 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/25 transition-all duration-300 active:scale-[0.98]"
              >
                <PlusCircle className="h-4 w-4" />
                Manage Occupants
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/api/admin/users"
                className="group inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-bold text-foreground hover:bg-muted hover:text-foreground transition-all duration-300 active:scale-[0.98]"
              >
                <Database className="h-4 w-4 text-muted-foreground" />
                Export User JSON
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* System Info / Documentation Card */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-foreground">Dormitory Admin Guidelines</CardTitle>
            <CardDescription className="text-xs">Quick tips for managing database updates.</CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground leading-relaxed space-y-2">
            <p>
              🔐 **Security**: Do not share administrator credentials. Accounts are pre-authenticated via Supabase auth, and only admin-provisioned email addresses can sign in.
            </p>
            <p>
              📊 **Evaluations**: The computation rank formula applies weighted grades. Adding new record entries in "Records" automatically recalibrates ranking tables for the occupants.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}