"use client";

import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";
import { toast } from "./Toaster";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

export default function PushOptIn() {
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!key) return;
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
    if (Notification.permission !== "default") return;
    let dismissed = false;
    try {
      dismissed = localStorage.getItem("zaya-push-dismissed") === "1";
    } catch {
      /* ignore */
    }
    if (dismissed) return;
    const t = setTimeout(() => setShow(true), 6000);
    return () => clearTimeout(t);
  }, []);

  const enable = async () => {
    const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!key) return;
    setBusy(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setShow(false);
        return;
      }
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(key),
      });
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: sub }),
      });
      toast("Notifications activées 🔔");
      setShow(false);
    } catch {
      toast("Impossible d'activer les notifications", "error");
    } finally {
      setBusy(false);
    }
  };

  const dismiss = () => {
    setShow(false);
    try {
      localStorage.setItem("zaya-push-dismissed", "1");
    } catch {
      /* ignore */
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-x-3 top-3 z-[115] mx-auto max-w-md rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-black/10 md:left-auto md:right-4 md:top-4">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zaya-50 text-zaya">
          <Bell className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink">Restez informé des promos</p>
          <p className="text-xs text-ink-muted">Recevez nos offres et nouveautés.</p>
        </div>
        <button onClick={enable} disabled={busy} className="shrink-0 rounded-lg bg-zaya px-3 py-2 text-sm font-semibold text-white">
          Activer
        </button>
        <button onClick={dismiss} aria-label="Fermer" className="shrink-0 text-ink-muted hover:text-ink">
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
