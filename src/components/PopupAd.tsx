"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import SmartImage from "./SmartImage";

export default function PopupAd({
  enabled,
  image,
  link,
  title,
}: {
  enabled: boolean;
  image: string | null;
  link: string | null;
  title: string | null;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!enabled || !image) return;
    // Clé liée à l'image : si l'admin change l'image, le popup réapparaît
    const key = `zaya-popup-${btoa(unescape(encodeURIComponent(image))).slice(0, 20)}`;
    let seen = false;
    try {
      seen = sessionStorage.getItem(key) === "1";
    } catch {
      /* ignore */
    }
    if (!seen) {
      const t = setTimeout(() => {
        setOpen(true);
        try {
          sessionStorage.setItem(key, "1");
        } catch {
          /* ignore */
        }
      }, 1200);
      return () => clearTimeout(t);
    }
  }, [enabled, image]);

  if (!enabled || !image) return null;

  const Inner = (
    <div className="relative">
      <div className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[3/4]">
        <SmartImage
          src={image}
          alt={title || "Promotion ZAYA"}
          fill
          sizes="(max-width: 640px) 90vw, 420px"
          className="object-cover"
        />
      </div>
      {title && (
        <div className="bg-white p-4 text-center">
          <p className="font-display text-lg font-bold text-ink">{title}</p>
          <span className="mt-1 inline-block text-sm font-semibold text-zaya">
            Voir l'offre →
          </span>
        </div>
      )}
    </div>
  );

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/60"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 24, stiffness: 280 }}
            className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="Fermer"
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-black/60"
            >
              <X className="h-5 w-5" />
            </button>
            {link ? (
              <Link href={link} onClick={() => setOpen(false)}>
                {Inner}
              </Link>
            ) : (
              Inner
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
