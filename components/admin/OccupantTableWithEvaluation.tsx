"use client";

import { useState, useMemo } from "react";
import { EvaluationForm } from "./EvaluationForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { deleteOccupant } from "@/lib/occupant-actions";
import { Search, Filter, ArrowUpDown, ChevronDown } from "lucide-react";

type Occupant = {
  auth_user_id: string;
  full_name: string;
  email: string;
  role: string;
  room_number?: string | null;
  degree_program?: string;
  year?: number;
};

type Evaluation = {
  id: string;
  occupant_id: string;
  evaluator_points: number;
  record_points: number;
  first_sem: string;
  second_sem: string;
  created_at: string;
};

type OccupantTableProps = {
  users: Occupant[];
  evaluations: Evaluation[];
};

export function OccupantTableWithEvaluation({ users, evaluations }: OccupantTableProps) {
  const [selectedOccupant, setSelectedOccupant] = useState<Occupant | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "pending">("all");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  
  const evaluatedIds = useMemo(() => new Set(evaluations.map(e => e.occupant_id)), [evaluations]);

  const filteredAndSortedOccupants = useMemo(() => {
    return users
      .filter(user => user.role !== 'admin')
      .filter(user => {
        const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             (user.room_number?.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const isCompleted = evaluatedIds.has(user.auth_user_id);
        const matchesStatus = statusFilter === "all" || 
                             (statusFilter === "completed" && isCompleted) || 
                             (statusFilter === "pending" && !isCompleted);
        
        const matchesYear = yearFilter === "all" || String(user.year) === yearFilter;

        const room = user.room_number?.trim() || "";
        let level = "unassigned";
        if (room.startsWith("0")) {
          level = "ground";
        } else if (room.startsWith("1")) {
          level = "first";
        } else if (room.startsWith("2")) {
          level = "second";
        } else if (room.startsWith("3")) {
          level = "third";
        }
        const matchesLevel = levelFilter === "all" || level === levelFilter;
        
        return matchesSearch && matchesStatus && matchesYear && matchesLevel;
      })
      .sort((a, b) => {
        const nameA = a.full_name.toLowerCase();
        const nameB = b.full_name.toLowerCase();
        if (sortOrder === "asc") return nameA.localeCompare(nameB);
        return nameB.localeCompare(nameA);
      });
  }, [users, searchTerm, statusFilter, yearFilter, levelFilter, sortOrder, evaluatedIds]);

  const selectedEvaluation = selectedOccupant 
    ? evaluations.find(e => e.occupant_id === selectedOccupant.auth_user_id)
    : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
      <div className="space-y-6">
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-xl font-extrabold tracking-tight text-foreground">Occupant Profiles</CardTitle>
                <CardDescription className="text-xs text-muted-foreground mt-0.5">
                  Manage profiles, view standings, and submit resident evaluations.
                </CardDescription>
              </div>
              
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search name, email, or room..."
                  className="pl-9 text-xs h-9 bg-muted/20 border-border"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Filter controls row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/60">
              <div className="flex flex-wrap items-center gap-2">
                {/* Status Filter */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Status</span>
                  <select 
                    className="h-9 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground outline-none transition-colors hover:bg-muted cursor-pointer"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>

                {/* Year Level Filter */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Year Level</span>
                  <select 
                    className="h-9 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground outline-none transition-colors hover:bg-muted cursor-pointer"
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                  >
                    <option value="all">All Years</option>
                    <option value="1">Year 1</option>
                    <option value="2">Year 2</option>
                    <option value="3">Year 3</option>
                    <option value="4">Year 4</option>
                  </select>
                </div>

                {/* Dorm Level Filter */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Dorm Level</span>
                  <select 
                    className="h-9 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground outline-none transition-colors hover:bg-muted cursor-pointer"
                    value={levelFilter}
                    onChange={(e) => setLevelFilter(e.target.value)}
                  >
                    <option value="all">All Levels</option>
                    <option value="ground">Ground Level</option>
                    <option value="first">1st Level</option>
                    <option value="second">2nd Level</option>
                    <option value="third">3rd Level</option>
                  </select>
                </div>
              </div>

              {/* Sorting Button */}
              <div className="flex items-end h-full pt-4 sm:pt-0">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-9 text-xs font-bold border-border"
                  onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
                >
                  <ArrowUpDown className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                  Sort A-Z: {sortOrder === "asc" ? "A-Z" : "Z-A"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="min-w-full divide-y divide-border text-sm">
                <thead className="bg-muted text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Full name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Room</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {filteredAndSortedOccupants.length > 0 ? (
                    filteredAndSortedOccupants.map((user) => (
                      <tr 
                        key={user.auth_user_id} 
                        onClick={() => setSelectedOccupant(user)}
                        className={`transition-colors cursor-pointer hover:bg-muted/50 ${selectedOccupant?.auth_user_id === user.auth_user_id ? 'bg-primary/10 hover:bg-primary/20' : ''}`}
                      >
                        <td className="px-4 py-3 font-medium text-foreground">{user.full_name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                        <td className="px-4 py-3 text-muted-foreground">{user.room_number ?? 'N/A'}</td>
                        <td className="px-4 py-3">
                          {evaluatedIds.has(user.auth_user_id) ? (
                            <span className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
                              Completed
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold uppercase text-accent-foreground">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex justify-end gap-2">
                            <Link
                                href={`/admin/occupants/${user.auth_user_id}/edit`}
                                className="inline-flex h-8 items-center justify-center rounded-md border border-border bg-card px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted"
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
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                        No occupants found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="border-border bg-card shadow-sm sticky top-6">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-foreground">
              {selectedOccupant ? `Evaluate ${selectedOccupant.full_name.split(' ')[0]}` : 'Select an occupant'}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {selectedOccupant ? 'Input the points for this resident.' : 'Click an occupant from the table to begin evaluation.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedOccupant ? (
              <EvaluationForm 
                key={selectedOccupant.auth_user_id}
                occupantId={selectedOccupant.auth_user_id} 
                occupantName={selectedOccupant.full_name} 
                existingEvaluation={selectedEvaluation}
              />
            ) : (
              <div className="flex h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/10 text-center">
                <p className="text-sm font-medium text-muted-foreground">No occupant selected</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
