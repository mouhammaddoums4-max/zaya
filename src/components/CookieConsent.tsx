"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie } from "lucide-react";

const KEY = "zaya-cookie-consent";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) {
        const t = setTimeout(() => setShow(true), 800);
        return () => clearTimeout(t);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const decide = (value: "accepted" | "refused") => {
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* ignore */
    }
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="fixed inset-x-3 bottom-20 z-[110] mx-auto max-w-2xl rounded-2xl bg-ink p-4 text-white shadow-2xl ring-1 ring-white/10 md:bottom-4 md:p-5"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zaya/20 text-zaya-400">
                <Cookie className="h-5 w-5" />
              </span>
              <p className="text-sm text-white/80">
                Nous utilisons des cookies pour améliorer votre expérience sur ZAYA.
                En continuant, vous acceptez notre{" "}
                <Link href="/confidentialite" className="font-semibold text-zaya-400 underline">
                  politique de confidentialité
                </Link>
                .
              </p>
            </div>
            <div className="flex shrink-0 gap-2 sm:ml-auto">
              <button
                onClick={() => decide("refused")}
                className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10"
              >
                Refuser
              </button>
              <button
                onClick={() => decide("accepted")}
                className="rounded-lg bg-zaya px-4 py-2 text-sm font-semibold text-white transition hover:bg-zaya-600"
              >
                Accepter
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
