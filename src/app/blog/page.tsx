import BlurFade from "@/components/magicui/blur-fade";
import { getPublishedPosts } from "@/lib/db/blog";
import { resolvePublicUrl } from "@/lib/storage";
import Image from "next/image";
import { Link } from "next-view-transitions";

export const metadata = {
  title: "Blog",
  description: "My thoughts on software development, life, and more.",
};

export const revalidate = 60;

const S = 0.025;

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <section className="mx-auto w-full">
      <BlurFade delay={S}>
        <h1 className="font-medium text-2xl mb-8 tracking-tighter">blog</h1>
      </BlurFade>
      {posts.map((post, id) => {
        const thumb = post.thumbnailImage ? resolvePublicUrl(post.thumbnailImage) : null;
        return (
          <BlurFade delay={S * 2 + id * 0.022} key={post.slug}>
            <Link className="flex flex-col space-y-2 mb-8 border-b pb-6 last:border-0" href={`/blog/${post.slug}`}>
              <div className="flex flex-col md:flex-row gap-4">
                {thumb ? (
                  <div 
                    className="relative w-full md:w-40 h-28 shrink-0 rounded-md overflow-hidden border bg-muted"
                    style={{ viewTransitionName: `blog-image-${post.slug}` }}
                  >
                    <Image src={thumb} alt="" fill className="object-cover" sizes="160px" />
                  </div>
                ) : null}
                <div className="w-full flex flex-col min-w-0">
                  <p className="tracking-tight font-medium">{post.title}</p>
                  <p className="h-6 text-xs text-muted-foreground">
                    {post.publishedAt.toISOString().slice(0, 10)}
                  </p>
                  {post.tags.length > 0 ? (
                    <p className="text-xs text-muted-foreground mt-1">{post.tags.join(" · ")}</p>
                  ) : null}
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{post.summary}</p>
                </div>
              </div>
            </Link>
          </BlurFade>
        );
      })}
    </section>
  );
}
