import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const categories = [
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
      const res = await axios.get(
        "https://www.googleapis.com/books/v1/volumes",
        {
          params: { q: query, orderBy: "relevance", maxResults: 12 },
        }
      );
      return res.data.items || [];
    } catch {
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
  async (searchQuery, { dispatch }) => {
    const books = await dispatch(fetchBooks(searchQuery)).unwrap();
    return { "Search Results": books };
  }
);

const booksSlice = createSlice({
  name: "books",
  initialState: {
    categoryBooks: {},
    originalCategoryBooks: {},
    loading: false,
    initialized: false,
    error: null,
  },
  reducers: {
    clearSearch: (state) => {
      state.categoryBooks = state.originalCategoryBooks;
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
        state.categoryBooks = action.payload;
      })
      .addCase(searchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearSearch } = booksSlice.actions;
export default booksSlice.reducer;
