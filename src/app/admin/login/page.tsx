import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "@/app/admin/actions";
import Link from "next/link";

type Props = { searchParams: { error?: string; next?: string } };

export default function AdminLoginPage({ searchParams }: Props) {
  const next = searchParams.next ?? "/admin";
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6 border rounded-xl p-8 shadow-sm">
        <div>
          <h1 className="text-2xl font-semibold">Admin login</h1>
          <p className="text-sm text-muted-foreground mt-1">Email and password only.</p>
        </div>
        {searchParams.error ? (
          <p className="text-sm text-destructive">Invalid email or password.</p>
        ) : null}
        <form action={loginAction} className="space-y-4">
          <input type="hidden" name="next" value={next} />
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required autoComplete="current-password" />
          </div>
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
        <Link href="/" className="block text-center text-sm text-muted-foreground hover:underline">
          ← Back to site
        </Link>
      </div>
    </div>
  );
}
