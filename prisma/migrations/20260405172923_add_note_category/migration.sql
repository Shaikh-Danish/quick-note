-- CreateEnum
CREATE TYPE "note_category" AS ENUM ('TEXT', 'URL', 'IMAGE', 'DOCUMENT', 'MARKDOWN');

-- AlterTable
ALTER TABLE "note" ADD COLUMN     "category" "note_category" NOT NULL DEFAULT 'TEXT',
ADD COLUMN     "contentType" TEXT;

-- CreateIndex
CREATE INDEX "note_userId_category_idx" ON "note"("userId", "category");
