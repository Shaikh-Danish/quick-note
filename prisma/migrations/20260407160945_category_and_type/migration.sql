/*
  Warnings:

  - The `category` column on the `note` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "note" ADD COLUMN     "type" "note_category" NOT NULL DEFAULT 'TEXT',
DROP COLUMN "category",
ADD COLUMN     "category" TEXT;

-- CreateIndex
CREATE INDEX "note_userId_type_idx" ON "note"("userId", "type");

-- CreateIndex
CREATE INDEX "note_userId_category_idx" ON "note"("userId", "category");
