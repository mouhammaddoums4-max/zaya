"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { toast } from "./Toaster";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      toast("Entrez un email valide", "error");
      return;
    }
    try {
      localStorage.setItem("zaya-newsletter", email);
    } catch {
      /* ignore */
    }
    toast("Merci ! Vous êtes abonné ✅");
    setEmail("");
  };

  return (
    <form onSubmit={submit} className="flex overflow-hidden rounded-lg bg-white">
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder="Votre email..."
        className="w-full bg-transparent px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink-muted"
      />
      <button
        type="submit"
        className="flex items-center gap-1.5 bg-zaya px-4 text-sm font-semibold text-white transition hover:bg-zaya-600"
      >
        <Send className="h-4 w-4" />
        <span className="hidden sm:inline">S'abonner</span>
      </button>
    </form>
  );
}
