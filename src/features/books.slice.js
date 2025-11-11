import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/api";
import { logout } from "./auth.slice";

export const categories = [
  { name: "Thriller", query: "thriller" },
  { name: "Fiction", query: "fiction" },
  { name: "Fantasy", query: "fantasy" },
  { name: "Self Help", query: "self-help" },
  { name: "Romance", query: "romance" },
];

export const fetchBooks = createAsyncThunk(
  "books/fetchBooks",
  async (category, { rejectWithValue }) => {
    try {
      const res = await api.get("/books/category", {
        params: {
          category: category,
        },
      });
      console.log(
        `📖 [Books API] fetchBooks (${category}) response:`,
        res.data
      );
      return res.data || [];
    } catch (error) {
      console.error(`❌ [Books API] fetchBooks (${category}) error:`, error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Error fetching books"
      );
    }
  }
);

export const loadAllCategories = createAsyncThunk(
  "books/loadAllCategories",
  async (_, { dispatch }) => {
    console.log(
      "📖 [Books API] loadAllCategories - iniciando carga de todas las categorías"
    );
    const results = {};
    for (let cat of categories) {
      const books = await dispatch(fetchBooks(cat.query)).unwrap();
      results[cat.name] = books;
    }
    console.log("📖 [Books API] loadAllCategories - completado:", results);
    return results;
  }
);

export const fetchSearchBooks = createAsyncThunk(
  "books/fetchSearchBooks",
  async (searchQuery, { rejectWithValue }) => {
    try {
      const res = await api.get("/books", {
        params: {
          q: searchQuery,
        },
      });
      console.log(
        `📖 [Books API] fetchSearchBooks (${searchQuery}) response:`,
        res.data
      );
      return res.data || [];
    } catch (error) {
      console.error(
        `❌ [Books API] fetchSearchBooks (${searchQuery}) error:`,
        error
      );
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Error searching books"
      );
    }
  }
);

export const fetchAllBooks = createAsyncThunk(
  "books/fetchAllBooks",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/books");
      console.log("📖 [Books API] fetchAllBooks response:", res.data);
      return res.data || [];
    } catch (error) {
      console.error("❌ [Books API] fetchAllBooks error:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Error fetching all books"
      );
    }
  }
);

export const searchBooks = createAsyncThunk(
  "books/searchBooks",
  async (searchQuery, { dispatch, getState }) => {
    console.log(`📖 [Books API] searchBooks - query: "${searchQuery}"`);
    const state = getState();
    const cacheKey = searchQuery.toLowerCase().trim();

    // Si ya existe en cache, retornar datos guardados
    if (state.books.searchCache[cacheKey]) {
      console.log(
        `📖 [Books API] searchBooks - usando cache para: "${searchQuery}"`
      );
      return {
        query: cacheKey,
        books: state.books.searchCache[cacheKey],
        fromCache: true,
      };
    }

    // Si no existe, hacer fetch usando el endpoint de búsqueda
    const books = await dispatch(fetchSearchBooks(searchQuery)).unwrap();
    console.log(
      `📖 [Books API] searchBooks - resultado para "${searchQuery}":`,
      books
    );
    return {
      query: cacheKey,
      books,
      fromCache: false,
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
    lastSyncAt: 0,
  },
  reducers: {
    clearSearch: (state) => {
      state.categoryBooks = { ...state.originalCategoryBooks };
      state.searchQuery = "";
      delete state.categoryBooks["Search Results"];
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedBook: (state, action) => {
      state.selectedBook = action.payload;
    },
    // Estos reducers locales se mantienen para operaciones inmediatas de UI
    // Los thunks se encargan de la sincronización con el servidor
    addToFavoritesLocal: (state, action) => {
      const book = action.payload;
      const exists = state.favoriteBooks.find((b) => b.id === book.id);
      if (!exists) {
        state.favoriteBooks.push(book);
      }
    },
    removeFromFavoritesLocal: (state, action) => {
      const bookId = action.payload;
      state.favoriteBooks = state.favoriteBooks.filter((b) => b.id !== bookId);
    },
    addToSavedLocal: (state, action) => {
      const book = action.payload;
      const exists = state.savedBooks.find((b) => b.id === book.id);
      if (!exists) {
        state.savedBooks.push(book);
      }
    },
    removeFromSavedLocal: (state, action) => {
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
    markBooksSynced: (state) => {
      state.lastSyncAt = Date.now();
    },
  },
  extraReducers: (builder) => {
    builder

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
      })
      // Escuchar el logout de auth para limpiar el estado
      .addCase(logout, (state) => {
        state.categoryBooks = {};
        state.originalCategoryBooks = {};
        state.searchCache = {};
        state.favoriteBooks = [];
        state.savedBooks = [];
        state.selectedBook = null;
        state.searchQuery = "";
        state.visibleCategories = categories.map((cat) => cat.name);
        state.loading = false;
        state.initialized = false;
        state.error = null;
        state.lastSyncAt = 0;
      });
  },
});

export const {
  clearSearch,
  setSearchQuery,
  setSelectedBook,
  addToFavoritesLocal,
  removeFromFavoritesLocal,
  addToSavedLocal,
  removeFromSavedLocal,
  toggleCategoryVisibility,
  markBooksSynced,
} = booksSlice.actions;
export default booksSlice.reducer;
