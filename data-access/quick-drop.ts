import { prisma } from "@/lib/prisma";

export async function createQuickDropDal(data: {
  content: string;
  accessCode: string;
  expiresAt: Date;
  isBurnAfterRead: boolean;
  userId?: string;
}) {
  return prisma.quickDrop.create({
    data,
  });
}

export async function getQuickDropByCodeDal(accessCode: string) {
  return prisma.quickDrop.findUnique({
    where: { accessCode },
  });
}

export async function deleteQuickDropDal(id: string) {
  return prisma.quickDrop.delete({
    where: { id },
  });
}
