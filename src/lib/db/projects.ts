import { prisma } from "@/lib/prisma";
import type { ProjectStatus, Prisma } from "@prisma/client";

export async function getProjectsForHome() {
  return prisma.project.findMany({
    where: { status: { not: "ARCHIVED" } },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { title: "asc" }],
  });
}

export async function getProjectBySlug(slug: string) {
  return prisma.project.findUnique({
    where: { slug },
  });
}

export async function getAllProjectsAdmin() {
  return prisma.project.findMany({
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
  });
}

export async function createProject(data: Prisma.ProjectCreateInput) {
  return prisma.project.create({ data });
}

export async function updateProject(slug: string, data: Prisma.ProjectUpdateInput) {
  return prisma.project.update({
    where: { slug },
    data,
  });
}

export async function deleteProjectBySlug(slug: string) {
  return prisma.project.delete({ where: { slug } });
}

export { ProjectStatus };
