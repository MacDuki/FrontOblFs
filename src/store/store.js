import { configureStore } from "@reduxjs/toolkit";
import contadorReducer from "../features/contador.slice";
export const store = configureStore({
  reducer: {
    contador: contadorReducer,
  },
});
