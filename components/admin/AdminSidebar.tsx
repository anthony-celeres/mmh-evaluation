"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signout } from "@/lib/auth-actions";
import type { AdminUserRow } from "@/lib/admin";
import InteractiveLogo from "@/components/InteractiveLogo";
import { Sun, Moon, Monitor, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

type AdminSidebarProps = {
  admin: AdminUserRow;
};

export default function AdminSidebar({ admin }: AdminSidebarProps) {
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark" | "system">("system");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      setCurrentTheme(stored);
    } else {
      setCurrentTheme("system");
    }
  }, []);

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setCurrentTheme(newTheme);
    if (newTheme === "system") {
      localStorage.removeItem("theme");
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", isDark);
    } else {
      localStorage.setItem("theme", newTheme);
      document.documentElement.classList.toggle("dark", newTheme === "dark");
    }
  };

  const isDarkActive = isMounted && (
    currentTheme === "dark" || 
    (currentTheme === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  return (
    <aside className="flex flex-col border-b border-border bg-card px-6 py-6 lg:h-screen lg:sticky lg:top-0 lg:border-b-0 lg:border-r lg:overflow-y-hidden">
      <div className="flex items-center justify-between lg:block lg:space-y-4">
        {/* Brand/Header */}
        <div className="flex items-center gap-3">
          <InteractiveLogo width={40} height={40} className="h-10 w-10 hover:scale-105 transition-transform duration-300" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
              Admin panel
            </p>
            <h2 className="text-lg font-bold text-foreground lg:text-xl leading-none mt-0.5">MMH System</h2>
            <p className="hidden text-xs text-muted-foreground lg:block mt-1">
              Signed in as <span className="font-semibold text-foreground">{admin.full_name}</span>
            </p>
          </div>
        </div>
        
        {/* Mobile Header Actions */}
        <div className="lg:hidden flex items-center gap-2">
          {/* Mobile Theme Toggle */}
          <button
            onClick={() => handleThemeChange(isDarkActive ? "light" : "dark")}
            className="inline-flex items-center justify-center p-2 rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-all active:scale-95 shadow-sm text-muted-foreground hover:text-foreground h-9 w-9"
            title="Toggle Theme"
            aria-label="Toggle Theme"
          >
            {isDarkActive ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Mobile Logout */}
          <form action={signout}>
            <Button
              type="submit"
              variant="destructive"
              size="sm"
              className="gap-2 font-bold shadow-sm h-9"
            >
              <LogOut size={13} />
              Logout
            </Button>
          </form>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="mt-6 flex flex-row gap-2 text-sm lg:mt-8 lg:flex-col">
        <Link
          href="/admin"
          className="flex-1 rounded-lg border border-border px-4 py-2.5 text-center font-bold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:flex-none lg:text-left"
        >
          Dashboard
        </Link>
        <Link
          href="/admin/occupants"
          className="flex-1 rounded-lg border border-border px-4 py-2.5 text-center font-bold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:flex-none lg:text-left"
        >
          Occupants
        </Link>
        <Link
          href="/admin/records"
          className="flex-1 rounded-lg border border-border px-4 py-2.5 text-center font-bold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:flex-none lg:text-left"
        >
          Records
        </Link>
      </nav>

      {/* Desktop Theme Settings Selector */}
      <div className="hidden lg:block mt-6 pt-6 border-t border-border/60">
        <p className="text-[9px] font-bold uppercase tracking-wider text-accent mb-2">Theme Preference</p>
        <div className="grid grid-cols-3 gap-0.5 rounded-lg border border-border p-0.5 bg-muted/40">
          <button
            onClick={() => handleThemeChange("light")}
            title="Light Mode"
            className={cn(
              "py-1.5 rounded-md text-[10px] font-bold flex flex-col items-center justify-center gap-1 transition-all",
              currentTheme === "light"
                ? "bg-primary text-primary-foreground shadow-sm scale-102"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
            )}
          >
            <Sun size={12} />
            <span>Light</span>
          </button>
          <button
            onClick={() => handleThemeChange("dark")}
            title="Dark Mode"
            className={cn(
              "py-1.5 rounded-md text-[10px] font-bold flex flex-col items-center justify-center gap-1 transition-all",
              currentTheme === "dark"
                ? "bg-primary text-primary-foreground shadow-sm scale-102"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
            )}
          >
            <Moon size={12} />
            <span>Dark</span>
          </button>
          <button
            onClick={() => handleThemeChange("system")}
            title="System Theme"
            className={cn(
              "py-1.5 rounded-md text-[10px] font-bold flex flex-col items-center justify-center gap-1 transition-all",
              currentTheme === "system"
                ? "bg-primary text-primary-foreground shadow-sm scale-102"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
            )}
          >
            <Monitor size={12} />
            <span>System</span>
          </button>
        </div>
      </div>

      {/* Desktop Footer Actions */}
      <div className="mt-auto hidden pt-8 lg:block">
        {/* Desktop Logout Button */}
        <form action={signout}>
          <Button
            type="submit"
            variant="destructive"
            className="w-full gap-2 font-bold shadow-sm py-5 hover:bg-destructive/90 active:scale-98 transition-all"
          >
            <LogOut size={14} />
            Logout
          </Button>
        </form>
      </div>
    </aside>
  );
}