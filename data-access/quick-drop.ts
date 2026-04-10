import { prisma } from "@/lib/prisma";

export async function createQuickDropDal(data: {
  content: string;
  url: string;
  expiresAt: Date;
  isBurnAfterRead: boolean;
  userId?: string;
}) {
  return prisma.quickDrop.create({
    data,
  });
}

export async function getQuickDropByUrlDal(url: string) {
  return prisma.quickDrop.findUnique({
    where: { url },
  });
}

export async function deleteQuickDropDal(id: string) {
  return prisma.quickDrop.delete({
    where: { id },
  });
}
