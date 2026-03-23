import { prisma } from "@/lib/prisma";

export async function getProfile() {
  return prisma.profile.findUnique({
    where: { id: "singleton" },
  });
}

export type ProfileDTO = NonNullable<Awaited<ReturnType<typeof getProfile>>>;
