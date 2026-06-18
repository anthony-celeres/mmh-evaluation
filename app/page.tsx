import { redirect } from "next/navigation";
import Link from "next/link";

import LoginButton from "@/components/LoginLogoutButton";
import UserGreetText from "@/components/UserGreetText";
import { getCurrentUserProfile } from "@/lib/admin";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Home() {
  const profile = await getCurrentUserProfile();

  if (profile?.role === "admin") {
    redirect("/admin");
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">MMH Evaluation</h1>
          <LoginButton />
        </div>
      </header>

      <div className="mx-auto max-w-5xl p-6 lg:p-10">
        {profile ? (
          <div className="space-y-8">
            {/* Welcome Section */}
            <section>
              <h2 className="text-3xl font-bold text-slate-900">Welcome back, {profile.full_name}!</h2>
              <p className="mt-2 text-slate-500">Here is your current resident information.</p>
            </section>

            {/* Profile Information Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-slate-200 bg-white shadow-sm">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs font-bold uppercase tracking-wider text-blue-600">Personal Details</CardDescription>
                  <CardTitle className="text-lg font-bold text-slate-900">Name & Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div>
                    <label className="text-xs font-medium text-slate-400">Full Name</label>
                    <p className="text-sm font-semibold text-slate-700">{profile.full_name}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-400">Email Address</label>
                    <p className="text-sm font-semibold text-slate-700">{profile.email}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 bg-white shadow-sm">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs font-bold uppercase tracking-wider text-blue-600">Academic Info</CardDescription>
                  <CardTitle className="text-lg font-bold text-slate-900">Education</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div>
                    <label className="text-xs font-medium text-slate-400">Degree Program</label>
                    <p className="text-sm font-semibold text-slate-700">{profile.degree_program}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-400">Year Level</label>
                    <p className="text-sm font-semibold text-slate-700">Year {profile.year}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 bg-white shadow-sm md:col-span-2 lg:col-span-1">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs font-bold uppercase tracking-wider text-blue-600">Dormitory Info</CardDescription>
                  <CardTitle className="text-lg font-bold text-slate-900">Room Assignment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div>
                    <label className="text-xs font-medium text-slate-400">Room Number</label>
                    <p className="text-sm font-semibold text-slate-700">{profile.room_number ?? "Not Assigned"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-400">Status</label>
                    <div className="mt-1">
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Active Resident
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <section className="rounded-2xl border border-slate-200 bg-blue-50 p-6">
              <h3 className="text-lg font-bold text-blue-900">Need to update your info?</h3>
              <p className="mt-1 text-sm text-blue-700">Please contact the dormitory administrator if any of your details are incorrect or if you have recently changed rooms.</p>
            </section>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h2 className="text-3xl font-bold text-slate-900">MMH Evaluation System</h2>
            <p className="mt-4 max-w-md text-slate-500">
              Welcome to the MMH Evaluation platform. Please log in to view your resident profile and manage your information.
            </p>
            <div className="mt-8">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700"
              >
                Log In Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
