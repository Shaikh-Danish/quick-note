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
      return result.data as { accessCode: string; expiresAt: string };
    },
  });
}

export function useFetchQuickDrop() {
  // We use mutation here instead of query because fetching a code might burn it.
  return useMutation({
    mutationFn: async (code: string) => {
      const response = await fetch(`/api/quickdrop/${code}`);
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Failed to fetch quick drop");
      return result.data as { content: string };
    },
  });
}
