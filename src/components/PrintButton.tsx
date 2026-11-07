"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="btn-primary w-full print:hidden"
    >
      <Printer className="h-4 w-4" />
      Télécharger / Imprimer le reçu
    </button>
  );
}
