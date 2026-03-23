"use client";

import type React from "react";
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { ProjectCard } from "@/components/project-card";
import { ResumeCard } from "@/components/resume-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "next-view-transitions";
import { useState } from "react";

/** Small stagger between siblings — keep low so scroll content appears quickly */
const S = 0.025;

export type HomeProject = {
  slug: string;
  title: string;
  description: string;
  projectTag: string;
  techStack: string[];
  coverImage: string;
  video: string;
  liveUrl: string;
  timeline: string;
};

type SkillCategory = { name: string; skills: string[] };
type Service = { title: string; description: string; price: string };

export type HomeWorkExperience = {
  id: string;
  company: string;
  title: string;
  href: string;
  logoUrl: string;
  description: string;
  startDate: string;
  endDate: string;
  badges: string[];
};

export type HomeEducation = {
  id: string;
  school: string;
  degree: string;
  href: string;
  logoUrl: string;
  startDate: string;
  endDate: string;
};

type Props = {
  profile: {
    name: string;
    description: string;
    /** Sanitized HTML for hero when `bioHtml` is set in DB */
    bioHtmlRendered: string | null;
    avatarUrl: string;
    initials: string;
  };
  projects: HomeProject[];
  skillCategories: SkillCategory[];
  services: Service[];
  workExperience: HomeWorkExperience[];
  education: HomeEducation[];
  contact: {
    email: string;
    twitterUrl: string;
  };
  /** Server components (e.g. featured blog) rendered after Hero, before Projects */
  children?: React.ReactNode;
};

