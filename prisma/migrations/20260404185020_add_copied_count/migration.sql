-- AlterTable
ALTER TABLE "note" ADD COLUMN     "copiedCount" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "note_copiedCount_idx" ON "note"("copiedCount" DESC);
