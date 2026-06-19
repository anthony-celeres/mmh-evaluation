"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, LogOut } from "lucide-react";

const LogoutPage = () => {
  const router = useRouter();
  const [stage, setStage] = useState<"leaving" | "redirecting">("leaving");

  useEffect(() => {
    const stageTimeout = setTimeout(() => setStage("redirecting"), 1200);
    const redirectTimeout = setTimeout(() => router.push("/login"), 2500);

    return () => {
      clearTimeout(stageTimeout);
      clearTimeout(redirectTimeout);
    };
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center gap-6 text-center animate-fade-in">
        <div className="relative">
          <Image
            src="/logo.png"
            alt="MMH Logo"
            width={80}
            height={80}
            className="h-20 w-20 object-contain opacity-60"
          />
          <div className="absolute -bottom-1 -right-1 rounded-full bg-card p-1.5 shadow-md border border-border">
            <LogOut className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">
            {stage === "leaving" ? "Signing you out..." : "Redirecting..."}
          </h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            {stage === "leaving"
              ? "Please wait while we securely log you out."
              : "You'll be redirected to the login page shortly."}
          </p>
        </div>

        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    </div>
  );
};

export default LogoutPage;