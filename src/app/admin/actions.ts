"use server";

import { loginAdmin, logoutAdmin, requireAdminSession } from "@/lib/auth";
import {
  extractFirstImgSrcFromHtml,
  extractFirstVideoSrcFromHtml,
  isRichHtmlEmpty,
} from "@/lib/html-content";
import { formatProjectTimelineFromDates } from "@/lib/project-timeline";
import { prisma } from "@/lib/prisma";
import { ProjectStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 96);
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");
  const ok = await loginAdmin(email, password);
  if (!ok) {
    redirect(`/admin/login?error=1&next=${encodeURIComponent(next)}`);
  }
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logoutAction() {
  await logoutAdmin();
  redirect("/admin/login");
}

export async function uploadFileAction(formData: FormData) {
  await requireAdminSession();
  const { uploadFile } = await import("@/lib/storage");
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) throw new Error("No file");
  const buf = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split(".").pop() || "bin";
  const prefix = String(formData.get("prefix") ?? "uploads");
  const key = `${prefix.replace(/\/$/, "")}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  await uploadFile(buf, key, file.type || "application/octet-stream");
  return key;
}

export async function upsertProjectAction(formData: FormData) {
  await requireAdminSession();
  const existingSlug = String(formData.get("existingSlug") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) throw new Error("Title required");
  let slug = String(formData.get("slug") ?? "").trim() || slugify(title);
  slug = slugify(slug);

  const statusRaw = String(formData.get("status") ?? "LIVE");
  const status = (["LIVE", "ARCHIVED", "WIP"] as const).includes(statusRaw as "LIVE" | "ARCHIVED" | "WIP")
    ? (statusRaw as ProjectStatus)
    : ProjectStatus.LIVE;

  const body = String(formData.get("body") ?? "");
  let coverImage = String(formData.get("coverImage") ?? "").trim();
  let video = String(formData.get("video") ?? "").trim();
  if (!coverImage) coverImage = extractFirstImgSrcFromHtml(body) || "";
  if (!video) video = extractFirstVideoSrcFromHtml(body) || "";

  const data = {
    title,
    slug,
    tagline: String(formData.get("tagline") ?? ""),
    description: String(formData.get("description") ?? ""),
    body,
    projectTag: String(formData.get("projectTag") ?? ""),
    coverImage,
    video,
    gallery: String(formData.get("gallery") ?? "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    techStack: String(formData.get("techStack") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    role: String(formData.get("role") ?? ""),
    timeline: formatProjectTimelineFromDates(
      String(formData.get("timelineStart") ?? "").trim(),
      String(formData.get("timelineEnd") ?? "").trim(),
    ),
    liveUrl: String(formData.get("liveUrl") ?? ""),
    repoUrl: String(formData.get("repoUrl") ?? ""),
    challenge: String(formData.get("challenge") ?? ""),
    solution: String(formData.get("solution") ?? ""),
    outcome: String(formData.get("outcome") ?? ""),
    status,
    featured: formData.get("featured") === "on",
    sortOrder: Number(formData.get("sortOrder") ?? 0) || 0,
  };

  if (existingSlug) {
    await prisma.project.update({
      where: { slug: existingSlug },
      data,
    });
  } else {
    await prisma.project.create({ data });
  }

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${slug}`);
  if (existingSlug && existingSlug !== slug) {
    revalidatePath(`/projects/${existingSlug}`);
  }
  redirect("/admin/projects");
}

export async function deleteProjectAction(formData: FormData) {
  await requireAdminSession();
  const slug = String(formData.get("slug") ?? "");
  if (!slug) throw new Error("Missing slug");
  await prisma.project.delete({ where: { slug } });
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${slug}`);
  redirect("/admin/projects");
}

export async function upsertBlogPostAction(formData: FormData) {
  await requireAdminSession();
  const existingSlug = String(formData.get("existingSlug") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) throw new Error("Title required");
  let slug = String(formData.get("slug") ?? "").trim() || slugify(title);
  slug = slugify(slug);
  const publishedRaw = String(formData.get("publishedAt") ?? "").trim();
  const publishedAt = publishedRaw ? new Date(publishedRaw) : new Date();
  if (Number.isNaN(publishedAt.getTime())) {
    throw new Error("Invalid published date");
  }
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const body = String(formData.get("body") ?? "");
  if (isRichHtmlEmpty(body)) {
    throw new Error("Post body cannot be empty");
  }

  let thumbnailImage = String(formData.get("thumbnailImage") ?? "").trim();
  if (!thumbnailImage) {
    thumbnailImage = extractFirstImgSrcFromHtml(body) || "";
  }

  const data = {
    title,
    slug,
    summary: String(formData.get("summary") ?? ""),
    body,
    thumbnailImage,
    publishedAt,
    tags,
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
  };

  if (existingSlug) {
    await prisma.blogPost.update({
      where: { slug: existingSlug },
      data,
    });
  } else {
    await prisma.blogPost.create({ data });
  }

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  if (existingSlug && existingSlug !== slug) {
    revalidatePath(`/blog/${existingSlug}`);
  }
  redirect("/admin/blog");
}

export async function deleteBlogPostAction(formData: FormData) {
  await requireAdminSession();
  const slug = String(formData.get("slug") ?? "");
  await prisma.blogPost.delete({ where: { slug } });
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  redirect("/admin/blog");
}

export async function updateProfileAction(formData: FormData) {
  await requireAdminSession();
  await prisma.profile.update({
    where: { id: "singleton" },
    data: {
      name: String(formData.get("name") ?? ""),
      initials: String(formData.get("initials") ?? ""),
      siteUrl: String(formData.get("siteUrl") ?? ""),
      description: String(formData.get("description") ?? ""),
      bioHtml: String(formData.get("bioHtml") ?? ""),
      avatarUrl: String(formData.get("avatarUrl") ?? ""),
      location: String(formData.get("location") ?? ""),
      locationLink: String(formData.get("locationLink") ?? ""),
      email: String(formData.get("email") ?? ""),
      tel: String(formData.get("tel") ?? ""),
      socialGithub: String(formData.get("socialGithub") ?? ""),
      socialLinkedin: String(formData.get("socialLinkedin") ?? ""),
      socialX: String(formData.get("socialX") ?? ""),
      socialYoutube: String(formData.get("socialYoutube") ?? ""),
    },
  });
  revalidatePath("/");
  redirect("/admin/profile?saved=1");
}
