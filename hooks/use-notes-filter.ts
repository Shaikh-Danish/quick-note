import { useReducer, useRef, useCallback } from "react";
import type { NoteType } from "@/lib/schemas/notes";

interface NotesFilterState {
  sortBy: "latest" | "most_used";
  type: NoteType | undefined;
  category: string | undefined;
  search: string;
  debouncedSearch: string;
  page: number;
}

type NotesFilterAction =
  | { type: "SET_SORT"; sort: "latest" | "most_used" }
  | { type: "SET_TYPE"; noteType: NoteType | undefined }
  | { type: "SET_CATEGORY"; category: string | undefined }
  | { type: "SET_SEARCH"; search: string }
  | { type: "SET_DEBOUNCED_SEARCH"; search: string }
  | { type: "SET_PAGE"; page: number };

const initialState: NotesFilterState = {
  sortBy: "latest",
  type: undefined,
  category: undefined,
  search: "",
  debouncedSearch: "",
  page: 1,
};

function filterReducer(
  state: NotesFilterState,
  action: NotesFilterAction,
): NotesFilterState {
  switch (action.type) {
    case "SET_SORT":
      return { ...state, sortBy: action.sort, page: 1 };
    case "SET_TYPE":
      return { ...state, type: action.noteType, page: 1 };
    case "SET_CATEGORY":
      return { ...state, category: action.category, page: 1 };
    case "SET_SEARCH":
      return { ...state, search: action.search, page: 1 };
    case "SET_DEBOUNCED_SEARCH":
      return { ...state, debouncedSearch: action.search };
    case "SET_PAGE":
      return { ...state, page: action.page };
  }
}

export function useNotesFilter() {
  const [state, dispatch] = useReducer(filterReducer, initialState);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setSortBy = useCallback(
    (sort: "latest" | "most_used") => dispatch({ type: "SET_SORT", sort }),
    [],
  );

  const setType = useCallback(
    (noteType: NoteType | undefined) =>
      dispatch({ type: "SET_TYPE", noteType }),
    [],
  );

  const setCategory = useCallback(
    (category: string | undefined) =>
      dispatch({ type: "SET_CATEGORY", category }),
    [],
  );

  const setSearch = useCallback((value: string) => {
    dispatch({ type: "SET_SEARCH", search: value });
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      dispatch({ type: "SET_DEBOUNCED_SEARCH", search: value });
    }, 300);
  }, []);

  const setPage = useCallback(
    (page: number) => dispatch({ type: "SET_PAGE", page }),
    [],
  );

  return {
    ...state,
    setSortBy,
    setType,
    setCategory,
    setSearch,
    setPage,
  } as const;
}
