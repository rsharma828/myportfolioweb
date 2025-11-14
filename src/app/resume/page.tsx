"use client";

import BlurFade from "@/components/magicui/blur-fade";
import { ResumeCard } from "@/components/resume-card";
import { DATA } from "@/data/resume";
import Link from "next/link";

const BLUR_FADE_DELAY = 0.04;

export default function ResumePage() {
  return (
    <main className="flex flex-col min-h-[100dvh] space-y-6 sm:space-y-8 md:space-y-10 max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">My Resume</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          My professional experience
        </p>
      </div>

      <section id="work">
        <div className="flex min-h-0 flex-col gap-y-3 sm:gap-y-4">
          <BlurFade delay={BLUR_FADE_DELAY}>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 sm:mb-6">Work Experience</h2>
          </BlurFade>
          {DATA.work.map((work, id) => (
            <BlurFade
              key={work.company}
              delay={BLUR_FADE_DELAY * 2 + id * 0.05}
            >
              <ResumeCard
                key={work.company}
                logoUrl={work.logoUrl}
                altText={work.company}
                title={work.company}
                subtitle={work.title}
                href={work.href}
                badges={work.badges}
                period={`${work.start} - ${work.end ?? "Present"}`}
                description={work.description}
              />
            </BlurFade>
          ))}
        </div>
      </section>

      <div className="flex justify-center mt-6 sm:mt-8 pb-20 sm:pb-24">
        <Link href="/" className="text-sm sm:text-base text-blue-500 hover:underline">
          ← Back to Home
        </Link>
      </div>
    </main>
  );
} 