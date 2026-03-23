import { getFeaturedPost } from "@/lib/db/blog";
import { resolvePublicUrl } from "@/lib/storage";
import BlurFade from "@/components/magicui/blur-fade";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import Image from "next/image";
import { Link } from "next-view-transitions";

const BLUR_FADE_DELAY = 0.025;

/** Fixed thumbnail column on md+ so layout stays stable with or without an image */
const THUMB_COL =
  "relative w-full md:w-[min(280px,38%)] shrink-0 h-44 sm:h-48 md:h-auto md:min-h-[180px]";

export async function FeaturedBlog() {
  const post = await getFeaturedPost();
  if (!post) return null;

  const excerpt =
    post.summary.length > 220 ? `${post.summary.slice(0, 220).trim()}…` : post.summary;
  const thumb = post.thumbnailImage ? resolvePublicUrl(post.thumbnailImage) : null;

  return (
    <section id="featured-blog" className="pt-4 pb-1 max-w-5xl mx-auto px-6">
      <BlurFade delay={BLUR_FADE_DELAY * 2}>
        <div className="flex flex-col items-center justify-center space-y-2 text-center mb-4">
          <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
            From the blog
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Featured post</h2>
        </div>
      </BlurFade>
      <BlurFade delay={BLUR_FADE_DELAY * 2.5}>
        <div className="border rounded-xl overflow-hidden flex flex-col md:flex-row gap-0 hover:shadow-md transition-shadow relative group">
          <Link href={`/blog/${post.slug}`} className="absolute inset-0 z-10" aria-label={`Read ${post.title}`} />
          <div className={THUMB_COL} style={{ viewTransitionName: `blog-image-${post.slug}` }}>
            {thumb ? (
              <Image
                src={thumb}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 280px"
                priority
              />
            ) : (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted/60 text-muted-foreground"
                aria-hidden
              >
                <FileText className="size-10 opacity-50" />
                <span className="text-xs font-medium opacity-70">No cover image</span>
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center p-6 md:p-8 flex-1 text-left min-w-0">
            <p className="text-xs text-muted-foreground mb-2">
              {post.publishedAt.toISOString().slice(0, 10)}
            </p>
            <h3 className="text-xl font-semibold tracking-tight mb-3">{post.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">{excerpt}</p>
            <div className="relative z-20 pointer-events-none">
              <Link href={`/blog/${post.slug}`} className="pointer-events-auto">
                <Button variant="outline" size="sm" className="w-fit">
                  Read more
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </BlurFade>
    </section>
  );
}
