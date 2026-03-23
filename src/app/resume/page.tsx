import BlurFade from "@/components/magicui/blur-fade";
import { ResumeCard } from "@/components/resume-card";
import { getEducation, getWorkExperience } from "@/lib/db/resume";
import Link from "next/link";

export const revalidate = 60;

const S = 0.025;

export default async function ResumePage() {
  const [work, education] = await Promise.all([getWorkExperience(), getEducation()]);

  return (
    <main className="flex flex-col min-h-[100dvh] space-y-10 max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">My Resume</h1>
        <p className="text-muted-foreground">My professional experience and educational background</p>
      </div>

      <section id="work">
        <div className="flex min-h-0 flex-col gap-y-3">
          <BlurFade delay={S}>
            <h2 className="text-2xl font-bold">Work Experience</h2>
          </BlurFade>
          {work.map((w, id) => (
            <BlurFade key={w.company} delay={S * 2 + id * 0.03}>
              <ResumeCard
                logoUrl={w.logoUrl}
                altText={w.company}
                title={w.company}
                subtitle={w.title}
                href={w.href}
                badges={w.badges}
                period={`${w.startDate} - ${w.endDate ?? "Present"}`}
                description={w.description}
              />
            </BlurFade>
          ))}
        </div>
      </section>

      <section id="education">
        <div className="flex min-h-0 flex-col gap-y-3">
          <BlurFade delay={S * 2}>
            <h2 className="text-2xl font-bold">Education</h2>
          </BlurFade>
          {education.map((ed, id) => (
            <BlurFade key={ed.school} delay={S * 2 + id * 0.03}>
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

      <div className="flex justify-center mt-8">
        <Link href="/" className="text-blue-500 hover:underline">
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}
