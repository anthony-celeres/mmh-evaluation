import type { ReactNode } from "react";

import AdminSidebar from "@/components/admin/AdminSidebar";
import { requireAdminUser } from "@/lib/admin";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const admin = await requireAdminUser();

  return (
    <div className="min-h-screen bg-background text-foreground lg:grid lg:grid-cols-[280px_1fr]">
      <AdminSidebar admin={admin} />
      <main className="min-w-0 p-4 md:p-6 lg:p-10">{children}</main>
    </div>
  );
}