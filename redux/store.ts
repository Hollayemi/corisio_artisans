// redux/business/store.ts  (updated — adds jobs feature)
import { configureStore } from "@reduxjs/toolkit";

import authReducer, { authApi } from "./authService/authSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(authApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
