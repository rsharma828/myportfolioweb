import { upsertProjectAction } from "@/app/admin/actions";
import { ComposerCoverImage, ComposerHeroVideo } from "@/components/admin/composer-hero-media";
import { NativeSelect } from "@/components/admin/native-select";
import { RichEditor } from "@/components/admin/rich-editor";
import { TimelineDateFields } from "@/components/admin/timeline-date-fields";
import { AdminGalleryField } from "@/components/admin-gallery-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { legacyTextToEditorHtml } from "@/lib/html-content";
import { cn } from "@/lib/utils";
import { parseProjectTimelineForDates } from "@/lib/project-timeline";
import { getProjectBySlug } from "@/lib/db/projects";
import { getPublicAssetBaseUrl } from "@/lib/storage";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { InputHTMLAttributes } from "react";

type Props = { params: { slug: string } };

export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: Props) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  const { start: timelineStart, end: timelineEnd } = parseProjectTimelineForDates(project.timeline);
  const assetBaseUrl = getPublicAssetBaseUrl();

  const challengeHtml = legacyTextToEditorHtml(project.challenge);
  const solutionHtml = legacyTextToEditorHtml(project.solution);
  const outcomeHtml = legacyTextToEditorHtml(project.outcome);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a]">
      <form action={upsertProjectAction} className="pb-24">
        <input type="hidden" name="existingSlug" value={project.slug} />

        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-md">
          <Link href="/admin/projects" className="text-sm text-muted-foreground hover:text-foreground">
            ← Projects
          </Link>
          <Button type="submit" size="sm" className="rounded-full px-6">
            Save changes
          </Button>
        </header>

        <div className="mx-auto w-full max-w-[680px] px-4 pt-10 md:px-6">
          <ComposerCoverImage
            key={`${project.slug}-cover`}
            name="coverImage"
            prefix="projects/covers"
            assetBaseUrl={assetBaseUrl}
            label="Project cover"
            defaultValue={project.coverImage ?? ""}
          />
          <ComposerHeroVideo
            key={`${project.slug}-video`}
            name="video"
            prefix="projects/video"
            assetBaseUrl={assetBaseUrl}
            defaultValue={project.video ?? ""}
          />
          <input
            name="title"
            required
            defaultValue={project.title}
            placeholder="Project name"
            className="mb-2 w-full border-0 bg-transparent p-0 text-4xl font-bold leading-tight tracking-tight placeholder:text-muted-foreground/40 focus-visible:outline-none focus-visible:ring-0 md:text-5xl"
          />
          <input
            name="tagline"
            defaultValue={project.tagline}
            placeholder="One-line pitch (optional)"
            className="mb-6 w-full border-0 bg-transparent p-0 text-xl text-muted-foreground placeholder:text-muted-foreground/45 focus-visible:outline-none focus-visible:ring-0 md:text-2xl"
          />
          <div className="mb-10">
            <Label className="sr-only" htmlFor="description">
              Short description
            </Label>
            <Textarea
              id="description"
              name="description"
              required
              rows={3}
              defaultValue={project.description}
              placeholder="Short description for cards and SEO (plain text)"
              className="resize-none border-0 border-b border-border/40 bg-transparent px-0 py-2 text-base focus-visible:ring-0"
            />
          </div>

          <section className="mb-12">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Case study</h2>
            <RichEditor
              key={`${project.slug}-body`}
              name="body"
              defaultHtml={project.body || ""}
              uploadPrefix="projects/body"
              assetBaseUrl={assetBaseUrl}
              variant="medium"
              placeholder="Write the full story — drag images or videos anywhere…"
            />
            <p className="mt-4 text-center text-xs text-muted-foreground/70">
              Cover and preview video are above the title. Optional gallery is in{" "}
              <strong className="font-medium text-foreground">Project details</strong> — or leave hero media empty to use
              the first image/video from the case study.
            </p>
          </section>

          <section className="mb-8 space-y-8">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Challenge / Solution / Outcome
            </h2>
            <div>
              <p className="mb-2 text-sm font-medium">Challenge</p>
              <RichEditor
                key={`${project.slug}-challenge`}
                name="challenge"
                variant="mediumCompact"
                defaultHtml={challengeHtml}
                uploadPrefix="projects/challenge"
                assetBaseUrl={assetBaseUrl}
                placeholder="What problem did you tackle?"
              />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Solution</p>
              <RichEditor
                key={`${project.slug}-solution`}
                name="solution"
                variant="mediumCompact"
                defaultHtml={solutionHtml}
                uploadPrefix="projects/solution"
                assetBaseUrl={assetBaseUrl}
                placeholder="How did you solve it?"
              />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Outcome</p>
              <RichEditor
                key={`${project.slug}-outcome`}
                name="outcome"
                variant="mediumCompact"
                defaultHtml={outcomeHtml}
                uploadPrefix="projects/outcome"
                assetBaseUrl={assetBaseUrl}
                placeholder="What changed?"
              />
            </div>
          </section>
        </div>

        <div className="mx-auto w-full max-w-[680px] px-4 md:px-6">
          <details className="group rounded-xl border border-border/80 bg-background/60 p-4 shadow-sm">
            <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-medium">
              <ChevronDown className="h-4 w-4 shrink-0 transition group-open:rotate-180" />
              Project details &amp; links
            </summary>
            <div className="mt-6 space-y-5 border-t border-border/60 pt-6">
              <div className="rounded-lg border border-dashed border-border/80 bg-muted/20 p-4 space-y-4">
                <div>
                  <p className="text-sm font-medium">Gallery</p>
                  <p className="text-xs text-muted-foreground">
                    Extra images for the project page (below the case study). Cover and preview video are set at the top of
                    this editor.
                  </p>
                </div>
                <AdminGalleryField prefix="projects/gallery" defaultValue={project.gallery.join("\n")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL slug</Label>
                <Input id="slug" name="slug" required defaultValue={project.slug} className="bg-background" />
              </div>
              <Field name="projectTag" label="Tag / category" defaultValue={project.projectTag} />
              <Field
                name="techStack"
                label="Tech stack (comma-separated)"
                defaultValue={project.techStack.join(", ")}
              />
              <Field name="role" label="Your role" defaultValue={project.role} />
              <TimelineDateFields defaultStart={timelineStart} defaultEnd={timelineEnd} />
              <Field name="liveUrl" label="Live site URL" type="url" defaultValue={project.liveUrl} inputMode="url" />
              <Field name="repoUrl" label="Repository URL" type="url" defaultValue={project.repoUrl} inputMode="url" />
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <NativeSelect id="status" name="status" defaultValue={project.status}>
                  <option value="LIVE">Live</option>
                  <option value="WIP">WIP</option>
                  <option value="ARCHIVED">Archived</option>
                </NativeSelect>
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="featured"
                  className="rounded border"
                  defaultChecked={project.featured}
                />
                Featured on home
              </label>
              <Field
                name="sortOrder"
                label="Sort order"
                type="number"
                min={0}
                step={1}
                defaultValue={String(project.sortOrder)}
              />
            </div>
          </details>
        </div>
      </form>
    </div>
  );
}

function Field({
  name,
  label,
  required,
  placeholder,
  defaultValue,
  type = "text",
  min,
  step,
  inputMode,
  className,
}: {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
  min?: number;
  step?: number;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  className?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        type={type}
        min={min}
        step={step}
        inputMode={inputMode}
        className={cn("bg-background", className)}
      />
    </div>
  );
}
