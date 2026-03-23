import BlurFade from "@/components/magicui/blur-fade";
import { ProjectCard } from "@/components/project-card";
import { getProjectsForHome } from "@/lib/db/projects";
import type { Metadata } from "next";
import Link from "next/link";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected work and case studies.",
};

const S = 0.025;

export default async function ProjectsIndexPage() {
  const projects = await getProjectsForHome();

  return (
    <main className="flex flex-col min-h-[100dvh] space-y-10 pb-24">
      <BlurFade delay={S}>
        <div className="flex flex-col gap-2">
          <Link href="/" className="text-sm text-muted-foreground hover:underline w-fit">
            ← Home
          </Link>
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">All projects</h1>
          <p className="text-muted-foreground max-w-2xl">
            Everything in the portfolio, including work in progress and archived builds.
          </p>
        </div>
      </BlurFade>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, id) => (
          <BlurFade key={project.slug} delay={S * 2 + id * 0.022}>
            <ProjectCard
              slug={project.slug}
              title={project.title}
              description={project.description}
              tags={project.techStack}
              image={project.coverImage}
              video={project.video}
              projectTag={project.projectTag}
              liveUrl={project.liveUrl}
              dates={project.timeline}
            />
          </BlurFade>
        ))}
      </div>
    </main>
  );
}
