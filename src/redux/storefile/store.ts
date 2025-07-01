import {configureStore, combineReducers} from "@reduxjs/toolkit";
import {persistStore, persistReducer} from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "@/redux/slices/authSlice";
// import sideBarReducer from "@/redux/Slices/sidebarSlice";

const rootReducer = combineReducers({
  userAuth: authReducer,
//   sidebar: sideBarReducer,
});
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["userAuth", "sidebar"],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
