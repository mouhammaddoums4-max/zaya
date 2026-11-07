"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Bike, Loader2 } from "lucide-react";

export default function DriverLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/livreur/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, pin }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur de connexion");
      router.push("/livreur");
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
          <Image src="/logo-zaya.png" alt="ZAYA" width={160} height={53} className="logo-white h-11 w-auto" />
        </div>
        <form onSubmit={submit} className="rounded-3xl bg-white p-7 shadow-2xl">
          <div className="mb-5 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-zaya-50 text-zaya">
              <Bike className="h-6 w-6" />
            </div>
            <h1 className="font-display text-xl font-bold">Espace livreur</h1>
            <p className="mt-1 text-sm text-ink-muted">Connectez-vous pour voir vos livraisons</p>
          </div>

          <input
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Votre numéro de téléphone"
            autoFocus
            className="mb-3 w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-zaya focus:ring-2 focus:ring-zaya/20"
          />
          <input
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ""))}
            placeholder="Code PIN"
            maxLength={6}
            className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-zaya focus:ring-2 focus:ring-zaya/20"
          />

          {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary mt-4 w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
