import { prisma } from "@/lib/prisma";
import { richBodyToDisplayHtml } from "@/lib/html-content";
import { resolvePublicUrl } from "@/lib/storage";

export async function getPublishedPosts() {
  return prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getFeaturedPost() {
  const featured = await prisma.blogPost.findFirst({
    where: { published: true, featured: true },
    orderBy: { publishedAt: "desc" },
  });
  if (featured) return featured;
  return prisma.blogPost.findFirst({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getPostBySlug(slug: string) {
  return prisma.blogPost.findUnique({
    where: { slug },
  });
}


export async function getPostWithHtml(slug: string) {
  const post = await getPostBySlug(slug);
  if (!post || !post.published) return null;
  const html = await richBodyToDisplayHtml(post.body);
  return { post, html };
}

export async function getAllPostsAdmin() {
  return prisma.blogPost.findMany({
    orderBy: { publishedAt: "desc" },
  });
}

export function thumbnailUrl(thumbnailImage: string) {
  return resolvePublicUrl(thumbnailImage);
}
