import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/es/storage";
import authReducer from "./Slices/AuthSlice"; // ⚠️ مسیرها رو با پروژه‌ات تنظیم کن
import cartReducer from "./Slices/CartSlice";

// فقط auth ذخیره می‌شود (توکن و کاربر).
// سبد خرید عمداً ذخیره نمی‌شود؛ بعد از هر رفرش از سرور گرفته می‌شود (fetchCart).
const authPersistConfig = {
  key: "auth",
  storage,
};

export const store = configureStore({
  reducer: {
    auth: persistReducer(authPersistConfig, authReducer),
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // اکشن‌های داخلی redux-persist تابع دارند و serializable نیستند
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);