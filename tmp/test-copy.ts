import { prisma } from "../lib/prisma";

async function main() {
  // Get a note
  const notes = await prisma.note.findMany({ take: 1 });
  if (notes.length === 0) {
    console.log("No notes found in the database");
    return;
  }
  
  const note = notes[0];
  console.log("Before:", { id: note.id, copiedCount: note.copiedCount });
  
  const updated = await prisma.note.update({
    where: { id: note.id },
    data: { copiedCount: { increment: 1 } },
  });
  console.log("After:", { id: updated.id, copiedCount: updated.copiedCount });
}

main().catch(console.error).finally(() => process.exit(0));
