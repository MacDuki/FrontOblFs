import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth.slice";
import booksReducer from "../features/books.slice";
import petReducer from "../features/pet.slice";

export const store = configureStore({
  reducer: {
    books: booksReducer,
    auth: authReducer,
    pets: petReducer,
  },
});
