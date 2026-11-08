"use client";

import { useState } from "react";
import { Facebook, Send, Link2, Check, Share2 } from "lucide-react";
import { toast } from "./Toaster";

export default function ShareButtons({
  url,
  title,
  shareText,
  compact = false,
}: {
  url: string;
  title: string;
  shareText?: string;
  compact?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;

  const fb = `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`;
  const message = shareText ? `${title}. ${shareText}` : title;
  const wa = `https://wa.me/?text=${enc(`${message} ${url}`)}`;
  const tw = `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(message)}`;

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: shareText, url });
      } catch {
        /* annulé */
      }
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast("Lien copié ✅");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast("Impossible de copier le lien", "error");
    }
  };

  const base =
    "flex items-center justify-center rounded-full transition active:scale-90";
  const size = compact ? "h-9 w-9" : "h-10 w-10";

  return (
    <div className="flex items-center gap-2">
      {!compact && (
        <span className="mr-1 text-sm font-medium text-ink-muted">Partager :</span>
      )}
      <a
        href={fb}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Partager sur Facebook"
        className={`${base} ${size} bg-[#1877F2] text-white hover:opacity-90`}
      >
        <Facebook className="h-4 w-4" />
      </a>
      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Partager sur WhatsApp"
        className={`${base} ${size} bg-[#25D366] text-white hover:opacity-90`}
      >
        <Send className="h-4 w-4" />
      </a>
      <a
        href={tw}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Partager sur X"
        className={`${base} ${size} bg-ink text-white hover:opacity-90`}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>
      <button
        onClick={copy}
        aria-label="Copier le lien"
        className={`${base} ${size} bg-neutral-100 text-ink hover:bg-neutral-200`}
      >
        {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Link2 className="h-4 w-4" />}
      </button>
      {compact && typeof navigator !== "undefined" && "share" in navigator && (
        <button
          onClick={nativeShare}
          aria-label="Partager"
          className={`${base} ${size} bg-neutral-100 text-ink hover:bg-neutral-200`}
        >
          <Share2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
