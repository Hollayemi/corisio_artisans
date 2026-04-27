import { configureStore } from "@reduxjs/toolkit";
import authReducer, { authApi } from "./authService/authSlice";
 
// Business API slices — all use the shared axiosBaseQuery
import { branchApi }           from "./business/slices/branchSlice";
import { campaignsDashboardApi } from "./business/slices/campaignSlice";
import { growthApi }           from "./business/slices/growthSlice";
import { appliedJobsReducer, jobsApi } from "./business/slices/jobsSlice";
import { ordersCustomersApi }  from "./business/slices/orderSlice";
import { productApi }          from "./business/slices/productSlice";
import { referralApi }         from "./business/slices/referralSlice";
import { staffApi }            from "./business/slices/staffSlice";
import { storeInfoApi }        from "./business/slices/storeInfoSlice";
import { storeApi as bizStoreApi } from "./business/slices/storeSlice";
import { paymentApi }          from "./business/slices/transaction";
 
// User API slices
import { feedbackApi }         from "./user/slices/feedbackSlice";
import { followingApi }        from "./user/slices/followSlice";
import { homeApi }             from "./user/slices/homeSlice";
import { orderApi as userOrderApi } from "./user/slices/orderSlice";
import { savedItemsApi }       from "./user/slices/saveItemSlice";
import { storeApi as userStoreApi } from "./user/slices/storeSlice";
import { userApi }             from "./user/slices/userSlice";
 
export const store = configureStore({
    reducer: {
        // ── Auth (single source of truth) ──────────────────────────────────
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,
 
        // ── Business ───────────────────────────────────────────────────────
        appliedJobs: appliedJobsReducer,
        [jobsApi.reducerPath]:              jobsApi.reducer,
        [productApi.reducerPath]:           productApi.reducer,
        [referralApi.reducerPath]:          referralApi.reducer,
        [staffApi.reducerPath]:             staffApi.reducer,
        [storeInfoApi.reducerPath]:         storeInfoApi.reducer,
        [bizStoreApi.reducerPath]:          bizStoreApi.reducer,
        [growthApi.reducerPath]:          growthApi.reducer,
 
        [feedbackApi.reducerPath]:          feedbackApi.reducer,
        [followingApi.reducerPath]:         followingApi.reducer,
        [homeApi.reducerPath]:              homeApi.reducer,
        [userApi.reducerPath]:              userApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(authApi.middleware)
            .concat(jobsApi.middleware)
            .concat(productApi.middleware)
            .concat(referralApi.middleware)
            .concat(growthApi.middleware)
            .concat(staffApi.middleware)
            .concat(storeInfoApi.middleware)
            .concat(bizStoreApi.middleware)
            .concat(feedbackApi.middleware)
            .concat(followingApi.middleware)
            .concat(homeApi.middleware)
            .concat(userApi.middleware),
});
 
export type RootState  = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
 
