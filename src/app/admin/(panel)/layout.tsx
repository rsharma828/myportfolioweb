import { logoutAction } from "@/app/admin/actions";
import { getAdminSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session.isLoggedIn) {
    redirect("/admin/login");
  }

  return (
    <>
      <header className="border-b bg-card">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3 justify-between">
          <nav className="flex flex-wrap gap-3 text-sm">
            <Link href="/admin" className="font-semibold">
              Dashboard
            </Link>
            <Link href="/admin/projects" className="text-muted-foreground hover:text-foreground">
              Projects
            </Link>
            <Link href="/admin/blog" className="text-muted-foreground hover:text-foreground">
              Blog
            </Link>
            <Link href="/admin/profile" className="text-muted-foreground hover:text-foreground">
              Profile
            </Link>
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              View site
            </Link>
          </nav>
          <form action={logoutAction}>
            <Button type="submit" variant="outline" size="sm">
              Log out
            </Button>
          </form>
        </div>
      </header>
      {/* Full-width composers (Medium-style); inner pages set their own max-width */}
      <div className="w-full pb-12">{children}</div>
    </>
  );
}
