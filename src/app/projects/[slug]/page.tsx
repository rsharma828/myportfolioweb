import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProjectBySlug } from "@/lib/db/projects";
import { processHtmlForDisplay, snippetToDisplayHtml } from "@/lib/html-content";
import { resolvePublicUrl } from "@/lib/storage";
import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { notFound } from "next/navigation";

export const revalidate = 60;

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) return { title: "Project" };
  return {
    title: project.title,
    description: project.tagline || project.description.slice(0, 160),
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  const gallery = project.gallery.map((g) => resolvePublicUrl(g)).filter(Boolean);
  const cover = project.coverImage ? resolvePublicUrl(project.coverImage) : null;
  const videoSrc = project.video ? resolvePublicUrl(project.video) : null;
  const bodyHtml = project.body.trim() ? processHtmlForDisplay(project.body) : "";
  const hasCaseSections =
    project.challenge.trim().length > 0 ||
    project.solution.trim().length > 0 ||
    project.outcome.trim().length > 0;

  return (
    <main className="flex flex-col gap-10 pb-24 max-w-3xl mx-auto">
      <Link href="/projects" className="text-sm text-muted-foreground hover:underline w-fit">
        ← All projects
      </Link>

      <div className="space-y-6">
        <div 
          className="relative aspect-video w-full overflow-hidden rounded-xl border bg-muted"
          style={{ viewTransitionName: `project-image-${project.slug}` }}
        >
          {videoSrc ? (
            <video
              src={videoSrc}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
          ) : cover ? (
            <Image src={cover} alt="" fill className="object-cover" sizes="(max-width:768px) 100vw, 768px" />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground text-sm">No preview</div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
            <Badge variant="secondary">{project.status}</Badge>
            {project.featured ? <Badge>Featured</Badge> : null}
          </div>
          {project.tagline ? <p className="text-lg text-muted-foreground">{project.tagline}</p> : null}
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground border-y py-4">
          {project.role ? <span>Role: {project.role}</span> : null}
          {project.timeline ? <span>{project.timeline}</span> : null}
          {project.liveUrl ? (
            <Link href={project.liveUrl} className="text-primary underline" target="_blank" rel="noreferrer">
              Live site
            </Link>
          ) : null}
          {project.repoUrl ? (
            <Link href={project.repoUrl} className="text-primary underline" target="_blank" rel="noreferrer">
              Repository
            </Link>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          {project.techStack.map((t) => (
            <Badge key={t} variant="outline">
              {t}
            </Badge>
          ))}
        </div>

        {bodyHtml ? (
          <article
            className="prose dark:prose-invert max-w-none mb-2"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
        ) : null}

        {project.challenge.trim() ? (
          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Challenge</h2>
            <div
              className="prose dark:prose-invert max-w-none text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: snippetToDisplayHtml(project.challenge) }}
            />
          </section>
        ) : null}

        {project.solution.trim() ? (
          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Solution</h2>
            <div
              className="prose dark:prose-invert max-w-none text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: snippetToDisplayHtml(project.solution) }}
            />
          </section>
        ) : null}

        {project.outcome.trim() ? (
          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Outcome</h2>
            <div
              className="prose dark:prose-invert max-w-none text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: snippetToDisplayHtml(project.outcome) }}
            />
          </section>
        ) : null}

        {!bodyHtml && !hasCaseSections ? (
          <section className="prose dark:prose-invert max-w-none">
            <p className="text-muted-foreground whitespace-pre-wrap">{project.description}</p>
          </section>
        ) : null}

        {gallery.length > 0 ? (
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {gallery.map((src, i) => (
                <div key={i} className="relative aspect-video rounded-lg overflow-hidden border">
                  <Image src={src} alt="" fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/">Back home</Link>
          </Button>
          {project.liveUrl ? (
            <Button asChild>
              <Link href={project.liveUrl} target="_blank" rel="noreferrer">
                Open live site
              </Link>
            </Button>
          ) : null}
        </div>
      </div>
    </main>
  );
}
