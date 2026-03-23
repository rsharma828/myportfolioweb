import { updateProfileAction } from "@/app/admin/actions";
import { RichEditor } from "@/components/admin/rich-editor";
import { AdminMediaField } from "@/components/admin-media-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getProfile } from "@/lib/db/profile";
import { legacyTextToEditorHtml } from "@/lib/html-content";
import { getPublicAssetBaseUrl } from "@/lib/storage";
import { ChevronDown } from "lucide-react";

export const dynamic = "force-dynamic";

type Props = { searchParams: { saved?: string } };

export default async function AdminProfilePage({ searchParams }: Props) {
  const profile = await getProfile();
  if (!profile) {
    return <p>Profile missing — run seed.</p>;
  }

  const assetBaseUrl = getPublicAssetBaseUrl();
  const bioForEditor = profile.bioHtml.trim()
    ? legacyTextToEditorHtml(profile.bioHtml)
    : legacyTextToEditorHtml(profile.description);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a]">
      <form action={updateProfileAction} className="pb-24">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-md">
          <h1 className="text-sm font-medium text-muted-foreground">Profile</h1>
          <Button type="submit" size="sm" className="rounded-full px-6">
            Save
          </Button>
        </header>

        {searchParams.saved ? (
          <p className="mx-auto max-w-[680px] px-4 pt-4 text-sm text-green-600 dark:text-green-400">Saved.</p>
        ) : null}

        <div className="mx-auto w-full max-w-[680px] px-4 pt-10 md:px-6">
          <div className="mb-8 flex flex-wrap gap-4">
            <div className="min-w-[200px] flex-1 space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required defaultValue={profile.name} className="bg-background text-lg" />
            </div>
            <div className="w-28 space-y-2">
              <Label htmlFor="initials">Initials</Label>
              <Input id="initials" name="initials" defaultValue={profile.initials} className="bg-background" />
            </div>
          </div>

          <div className="mb-6 space-y-2">
            <Label htmlFor="description" className="text-muted-foreground">
              Short line (navbar / metadata)
            </Label>
            <Textarea
              id="description"
              name="description"
              rows={2}
              required
              defaultValue={profile.description}
              placeholder="One line for compact contexts"
              className="resize-none border-0 border-b border-border/40 bg-transparent px-0 focus-visible:ring-0"
            />
          </div>

          <section className="mb-12">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">About you</h2>
            <RichEditor
              key="profile-bio"
              id="bio-editor"
              name="bioHtml"
              defaultHtml={bioForEditor}
              uploadPrefix="profile/bio"
              assetBaseUrl={assetBaseUrl}
              variant="medium"
              placeholder="Introduce yourself — drag images into your story…"
            />
          </section>
        </div>

        <div className="mx-auto w-full max-w-[680px] px-4 md:px-6">
          <details className="group rounded-xl border border-border/80 bg-background/60 p-4 shadow-sm">
            <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-medium">
              <ChevronDown className="h-4 w-4 shrink-0 transition group-open:rotate-180" />
              Avatar, site &amp; social links
            </summary>
            <div className="mt-6 space-y-5 border-t border-border/60 pt-6">
              <AdminMediaField
                label="Avatar"
                name="avatarUrl"
                prefix="profile"
                accept="image/*"
                defaultValue={profile.avatarUrl}
              />
              <div className="space-y-2">
                <Label htmlFor="siteUrl">Site URL</Label>
                <Input
                  id="siteUrl"
                  name="siteUrl"
                  type="url"
                  inputMode="url"
                  placeholder="https://yoursite.com"
                  defaultValue={profile.siteUrl}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" defaultValue={profile.location} className="bg-background" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="locationLink">Location link</Label>
                <Input
                  id="locationLink"
                  name="locationLink"
                  type="url"
                  inputMode="url"
                  defaultValue={profile.locationLink}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" defaultValue={profile.email} className="bg-background" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tel">Phone</Label>
                <Input id="tel" name="tel" type="tel" inputMode="tel" defaultValue={profile.tel} className="bg-background" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="socialGithub">GitHub</Label>
                <Input
                  id="socialGithub"
                  name="socialGithub"
                  type="url"
                  inputMode="url"
                  defaultValue={profile.socialGithub}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="socialLinkedin">LinkedIn</Label>
                <Input
                  id="socialLinkedin"
                  name="socialLinkedin"
                  type="url"
                  inputMode="url"
                  defaultValue={profile.socialLinkedin}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="socialX">X</Label>
                <Input id="socialX" name="socialX" type="url" inputMode="url" defaultValue={profile.socialX} className="bg-background" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="socialYoutube">YouTube</Label>
                <Input
                  id="socialYoutube"
                  name="socialYoutube"
                  type="url"
                  inputMode="url"
                  defaultValue={profile.socialYoutube}
                  className="bg-background"
                />
              </div>
            </div>
          </details>
        </div>
      </form>
    </div>
  );
}
