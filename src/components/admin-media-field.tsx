"use client";

import { uploadFileAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useId, useRef, useState } from "react";

export type AdminMediaFieldProps = {
  name: string;
  label: string;
  /** R2 object prefix, e.g. projects/covers */
  prefix: string;
  accept: string;
  defaultValue?: string;
  linkPlaceholder?: string;
};

export function AdminMediaField({
  name,
  label,
  prefix,
  accept,
  defaultValue = "",
  linkPlaceholder = "https://… or paste a storage key",
}: AdminMediaFieldProps) {
  const id = useId();
  const fileId = `${id}-file`;
  const linkId = `${id}-link`;
  const [value, setValue] = useState(defaultValue);
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
      setValue(key);
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
          Upload a file to storage first. Use the link field only if you already have a URL or key.
        </p>
      </div>

      <div className="rounded-lg border bg-muted/40 p-4 space-y-3">
        <p className="text-sm font-medium">Upload</p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
          <div className="flex-1 min-w-0">
            <Label htmlFor={fileId} className="sr-only">
              Choose file
            </Label>
            <Input
              ref={fileRef}
              id={fileId}
              type="file"
              accept={accept}
              className="cursor-pointer bg-background"
            />
          </div>
          <Button type="button" className="shrink-0 sm:self-stretch" onClick={handleUpload} disabled={pending}>
            {pending ? "Uploading…" : "Upload to storage"}
          </Button>
        </div>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="space-y-1">
        <Label htmlFor={linkId} className="text-xs font-normal text-muted-foreground">
          Or paste URL / key
        </Label>
        <Input
          id={linkId}
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={linkPlaceholder}
          className="bg-background"
        />
      </div>
    </div>
  );
}
