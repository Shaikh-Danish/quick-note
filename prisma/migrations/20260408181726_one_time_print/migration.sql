-- CreateTable
CREATE TABLE "secure_print_token" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "noteId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "firstAccessedAt" TIMESTAMP(3),
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "secure_print_token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "secure_print_token_token_key" ON "secure_print_token"("token");

-- CreateIndex
CREATE INDEX "secure_print_token_noteId_idx" ON "secure_print_token"("noteId");

-- AddForeignKey
ALTER TABLE "secure_print_token" ADD CONSTRAINT "secure_print_token_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "note"("id") ON DELETE CASCADE ON UPDATE CASCADE;
