"use client";

import { useState } from "react";
import { EvaluationForm } from "./EvaluationForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { deleteOccupant } from "@/lib/occupant-actions";

type Occupant = {
  auth_user_id: string;
  full_name: string;
  email: string;
  role: string;
  room_number?: string | null;
  degree_program?: string;
  year?: number;
};

type OccupantTableProps = {
  users: Occupant[];
  evaluatedIds: Set<string>;
};

export function OccupantTableWithEvaluation({ users, evaluatedIds }: OccupantTableProps) {
  const [selectedOccupant, setSelectedOccupant] = useState<Occupant | null>(null);
  
  const filteredOccupants = users.filter(user => user.role !== 'admin');

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
      <div className="space-y-6">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-900">Occupant Profiles</CardTitle>
            <CardDescription className="text-sm text-slate-500">
              Click on an occupant to input or update their evaluation record.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Full name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {filteredOccupants.map((user) => (
                    <tr 
                      key={user.auth_user_id} 
                      onClick={() => setSelectedOccupant(user)}
                      className={`transition-colors cursor-pointer hover:bg-slate-50/80 ${selectedOccupant?.auth_user_id === user.auth_user_id ? 'bg-blue-50/50' : ''}`}
                    >
                      <td className="px-4 py-3 font-medium text-slate-900">{user.full_name}</td>
                      <td className="px-4 py-3 text-slate-600">{user.email}</td>
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
                  ))}
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
              <EvaluationForm occupantId={selectedOccupant.auth_user_id} occupantName={selectedOccupant.full_name} />
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
