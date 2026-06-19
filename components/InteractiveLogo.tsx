"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface InteractiveLogoProps {
  width?: number;
  height?: number;
  className?: string;
  onClick?: () => void;
  enableBubble?: boolean;
}

export default function InteractiveLogo({
  width = 40,
  height = 40,
  className,
  onClick,
  enableBubble = false,
}: InteractiveLogoProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleKey, setBubbleKey] = useState(0);

  const handleClick = (e: React.MouseEvent) => {
    setIsAnimating(false);
    setShowBubble(false);

    // Short timeout to force DOM reflow and restart CSS animations
    setTimeout(() => {
      setIsAnimating(true);
      if (enableBubble) {
        setShowBubble(true);
        setBubbleKey((prev) => prev + 1);
      }
    }, 15);

    if (onClick) {
      onClick();
    }
  };

  const handleLogoAnimationEnd = () => {
    setIsAnimating(false);
  };

  useEffect(() => {
    if (showBubble) {
      const timer = setTimeout(() => {
        setShowBubble(false);
      }, 1800); // 1.8s matches the bubble-pop animation duration
      return () => clearTimeout(timer);
    }
  }, [showBubble, bubbleKey]);

  return (
    <div className="relative inline-block overflow-visible">
      {/* Speech Bubble */}
      {showBubble && (
        <div
          key={bubbleKey}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 pointer-events-none"
        >
          <div className="animate-bubble-pop relative bg-primary text-primary-foreground px-3.5 py-2 rounded-xl text-[10px] md:text-xs font-black shadow-2xl whitespace-nowrap border border-primary/15 tracking-wide">
            Should I Stay or Should I Go?
            {/* Triangular arrow pointing down */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-primary" />
          </div>
        </div>
      )}

      {/* Logo Image Wrapper */}
      <div
        onClick={handleClick}
        onAnimationEnd={handleLogoAnimationEnd}
        className={cn(
          "cursor-pointer select-none transition-transform active:scale-95 duration-100",
          isAnimating && "animate-logo-pop",
          className
        )}
      >
        <Image
          src="/logo.png"
          alt="MMH Logo"
          width={width}
          height={height}
          className="object-contain w-full h-full"
          priority
        />
      </div>
    </div>
  );
}
