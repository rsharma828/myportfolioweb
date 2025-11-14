"use client";

import { HackathonCard } from "@/components/hackathon-card";
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { ProjectCard } from "@/components/project-card";
import { ResumeCard } from "@/components/resume-card";
import { IntelligentGridLayout } from "@/components/intelligent-grid-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DATA } from "@/data/resume";
import Link from "next/link";
import Markdown from "react-markdown";
import { useState } from "react";

const BLUR_FADE_DELAY = 0.04;

// Define types for the project data
interface ProjectLink {
  type: string;
  href: string;
  icon: React.ReactNode;
}

// Use a more generic type that can accept readonly properties
type Project = {
  title: string;
  href: string;
  dates: string;
  active?: boolean;
  description: string;
  technologies: readonly string[] | string[];
  links: readonly ProjectLink[] | ProjectLink[];
  image?: string;
  video?: string;
  projectTag: string;
};

// Define props interface for ProjectsSection
interface ProjectsSectionProps {
  projects: readonly Project[] | Project[];
}

export default function Page() {
  return (
    <main className="flex flex-col min-h-[100dvh] space-y-10 max-w-5xl mx-auto py-12 sm:py-24 px-6">
      <section id="hero">
        <div className="mx-auto w-full max-w-2xl space-y-8">
          <div className="gap-2 flex justify-between">
            <div className="flex-col flex flex-1 space-y-1.5">
              <BlurFadeText
                delay={BLUR_FADE_DELAY}
                className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                yOffset={8}
                text={`Hi, I'm ${DATA.name.split(" ")[0]} 👋`}
              />
              <BlurFadeText
                className="max-w-[600px] md:text-xl"
                delay={BLUR_FADE_DELAY}
                text={DATA.description}
              />
            </div>
            <BlurFade delay={BLUR_FADE_DELAY}>
              <Avatar className="size-28 border">
                <AvatarImage alt={DATA.name} src={DATA.avatarUrl} />
                <AvatarFallback>{DATA.initials}</AvatarFallback>
              </Avatar>
            </BlurFade>
          </div>
        </div>
      </section>

      <section id="projects" className="py-12">
        <div className="space-y-12 w-full">
          <BlurFade delay={BLUR_FADE_DELAY * 3}>
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                  My Projects
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Check out my latest work
                </h2>
                <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed max-w-3xl mx-auto">
                  I&apos;ve created compelling video content across various
                  genres, from commercial videos to music videos and
                  documentaries. Here are some of my recent projects.
                </p>
              </div>
            </div>
          </BlurFade>

          <ProjectsSection
            projects={DATA.projects as unknown as readonly Project[]}
          />
        </div>
      </section>

      <section id="skills" className="w-full max-w-5xl mx-auto px-6">
        <div className="flex min-h-0 flex-col gap-y-6">
          <BlurFade delay={BLUR_FADE_DELAY * 7}>
            <h2 className="text-2xl font-bold mb-4">Skills</h2>
          </BlurFade>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(DATA.skillCategories).map(
              ([category, skills], categoryIndex) => (
                <BlurFade
                  key={category}
                  delay={BLUR_FADE_DELAY * 8 + categoryIndex * 0.1}
                >
                  <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-semibold mb-3">{category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {(skills as readonly string[]).map(
                        (skill, skillIndex) => (
                          <BlurFade
                            key={skill}
                            delay={BLUR_FADE_DELAY * 9 + skillIndex * 0.05}
                          >
                            <Badge className="px-3 py-1 text-sm" key={skill}>
                              {skill}
                            </Badge>
                          </BlurFade>
                        )
                      )}
                    </div>
                  </div>
                </BlurFade>
              )
            )}
          </div>
        </div>
      </section>

      <section id="services" className="py-8 sm:py-12 md:py-16 w-full">
        <div className="space-y-8 sm:space-y-12 w-full">
          <BlurFade delay={BLUR_FADE_DELAY * 16}>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-3 sm:space-y-4">
                <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-xs sm:text-sm">
                  My Services
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter">
                  Video Editing Services
                </h2>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-[90%] sm:max-w-3xl mx-auto leading-relaxed">
                  I offer professional video editing services to transform your
                  raw footage into compelling visual stories that captivate your
                  audience.
                </p>
              </div>
            </div>
          </BlurFade>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-6 sm:mt-8 md:mt-10">
            <BlurFade delay={BLUR_FADE_DELAY * 17.2}>
              <div className="border rounded-lg p-4 sm:p-6 md:p-8 hover:shadow-md transition-shadow text-center">
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                  Corporate Videos
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                  Professional corporate videos including documentaries,
                  training videos, and company profiles with multi-camera
                  editing and professional narration.
                </p>
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
                  <p className="font-semibold text-foreground text-sm sm:text-base">
                    ₹1,000 onwards
                  </p>
                </div>
              </div>
            </BlurFade>

            <BlurFade delay={BLUR_FADE_DELAY * 17.3}>
              <div className="border rounded-lg p-4 sm:p-6 md:p-8 hover:shadow-md transition-shadow text-center">
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                  Social Media Content
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                  Short-form video content optimized for Instagram Reels,
                  TikTok, YouTube Shorts with engaging transitions and motion
                  graphics.
                </p>
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
                  <p className="font-semibold text-foreground text-sm sm:text-base">
                    ₹500 onwards
                  </p>
                </div>
              </div>
            </BlurFade>

            <BlurFade delay={BLUR_FADE_DELAY * 17.5}>
              <div className="border rounded-lg p-4 sm:p-6 md:p-8 hover:shadow-md transition-shadow text-center sm:col-span-2 lg:col-span-1">
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                  Motion Graphics & Animation
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                  Custom motion graphics, animated intros, title sequences, and
                  2D animations for videos, presentations, and brand identity.
                </p>
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
                  <p className="font-semibold text-foreground text-sm sm:text-base">
                    ₹200/sec onwards
                  </p>
                </div>
              </div>
            </BlurFade>
          </div>

          <div className="flex justify-center mt-8 sm:mt-10 md:mt-12">
            <BlurFade delay={BLUR_FADE_DELAY * 18}>
              <Link
                href={`https://wa.me/${DATA.contact.tel.replace(
                  /[^0-9]/g,
                  ""
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-green-600 hover:bg-green-700 px-4 sm:px-6 md:px-8 py-2 sm:py-3 text-sm sm:text-base">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    fill="currentColor"
                    className="bi bi-whatsapp mr-2 sm:w-4 sm:h-4"
                    viewBox="0 0 16 16"
                  >
                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                  </svg>
                  <span className="hidden sm:inline">
                    Contact Me on WhatsApp
                  </span>
                  <span className="sm:hidden">WhatsApp</span>
                </Button>
              </Link>
            </BlurFade>
          </div>
        </div>
      </section>

      <section id="contact" className="py-8 sm:py-12 md:py-16 w-full">
        <div className="grid items-center justify-center gap-4 text-center w-full">
          <BlurFade delay={BLUR_FADE_DELAY * 19}>
            <div className="space-y-4 sm:space-y-6">
              <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-xs sm:text-sm">
                <div>Contact</div>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter">
                Get in Touch
              </h2>
              <p className="mx-auto max-w-[90%] sm:max-w-[700px] text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed">
                Have a video project in mind? Let&apos;s discuss how I can bring
                your vision to life. Reach out via{" "}
                <Link
                  href={DATA.contact.social.Instagram.url}
                  className="text-blue-500 hover:underline"
                >
                  Instagram
                </Link>{" "}
                or{" "}
                <Link
                  href={`mailto:${DATA.contact.email}`}
                  className="text-blue-500 hover:underline"
                >
                  Email
                </Link>{" "}
                and I&apos;ll get back to you as soon as possible.
              </p>
              <div className="mt-4 sm:mt-6">
                <Link
                  href={`https://wa.me/${DATA.contact.tel.replace(
                    /[^0-9]/g,
                    ""
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-green-600 hover:bg-green-700 px-4 sm:px-6 md:px-8 py-2 sm:py-3 text-sm sm:text-base">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      fill="currentColor"
                      className="bi bi-whatsapp mr-2 sm:w-4 sm:h-4"
                      viewBox="0 0 16 16"
                    >
                      <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                    </svg>
                    <span className="hidden sm:inline">
                      Contact Me on WhatsApp
                    </span>
                    <span className="sm:hidden">WhatsApp</span>
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

function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [showAll, setShowAll] = useState(false);
  // Calculate projects needed for exactly 3 rows in 3-column grid
  // Portrait videos span 2 rows, landscape span 1 row
  // Worst case (all landscape): 3 rows × 3 columns = 9 projects
  // Best case with portraits: 1 portrait (rows 1-2) + 2 landscape (row 1) + 2 landscape (row 2) + 3 landscape (row 3) = 8 projects
  // To ensure exactly 3 rows are filled, we use 8 projects (conservative)
  // This accounts for portrait videos taking 2 row spaces
  const INITIAL_DISPLAY_COUNT = 8;
  const displayedProjects = showAll
    ? projects
    : projects.slice(0, INITIAL_DISPLAY_COUNT);

  return (
    <>
      <IntelligentGridLayout>
        {displayedProjects.map((project, id: number) => (
          <BlurFade key={project.title} delay={BLUR_FADE_DELAY * 4 + id * 0.05}>
            <ProjectCard
              href={project.href}
              key={project.title}
              title={project.title}
              description={project.description}
              tags={project.technologies}
              image={project.image}
              video={project.video}
              links={project.links}
              projectTag={project.projectTag}
              forceRotate={id === 0} // Force rotate only the first video (Showreel)
            />
          </BlurFade>
        ))}
      </IntelligentGridLayout>

      {projects.length > INITIAL_DISPLAY_COUNT && (
        <div className="flex justify-center mt-8 sm:mt-10 md:mt-12">
          <Button
            onClick={() => setShowAll(!showAll)}
            variant="outline"
            className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 text-sm sm:text-base"
          >
            {showAll ? "Show Less" : "Show More Projects"}
          </Button>
        </div>
      )}
    </>
  );
}
