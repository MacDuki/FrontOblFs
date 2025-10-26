import { configureStore } from "@reduxjs/toolkit";
import booksReducer from "../features/books.slice";
import contadorReducer from "../features/contador.slice";

export const store = configureStore({
  reducer: {
    contador: contadorReducer,
    books: booksReducer,
  },
});
