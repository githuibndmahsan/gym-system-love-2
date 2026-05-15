import { supabase } from "@/integrations/supabase/client";

const BUCKET = "profile-images";

export async function uploadProfileImage(blob: Blob, prefix = "profile"): Promise<string> {
  const ext = blob.type === "image/png" ? "png" : blob.type === "image/webp" ? "webp" : "jpg";
  const path = `${prefix}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
    contentType: blob.type,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export function profileImageOrFallback(url: string | null | undefined, name: string) {
  if (url) return url;
  // SVG initials fallback (no network needed)
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><rect width='200' height='200' fill='%23191919'/><text x='50%25' y='50%25' dy='.35em' text-anchor='middle' font-family='system-ui' font-size='80' font-weight='700' fill='%23F86A2A'>${initials || "?"}</text></svg>`;
  return `data:image/svg+xml;utf8,${svg}`;
}