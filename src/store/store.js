import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth.slice";
import booksReducer from "../features/books.slice";
import collectionsReducer from "../features/collections.slice";
import libraryItemsReducer from "../features/libraryItem.slice";
import petReducer from "../features/pet.slice";
import reviewsReducer from "../features/reviews.slice";

export const store = configureStore({
  reducer: {
    books: booksReducer,
    auth: authReducer,
    pets: petReducer,
    collections: collectionsReducer,
    libraryItems: libraryItemsReducer,
    reviews: reviewsReducer,
  },
});
