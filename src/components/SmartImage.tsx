"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type SmartImageProps = Omit<ImageProps, "src" | "alt"> & {
  src?: string | null;
  alt: string;
  wrapperClassName?: string;
};

/**
 * Image résiliente : si l'URL distante échoue, on affiche un
 * dégradé ZAYA avec l'initiale, pour ne jamais casser la mise en page.
 */
export default function SmartImage({
  src,
  alt,
  className,
  wrapperClassName,
  ...props
}: SmartImageProps) {
  const [failed, setFailed] = useState(false);
  const valid = src && src.length > 4;

  // Images importées depuis l'appareil (data URL) : rendu <img> simple
  if (valid && !failed && src!.startsWith("data:")) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src as string}
        alt={alt}
        className={cn("absolute inset-0 h-full w-full object-cover", className)}
        onError={() => setFailed(true)}
      />
    );
  }

  if (!valid || failed) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center bg-gradient-to-br from-zaya-100 via-zaya-50 to-white",
          wrapperClassName,
        )}
      >
        <span className="font-display text-3xl font-bold text-zaya/40">
          {(alt || "Z").charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src as string}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      {...props}
    />
  );
}
