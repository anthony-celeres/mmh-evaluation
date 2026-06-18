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
        
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const nameA = a.full_name.toLowerCase();
        const nameB = b.full_name.toLowerCase();
        if (sortOrder === "asc") return nameA.localeCompare(nameB);
        return nameB.localeCompare(nameA);
      });
  }, [users, searchTerm, statusFilter, sortOrder, evaluatedIds]);

  const selectedEvaluation = selectedOccupant 
    ? evaluations.find(e => e.occupant_id === selectedOccupant.auth_user_id)
    : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
      <div className="space-y-6">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-slate-900">Occupant Profiles</CardTitle>
                <CardDescription className="text-sm text-slate-500">
                  Manage and evaluate your residents.
                </CardDescription>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search name, email, or room..."
                    className="pl-9 text-xs"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <select 
                  className="h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 outline-none transition-colors hover:bg-slate-50"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                </select>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-9 text-xs"
                  onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
                >
                  <ArrowUpDown className="mr-2 h-3 w-3" />
                  Name {sortOrder === "asc" ? "(A-Z)" : "(Z-A)"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Full name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Room</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {filteredAndSortedOccupants.length > 0 ? (
                    filteredAndSortedOccupants.map((user) => (
                      <tr 
                        key={user.auth_user_id} 
                        onClick={() => setSelectedOccupant(user)}
                        className={`transition-colors cursor-pointer hover:bg-slate-50/80 ${selectedOccupant?.auth_user_id === user.auth_user_id ? 'bg-blue-50/50' : ''}`}
                      >
                        <td className="px-4 py-3 font-medium text-slate-900">{user.full_name}</td>
                        <td className="px-4 py-3 text-slate-600">{user.email}</td>
                        <td className="px-4 py-3 text-slate-600">{user.room_number ?? 'N/A'}</td>
                        <td className="px-4 py-3">
                          {evaluatedIds.has(user.auth_user_id) ? (
                            <span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold uppercase text-green-700">
                              Completed
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-700">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
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
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
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
        <Card className="border-slate-200 bg-white shadow-sm sticky top-6">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-900">
              {selectedOccupant ? `Evaluate ${selectedOccupant.full_name.split(' ')[0]}` : 'Select an occupant'}
            </CardTitle>
            <CardDescription className="text-sm text-slate-500">
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
              <div className="flex h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/30 text-center">
                <p className="text-sm font-medium text-slate-400">No occupant selected</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
