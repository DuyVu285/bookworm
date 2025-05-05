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
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import cartReducer from "./cartSlice";
import userReducer from "./userSlice";
import authReducer from "./authSlice";
import toastReducer from "./toastSlice";

// Redux Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart", "user", "toast"],
};

const rootReducer = combineReducers({
  cart: cartReducer,
  user: userReducer,
  auth: authReducer,
  toast: toastReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist action types
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
