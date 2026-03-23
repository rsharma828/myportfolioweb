"use client";

import { uploadFileAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useId, useRef, useState } from "react";

type Props = {
  name?: string;
  label?: string;
  rows?: number;
  defaultValue?: string;
  prefix: string;
};

export function AdminGalleryField({
  name = "gallery",
  label = "Gallery",
  rows = 4,
  defaultValue = "",
  prefix,
}: Props) {
  const id = useId();
  const fileId = `${id}-file`;
  const [text, setText] = useState(defaultValue);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleUpload() {
    const file = fileRef.current?.files?.[0];
    if (!file?.size) {
      setError("Choose a file first.");
      return;
    }
    setError(null);
    setPending(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("prefix", prefix);
      const key = await uploadFileAction(fd);
      setText((t) => (t.trim() ? `${t.trim()}\n${key}` : key));
      if (fileRef.current) fileRef.current.value = "";
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label className="text-base">{label}</Label>
        <p className="text-xs text-muted-foreground">
          Add images by uploading (appends one line per file) or paste URLs / keys, one per line.
        </p>
      </div>

      <div className="rounded-lg border bg-muted/40 p-4 space-y-3">
        <p className="text-sm font-medium">Upload images</p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
          <div className="flex-1 min-w-0">
            <Label htmlFor={fileId} className="sr-only">
              Choose image
            </Label>
            <Input
              ref={fileRef}
              id={fileId}
              type="file"
              accept="image/*"
              className="cursor-pointer bg-background"
            />
          </div>
          <Button type="button" className="shrink-0 sm:self-stretch" onClick={handleUpload} disabled={pending}>
            {pending ? "Uploading…" : "Upload and append"}
          </Button>
        </div>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="space-y-1">
        <Label htmlFor={name} className="text-xs font-normal text-muted-foreground">
          URLs / keys (one per line)
        </Label>
        <Textarea
          id={name}
          name={name}
          rows={rows}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="font-mono text-sm bg-background"
        />
      </div>
    </div>
  );
}
