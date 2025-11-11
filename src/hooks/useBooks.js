import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SYNC_CONFIG, shouldMakeCall } from "../config/syncConfig";
import {
  clearSearch,
  fetchBooks,
  loadAllCategories,
  searchBooks,
  setSearchQuery,
  setSelectedBook,
  toggleCategoryVisibility,
} from "../features/books.slice";

export const useBooks = () => {
  const dispatch = useDispatch();
  const {
    categoryBooks,
    favoriteBooks,
    savedBooks,
    selectedBook,
    searchQuery,
    visibleCategories,
    loading,
    initialized,
    error,
  } = useSelector((state) => state.books);

  // Funciones para buscar libros
  const searchForBooks = (query) => dispatch(searchBooks(query));
  const fetchBooksData = (query) => dispatch(fetchBooks(query));

  // Carga inicial de categorías controlada por SYNC_CONFIG
  useEffect(() => {
    if (SYNC_CONFIG.books.syncOnMount && !initialized) {
      if (shouldMakeCall("books-initial")) {
        if (SYNC_CONFIG.global.enableSyncLogs) {
          console.log("🔄 [Books] Sync inicial categorías");
        }
        dispatch(loadAllCategories());
      }
    }
  }, [dispatch, initialized]);

  // Revalidación por foco / visibilidad según config
  useEffect(() => {
    if (
      !SYNC_CONFIG.books.refetchOnWindowFocus &&
      !SYNC_CONFIG.books.refetchOnVisibility
    )
      return;

    const onFocus = () => {
      if (
        SYNC_CONFIG.books.refetchOnWindowFocus &&
        shouldMakeCall("books-focus")
      ) {
        if (SYNC_CONFIG.global.enableSyncLogs) {
          console.log("🔄 [Books] Refetch por foco");
        }
        dispatch(loadAllCategories());
      }
    };
    const onVisibility = () => {
      if (
        SYNC_CONFIG.books.refetchOnVisibility &&
        document.visibilityState === "visible" &&
        shouldMakeCall("books-visibility")
      ) {
        if (SYNC_CONFIG.global.enableSyncLogs) {
          console.log("🔄 [Books] Refetch por visibilidad");
        }
        dispatch(loadAllCategories());
      }
    };
    if (SYNC_CONFIG.books.refetchOnWindowFocus)
      window.addEventListener("focus", onFocus);
    if (SYNC_CONFIG.books.refetchOnVisibility)
      document.addEventListener("visibilitychange", onVisibility);
    return () => {
      if (SYNC_CONFIG.books.refetchOnWindowFocus)
        window.removeEventListener("focus", onFocus);
      if (SYNC_CONFIG.books.refetchOnVisibility)
        document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [dispatch]);

  // Polling opcional
  useEffect(() => {
    const pollMs = SYNC_CONFIG.books.pollMs;
    if (!pollMs || pollMs <= 0) {
      if (SYNC_CONFIG.global.enableSyncLogs) {
        console.log("⏸️ [Books] Polling deshabilitado");
      }
      return;
    }
    if (SYNC_CONFIG.global.enableSyncLogs) {
      console.log(`🔄 [Books] Polling habilitado cada ${pollMs}ms`);
    }
    const id = setInterval(() => {
      if (shouldMakeCall("books-poll")) {
        dispatch(loadAllCategories());
      }
    }, pollMs);
    return () => clearInterval(id);
  }, [dispatch]);

  // Funciones para favoritos
  const loadFavorites = () => console.log("fetchFavoriteBooks");
  const addToFavorites = async (bookId) => {
    console.log("addBookToFavorites", bookId);
    return null;
  };
  const removeFromFavorites = async (bookId) => {
    console.log("removeBookFromFavorites", bookId);
    return null;
  };

  // Funciones para libros guardados
  const loadSavedBooks = () => console.log("fetchSavedBooks");
  const saveBook = async (bookId) => {
    console.log("addBookToSaved", bookId);
    return null;
  };
  const unsaveBook = async (bookId) => {
    console.log("removeBookFromSaved", bookId);
    return null;
  };

  // Funciones de UI
  const clearSearchResults = () => dispatch(clearSearch());
  const updateSearchQuery = (query) => dispatch(setSearchQuery(query));
  const selectBook = (book) => dispatch(setSelectedBook(book));
  const toggleCategory = (categoryName) =>
    dispatch(toggleCategoryVisibility(categoryName));

  // Funciones de utilidad
  const isBookFavorite = (bookId) =>
    favoriteBooks.some((book) => book.id === bookId);
  const isBookSaved = (bookId) => savedBooks.some((book) => book.id === bookId);

  return {
    // Estado
    categoryBooks,
    favoriteBooks,
    savedBooks,
    selectedBook,
    searchQuery,
    visibleCategories,
    loading,
    initialized,
    error,

    // Funciones de búsqueda
    searchForBooks,
    fetchBooksData,

    // Funciones de favoritos
    loadFavorites,
    addToFavorites,
    removeFromFavorites,

    // Funciones de guardados
    loadSavedBooks,
    saveBook,
    unsaveBook,

    // Funciones de UI
    clearSearchResults,
    updateSearchQuery,
    selectBook,
    toggleCategory,

    // Utilidades
    isBookFavorite,
    isBookSaved,
  };
};
