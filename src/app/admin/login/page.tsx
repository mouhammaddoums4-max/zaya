"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur de connexion");
      const from = new URLSearchParams(window.location.search).get("from");
      router.push(from && from.startsWith("/admin") ? from : "/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="absolute inset-0 pattern-grid opacity-30" />
      <div className="relative w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <Image
            src="/logo-zaya.png"
            alt="ZAYA"
            width={160}
            height={53}
            className="logo-white h-11 w-auto"
          />
        </div>
        <form
          onSubmit={submit}
          className="rounded-3xl bg-white p-7 shadow-2xl"
        >
          <div className="mb-5 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-zaya-50 text-zaya">
              <Lock className="h-6 w-6" />
            </div>
            <h1 className="font-display text-xl font-bold">Espace administrateur</h1>
            <p className="mt-1 text-sm text-ink-muted">
              Entrez votre mot de passe pour continuer
            </p>
          </div>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            autoFocus
            className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-zaya focus:ring-2 focus:ring-zaya/20"
          />

          {error && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-4 w-full"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
