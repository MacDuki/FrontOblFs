import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const categories = [
  { name: "Thriller", query: "subject:thriller" },
  { name: "Fiction", query: "subject:fiction" },
  { name: "Fantasy", query: "subject:fantasy" },
  { name: "Self Help", query: "subject:self-help" },
  { name: "Romance", query: "subject:romance" },
];

// Async thunk para obtener libros
export const fetchBooks = createAsyncThunk(
  "books/fetchBooks",
  async (query) => {
    try {
      const params = {
        q: query,
        orderBy: "relevance",
        maxResults: 12,
      };

      // Agregar API key si está disponible
      if (import.meta.env.VITE_GOOGLE_BOOKS_API_KEY) {
        params.key = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
      }

      const res = await axios.get(
        "https://www.googleapis.com/books/v1/volumes",
        { params }
      );

      return res.data.items || [];
    } catch (error) {
      console.error("API Error:", error);
      return [];
    }
  }
);

// Async thunk para cargar todas las categorías
export const loadAllCategories = createAsyncThunk(
  "books/loadAllCategories",
  async (_, { dispatch }) => {
    const results = {};
    for (let cat of categories) {
      const books = await dispatch(fetchBooks(cat.query)).unwrap();
      results[cat.name] = books;
    }
    return results;
  }
);

// Async thunk para buscar libros
export const searchBooks = createAsyncThunk(
  "books/searchBooks",
  async (searchQuery, { dispatch, getState }) => {
    const state = getState();
    const cacheKey = searchQuery.toLowerCase().trim();
    
    // Si ya existe en cache, retornar datos guardados
    if (state.books.searchCache[cacheKey]) {
      return { 
        query: cacheKey,
        books: state.books.searchCache[cacheKey],
        fromCache: true 
      };
    }
    
    // Si no existe, hacer fetch
    const books = await dispatch(fetchBooks(searchQuery)).unwrap();
    return { 
      query: cacheKey,
      books,
      fromCache: false 
    };
  }
);

const booksSlice = createSlice({
  name: "books",
  initialState: {
    categoryBooks: {},
    originalCategoryBooks: {},
    searchCache: {},
    favoriteBooks: [],
    savedBooks: [],
    selectedBook: null,
    searchQuery: "",
    visibleCategories: categories.map((cat) => cat.name),
    loading: false,
    initialized: false,
    error: null,
  },
  reducers: {
    clearSearch: (state) => {
      state.categoryBooks = { ...state.originalCategoryBooks };
      state.searchQuery = "";
      // Remover resultados de búsqueda previos
      delete state.categoryBooks["Search Results"];
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedBook: (state, action) => {
      state.selectedBook = action.payload;
    },
    addToFavorites: (state, action) => {
      const book = action.payload;
      const exists = state.favoriteBooks.find((b) => b.id === book.id);
      if (!exists) {
        state.favoriteBooks.push(book);
      }
    },
    removeFromFavorites: (state, action) => {
      const bookId = action.payload;
      state.favoriteBooks = state.favoriteBooks.filter((b) => b.id !== bookId);
    },
    addToSaved: (state, action) => {
      const book = action.payload;
      const exists = state.savedBooks.find((b) => b.id === book.id);
      if (!exists) {
        state.savedBooks.push(book);
      }
    },
    removeFromSaved: (state, action) => {
      const bookId = action.payload;
      state.savedBooks = state.savedBooks.filter((b) => b.id !== bookId);
    },
    toggleCategoryVisibility: (state, action) => {
      const categoryName = action.payload;

      if (state.visibleCategories.includes(categoryName)) {
        state.visibleCategories = state.visibleCategories.filter(
          (cat) => cat !== categoryName
        );
      } else {
        state.visibleCategories.push(categoryName);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Load all categories
      .addCase(loadAllCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryBooks = action.payload;
        state.originalCategoryBooks = action.payload;
        state.initialized = true;
      })
      .addCase(loadAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Search books
      .addCase(searchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchBooks.fulfilled, (state, action) => {
        state.loading = false;
        const { query, books, fromCache } = action.payload;
        
        // Guardar en cache si no venía de ahí
        if (!fromCache) {
          state.searchCache[query] = books;
        }
        
        // Mostrar resultados
        state.categoryBooks = { "Search Results": books };
      })
      .addCase(searchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  clearSearch,
  setSearchQuery,
  setSelectedBook,
  addToFavorites,
  removeFromFavorites,
  addToSaved,
  removeFromSaved,
  toggleCategoryVisibility,
} = booksSlice.actions;
export default booksSlice.reducer;
