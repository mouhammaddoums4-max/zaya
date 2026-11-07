"use client";

import { create } from "zustand";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, XCircle } from "lucide-react";
import { useEffect } from "react";

type ToastType = "success" | "error" | "info";
type Toast = { id: number; message: string; type: ToastType };

type ToastStore = {
  toasts: Toast[];
  push: (message: string, type?: ToastType) => void;
  remove: (id: number) => void;
};

export const useToast = create<ToastStore>((set) => ({
  toasts: [],
  push: (message, type = "success") =>
    set((s) => ({
      toasts: [...s.toasts, { id: Date.now() + Math.random(), message, type }],
    })),
  remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export function toast(message: string, type: ToastType = "success") {
  useToast.getState().push(message, type);
}

function ToastItem({ toast: t }: { toast: Toast }) {
  const remove = useToast((s) => s.remove);
  useEffect(() => {
    const timer = setTimeout(() => remove(t.id), 3200);
    return () => clearTimeout(timer);
  }, [t.id, remove]);

  const Icon =
    t.type === "success" ? CheckCircle2 : t.type === "error" ? XCircle : Info;
  const color =
    t.type === "success"
      ? "text-emerald-500"
      : t.type === "error"
        ? "text-red-500"
        : "text-zaya";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      className="pointer-events-auto flex items-center gap-3 rounded-2xl bg-ink px-4 py-3 text-sm font-medium text-white shadow-2xl ring-1 ring-white/10"
    >
      <Icon className={`h-5 w-5 shrink-0 ${color}`} />
      <span>{t.message}</span>
    </motion.div>
  );
}

export function Toaster() {
  const toasts = useToast((s) => s.toasts);
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[100] flex flex-col items-center gap-2 px-4 md:bottom-6">
      <AnimatePresence>
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} />
        ))}
      </AnimatePresence>
    </div>
  );
}
