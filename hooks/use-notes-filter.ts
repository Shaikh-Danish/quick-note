import { useReducer, useRef, useCallback } from "react";
import type { NoteCategory } from "@/lib/schemas/notes";

interface NotesFilterState {
  sortBy: "latest" | "most_copied";
  category: NoteCategory | undefined;
  search: string;
  debouncedSearch: string;
  page: number;
}

type NotesFilterAction =
  | { type: "SET_SORT"; sort: "latest" | "most_copied" }
  | { type: "SET_CATEGORY"; category: NoteCategory | undefined }
  | { type: "SET_SEARCH"; search: string }
  | { type: "SET_DEBOUNCED_SEARCH"; search: string }
  | { type: "SET_PAGE"; page: number };

const initialState: NotesFilterState = {
  sortBy: "most_copied",
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
    (sort: "latest" | "most_copied") => dispatch({ type: "SET_SORT", sort }),
    [],
  );

  const setCategory = useCallback(
    (category: NoteCategory | undefined) =>
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
    setCategory,
    setSearch,
    setPage,
  } as const;
}
