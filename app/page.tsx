import { redirect } from "next/navigation";
import Link from "next/link";

import { getCurrentUserProfile } from "@/lib/admin";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import OccupantNavbar from "@/components/OccupantNavbar";
import { getEvaluationsByOccupantId } from "@/lib/evaluation-actions";
import { ArrowRight } from "lucide-react";
import InteractiveLogo from "@/components/InteractiveLogo";

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
    <main className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <OccupantNavbar profile={profile} />

      {profile ? (
        /* ── Logged-in Dashboard ── */
        <div className="mx-auto max-w-5xl p-4 md:p-6 lg:p-10 w-full flex-1">
          <div className="space-y-6 md:space-y-8">
            {/* Greeting */}
            <div className="space-y-1">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                Hello, {profile.full_name}!
              </h2>
              <p className="text-xs md:text-sm text-muted-foreground">
                Here&apos;s your evaluation result.
              </p>
            </div>

            {/* Ranking Component */}
            {evaluations.length > 0 && (
              <section className="flex flex-col items-center justify-center rounded-2xl border border-primary/20 bg-card p-6 md:p-8 shadow-lg shadow-primary/5">
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-accent mb-4 md:mb-6">Current Standing</p>
                {(() => {
                  const s2 = parseFloat(evaluations[0].second_sem) || 0;
                  const isNA = evaluations[0].first_sem === "N/A";
                  const s1 = isNA ? 0 : (parseFloat(evaluations[0].first_sem) || 0);
                  const finalScore = isNA ? s2 : (s2 * 0.6) + (s1 * 0.4);
                  const passed = finalScore >= 70;
                  return (
                    <div className="flex items-center justify-center gap-6 md:gap-12 w-full">
                      {/* Left Column: Rank + Remarks */}
                      <div className="flex flex-col items-center gap-3 md:gap-4">
                        <div className="flex items-baseline gap-1 md:gap-2">
                          <span className="text-4xl md:text-6xl font-black text-foreground">#{evaluations[0].rank || 1}</span>
                          <span className="text-lg md:text-xl font-bold text-muted-foreground">Rank</span>
                        </div>
                        <span className={`inline-flex rounded-full px-3 py-1 text-[10px] md:text-xs font-bold uppercase tracking-wider ${passed ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
                          {passed ? 'Passed' : 'Failed'}
                        </span>
                      </div>

                      <div className="h-16 md:h-24 w-px bg-border" />

                      {/* Right Column: Final Score */}
                      <div className="flex flex-col items-center">
                        <span className={`text-4xl md:text-6xl font-black ${passed ? 'text-primary' : 'text-destructive'}`}>
                          {finalScore.toFixed(5)}
                        </span>
                        <span className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-wider mt-1">Final Score</span>
                      </div>
                    </div>
                  );
                })()}
              </section>
            )}

            {/* Evaluation Records Section */}
            <section id="records" className="space-y-3 md:space-y-4 scroll-mt-20">
              <h3 className="text-xl md:text-2xl font-bold text-foreground">Evaluation Record</h3>
              {evaluations.length > 0 ? (
                <>
                  {/* Desktop Table View */}
                  <Card className="hidden md:block overflow-hidden border-border bg-card shadow-sm">
                    <table className="min-w-full divide-y divide-border text-xs md:text-sm">
                      <thead className="bg-muted text-left text-[10px] md:text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        <tr>
                          <th className="px-4 md:px-6 py-3 md:py-4 text-center">Evaluators (35 points)</th>
                          <th className="px-4 md:px-6 py-3 md:py-4 text-center">Records (65 points)</th>
                          <th className="px-4 md:px-6 py-3 md:py-4 text-center">2nd Sem (60%)</th>
                          <th className="px-4 md:px-6 py-3 md:py-4 text-center">1st Sem (40%)</th>
                          <th className="px-4 md:px-6 py-3 md:py-4 text-center">Final Score</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border bg-card">
                        {evaluations.map((evaluation) => {
                          const secondSem = parseFloat(evaluation.second_sem) || 0;
                          const isNA = evaluation.first_sem === "N/A";
                          const firstSem = isNA ? 0 : (parseFloat(evaluation.first_sem) || 0);
                          const finalScore = isNA ? secondSem : (secondSem * 0.6) + (firstSem * 0.4);
                          
                          return (
                            <tr key={evaluation.id} className="transition-colors hover:bg-muted/50">
                              <td className="px-4 md:px-6 py-3 md:py-4 text-center text-muted-foreground">{evaluation.evaluator_points ?? 0} points</td>
                              <td className="px-4 md:px-6 py-3 md:py-4 text-center text-muted-foreground">{evaluation.record_points ?? 0} points</td>
                              <td className="px-4 md:px-6 py-3 md:py-4 text-center font-bold text-foreground">{secondSem} points</td>
                              <td className={`px-4 md:px-6 py-3 md:py-4 text-center ${isNA ? "italic text-muted-foreground" : "text-muted-foreground"}`}>{isNA ? "N/A" : `${firstSem} points`}</td>
                              <td className="px-4 md:px-6 py-3 md:py-4 text-center">
                                <span className={`inline-flex rounded-lg px-2.5 py-1 text-xs md:text-sm font-black ${finalScore >= 70 ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
                                  {finalScore.toFixed(5)} points
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </Card>

                  {/* Mobile Stacked Card View */}
                  <div className="md:hidden space-y-4">
                    {evaluations.map((evaluation) => {
                      const secondSem = parseFloat(evaluation.second_sem) || 0;
                      const isNA = evaluation.first_sem === "N/A";
                      const firstSem = isNA ? 0 : (parseFloat(evaluation.first_sem) || 0);
                      const finalScore = isNA ? secondSem : (secondSem * 0.6) + (firstSem * 0.4);
                      
                      return (
                        <Card key={evaluation.id} className="border-border bg-card p-5 shadow-sm space-y-4">
                          <div className="flex items-center justify-between border-b pb-2">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Final Score</span>
                            <span className={`inline-flex rounded-lg px-3 py-1 text-sm font-black ${finalScore >= 70 ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
                              {finalScore.toFixed(5)} points
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                            <div>
                              <p className="text-muted-foreground font-medium">Evaluators (35 points)</p>
                              <p className="font-semibold text-foreground mt-0.5">{evaluation.evaluator_points ?? 0} points</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground font-medium">Records (65 points)</p>
                              <p className="font-semibold text-foreground mt-0.5">{evaluation.record_points ?? 0} points</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground font-medium">2nd Sem (60%)</p>
                              <p className="font-bold text-foreground mt-0.5">{secondSem} points</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground font-medium">1st Sem (40%)</p>
                              <p className={`font-semibold mt-0.5 ${isNA ? "italic text-muted-foreground" : "text-foreground"}`}>{isNA ? "N/A" : `${firstSem} points`}</p>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </>
              ) : (
                <Card className="border-dashed border-border bg-transparent py-10 md:py-12 text-center shadow-none">
                  <p className="text-sm text-muted-foreground">No evaluation records have been posted yet.</p>
                </Card>
              )}
            </section>

            {/* Record Breakdown Section */}
            <section id="breakdown" className="space-y-3 md:space-y-4 scroll-mt-20">
              <h3 className="text-xl md:text-2xl font-bold text-foreground">Record Breakdown</h3>
              <Card className="border-border bg-card shadow-sm overflow-hidden">
                <CardContent className="p-5 md:p-6">
                  <p className="text-xs text-muted-foreground mb-4">
                    This breakdown shows how the evaluation points are categorized. The recorded points are the summarized/averaged data from these components.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Evaluators Breakdown */}
                    <div className="rounded-lg border border-border bg-muted/30 p-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-accent mb-3">Evaluators (35 points)</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Roommates</span>
                          <span className="font-bold text-foreground">10%</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Advisers</span>
                          <span className="font-bold text-foreground">40%</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Evaluators</span>
                          <span className="font-bold text-foreground">50%</span>
                        </div>
                        <div className="mt-2 pt-2 border-t border-border flex items-center justify-between text-xs">
                          <span className="font-bold text-muted-foreground">Total</span>
                          <span className="font-black text-foreground">100%</span>
                        </div>
                      </div>
                    </div>

                    {/* Records Breakdown */}
                    <div className="rounded-lg border border-border bg-muted/30 p-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-accent mb-3">Records (65 points)</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Cleaning Attendance</span>
                          <span className="font-bold text-foreground">20 pts</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Participation Attendance</span>
                          <span className="font-bold text-foreground">15 pts</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Violations</span>
                          <span className="font-bold text-foreground">20 pts</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Interpersonal</span>
                          <span className="font-bold text-foreground">10 pts</span>
                        </div>
                        <div className="mt-2 pt-2 border-t border-border flex items-center justify-between text-xs">
                          <span className="font-bold text-muted-foreground">Total</span>
                          <span className="font-black text-foreground">65 pts</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Occupant's Info Section */}
            <section id="profile" className="space-y-3 md:space-y-4 scroll-mt-20">
              <h3 className="text-xl md:text-2xl font-bold text-foreground">Occupant&apos;s Info</h3>
              <Card className="border-border bg-card shadow-sm overflow-hidden">
                <CardContent className="p-5 md:p-6">
                  <div className="grid gap-6 grid-cols-2">
                    {/* Personal Details */}
                    <div className="space-y-4 col-span-1">
                      <h4 className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-muted-foreground">Personal Details</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] md:text-xs font-medium text-muted-foreground/80 block">Full Name</label>
                          <span className="text-xs md:text-sm font-semibold text-foreground">{profile.full_name}</span>
                        </div>
                        <div>
                          <label className="text-[10px] md:text-xs font-medium text-muted-foreground/80 block">Email Address</label>
                          <span className="text-xs md:text-sm font-semibold text-foreground">{profile.email}</span>
                        </div>
                        <div>
                          <label className="text-[10px] md:text-xs font-medium text-muted-foreground/80 block">Room Number</label>
                          <span className="text-xs md:text-sm font-semibold text-foreground">{profile.room_number ?? "Not Assigned"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Academic Info */}
                    <div className="space-y-4 col-span-1 pl-6 border-l border-border/40 md:border-border">
                      <h4 className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-muted-foreground">Academic Info</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] md:text-xs font-medium text-muted-foreground/80 block">Degree Program</label>
                          <span className="text-xs md:text-sm font-semibold text-foreground">{profile.degree_program}</span>
                        </div>
                        <div>
                          <label className="text-[10px] md:text-xs font-medium text-muted-foreground/80 block">Year Level</label>
                          <span className="text-xs md:text-sm font-semibold text-foreground">Year {profile.year}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

          </div>
        </div>
      ) : (
        /* ── Logged-out Landing Page ── */
        <>
          {/* Hero Section */}
          <section className="relative overflow-hidden flex-1 flex flex-col justify-center py-8">
            {/* Decorative background elements */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/98 to-primary/5" />
              <div 
                className="absolute inset-0"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, hsla(var(--foreground) / 0.08) 1px, transparent 1px),
                    linear-gradient(to bottom, hsla(var(--foreground) / 0.08) 1px, transparent 1px),
                    radial-gradient(circle at 1px 1px, hsla(var(--foreground) / 0.18) 1.5px, transparent 0)
                  `,
                  backgroundSize: '24px 24px'
                }}
              />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />
            </div>

            <div className="mx-auto max-w-5xl px-4 pt-16 pb-20 md:pt-24 md:pb-28 lg:pt-32 lg:pb-36">
              <div className="flex flex-col items-center text-center">
                {/* Logo with glow */}
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl scale-150 pointer-events-none" />
                  <InteractiveLogo
                    width={120}
                    height={120}
                    className="relative h-24 w-24 md:h-28 md:w-28 drop-shadow-lg hover:scale-105 transition-transform duration-300"
                    enableBubble
                  />
                </div>

                {/* Headline */}
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                  MMH Evaluation
                  <span className="block text-primary mt-1">System</span>
                </h2>

                {/* Subtitle */}
                <p className="mt-5 max-w-lg text-base md:text-lg text-muted-foreground leading-relaxed">
                  The official Mahogany Men&apos;s Hall Evaluation System. Please log in to your account to view your evaluation record.
                </p>

                {/* CTA */}
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/login"
                    className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 active:scale-[0.98]"
                  >
                    Log In to Your Account
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-border bg-card">
            <div className="mx-auto max-w-5xl px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Image src="/logo.png" alt="MMH Logo" width={24} height={24} className="h-6 w-6 object-contain opacity-60" />
                <span className="text-xs font-semibold text-muted-foreground">MMH Evaluation System</span>
              </div>
              <p className="text-xs text-muted-foreground">
                &copy; {new Date().getFullYear()} MMH Dormitory. All rights reserved.
              </p>
            </div>
          </footer>
        </>
      )}
    </main>
  );
}
