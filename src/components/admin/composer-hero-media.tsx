"use client";

import { uploadFileAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ImageIcon, Loader2, Video, X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";

function previewUrl(keyOrUrl: string, assetBaseUrl: string): string {
  const k = keyOrUrl.trim();
  if (!k) return "";
  if (k.startsWith("http://") || k.startsWith("https://")) return k;
  const base = assetBaseUrl.replace(/\/$/, "");
  if (!base) return k;
  return `${base}/${k.replace(/^\//, "")}`;
}

type CoverProps = {
  name: string;
  prefix: string;
  assetBaseUrl: string;
  defaultValue?: string;
  /** e.g. "Cover" — shown in empty state */
  label?: string;
};

/**
 * Medium-style hero cover: large 16:9 area above the title, click or drag image, optional URL field collapsed.
 */
export function ComposerCoverImage({ name, prefix, assetBaseUrl, defaultValue = "", label = "Cover" }: CoverProps) {
  const id = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(defaultValue);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrl, setShowUrl] = useState(false);

  useEffect(() => {
    setValue(defaultValue ?? "");
  }, [defaultValue]);

  const src = previewUrl(value, assetBaseUrl);

  const upload = useCallback(
    async (file: File) => {
      if (!file?.size || !file.type.startsWith("image/")) {
        setError("Choose an image file.");
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
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed");
      } finally {
        setPending(false);
      }
    },
    [prefix],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const file = e.dataTransfer.files?.[0];
      if (file) void upload(file);
    },
    [upload],
  );

  const clear = () => {
    setValue("");
    setError(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="mb-10 space-y-3">
      <input type="hidden" name={name} value={value} readOnly />
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={onDrop}
        className={cn(
          "group relative w-full overflow-hidden rounded-lg border-2 border-dashed border-border/80 bg-muted/30 transition-colors",
          "hover:border-muted-foreground/40 hover:bg-muted/40",
          src ? "aspect-[2/1] border-solid border-border sm:aspect-video" : "min-h-[200px] sm:min-h-[240px]",
        )}
      >
        {src ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element -- admin preview any R2 URL */}
            <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition group-hover:opacity-100" />
            <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 transition group-hover:opacity-100">
              <Button type="button" size="sm" variant="secondary" className="shadow-md" onClick={() => fileRef.current?.click()}>
                Change
              </Button>
              <Button type="button" size="sm" variant="destructive" className="shadow-md" onClick={clear}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <button
            type="button"
            className="flex min-h-[inherit] w-full flex-col items-center justify-center gap-2 px-6 py-12 text-center"
            onClick={() => fileRef.current?.click()}
          >
            {pending ? (
              <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
            ) : (
              <ImageIcon className="h-10 w-10 text-muted-foreground/70" />
            )}
            <span className="text-sm font-medium text-foreground">Add a cover image</span>
            <span className="max-w-xs text-xs text-muted-foreground">
              Appears above your title on listings and social cards. Drag &amp; drop or click — optional.
            </span>
          </button>
        )}
        <input
          ref={fileRef}
          id={`${id}-cover-file`}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void upload(f);
            e.target.value = "";
          }}
        />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
          onClick={() => setShowUrl((s) => !s)}
        >
          {showUrl ? "Hide URL field" : "Paste image URL or storage key instead"}
        </button>
      </div>
      {showUrl ? (
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="https://… or R2 key"
          className="bg-background font-mono text-sm"
        />
      ) : null}
    </div>
  );
}

type VideoProps = {
  name: string;
  prefix: string;
  assetBaseUrl: string;
  defaultValue?: string;
};

/** Optional hero preview video (projects): same visual language, below or beside cover. */
export function ComposerHeroVideo({ name, prefix, assetBaseUrl, defaultValue = "" }: VideoProps) {
  const id = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(defaultValue);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setValue(defaultValue ?? "");
  }, [defaultValue]);

  const src = previewUrl(value, assetBaseUrl);

  const upload = useCallback(
    async (file: File) => {
      if (!file?.size || !file.type.startsWith("video/")) {
        setError("Choose a video file.");
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
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed");
      } finally {
        setPending(false);
      }
    },
    [prefix],
  );

  const clear = () => {
    setValue("");
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="mb-10 space-y-3">
      <input type="hidden" name={name} value={value} readOnly />
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Preview video</p>
      <div className="relative overflow-hidden rounded-lg border-2 border-dashed border-border/80 bg-muted/20">
        {src ? (
          <div className="relative aspect-video w-full bg-black">
            <video src={src} className="h-full w-full object-contain" controls playsInline muted />
            <div className="absolute right-2 top-2 flex gap-2">
              <Button type="button" size="sm" variant="secondary" onClick={() => fileRef.current?.click()}>
                Change
              </Button>
              <Button type="button" size="sm" variant="destructive" onClick={clear}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="flex w-full flex-col items-center justify-center gap-2 px-6 py-10"
            onClick={() => fileRef.current?.click()}
          >
            {pending ? <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /> : <Video className="h-8 w-8 text-muted-foreground/70" />}
            <span className="text-sm font-medium">Add preview video</span>
            <span className="text-xs text-muted-foreground">Shown on project cards and header when set</span>
          </button>
        )}
        <input
          ref={fileRef}
          id={`${id}-video-file`}
          type="file"
          accept="video/*"
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void upload(f);
            e.target.value = "";
          }}
        />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Or paste video URL / key"
        className="bg-background font-mono text-sm"
      />
    </div>
  );
}
