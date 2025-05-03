import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import cartReducer from "./cartSlice";
import userReducer from "./userSlice";
import authReducer from "./authSlice";

// Redux Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart", "user", "auth"],
};
const rootReducer = combineReducers({
  cart: cartReducer,
  user: userReducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store); // create persistor

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
