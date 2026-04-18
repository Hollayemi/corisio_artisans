// redux/authService/authSlice.ts
// ONE slice managing both store-owner and regular-user sessions.
// Replaces: authSlice.ts, authSlices.ts, authService/authSlice.ts

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createApi, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { router } from "expo-router";
import { axiosBaseQuery, clearAllTokens } from "@/redux/shared/axiosBaseQuery";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AuthParty = "user" | "business";

export interface AuthState {
    party:           AuthParty | null;   // who is logged in
    token:           string | null;
    refreshToken:    string | null;
    isAuthenticated: boolean;
    data:            Record<string, any>; // store or user object
    error:           string | null;
}

// ─── Initial state (sync-loaded from AsyncStorage in _layout.tsx) ────────────

const initialState: AuthState = {
    party:           null,
    token:           null,
    refreshToken:    null,
    isAuthenticated: false,
    data:            {},
    error:           null,
};

// ─── RTK Query API ────────────────────────────────────────────────────────────
// All four auth endpoints work for BOTH user and business via the `party` param.

export const authApi = createApi({
    reducerPath: "authApi",
    // No token needed for OTP / verify — they ARE the login flow
    baseQuery: axiosBaseQuery("none"),
    tagTypes: ["Auth"],
    endpoints: (builder) => ({

        /**
         * Step 1 — request OTP
         * POST /users/auth/send-otp   (party === "user")
         * POST /stores/auth/send-otp  (party === "business")
         */
        sendOtp: builder.mutation<
            ApiEnvelope<{ phoneNumber: string; message: string }>,
            { phoneNumber: string; party: AuthParty; category?: Record<string, any> }
        >({
            query: ({ phoneNumber, party, category }) => ({
                url: `/${party === "user" ? "users" : "stores"}/auth/send-otp`,
                method: "POST",
                data: { phoneNumber, ...(category && { category }) },
                skipErrorHandling: true,  // let PhoneNumber screen show inline error
            }),
        }),

        /**
         * Step 2 — verify OTP → receive token
         * POST /users/auth/verify-otp   (party === "user")
         * POST /stores/auth/verify-otp  (party === "business")
         *
         * On success, persists token + profile data to AsyncStorage + Redux.
         */
        verifyOtp: builder.mutation<
            ApiEnvelope<VerifyOtpResponse>,
            { phoneNumber: string; otp: string; party: AuthParty }
        >({
            query: ({ phoneNumber, otp, party }) => ({
                url: `/${party === "user" ? "users" : "stores"}/auth/verify-otp`,
                method: "POST",
                data: { phoneNumber, otp },
                skipErrorHandling: true,
            }),
            invalidatesTags: ["Auth"],
            async onQueryStarted({ party }, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    const { token, refreshToken } = data.data;
                    const profileData = data.data.store ?? data.data.user ?? {};

                    dispatch(setCredentials({ party, token, refreshToken, data: profileData }));
                } catch {
                    // component handles error via .unwrap()
                }
            },
        }),

        /**
         * Step 3 — resend OTP
         */
        resendOtp: builder.mutation<
            ApiEnvelope<{ message: string }>,
            { phoneNumber: string; party: AuthParty }
        >({
            query: ({ phoneNumber, party }) => ({
                url: `/${party === "user" ? "users" : "stores"}/auth/resend-otp`,
                method: "POST",
                data: { phoneNumber },
                skipErrorHandling: true,
            }),
        }),

        /**
         * Register store (business onboarding step 4)
         */
        registerStore: builder.mutation<ApiEnvelope<any>, RegisterStorePayload>({
            query: (payload) => ({
                url: "/stores/register",
                method: "POST",
                data: payload,
                tokenOwner: "store",
            }),
        }),

        /**
         * Register / complete user profile (user onboarding)
         */
        registerUser: builder.mutation<ApiEnvelope<any>, RegisterUserPayload>({
            query: (payload) => ({
                url: "/users/auth/complete-profile",
                method: "POST",
                data: payload,
                tokenOwner: "user",
            }),
        }),

        /**
         * Logout — clears server session
         */
        logoutRemote: builder.mutation<ApiEnvelope<null>, { party: AuthParty }>({
            query: ({ party }) => ({
                url: `/${party === "user" ? "users" : "stores"}/auth/logout`,
                method: "POST",
                tokenOwner: party === "user" ? "user" : "store",
            }),
        }),
    }),
});

