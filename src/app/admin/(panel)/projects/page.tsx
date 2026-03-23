import { deleteProjectAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { getAllProjectsAdmin } from "@/lib/db/projects";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await getAllProjectsAdmin();

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 pt-6">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <Button asChild>
          <Link href="/admin/projects/new">New project</Link>
        </Button>
      </div>
      <ul className="border rounded-lg divide-y">
        {projects.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="font-medium">{p.title}</p>
              <p className="text-xs text-muted-foreground">{p.slug}</p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href={`/admin/projects/${p.slug}/edit`}>Edit</Link>
              </Button>
              <form action={deleteProjectAction}>
                <input type="hidden" name="slug" value={p.slug} />
                <Button type="submit" variant="destructive" size="sm">
                  Delete
                </Button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
