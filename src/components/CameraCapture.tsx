import { useEffect, useRef, useState } from "react";
import { Camera, RotateCcw, Check, X, Upload, SwitchCamera, Zap, ZapOff } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { compressImage, validateImage } from "@/lib/image-utils";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCapture: (blob: Blob, previewUrl: string) => void;
  title?: string;
};

export function CameraCapture({ open, onOpenChange, onCapture, title = "Capture Photo" }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facing, setFacing] = useState<"user" | "environment">("user");
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [torch, setTorch] = useState(false);
  const [hasTorch, setHasTorch] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const stop = () => {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
    setTorch(false);
    setHasTorch(false);
  };

  const start = async (mode: "user" | "environment") => {
    setCameraError(null);
    stop();
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: mode }, width: { ideal: 1280 }, height: { ideal: 1280 } },
        audio: false,
      });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
      const track = s.getVideoTracks()[0];
      const caps = (track.getCapabilities?.() ?? {}) as MediaTrackCapabilities & { torch?: boolean };
      setHasTorch(!!caps.torch);
    } catch (e) {
      console.error(e);
      setCameraError("Camera unavailable. Use upload or device camera below.");
    }
  };

  useEffect(() => {
    if (open && !preview) start(facing);
    if (!open) {
      stop();
      setPreview(null);
    }
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, facing]);

  const flip = () => setFacing((f) => (f === "user" ? "environment" : "user"));

  const toggleTorch = async () => {
    const track = stream?.getVideoTracks()[0];
    if (!track) return;
    try {
      await track.applyConstraints({ advanced: [{ torch: !torch }] as unknown as MediaTrackConstraintSet[] });
      setTorch((t) => !t);
    } catch {
      toast.error("Flash not supported");
    }
  };

  const snap = () => {
    const v = videoRef.current;
    if (!v) return;
    const c = document.createElement("canvas");
    const size = Math.min(v.videoWidth, v.videoHeight);
    c.width = size;
    c.height = size;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    if (facing === "user") {
      ctx.translate(size, 0);
      ctx.scale(-1, 1);
    }
    const sx = (v.videoWidth - size) / 2;
    const sy = (v.videoHeight - size) / 2;
    ctx.drawImage(v, sx, sy, size, size, 0, 0, size, size);
    setPreview(c.toDataURL("image/jpeg", 0.92));
    stop();
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const err = validateImage(f);
    if (err) {
      toast.error(err);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
      stop();
    };
    reader.readAsDataURL(f);
  };

  const retake = () => {
    setPreview(null);
    start(facing);
  };

  const confirm = async () => {
    if (!preview) return;
    setBusy(true);
    try {
      const blob = await compressImage(preview, { maxSize: 800, quality: 0.85 });
      const url = URL.createObjectURL(blob);
      onCapture(blob, url);
      onOpenChange(false);
      setPreview(null);
    } catch (e) {
      console.error(e);
      toast.error("Failed to process image");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 gap-0 overflow-hidden bg-background border-border">
        <DialogHeader className="px-5 py-4 border-b border-border">
          <DialogTitle className="font-display uppercase tracking-wider text-base">{title}</DialogTitle>
        </DialogHeader>

        <div className="relative aspect-square bg-black">
          {preview ? (
            <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`absolute inset-0 w-full h-full object-cover ${facing === "user" ? "scale-x-[-1]" : ""}`}
              />
              {/* Framing guide */}
              <div className="pointer-events-none absolute inset-6 rounded-full border-2 border-primary/50 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
              {cameraError && (
                <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-muted-foreground bg-black/80">
                  {cameraError}
                </div>
              )}
              {hasTorch && (
                <button
                  onClick={toggleTorch}
                  className="absolute top-3 right-3 size-10 rounded-full glass-strong flex items-center justify-center"
                  aria-label="Toggle flash"
                >
                  {torch ? <Zap className="size-4 text-primary" /> : <ZapOff className="size-4" />}
                </button>
              )}
            </>
          )}
        </div>

        <div className="p-4 flex items-center justify-center gap-3 bg-card">
          {preview ? (
            <>
              <Button variant="outline" onClick={retake} disabled={busy} className="gap-2">
                <RotateCcw className="size-4" /> Retake
              </Button>
              <Button onClick={confirm} disabled={busy} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Check className="size-4" /> {busy ? "Saving…" : "Use Photo"}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="icon" onClick={() => fileInputRef.current?.click()} aria-label="Upload">
                <Upload className="size-4" />
              </Button>
              <button
                onClick={snap}
                disabled={!stream}
                className="size-16 rounded-full bg-primary disabled:opacity-40 flex items-center justify-center ring-4 ring-primary/30 hover:ring-primary/50 transition"
                aria-label="Capture"
              >
                <Camera className="size-7 text-primary-foreground" />
              </button>
              <Button variant="outline" size="icon" onClick={flip} aria-label="Flip camera">
                <SwitchCamera className="size-4" />
              </Button>
            </>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            capture="environment"
            onChange={onFile}
            className="hidden"
          />
        </div>

        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-3 left-3 size-9 rounded-full glass-strong flex items-center justify-center"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>
      </DialogContent>
    </Dialog>
  );
}