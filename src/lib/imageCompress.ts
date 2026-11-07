/**
 * Compresse une image choisie depuis l'appareil en une data URL légère.
 * Redimensionne au maximum à `maxSize` px et encode en JPEG.
 * Fonctionne entièrement côté navigateur (aucun serveur requis).
 */
export async function compressImageFile(
  file: File,
  maxSize = 1200,
  quality = 0.82,
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Fichier non image");
  }

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Lecture impossible"));
    reader.readAsDataURL(file);
  });

  const imgEl = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Image invalide"));
    image.src = dataUrl;
  });

  let { width, height } = imgEl;
  if (width > maxSize || height > maxSize) {
    if (width >= height) {
      height = Math.round((height * maxSize) / width);
      width = maxSize;
    } else {
      width = Math.round((width * maxSize) / height);
      height = maxSize;
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(imgEl, 0, 0, width, height);

  // PNG avec transparence -> garder PNG, sinon JPEG (plus léger)
  const isPng = file.type === "image/png";
  return canvas.toDataURL(isPng ? "image/png" : "image/jpeg", quality);
}
