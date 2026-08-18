import { useMutation } from "@tanstack/react-query";
import type { z } from "zod";
import {
  decryptDropContent,
  encryptDropContent,
  generateDropKey,
} from "@/lib/drop-crypto";
import type { createQuickDropFormSchema } from "@/lib/schemas/quick-drop";

async function readJson(response: Response) {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new Error("Unexpected response from server");
  }
  return response.json();
}

export function useCreateQuickDrop() {
  return useMutation({
    mutationFn: async (data: z.infer<typeof createQuickDropFormSchema>) => {
      const key = generateDropKey();
      const encryptedContent = await encryptDropContent(data.content, key);

      const response = await fetch("/api/quickdrop", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: encryptedContent,
          expiresInHours: data.expiresInHours,
          isBurnAfterRead: data.isBurnAfterRead,
        }),
      });
      const result = await readJson(response);
      if (!response.ok)
        throw new Error(result.error || "Failed to create quick drop");

      return {
        url: result.data.url as string,
        expiresAt: result.data.expiresAt as string,
        key,
        plaintext: data.content,
      };
    },
  });
}

export function useFetchQuickDrop() {
  return useMutation({
    mutationFn: async ({ url, key }: { url: string; key: string }) => {
      const response = await fetch(`/api/quickdrop/${encodeURIComponent(url)}`, {
        method: "GET",
        credentials: "same-origin",
        headers: { Accept: "application/json" },
      });
      const result = await readJson(response);
      if (!response.ok)
        throw new Error(result.error || "Failed to fetch quick drop");

      const payload = result.data as {
        content: string;
        isBurnAfterRead: boolean;
      };
      const content = await decryptDropContent(payload.content, key);

      if (payload.isBurnAfterRead) {
        await fetch(`/api/quickdrop/${encodeURIComponent(url)}`, {
          method: "DELETE",
          credentials: "same-origin",
        });
      }

      return { content };
    },
  });
}
