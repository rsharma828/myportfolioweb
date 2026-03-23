import { upsertBlogPostAction } from "@/app/admin/actions";
import { ComposerCoverImage } from "@/components/admin/composer-hero-media";
import { RichEditor } from "@/components/admin/rich-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { dateToDatetimeLocalValue } from "@/lib/datetime-local";
import { getPublicAssetBaseUrl } from "@/lib/storage";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function NewBlogPage() {
  const assetBaseUrl = getPublicAssetBaseUrl();
  const now = dateToDatetimeLocalValue(new Date());

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a]">
      <form action={upsertBlogPostAction} className="pb-24">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-md">
          <Link
            href="/admin/blog"
            className="shrink-0 text-sm text-muted-foreground transition hover:text-foreground"
          >
            ← Stories
          </Link>
          <Button type="submit" size="sm" className="rounded-full px-6">
            Publish
          </Button>
        </header>

        <div className="mx-auto w-full max-w-[680px] px-4 pt-10 md:px-6">
          <ComposerCoverImage
            name="thumbnailImage"
            prefix="blog/thumbnails"
            assetBaseUrl={assetBaseUrl}
            label="Story cover"
          />
          <input
            name="title"
            required
            placeholder="Title"
            className="mb-3 w-full border-0 bg-transparent p-0 text-4xl font-bold leading-tight tracking-tight text-foreground placeholder:text-muted-foreground/40 focus-visible:outline-none focus-visible:ring-0 md:text-5xl md:leading-[1.05]"
          />
          <Textarea
            name="summary"
            required
            rows={2}
            placeholder="Short summary — appears in listings and previews"
            className="mb-8 w-full resize-none border-0 bg-transparent p-0 text-xl leading-snug text-muted-foreground placeholder:text-muted-foreground/45 focus-visible:outline-none focus-visible:ring-0 md:text-2xl"
          />

          <RichEditor
            name="body"
            uploadPrefix="blog/body"
            assetBaseUrl={assetBaseUrl}
            variant="medium"
            placeholder="Tell your story…"
          />
          <p className="mt-6 text-center text-xs text-muted-foreground/70">
            If you skip the cover above, the first image in your story is used for listings and previews.
          </p>
        </div>

        <div className="mx-auto mt-12 w-full max-w-[680px] px-4 md:px-6">
          <details className="group rounded-xl border border-border/80 bg-background/60 p-4 shadow-sm">
            <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-medium text-foreground">
              <ChevronDown className="h-4 w-4 shrink-0 transition group-open:rotate-180" />
              Story settings &amp; publishing
            </summary>
            <div className="mt-6 space-y-5 border-t border-border/60 pt-6">
              <div className="space-y-2">
                <Label htmlFor="slug">URL slug</Label>
                <Input id="slug" name="slug" placeholder="auto-generated from title" className="bg-background" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="publishedAt">Publish date</Label>
                <Input id="publishedAt" name="publishedAt" type="datetime-local" defaultValue={now} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input id="tags" name="tags" placeholder="react, nextjs, essay" className="bg-background" />
              </div>
              <div className="flex flex-wrap gap-6">
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input type="checkbox" name="featured" className="rounded border" />
                  Featured
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input type="checkbox" name="published" className="rounded border" defaultChecked />
                  Visible on site
                </label>
              </div>
            </div>
          </details>
        </div>
      </form>
    </div>
  );
}
