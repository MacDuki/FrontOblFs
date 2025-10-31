import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/api";

export const categories = [
  { name: "Thriller", query: "thriller" },
  { name: "Fiction", query: "fiction" },
  { name: "Fantasy", query: "fantasy" },
  { name: "Self Help", query: "self-help" },
  { name: "Romance", query: "romance" },
];

export const fetchBooks = createAsyncThunk(
  "books/fetchBooks",
  async (query, { rejectWithValue }) => {
    try {
      const res = await api.get("/books", {
        params: {
          search: query,
          limit: 12,
        },
      });

      return res.data.books || [];
    } catch (error) {
      console.error("API Error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Error fetching books"
      );
    }
  }
);

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
        fromCache: true,
      };
    }

    // Si no existe, hacer fetch
    const books = await dispatch(fetchBooks(searchQuery)).unwrap();
    return {
      query: cacheKey,
      books,
      fromCache: false,
    };
  }
);

// Thunk para obtener libros favoritos del usuario
export const fetchFavoriteBooks = createAsyncThunk(
  "books/fetchFavoriteBooks",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/books/favorites");
      return res.data.favorites || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching favorite books"
      );
    }
  }
);

// Thunk para obtener libros guardados del usuario
export const fetchSavedBooks = createAsyncThunk(
  "books/fetchSavedBooks",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/books/saved");
      return res.data.saved || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching saved books"
      );
    }
  }
);

// Thunk para agregar libro a favoritos
export const addBookToFavorites = createAsyncThunk(
  "books/addBookToFavorites",
  async (bookId, { rejectWithValue }) => {
    try {
      const res = await api.post(`/books/${bookId}/favorite`);
      return res.data.book;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error adding to favorites"
      );
    }
  }
);

// Thunk para quitar libro de favoritos
export const removeBookFromFavorites = createAsyncThunk(
  "books/removeBookFromFavorites",
  async (bookId, { rejectWithValue }) => {
    try {
      await api.delete(`/books/${bookId}/favorite`);
      return bookId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error removing from favorites"
      );
    }
  }
);

// Thunk para agregar libro a guardados
export const addBookToSaved = createAsyncThunk(
  "books/addBookToSaved",
  async (bookId, { rejectWithValue }) => {
    try {
      const res = await api.post(`/books/${bookId}/save`);
      return res.data.book;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error saving book"
      );
    }
  }
);

// Thunk para quitar libro de guardados
export const removeBookFromSaved = createAsyncThunk(
  "books/removeBookFromSaved",
  async (bookId, { rejectWithValue }) => {
    try {
      await api.delete(`/books/${bookId}/save`);
      return bookId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error removing saved book"
      );
    }
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
      // Fetch favorite books
      .addCase(fetchFavoriteBooks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFavoriteBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.favoriteBooks = action.payload;
      })
      .addCase(fetchFavoriteBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch saved books
      .addCase(fetchSavedBooks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSavedBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.savedBooks = action.payload;
      })
      .addCase(fetchSavedBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to favorites
      .addCase(addBookToFavorites.fulfilled, (state, action) => {
        const book = action.payload;
        const exists = state.favoriteBooks.find((b) => b.id === book.id);
        if (!exists) {
          state.favoriteBooks.push(book);
        }
      })
      .addCase(addBookToFavorites.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Remove from favorites
      .addCase(removeBookFromFavorites.fulfilled, (state, action) => {
        const bookId = action.payload;
        state.favoriteBooks = state.favoriteBooks.filter(
          (b) => b.id !== bookId
        );
      })
      .addCase(removeBookFromFavorites.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Add to saved
      .addCase(addBookToSaved.fulfilled, (state, action) => {
        const book = action.payload;
        const exists = state.savedBooks.find((b) => b.id === book.id);
        if (!exists) {
          state.savedBooks.push(book);
        }
      })
      .addCase(addBookToSaved.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Remove from saved
      .addCase(removeBookFromSaved.fulfilled, (state, action) => {
        const bookId = action.payload;
        state.savedBooks = state.savedBooks.filter((b) => b.id !== bookId);
      })
      .addCase(removeBookFromSaved.rejected, (state, action) => {
        state.error = action.payload;
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
} = booksSlice.actions;
export default booksSlice.reducer;
