"use client";

import { useState } from "react";
import { Upload, Loader2, X } from "lucide-react";
import SmartImage from "@/components/SmartImage";
import { compressImageFile } from "@/lib/imageCompress";
import { toast } from "@/components/Toaster";
import { cn } from "@/lib/utils";

export default function AdminImageUpload({
  value,
  onChange,
  hint,
  aspect = "wide",
}: {
  value: string;
  onChange: (url: string) => void;
  hint?: string;
  aspect?: "wide" | "square" | "portrait" | "banner";
}) {
  const [uploading, setUploading] = useState(false);

  const aspectClass =
    aspect === "square"
      ? "aspect-square"
      : aspect === "portrait"
        ? "aspect-[4/5]"
        : aspect === "banner"
          ? "aspect-[2/1]"
          : "aspect-[16/6]";

  const handle = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    if (file.size > 12 * 1024 * 1024) {
      toast("Image trop lourde (max 12 Mo)", "error");
      return;
    }
    setUploading(true);
    try {
      const dataUrl = await compressImageFile(file, 1600, 0.82);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload échoué");
      onChange(data.url);
      toast("Image importée ✅");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erreur", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {value ? (
        <div className={cn("relative overflow-hidden rounded-xl bg-neutral-50 ring-1 ring-black/5", aspectClass)}>
          <SmartImage src={value} alt="Aperçu" fill sizes="400px" className="object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur hover:bg-black/70"
            aria-label="Retirer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-zaya/40 bg-zaya-50/40 text-center transition hover:border-zaya",
            aspectClass,
            uploading && "pointer-events-none opacity-60",
          )}
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              handle(e.target.files);
              e.target.value = "";
            }}
          />
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-zaya" />
          ) : (
            <Upload className="h-6 w-6 text-zaya" />
          )}
          <span className="text-xs font-semibold text-zaya">
            {uploading ? "Envoi…" : "Importer une image"}
          </span>
          {hint && <span className="px-2 text-[10px] text-ink-muted">{hint}</span>}
        </label>
      )}
    </div>
  );
}
