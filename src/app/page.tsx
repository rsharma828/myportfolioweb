import { FeaturedBlog } from "@/components/featured-blog";
import { HomePageClient } from "@/components/home-page-client";
import { processHtmlForDisplay } from "@/lib/html-content";
import { getProfile } from "@/lib/db/profile";
import { getProjectsForHome } from "@/lib/db/projects";
import { getEducation, getServices, getSkillCategories, getWorkExperience } from "@/lib/db/resume";

export const revalidate = 60;

export default async function Page() {
  const [profile, projects, skillCategories, services, work, education] = await Promise.all([
    getProfile(),
    getProjectsForHome(),
    getSkillCategories(),
    getServices(),
    getWorkExperience(),
    getEducation(),
  ]);

  if (!profile) {
    throw new Error("Profile not seeded — run pnpm db:seed");
  }

  return (
    <HomePageClient
      profile={{
        name: profile.name,
        description: profile.description,
        bioHtmlRendered:
          profile.bioHtml.trim().length > 0 ? processHtmlForDisplay(profile.bioHtml) : null,
        avatarUrl: profile.avatarUrl,
        initials: profile.initials,
      }}
      projects={projects.map((p) => ({
        slug: p.slug,
        title: p.title,
        description: p.description,
        projectTag: p.projectTag,
        techStack: p.techStack,
        coverImage: p.coverImage,
        video: p.video,
        liveUrl: p.liveUrl,
        timeline: p.timeline,
      }))}
      skillCategories={skillCategories.map((c) => ({ name: c.name, skills: c.skills }))}
      services={services.map((s) => ({ title: s.title, description: s.description, price: s.price }))}
      workExperience={work.map((w) => ({
        id: w.id,
        company: w.company,
        title: w.title,
        href: w.href,
        logoUrl: w.logoUrl,
        description: w.description,
        startDate: w.startDate,
        endDate: w.endDate,
        badges: w.badges,
      }))}
      education={education.map((e) => ({
        id: e.id,
        school: e.school,
        degree: e.degree,
        href: e.href,
        logoUrl: e.logoUrl,
        startDate: e.startDate,
        endDate: e.endDate,
      }))}
      contact={{ email: profile.email, twitterUrl: profile.socialX }}
    >
      <FeaturedBlog />
    </HomePageClient>
  );
}
