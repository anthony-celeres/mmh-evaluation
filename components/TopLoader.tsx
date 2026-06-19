"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function TopLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Reset on route change complete
    setLoading(false);
    setProgress(100);

    const timeout = setTimeout(() => setProgress(0), 300);
    return () => clearTimeout(timeout);
  }, [pathname, searchParams]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const handleStart = () => {
      setLoading(true);
      setProgress(20);

      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 300);
    };

    // Listen for click events on links/forms to detect navigation start
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      const isFormSubmit = target.closest("form") && (target as HTMLButtonElement).type === "submit";

      if (anchor && anchor.href && !anchor.href.startsWith("#") && !anchor.target) {
        const url = new URL(anchor.href, window.location.origin);
        if (url.origin === window.location.origin && url.pathname !== pathname) {
          handleStart();
        }
      }

      if (isFormSubmit) {
        handleStart();
      }
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
      clearInterval(interval);
    };
  }, [pathname]);

  if (!loading && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px]">
      <div
        className="h-full bg-primary shadow-[0_0_10px_hsl(var(--primary)),0_0_5px_hsl(var(--primary))]"
        style={{
          width: `${progress}%`,
          transition: progress === 0
            ? "none"
            : progress === 100
              ? "width 200ms ease-out, opacity 200ms ease-out 200ms"
              : "width 300ms ease-in-out",
          opacity: progress === 100 ? 0 : 1,
        }}
      />
    </div>
  );
}
