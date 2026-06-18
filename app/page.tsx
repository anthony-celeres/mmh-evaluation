import { redirect } from "next/navigation";
import Link from "next/link";

import LoginButton from "@/components/LoginLogoutButton";
import UserGreetText from "@/components/UserGreetText";
import { getCurrentUserProfile } from "@/lib/admin";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { getEvaluationsByOccupantId } from "@/lib/evaluation-actions";

export default async function Home() {
  const profile = await getCurrentUserProfile();

  if (profile?.role === "admin") {
    redirect("/admin");
  }

  let evaluations: any[] = [];
  if (profile) {
    evaluations = await getEvaluationsByOccupantId(profile.auth_user_id);
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

      <div className="mx-auto max-w-5xl p-4 md:p-6 lg:p-10">
        {profile ? (
          <div className="space-y-6 md:space-y-8">
            {/* Ranking Component */}
            {evaluations.length > 0 && (
              <section className="flex flex-col items-center justify-center rounded-2xl border-2 border-blue-100 bg-white p-6 md:p-8 shadow-xl shadow-blue-50">
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mb-4 md:mb-6">Current Standing</p>
                <div className="flex items-center justify-center gap-6 md:gap-12">
                  <div className="flex flex-col items-center">
                    <div className="flex items-baseline gap-1 md:gap-2">
                      <span className="text-4xl md:text-6xl font-black text-slate-900">#{evaluations[0].rank || 1}</span>
                      <span className="text-lg md:text-xl font-bold text-slate-500">Rank</span>
                    </div>
                  </div>
                  
                  <div className="h-10 md:h-16 w-px bg-slate-200" /> {/* Vertical Divider */}

                  <div className="flex flex-col items-center">
                    <div className="flex flex-col items-center">
                      <span className={`text-2xl md:text-4xl font-black ${((parseFloat(evaluations[0].second_sem) || 0) * 0.6 + (parseFloat(evaluations[0].first_sem) || 0) * 0.4) >= 70 ? 'text-blue-600' : 'text-red-600'}`}>
                        {((parseFloat(evaluations[0].second_sem) || 0) * 0.6 + (parseFloat(evaluations[0].first_sem) || 0) * 0.4).toFixed(1)}
                      </span>
                      <span className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-wider">Final Score</span>
                    </div>
                  </div>
                </div>
                <p className="mt-6 md:mt-8 text-center text-xs md:text-sm font-medium text-slate-600 max-w-sm">
                  Based on your most recent evaluation performance across all residents.
                </p>
              </section>
            )}

            {/* Evaluation Records Section */}
            <section className="space-y-3 md:space-y-4">
              <h3 className="text-xl md:text-2xl font-bold text-slate-900">Evaluation Record</h3>
              {evaluations.length > 0 ? (
                <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 text-xs md:text-sm">
                      <thead className="bg-slate-50 text-left text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-500">
                        <tr>
                          <th className="px-4 md:px-6 py-3 md:py-4 text-center">Evaluators (35)</th>
                          <th className="px-4 md:px-6 py-3 md:py-4 text-center">Records (65)</th>
                          <th className="px-4 md:px-6 py-3 md:py-4 text-center">2nd Sem Total</th>
                          <th className="px-4 md:px-6 py-3 md:py-4 text-center">1st Sem (40%)</th>
                          <th className="px-4 md:px-6 py-3 md:py-4 text-center">Final Grade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {evaluations.map((evaluation) => {
                          const secondSem = parseFloat(evaluation.second_sem) || 0;
                          const firstSem = parseFloat(evaluation.first_sem) || 0;
                          const final = (secondSem * 0.6) + (firstSem * 0.4);
                          
                          return (
                            <tr key={evaluation.id} className="transition-colors hover:bg-slate-50/50">
                              <td className="px-4 md:px-6 py-3 md:py-4 text-center text-slate-600">{evaluation.evaluator_points ?? 0}</td>
                              <td className="px-4 md:px-6 py-3 md:py-4 text-center text-slate-600">{evaluation.record_points ?? 0}</td>
                              <td className="px-4 md:px-6 py-3 md:py-4 text-center font-bold text-slate-900">{secondSem}</td>
                              <td className="px-4 md:px-6 py-3 md:py-4 text-center text-slate-600">{firstSem}</td>
                              <td className="px-4 md:px-6 py-3 md:py-4 text-center">
                                <span className={`inline-flex rounded-lg px-2.5 py-1 text-xs md:text-sm font-black ${final >= 70 ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'}`}>
                                  {final.toFixed(1)}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card>
              ) : (
                <Card className="border-dashed border-slate-200 bg-transparent py-10 md:py-12 text-center shadow-none">
                  <p className="text-sm text-slate-400">No evaluation records have been posted yet.</p>
                </Card>
              )}
            </section>

            {/* Profile Information Grid */}
            <div className="grid gap-4 md:grid-gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-slate-200 bg-white shadow-sm">
                <CardHeader className="pb-1 md:pb-2">
                  <CardDescription className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-blue-600">Personal Details</CardDescription>
                  <CardTitle className="text-base md:text-lg font-bold text-slate-900">Name & Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4 pt-2 md:pt-4">
                  <div>
                    <label className="text-[10px] md:text-xs font-medium text-slate-400">Full Name</label>
                    <p className="text-xs md:text-sm font-semibold text-slate-700">{profile.full_name}</p>
                  </div>
                  <div>
                    <label className="text-[10px] md:text-xs font-medium text-slate-400">Email Address</label>
                    <p className="text-xs md:text-sm font-semibold text-slate-700">{profile.email}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 bg-white shadow-sm">
                <CardHeader className="pb-1 md:pb-2">
                  <CardDescription className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-blue-600">Academic Info</CardDescription>
                  <CardTitle className="text-base md:text-lg font-bold text-slate-900">Education</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4 pt-2 md:pt-4">
                  <div>
                    <label className="text-[10px] md:text-xs font-medium text-slate-400">Degree Program</label>
                    <p className="text-xs md:text-sm font-semibold text-slate-700">{profile.degree_program}</p>
                  </div>
                  <div>
                    <label className="text-[10px] md:text-xs font-medium text-slate-400">Year Level</label>
                    <p className="text-xs md:text-sm font-semibold text-slate-700">Year {profile.year}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 bg-white shadow-sm md:col-span-2 lg:col-span-1">
                <CardHeader className="pb-1 md:pb-2">
                  <CardDescription className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-blue-600">Dormitory Info</CardDescription>
                  <CardTitle className="text-base md:text-lg font-bold text-slate-900">Room Assignment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4 pt-2 md:pt-4">
                  <div>
                    <label className="text-[10px] md:text-xs font-medium text-slate-400">Room Number</label>
                    <p className="text-xs md:text-sm font-semibold text-slate-700">{profile.room_number ?? "Not Assigned"}</p>
                  </div>
                  <div>
                    <label className="text-[10px] md:text-xs font-medium text-slate-400">Status</label>
                    <div className="mt-0.5 md:mt-1">
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[10px] md:text-xs font-medium text-green-800">
                        Active Resident
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <section className="rounded-xl md:rounded-2xl border border-slate-200 bg-blue-50 p-4 md:p-6">
              <h3 className="text-base md:text-lg font-bold text-blue-900">Need to update your info?</h3>
              <p className="mt-1 text-xs md:text-sm text-blue-700">Please contact the dormitory administrator if any of your details are incorrect or if you have recently changed rooms.</p>
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
