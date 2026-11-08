"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Download, X } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function PwaProvider() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      if (process.env.NODE_ENV === "production") {
        navigator.serviceWorker.register("/sw.js").catch(() => {});
      } else {
        navigator.serviceWorker
          .getRegistrations()
          .then((registrations) =>
            Promise.all(registrations.map((registration) => registration.unregister())),
          )
          .catch(() => {});
      }
    }

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      try {
        if (!localStorage.getItem("zaya-pwa-dismissed")) setShow(true);
      } catch {
        setShow(true);
      }
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    setShow(false);
  };

  const dismiss = () => {
    setShow(false);
    try {
      localStorage.setItem("zaya-pwa-dismissed", "1");
    } catch {
      /* ignore */
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-x-3 bottom-24 z-[115] mx-auto max-w-md rounded-2xl bg-ink p-4 text-white shadow-2xl ring-1 ring-white/10 md:bottom-4">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white">
          <Image src="/icons/icon-192.png" alt="ZAYA" width={44} height={44} className="h-9 w-9" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Installer l'application ZAYA</p>
          <p className="text-xs text-white/60">Accès rapide, comme une vraie app.</p>
        </div>
        <button onClick={install} className="flex shrink-0 items-center gap-1.5 rounded-lg bg-zaya px-3 py-2 text-sm font-semibold">
          <Download className="h-4 w-4" /> Installer
        </button>
        <button onClick={dismiss} aria-label="Fermer" className="shrink-0 text-white/50 hover:text-white">
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
