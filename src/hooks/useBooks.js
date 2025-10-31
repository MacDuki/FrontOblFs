import { useDispatch, useSelector } from "react-redux";
import {
  addBookToFavorites,
  addBookToSaved,
  clearSearch,
  fetchBooks,
  fetchFavoriteBooks,
  fetchSavedBooks,
  loadAllCategories,
  removeBookFromFavorites,
  removeBookFromSaved,
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
  const loadCategories = () => dispatch(loadAllCategories());
  const fetchBooksData = (query) => dispatch(fetchBooks(query));

  // Funciones para favoritos
  const loadFavorites = () => dispatch(fetchFavoriteBooks());
  const addToFavorites = async (bookId) => {
    const result = await dispatch(addBookToFavorites(bookId));
    return result;
  };
  const removeFromFavorites = async (bookId) => {
    const result = await dispatch(removeBookFromFavorites(bookId));
    return result;
  };

  // Funciones para libros guardados
  const loadSavedBooks = () => dispatch(fetchSavedBooks());
  const saveBook = async (bookId) => {
    const result = await dispatch(addBookToSaved(bookId));
    return result;
  };
  const unsaveBook = async (bookId) => {
    const result = await dispatch(removeBookFromSaved(bookId));
    return result;
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
    loadCategories,
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
