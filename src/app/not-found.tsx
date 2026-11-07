import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink px-4 text-center text-white">
      <Image
        src="/logo-zaya.png"
        alt="ZAYA"
        width={160}
        height={53}
        className="logo-white h-10 w-auto"
      />
      <p className="mt-10 font-display text-7xl font-extrabold text-gradient-zaya">
        404
      </p>
      <h1 className="mt-2 font-display text-2xl font-bold">Page introuvable</h1>
      <p className="mt-2 max-w-sm text-white/60">
        La page que vous cherchez n'existe pas ou a été déplacée.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-zaya px-6 py-3 text-sm font-semibold text-white transition hover:bg-zaya-600"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}
