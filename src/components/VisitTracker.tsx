"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function VisitTracker() {
  const pathname = usePathname();
  const last = useRef<string>("");

  useEffect(() => {
    if (!pathname || pathname === last.current) return;
    if (pathname.startsWith("/admin") || pathname.startsWith("/livreur")) return;
    last.current = pathname;
    try {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: pathname }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      /* ignore */
    }
  }, [pathname]);

  return null;
}
