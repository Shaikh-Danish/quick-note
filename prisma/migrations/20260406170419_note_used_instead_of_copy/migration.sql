/*
  Warnings:

  - You are about to drop the column `copiedCount` on the `note` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "note_copiedCount_idx";

-- AlterTable
ALTER TABLE "note" DROP COLUMN "copiedCount",
ADD COLUMN     "useCount" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "note_useCount_idx" ON "note"("useCount" DESC);
