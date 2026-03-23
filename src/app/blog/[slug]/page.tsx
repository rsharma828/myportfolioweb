import { getPostWithHtml } from "@/lib/db/blog";
import { getProfile } from "@/lib/db/profile";
import { resolvePublicUrl } from "@/lib/storage";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export const revalidate = 60;

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata | undefined> {
  const result = await getPostWithHtml(params.slug);
  if (!result) return { title: "Post" };

  const { post } = result;
  const profile = await getProfile();
  const base = profile?.siteUrl ?? "http://localhost:3000";
  const thumb = post.thumbnailImage ? resolvePublicUrl(post.thumbnailImage) : null;
  const ogImage = thumb ?? `${base}/og?title=${encodeURIComponent(post.title)}`;

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.publishedAt.toISOString(),
      url: `${base}/blog/${post.slug}`,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const result = await getPostWithHtml(params.slug);
  if (!result) notFound();

  const { post, html } = result;
  const profile = await getProfile();
  const base = profile?.siteUrl ?? "http://localhost:3000";
  const thumb = post.thumbnailImage ? resolvePublicUrl(post.thumbnailImage) : null;

  return (
    <section id="blog" className="max-w-[650px] mx-auto w-full">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            datePublished: post.publishedAt.toISOString(),
            dateModified: post.updatedAt.toISOString(),
            description: post.summary,
            image: thumb ?? `${base}/og?title=${encodeURIComponent(post.title)}`,
            url: `${base}/blog/${post.slug}`,
            author: profile
              ? {
                  "@type": "Person",
                  name: profile.name,
                }
              : undefined,
          }),
        }}
      />

      {thumb ? (
        <div 
          className="relative w-full aspect-video mb-8 rounded-lg overflow-hidden border"
          style={{ viewTransitionName: `blog-image-${post.slug}` }}
        >
          <Image src={thumb} alt="" fill className="object-cover" priority sizes="(max-width:768px) 100vw, 650px" />
        </div>
      ) : null}

      <h1 className="title font-medium text-2xl tracking-tighter">{post.title}</h1>
      <div className="flex flex-wrap gap-2 mt-3 mb-2 text-xs text-muted-foreground">
        {post.tags.map((t) => (
          <span key={t} className="rounded-md border px-2 py-0.5">
            {t}
          </span>
        ))}
      </div>
      <div className="flex justify-between items-center mt-2 mb-8 text-sm">
        <Suspense fallback={<p className="h-5" />}>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {formatDate(post.publishedAt.toISOString())}
          </p>
        </Suspense>
      </div>
      <article className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
    </section>
  );
}
