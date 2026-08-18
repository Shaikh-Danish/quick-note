import { useMutation } from "@tanstack/react-query";
import type { z } from "zod";
import type { createQuickDropSchema } from "@/lib/schemas/quick-drop";

export function useCreateQuickDrop() {
  return useMutation({
    mutationFn: async (data: z.infer<typeof createQuickDropSchema>) => {
      const response = await fetch("/api/quickdrop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Failed to create quick drop");
      return result.data as { url: string; expiresAt: string };
    },
  });
}

export function useFetchQuickDrop() {
  // We use mutation here instead of query because fetching a url might burn it.
  return useMutation({
    mutationFn: async (url: string) => {
      const response = await fetch(`/api/quickdrop/${encodeURIComponent(url)}`, {
        method: "GET",
        credentials: "same-origin",
        headers: { Accept: "application/json" },
      });
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        throw new Error("Failed to fetch quick drop");
      }
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Failed to fetch quick drop");
      return result.data as { content: string };
    },
  });
}
