/**
 * Compress and resize an image file (or data URL) using a canvas.
 * Returns a JPEG/WebP Blob suitable for upload.
 */
export async function compressImage(
  source: File | Blob | string,
  opts: { maxSize?: number; quality?: number; mimeType?: string } = {}
): Promise<Blob> {
  const { maxSize = 800, quality = 0.85, mimeType = "image/jpeg" } = opts;

  const dataUrl =
    typeof source === "string"
      ? source
      : await new Promise<string>((res, rej) => {
          const r = new FileReader();
          r.onload = () => res(r.result as string);
          r.onerror = rej;
          r.readAsDataURL(source);
        });

  const img = await new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = dataUrl;
  });

  // Square crop centered (good for avatars)
  const side = Math.min(img.width, img.height);
  const sx = (img.width - side) / 2;
  const sy = (img.height - side) / 2;
  const target = Math.min(maxSize, side);

  const canvas = document.createElement("canvas");
  canvas.width = target;
  canvas.height = target;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(img, sx, sy, side, side, 0, 0, target, target);

  return await new Promise<Blob>((res, rej) =>
    canvas.toBlob((b) => (b ? res(b) : rej(new Error("Compression failed"))), mimeType, quality)
  );
}

const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024;

export function validateImage(file: File): string | null {
  if (!ALLOWED.includes(file.type)) return "Only JPG, PNG, or WebP images are allowed.";
  if (file.size > MAX_BYTES) return "Image must be under 5MB.";
  return null;
}