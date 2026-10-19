import { configureStore } from "@reduxjs/toolkit";
import auth from "./Slices/AuthSlice";
import cart from './Slices/CartSlice'
const store = configureStore({
  reducer: {
    auth,
    cart
  },
});

export default store;