export function HomePageClient({
  profile,
  projects,
  skillCategories,
  services,
  workExperience,
  education,
  contact,
  children,
}: Props) {
  return (
    <main className="flex flex-col min-h-[100dvh] space-y-10">
      <section id="hero">
        <div className="mx-auto w-full max-w-2xl space-y-8">
          <div className="gap-2 flex justify-between">
            <div className="flex-col flex flex-1 space-y-1.5">
              <BlurFadeText
                delay={S}
                className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                yOffset={6}
                text={`Hi, I'm ${profile.name.split(" ")[0]} 👋`}
              />
              {profile.bioHtmlRendered ? (
                <BlurFade delay={S * 1.5} className="max-w-[600px] md:text-xl">
                  <div
                    className="prose dark:prose-invert max-w-[600px] md:text-xl prose-p:leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: profile.bioHtmlRendered }}
                  />
                </BlurFade>
              ) : (
                <BlurFadeText
                  className="max-w-[600px] md:text-xl"
                  delay={S * 1.5}
                  text={profile.description}
                />
              )}
            </div>
            <BlurFade inView={false} delay={S}>
              <Avatar className="size-28 border">
                <AvatarImage alt={profile.name} src={profile.avatarUrl} />
                <AvatarFallback>{profile.initials}</AvatarFallback>
              </Avatar>
            </BlurFade>
          </div>
        </div>
      </section>

      {children}

      <section id="projects" className="!mt-3 pt-3 pb-12">
        <div className="space-y-12 w-full">
          <BlurFade delay={S * 2}>
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                  My Projects
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Check out my latest work
                </h2>
                <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed max-w-3xl mx-auto">
                  I&apos;ve worked on a variety of projects, from simple websites to complex web applications. Here are a few of my
                  favorites.
                </p>
              </div>
            </div>
          </BlurFade>

          <ProjectsSection projects={projects} />
        </div>
      </section>

      {(workExperience.length > 0 || education.length > 0) && (
        <div className="w-full max-w-4xl mx-auto px-6 space-y-14 pb-4">
          {workExperience.length > 0 && (
            <section id="work">
              <div className="flex min-h-0 flex-col gap-y-3">
                <BlurFade delay={S * 2}>
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-2">
                    <h2 className="text-2xl font-bold">Work experience</h2>
                    <Link href="/resume" className="text-sm text-muted-foreground hover:text-foreground hover:underline">
                      Full resume →
                    </Link>
                  </div>
                </BlurFade>
                {workExperience.map((w, id) => (
                  <BlurFade key={w.id} delay={S * 2 + id * 0.03}>
                    <ResumeCard
                      logoUrl={w.logoUrl}
                      altText={w.company}
                      title={w.company}
                      subtitle={w.title}
                      href={w.href}
                      badges={w.badges}
                      period={`${w.startDate} - ${w.endDate || "Present"}`}
                      description={w.description}
                    />
                  </BlurFade>
                ))}
              </div>
            </section>
          )}

          {education.length > 0 && (
            <section id="education">
              <div className="flex min-h-0 flex-col gap-y-3">
                <BlurFade delay={S * 2}>
                  <h2 className="text-2xl font-bold mb-2">Education</h2>
                </BlurFade>
                {education.map((ed, id) => (
                  <BlurFade key={ed.id} delay={S * 2 + id * 0.03}>
                    <ResumeCard
                      href={ed.href}
                      logoUrl={ed.logoUrl}
                      altText={ed.school}
                      title={ed.school}
                      period={`${ed.startDate} - ${ed.endDate}`}
                      description={ed.degree}
                    />
                  </BlurFade>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      <section id="skills" className="w-full max-w-5xl mx-auto px-6">
        <div className="flex min-h-0 flex-col gap-y-6">
          <BlurFade delay={S * 2}>
            <h2 className="text-2xl font-bold mb-4">Skills</h2>
          </BlurFade>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skillCategories.map((category, categoryIndex) => (
              <BlurFade key={category.name} delay={S * 2 + categoryIndex * 0.04}>
                <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold mb-3">{category.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <Badge className="px-3 py-1 text-sm" key={skill}>
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="py-16">
        <div className="space-y-12 w-full">
          <BlurFade delay={S * 2}>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                  My Services
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What I Can Build For You</h2>
                <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed max-w-3xl mx-auto">
                  I offer professional web development services to help bring your ideas to life.
                </p>
              </div>
            </div>
          </BlurFade>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1500px] mx-auto px-6 mt-10">
            {services.map((service, i) => (
              <BlurFade key={service.title} delay={S * 2 + i * 0.04}>
                <div className="border rounded-lg p-8 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                  <div className="mt-4 pt-4 border-t">
                    <p className="font-semibold text-foreground">{service.price}</p>
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <BlurFade delay={S * 3}>
              <Link href="https://wa.me/919973370694" target="_blank" rel="noopener noreferrer">
                <Button className="bg-green-600 hover:bg-green-700 px-8 py-2 text-base">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-whatsapp mr-2"
                    viewBox="0 0 16 16"
                  >
                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                  </svg>
                  Contact Me on WhatsApp
                </Button>
              </Link>
            </BlurFade>
          </div>
        </div>
      </section>

      <section id="contact" className="py-16">
        <div className="grid items-center justify-center gap-4 px-6 text-center md:px-6 w-full">
          <BlurFade delay={S * 2}>
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                <div>Contact</div>
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Get in Touch</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Want to chat? Just shoot me a dm{" "}
                <Link href={contact.twitterUrl} className="text-blue-500 hover:underline">
                  with a direct question on twitter
                </Link>{" "}
                or{" "}
                <Link href={`mailto:${contact.email}`} className="text-blue-500">
                  Gmail
                </Link>{" "}
                and I&apos;ll respond whenever I can. I will ignore all soliciting.
              </p>
              <div className="mt-6">
                <Link href="https://wa.me/919973370694" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-green-600 hover:bg-green-700 px-8 py-2 text-base">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-whatsapp mr-2"
                      viewBox="0 0 16 16"
                    >
                      <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                    </svg>
                    Contact Me on WhatsApp
                  </Button>
                </Link>
              </div>
            </div>
          </BlurFade>
        </div>
      </section>
    </main>
  );
}

function ProjectsSection({ projects }: { projects: HomeProject[] }) {
  const [showAll, setShowAll] = useState(false);
  const displayedProjects = showAll ? projects : projects.slice(0, 9);

  return (
    <>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-[1500px] mx-auto px-6">
        {displayedProjects.map((project, id: number) => (
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

      {projects.length > 9 && (
        <div className="flex justify-center mt-12">
          <Button onClick={() => setShowAll(!showAll)} variant="outline" className="px-8 py-2 text-base">
            {showAll ? "Show Less" : "Show More Projects"}
          </Button>
        </div>
      )}
    </>
  );
}
