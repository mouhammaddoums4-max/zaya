/**
 * Code-barres décoratif (type Code128) généré depuis une chaîne.
 * Rendu SVG pur, sans dépendance. Non scannable — purement visuel.
 */
export default function Barcode({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const rects: { x: number; w: number }[] = [];
  let x = 0;
  // barres de garde
  const push = (w: number, black: boolean) => {
    if (black) rects.push({ x, w });
    x += w;
  };
  push(2, true);
  push(1, false);
  push(2, true);
  push(2, false);

  for (const ch of value) {
    const code = ch.charCodeAt(0);
    for (let k = 0; k < 4; k++) {
      const w = ((code >> (k * 2)) & 3) + 1;
      push(w, k % 2 === 0);
      push(1, false);
    }
  }
  push(2, true);
  push(1, false);
  push(2, true);

  return (
    <svg
      viewBox={`0 0 ${x} 60`}
      className={className}
      preserveAspectRatio="none"
      role="img"
      aria-label={`Code ${value}`}
    >
      {rects.map((r, i) => (
        <rect key={i} x={r.x} y="0" width={r.w} height="60" fill="#111" />
      ))}
    </svg>
  );
}
