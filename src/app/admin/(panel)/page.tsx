import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [projectCount, postCount] = await Promise.all([
    prisma.project.count(),
    prisma.blogPost.count(),
  ]);

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 pt-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-muted-foreground text-sm">Manage portfolio content stored in Neon + uploads in R2.</p>
      <p className="text-xs text-muted-foreground border rounded-md p-3 bg-muted/30">
        <strong className="text-foreground">Not in admin yet:</strong> resume (work / education), skills, and services —
        those still come from <code className="text-[11px]">pnpm db:seed</code> / DB migrations. Profile, projects, and blog
        match the forms below.
      </p>
      <ul className="grid gap-4 sm:grid-cols-2">
        <li className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Projects</p>
          <p className="text-3xl font-bold">{projectCount}</p>
          <Link href="/admin/projects" className="text-sm text-primary underline mt-2 inline-block">
            Manage →
          </Link>
        </li>
        <li className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Blog posts</p>
          <p className="text-3xl font-bold">{postCount}</p>
          <Link href="/admin/blog" className="text-sm text-primary underline mt-2 inline-block">
            Manage →
          </Link>
        </li>
      </ul>
    </div>
  );
}
