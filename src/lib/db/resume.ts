import { prisma } from "@/lib/prisma";

export async function getWorkExperience() {
  return prisma.workExperience.findMany({
    orderBy: { sortOrder: "asc" },
  });
}

export async function getEducation() {
  return prisma.education.findMany({
    orderBy: { sortOrder: "asc" },
  });
}

export async function getSkillCategories() {
  return prisma.skillCategory.findMany({
    orderBy: { sortOrder: "asc" },
  });
}

export async function getServices() {
  return prisma.service.findMany({
    orderBy: { sortOrder: "asc" },
  });
}
