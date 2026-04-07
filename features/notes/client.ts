import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import type { NoteType, NoteSchema } from "@/lib/schemas/notes";

export interface Category {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  type: NoteType;
  category: string | null;
  contentType: string | null;
  fileKey: string | null;
  fileSize: number | null;
  createdAt: string;
  useCount: number;
  isProtected?: boolean;
  tags?: { id: string; name: string }[];
}

export interface PaginatedNotesResponse {
  notes: Note[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface NotesFilter {
  sort?: "latest" | "most_used";
  type?: NoteType;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export function useNotes(filter: NotesFilter = {}) {
  const { sort = "latest", type, category, search, page = 1, limit = 12 } = filter;

  return useQuery({
    queryKey: ["notes", sort, type, category, search, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("sort", sort);
      params.set("page", String(page));
      params.set("limit", String(limit));
      if (type) params.set("type", type);
      if (category) params.set("category", category);
      if (search) params.set("search", search);

      const response = await fetch(`/api/notes?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch notes");
      return (await response.json()) as PaginatedNotesResponse;
    },
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      return (await response.json()) as Category[];
    },
  });
}

export function useIncrementUseCount() {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/notes/${id}/copy`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to update copy count");

      return response.json();
    },
    onSuccess: (data) => {
      console.log("Copy count incremented:", data);
    },
    onError: (error) => {
      console.error("Failed to increment copy count:", error);
    },
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: NoteSchema | FormData) => {
      const isFormData = payload instanceof FormData;
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: isFormData ? undefined : { "Content-Type": "application/json" },
        body: isFormData ? payload : JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create note");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Note created successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete note");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
