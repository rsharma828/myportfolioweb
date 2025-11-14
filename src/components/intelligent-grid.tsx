"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface IntelligentGridProps {
  children: React.ReactNode[];
  className?: string;
}

export function IntelligentGrid({ children, className }: IntelligentGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={gridRef}
      className={cn(
        "grid gap-6 max-w-[1500px] mx-auto px-6",
        "grid-cols-1",
        "sm:grid-cols-2",
        "lg:grid-cols-3",
        "xl:grid-cols-4",
        className
      )}
      style={{
        gridAutoRows: 'minmax(200px, auto)',
      }}
    >
      {children}
    </div>
  );
}
