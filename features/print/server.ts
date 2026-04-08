import * as PrintData from "@/data-access/print";

/**
 * Orchestrates the creation of a secure print token.
 * This can be expanded to include logging, usage metrics, or secondary encryption.
 */
export async function generateSecurePrintLink(
  noteId: string, 
  userId: string, 
  password?: string
): Promise<string> {
  return PrintData.createPrintToken(noteId, userId, password);
}

/**
 * Handles the high-level logic for accessing a print token.
 * In the future, this could be where we trigger "document-ready" AI tasks 
 * or check for user-specific print permissions.
 */
export async function validateAndFetchPrintToken(token: string) {
  return PrintData.getValidPrintToken(token);
}

/**
 * Forces invalidation of a token.
 */
export async function burnPrintToken(token: string) {
  return PrintData.invalidatePrintToken(token);
}
