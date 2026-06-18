import Link from "next/link";

import { Button } from "@/components/ui/button";
import { signout } from "@/lib/auth-actions";
import type { AdminUserRow } from "@/lib/admin";

type AdminSidebarProps = {
  admin: AdminUserRow;
};

export default function AdminSidebar({ admin }: AdminSidebarProps) {
  return (
    <aside className="flex flex-col border-b border-slate-200 bg-white px-6 py-6 lg:min-h-screen lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between lg:block lg:space-y-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
            Admin panel
          </p>
          <h2 className="text-xl font-bold text-slate-900 lg:text-2xl">MMH Evaluation</h2>
          <p className="hidden text-sm text-slate-500 lg:block">
            Signed in as <span className="font-medium text-slate-700">{admin.full_name}</span>
          </p>
        </div>
        
        <div className="lg:hidden">
          <form action={signout}>
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              Logout
            </Button>
          </form>
        </div>
      </div>

      <nav className="mt-6 flex flex-row gap-2 text-sm lg:mt-8 lg:flex-col">
        <Link
          href="/admin"
          className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-center font-medium text-slate-700 transition-colors hover:bg-slate-50 lg:flex-none lg:text-left"
        >
          Dashboard
        </Link>
        <Link
          href="/admin/occupants"
          className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-center font-medium text-slate-700 transition-colors hover:bg-slate-50 lg:flex-none lg:text-left"
        >
          Occupants
        </Link>
      </nav>

      <div className="mt-auto hidden pt-8 lg:block">
        <form action={signout}>
          <Button
            type="submit"
            variant="outline"
            className="w-full border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          >
            Logout
          </Button>
        </form>
      </div>
    </aside>
  );
}