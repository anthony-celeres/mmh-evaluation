"use client";

import { useState, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { deleteOccupant } from "@/lib/occupant-actions";
import { Search, ArrowUpDown, X, AlertTriangle } from "lucide-react";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "pending">("all");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "room">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedOccupantInfo, setSelectedOccupantInfo] = useState<Occupant | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const deleteFormRef = useRef<HTMLFormElement>(null);
  
  const evaluatedIds = useMemo(() => {
    const completedIds = new Set<string>();
    for (const e of evaluations) {
      // N/A first_sem means occupant was only available in 2nd sem, which counts as complete
      if ((e.first_sem || e.first_sem === "N/A") && e.second_sem) {
        completedIds.add(e.occupant_id);
      }
    }
    return completedIds;
  }, [evaluations]);

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
        if (sortBy === "room") {
          const roomA = a.room_number || "";
          const roomB = b.room_number || "";
          if (roomA === "" && roomB !== "") return 1;
          if (roomB === "" && roomA !== "") return -1;
          const comparison = roomA.localeCompare(roomB, undefined, { numeric: true, sensitivity: 'base' });
          return sortOrder === "asc" ? comparison : -comparison;
        } else {
          const nameA = a.full_name.toLowerCase();
          const nameB = b.full_name.toLowerCase();
          const comparison = nameA.localeCompare(nameB);
          return sortOrder === "asc" ? comparison : -comparison;
        }
      });
  }, [users, searchTerm, statusFilter, yearFilter, levelFilter, sortBy, sortOrder, evaluatedIds]);

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-2">
            <CardTitle className="text-xl font-extrabold tracking-tight text-foreground">Occupant Profiles</CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Manage profiles, view standings, and submit resident evaluations.
            </CardDescription>
          </div>

          {/* Search and Filters row */}
          <div className="flex flex-col gap-4 pt-3 border-t border-border/60 lg:flex-row lg:items-end lg:justify-between">
            {/* Search Bar */}
            <div className="flex flex-col gap-1 w-full lg:max-w-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Search</span>
              <div className="relative w-full">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search name, email, or room..."
                  className="pl-9 text-xs h-9 bg-muted/20 border-border w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Filter controls row */}
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

              {/* Sorting Filter */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Sort By</span>
                <select 
                  className="h-9 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground outline-none transition-colors hover:bg-muted cursor-pointer"
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [newSortBy, newSortOrder] = e.target.value.split("-");
                    setSortBy(newSortBy as "name" | "room");
                    setSortOrder(newSortOrder as "asc" | "desc");
                  }}
                >
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="room-asc">Room (Low to High)</option>
                  <option value="room-desc">Room (High to Low)</option>
                </select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead className="bg-muted text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Degree Program</th>
                  <th className="px-4 py-3">Year</th>
                  <th className="px-4 py-3">Room</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {filteredAndSortedOccupants.length > 0 ? (
                  filteredAndSortedOccupants.map((user) => (
                    <tr 
                      key={user.auth_user_id} 
                      onClick={() => setSelectedOccupantInfo(user)}
                      className="transition-colors cursor-pointer hover:bg-muted/50"
                    >
                      <td className="px-4 py-3 font-medium text-foreground">{user.full_name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                      <td className="px-4 py-3 text-muted-foreground">{user.degree_program ?? 'N/A'}</td>
                      <td className="px-4 py-3 text-muted-foreground">{user.year ?? 'N/A'}</td>
                      <td className="px-4 py-3 text-muted-foreground">{user.room_number ?? 'N/A'}</td>
                      <td className="px-4 py-3">
                        {evaluatedIds.has(user.auth_user_id) ? (
                          <span className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
                            Completed
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold uppercase text-accent">
                            Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      No occupants found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Occupant Info Modal */}
      {selectedOccupantInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setSelectedOccupantInfo(null)} />
          
          <Card className="relative w-full max-w-md border-border bg-card shadow-2xl animate-in zoom-in-95 duration-200 z-10 overflow-hidden">
            <button 
              onClick={() => setSelectedOccupantInfo(null)}
              className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none text-muted-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground">
                Occupant Profile Info
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Profile details and admin operations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 rounded-lg border border-border bg-muted/30 p-4 text-xs">
                <div className="grid gap-1">
                  <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Full Name</Label>
                  <p className="text-sm font-semibold text-foreground">{selectedOccupantInfo.full_name}</p>
                </div>
                <div className="grid gap-1">
                  <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Email Address</Label>
                  <p className="text-sm text-foreground">{selectedOccupantInfo.email}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-1">
                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Degree Program</Label>
                    <p className="text-sm text-foreground">{selectedOccupantInfo.degree_program ?? 'N/A'}</p>
                  </div>
                  <div className="grid gap-1">
                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Year Level</Label>
                    <p className="text-sm text-foreground">{selectedOccupantInfo.year ?? 'N/A'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-1">
                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Room Number</Label>
                    <p className="text-sm text-foreground">{selectedOccupantInfo.room_number ?? 'N/A'}</p>
                  </div>
                  <div className="grid gap-1">
                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Evaluation Status</Label>
                    <div>
                      {evaluatedIds.has(selectedOccupantInfo.auth_user_id) ? (
                        <span className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
                          Completed
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold uppercase text-accent">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/admin/occupants/${selectedOccupantInfo.auth_user_id}/edit`}
                  className="flex-1 inline-flex h-9 items-center justify-center rounded-md border border-border bg-card text-xs font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  Edit Profile
                </Link>
                <form 
                  ref={deleteFormRef}
                  action={deleteOccupant}
                  onSubmit={() => {
                    setSelectedOccupantInfo(null);
                  }}
                  className="flex-1"
                >
                  <input type="hidden" name="auth_user_id" value={selectedOccupantInfo.auth_user_id} />
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full h-9 rounded-md text-xs font-semibold"
                  >
                    Delete Account
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedOccupantInfo && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setShowDeleteConfirm(false)} />
          
          <Card className="relative w-full max-w-sm border-destructive/20 bg-card shadow-2xl animate-in zoom-in-95 duration-200 z-10 overflow-hidden">
            <button 
              onClick={() => setShowDeleteConfirm(false)}
              className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none text-muted-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
            <CardHeader className="space-y-3 pb-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="text-center">
                <CardTitle className="text-lg font-bold text-foreground">
                  Delete Account
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground mt-2">
                  Are you sure you want to delete <span className="font-semibold text-foreground">{selectedOccupantInfo.full_name}</span>&apos;s account? This action cannot be undone.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex gap-2 pb-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 h-9 text-xs font-semibold border-border"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  deleteFormRef.current?.requestSubmit();
                  setShowDeleteConfirm(false);
                }}
                className="flex-1 h-9 text-xs font-semibold"
              >
                Delete
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