// ─── Slice ────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        /** Persists tokens + profile after verifyOtp */
        setCredentials: (
            state,
            action: PayloadAction<{
                party: AuthParty;
                token: string;
                refreshToken: string;
                data: Record<string, any>;
            }>
        ) => {
            const { party, token, refreshToken, data } = action.payload;
            state.party           = party;
            state.token           = token;
            state.refreshToken    = refreshToken;
            state.isAuthenticated = true;
            state.data            = data;
            state.error           = null;

            const tokenKey   = party === "user" ? "user_token"         : "store_token";
            const refreshKey = party === "user" ? "user_refresh_token"  : "store_refresh_token";
            const dataKey    = party === "user" ? "user_data"           : "store_data";

            AsyncStorage.setItem(tokenKey,   token);
            AsyncStorage.setItem(refreshKey, refreshToken);
            AsyncStorage.setItem(dataKey,    JSON.stringify(data));
        },

        /** Patch profile fields without a full refetch */
        patchProfileData: (state, action: PayloadAction<Record<string, any>>) => {
            state.data = { ...state.data, ...action.payload };
            const key  = state.party === "user" ? "user_data" : "store_data";
            AsyncStorage.setItem(key, JSON.stringify(state.data));
        },

        /**
         * Logout — call this from ANY screen.
         * Clears AsyncStorage, Redux state, and navigates to login.
         */
        logoutUser: (state) => {
            const wasParty = state.party;
            state.party           = null;
            state.token           = null;
            state.refreshToken    = null;
            state.isAuthenticated = false;
            state.data            = {};
            state.error           = null;

            clearAllTokens(); // removes all token keys from AsyncStorage

            // Navigate to the right login screen
            router.replace("/auth/Login");
        },

        /** Hydrate from AsyncStorage on app start */
        initializeAuth: (state, action: PayloadAction<Partial<AuthState>>) => {
            Object.assign(state, action.payload);
        },
    },
});

export const { setCredentials, patchProfileData, logoutUser, initializeAuth } =
    authSlice.actions;

export default authSlice.reducer;

// ─── App-start hydration (call once in _layout.tsx) ──────────────────────────

export const initializeAuthAsync = () => async (dispatch: any) => {
    try {
        // Try store first, then user
        let token        = await AsyncStorage.getItem("store_token");
        let refreshToken = await AsyncStorage.getItem("store_refresh_token");
        let rawData      = await AsyncStorage.getItem("store_data");
        let party: AuthParty = "business";

        if (!token) {
            token        = await AsyncStorage.getItem("user_token");
            refreshToken = await AsyncStorage.getItem("user_refresh_token");
            rawData      = await AsyncStorage.getItem("user_data");
            party        = "user";
        }

        if (token) {
            dispatch(
                initializeAuth({
                    party,
                    token,
                    refreshToken,
                    data:            rawData ? JSON.parse(rawData) : {},
                    isAuthenticated: true,
                })
            );
        }
    } catch {
        // stay unauthenticated
    }
};

// ─── Exported hooks ───────────────────────────────────────────────────────────

export const {
    useSendOtpMutation,
    useVerifyOtpMutation,
    useResendOtpMutation,
    useRegisterStoreMutation,
    useRegisterUserMutation,
    useLogoutRemoteMutation,
} = authApi;

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectAuthParty          = (s: { auth: AuthState }) => s.auth.party;
export const selectIsAuthenticated    = (s: { auth: AuthState }) => s.auth.isAuthenticated;
export const selectProfileData        = (s: { auth: AuthState }) => s.auth.data;
export const selectToken              = (s: { auth: AuthState }) => s.auth.token;

// ─── Supporting types ─────────────────────────────────────────────────────────

interface ApiEnvelope<T> {
    success: boolean;
    type?: "success" | "error";
    message: string;
    data: T;
}

interface VerifyOtpResponse {
    token:        string;
    refreshToken: string;
    store?:       Record<string, any>;
    user?:        Record<string, any>;
}

export interface RegisterStorePayload {
    storeName:   string;
    ownerInfo:   string;
    category:    Record<string, any>;
    address: {
        raw:         string;
        lga:         string;
        state?:      string;
        coordinates?: { type: "Point"; coordinates: [number, number] };
    };
    description?: string;
    website?:     string;
    referralCode?: string;
}

export interface RegisterUserPayload {
    fullname:      string;
    email?:        string;
    referralCode?: string;
}
