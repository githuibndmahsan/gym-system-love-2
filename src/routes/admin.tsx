import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Camera, Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CameraCapture } from "@/components/CameraCapture";
import { uploadProfileImage, profileImageOrFallback } from "@/lib/upload-profile-image";
import { MEMBERS as SEED_MEMBERS, TRAINERS as SEED_TRAINERS } from "@/lib/gym-data";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  component: AdminProfiles,
  head: () => ({ meta: [{ title: "Admin · Profiles · Iron Pulse" }] }),
});

type ProfileRow = { id: string; name: string; subtitle: string; image: string | null };

function AdminProfiles() {
  const [members, setMembers] = useState<ProfileRow[]>(
    SEED_MEMBERS.map((m) => ({ id: m.id, name: m.name, subtitle: `${m.plan} · ${m.batch}`, image: null }))
  );
  const [trainers, setTrainers] = useState<ProfileRow[]>(
    SEED_TRAINERS.map((t, i) => ({ id: `T${i + 1}`, name: t.name, subtitle: t.role, image: t.img }))
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="glass border-b border-border sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="size-9 rounded-lg glass-strong flex items-center justify-center">
              <ArrowLeft className="size-4" />
            </Link>
            <div>
              <h1 className="font-display text-xl uppercase tracking-wider">Profile Studio</h1>
              <p className="text-xs text-muted-foreground">Camera capture for members & trainers</p>
            </div>
          </div>
          <div className="text-xs text-muted-foreground hidden sm:block">
            Tap <Camera className="inline size-3 -mt-0.5 text-primary" /> to use your device camera
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <Tabs defaultValue="members" className="w-full">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="members">Members ({members.length})</TabsTrigger>
            <TabsTrigger value="trainers">Trainers ({trainers.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="mt-6">
            <ProfileGrid
              kind="member"
              rows={members}
              onChange={setMembers}
            />
          </TabsContent>
          <TabsContent value="trainers" className="mt-6">
            <ProfileGrid
              kind="trainer"
              rows={trainers}
              onChange={setTrainers}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function ProfileGrid({
  kind,
  rows,
  onChange,
}: {
  kind: "member" | "trainer";
  rows: ProfileRow[];
  onChange: (r: ProfileRow[]) => void;
}) {
  const [editing, setEditing] = useState<ProfileRow | null>(null);
  const [adding, setAdding] = useState(false);

  const remove = (id: string) => {
    onChange(rows.filter((r) => r.id !== id));
    toast.success("Profile removed");
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setAdding(true)} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
          <Plus className="size-4" /> Add {kind}
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {rows.map((r) => (
          <div key={r.id} className="glass rounded-2xl overflow-hidden group">
            <div className="aspect-square relative bg-muted">
              <img
                src={profileImageOrFallback(r.image, r.name)}
                alt={r.name}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition flex gap-2">
                <button
                  onClick={() => setEditing(r)}
                  className="flex-1 size-9 rounded-lg bg-primary/90 text-primary-foreground flex items-center justify-center"
                  aria-label="Edit"
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  onClick={() => remove(r.id)}
                  className="size-9 rounded-lg bg-destructive/90 text-destructive-foreground flex items-center justify-center"
                  aria-label="Delete"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
            <div className="p-3">
              <div className="font-semibold text-sm truncate">{r.name}</div>
              <div className="text-xs text-muted-foreground truncate">{r.subtitle}</div>
            </div>
          </div>
        ))}
      </div>

      {(editing || adding) && (
        <ProfileDialog
          kind={kind}
          initial={editing}
          onClose={() => {
            setEditing(null);
            setAdding(false);
          }}
          onSave={(row) => {
            if (editing) {
              onChange(rows.map((r) => (r.id === editing.id ? row : r)));
              toast.success("Profile updated");
            } else {
              onChange([row, ...rows]);
              toast.success("Profile added");
            }
            setEditing(null);
            setAdding(false);
          }}
        />
      )}
    </div>
  );
}

function ProfileDialog({
  kind,
  initial,
  onClose,
  onSave,
}: {
  kind: "member" | "trainer";
  initial: ProfileRow | null;
  onClose: () => void;
  onSave: (row: ProfileRow) => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [subtitle, setSubtitle] = useState(initial?.subtitle ?? "");
  const [image, setImage] = useState<string | null>(initial?.image ?? null);
  const [pendingBlob, setPendingBlob] = useState<Blob | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    try {
      let finalUrl = image;
      if (pendingBlob) {
        finalUrl = await uploadProfileImage(pendingBlob, kind);
      }
      onSave({
        id: initial?.id ?? `${kind === "member" ? "GM" : "T"}${Date.now().toString().slice(-5)}`,
        name: name.trim(),
        subtitle: subtitle.trim() || (kind === "member" ? "New Member" : "Trainer"),
        image: finalUrl,
      });
    } catch (e) {
      console.error(e);
      toast.error("Upload failed. You may need to be signed in to save photos.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display uppercase tracking-wider">
            {initial ? "Edit" : "Add"} {kind}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-col items-center gap-3">
            <div className="size-32 rounded-full overflow-hidden ring-2 ring-primary/40 bg-muted">
              <img
                src={profileImageOrFallback(image, name || "?")}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setCameraOpen(true)}
              className="gap-2"
            >
              <Camera className="size-4 text-primary" />
              {image ? "Change Photo" : "Capture / Upload Photo"}
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ahmed Raza" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sub">{kind === "member" ? "Plan & batch" : "Specialty"}</Label>
            <Input
              id="sub"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder={kind === "member" ? "Pro · Morning" : "Strength & Conditioning"}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={submit} disabled={saving} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {saving ? "Saving…" : "Save Profile"}
            </Button>
          </div>
        </div>

        <CameraCapture
          open={cameraOpen}
          onOpenChange={setCameraOpen}
          title={`${initial ? "Update" : "Capture"} ${kind} photo`}
          onCapture={(blob, previewUrl) => {
            setPendingBlob(blob);
            setImage(previewUrl);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}