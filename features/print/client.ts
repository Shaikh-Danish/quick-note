import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import type { PrintDocResponse, PrintTokenResponse } from "@/lib/schemas/print";

/**
 * Hook to generate a secure print link.
 * Handles the clipboard copy logic and global notification.
 */
export function useGeneratePrintLink() {
  return useMutation({
    mutationFn: async ({ noteId, password }: { noteId: string; password?: string }) => {
      const response = await fetch("/api/print/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteId, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate secure link");
      }

      const data = (await response.json()) as PrintTokenResponse;
      return data;
    },
    onSuccess: (data) => {
      // Just return the data, UI handles the popup
      return data;
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/**
 * Hook to fetch print document content using a token.
 * Support both JSON (text) and Blob (images/PDFs) responses.
 */
export function usePrintDocument(token: string) {
  return useQuery({
    queryKey: ["print-doc", token],
    queryFn: async () => {
      const response = await fetch(`/api/print/${token}`);

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Link expired or invalid");
      }

      const contentType = response.headers.get("Content-Type");

      if (contentType?.includes("application/json")) {
        return (await response.json()) as PrintDocResponse;
      } else {
        const blob = await response.blob();
        const binaryUrl = URL.createObjectURL(blob);
        const contentDisposition = response.headers.get("Content-Disposition");
        const title =
          contentDisposition?.match(/filename="(.+)"/)?.[1] || "Document";

        return {
          success: true,
          title,
          type: contentType?.includes("image") ? "IMAGE" : "DOCUMENT",
          binaryUrl,
        } as PrintDocResponse & { binaryUrl: string };
      }
    },
    enabled: !!token,
    retry: false, // Don't retry secure ephemeral links to prevent accidental burns
    staleTime: 0,
  });
}

/**
 * Hook to manually invalidate (burn) a print token.
 */
export function useBurnPrintToken() {
  return useMutation({
    mutationFn: async (token: string) => {
      const response = await fetch(`/api/print/${token}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to invalidate token");

      return response.json();
    },
  });
}
