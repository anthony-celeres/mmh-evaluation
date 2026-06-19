"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { signout } from "@/lib/auth-actions";
import { Menu, X, Sun, Moon, Monitor, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import InteractiveLogo from "./InteractiveLogo";

type OccupantNavbarProps = {
  profile: any;
};

export default function OccupantNavbar({ profile }: OccupantNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
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

  const handleScrollTo = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    }
  };

  const isDarkActive = isMounted && (
    currentTheme === "dark" || 
    (currentTheme === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 px-6 py-4 shadow-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between relative">
        {/* Brand Header */}
        <Link 
          href="/" 
          className="flex items-center gap-3 group select-none"
        >
          <InteractiveLogo 
            width={40} 
            height={40} 
            className="h-10 w-10 transition-transform duration-300 group-hover:scale-105" 
          />
          <h1 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
            MMH System
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {/* Theme Selector (Desktop) */}
          <div className="flex rounded-md border border-border p-0.5 bg-muted/40 items-center">
            <button
              onClick={() => handleThemeChange("light")}
              title="Light Mode"
              className={cn(
                "p-1.5 rounded-sm transition-all",
                currentTheme === "light"
                  ? "bg-primary text-primary-foreground shadow-sm scale-105"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Sun size={15} />
            </button>
            <button
              onClick={() => handleThemeChange("dark")}
              title="Dark Mode"
              className={cn(
                "p-1.5 rounded-sm transition-all",
                currentTheme === "dark"
                  ? "bg-primary text-primary-foreground shadow-sm scale-105"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Moon size={15} />
            </button>
            <button
              onClick={() => handleThemeChange("system")}
              title="System Theme"
              className={cn(
                "p-1.5 rounded-sm transition-all",
                currentTheme === "system"
                  ? "bg-primary text-primary-foreground shadow-sm scale-105"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Monitor size={15} />
            </button>
          </div>

          {/* Login/Logout Button */}
          {profile ? (
            <form action={signout}>
              <Button
                type="submit"
                variant="outline"
                size="sm"
                className="border-border text-muted-foreground hover:bg-muted font-semibold gap-2 transition-all hover:text-foreground"
              >
                <LogOut size={14} />
                Log out
              </Button>
            </form>
          ) : (
            <Link
              href="/login"
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-sm active:scale-98"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Actions */}
        <div className="flex md:hidden items-center gap-2">
          {profile ? (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md border border-border bg-card text-foreground hover:bg-muted transition-colors active:scale-95"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          ) : (
            <button
              onClick={() => {
                handleThemeChange(isDarkActive ? "light" : "dark");
              }}
              className="inline-flex items-center justify-center p-2 rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-all active:scale-95 shadow-sm text-muted-foreground hover:text-foreground"
              title="Toggle Theme"
              aria-label="Toggle Theme"
            >
              {isDarkActive ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}
        </div>

        {/* Mobile Dropdown Modal */}
        {profile && isOpen && (
          <>
            {/* Transparent closing overlay */}
            <div 
              className="fixed inset-0 z-40 bg-transparent" 
              onClick={() => setIsOpen(false)} 
            />
            
            {/* Dropdown Card */}
            <div className="absolute right-0 top-14 w-60 border border-border bg-card p-4 rounded-xl shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 flex flex-col gap-4">
              {/* Theme Settings Section */}
              <div className="space-y-2">
                <p className="text-[9px] font-bold uppercase tracking-wider text-accent">Theme Preference</p>
                <div className="grid grid-cols-3 gap-0.5 rounded-lg border border-border p-0.5 bg-muted/40">
                  <button
                    onClick={() => handleThemeChange("light")}
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

              {/* Divider */}
              <div className="h-px bg-border w-full" />

              {/* Logout Button */}
              <form action={signout} className="w-full">
                <Button
                  type="submit"
                  variant="destructive"
                  size="sm"
                  className="w-full py-4 justify-center gap-2 font-bold shadow-sm active:scale-98"
                >
                  <LogOut size={14} />
                  Logout
                </Button>
              </form>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
