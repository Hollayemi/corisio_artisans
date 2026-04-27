import AsyncStorage from '@react-native-async-storage/async-storage';
import { createApi } from '@reduxjs/toolkit/query/react';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { router } from 'expo-router';
import { axiosBaseQuery } from '@/redux/shared/axiosBaseQuery';

// ─── Storage keys (namespaced away from store auth) ───────────────────────────

const STORAGE_KEYS = {
    token:        'user_token',
    refreshToken: 'user_refresh_token',
    userData:     'user_data',
} as const;

// ─── Types────────────────────────────────

export type UserOnboardingStatus =
    | 'phone_verified'   // OTP done, no display name yet
    | 'profile_complete' // has display name + optional avatar
    | 'active';          // fully active user

export interface UserAddress {
    lga?: string;
    state?: string;
}

export interface UserProfile {
    id: string;
    phoneNumber: string;           // primary identifier — always present
    displayName?: string;          // set during onboarding
    avatar?: string;               // URL or null
    email?: string;                // optional — user may add later
    address?: UserAddress;         // optional location preference
    isPhoneVerified: boolean;
    onboardingStatus: UserOnboardingStatus;
    createdAt: string;
    updatedAt?: string;
}

export interface UserAuthState {
    user: UserProfile | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

// ─── API response wrapper─────────────────

interface ApiResponse<T> {
    success: boolean;
    type?: 'success' | 'error';
    message: string;
    data: T;
    timestamp?: string;
}

// ─── Endpoint payload types───────────────

export interface SendOtpPayload {
    phoneNumber: string; // E.164 e.g. "+2348012345678"
}

export interface VerifyOtpPayload {
    phoneNumber: string;
    otp: string;
}

export interface ResendOtpPayload {
    phoneNumber: string;
}

export interface RefreshTokenPayload {
    refreshToken: string;
}

export interface UpdateProfilePayload {
    displayName?: string;
    email?: string;
    address?: UserAddress;
}

// ─── RTK Query API────────────────────────

export const userApi = createApi({
    reducerPath: 'userAccountApi',
    baseQuery: axiosBaseQuery("business"),
    tagTypes: ['User'],
    endpoints: (builder) => ({

        // ── POST /users/auth/send-otp─────
        // Request:  { phoneNumber: "+2348012345678" }
        // Response: { data: { phoneNumber, message } }
        sendOtp: builder.mutation<
            ApiResponse<{ phoneNumber: string; message: string }>,
            SendOtpPayload
        >({
            query: (payload) => ({
                url: '/users/auth/send-otp',
                method: 'POST',
                data: payload,
            }),
        }),

        // ── POST /users/auth/verify-otp───
        // Request:  { phoneNumber, otp }
        // Response: { data: { user, token, refreshToken } }
        // Side-effect: persists tokens + user to AsyncStorage, updates state
        verifyOtp: builder.mutation<
            ApiResponse<{
                user: UserProfile;
                token: string;
                refreshToken: string;
            }>,
            VerifyOtpPayload
        >({
            query: (payload) => ({
                url: '/users/auth/verify-otp',
                method: 'POST',
                data: payload,
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    const { user, token, refreshToken } = data.data;
                    dispatch(setUserCredentials({ user, token, refreshToken }));
                } catch {
                    // Error handled by component via .unwrap()
                }
            },
        }),

        // ── POST /users/auth/resend-otp───
        resendOtp: builder.mutation<
            ApiResponse<{ message: string }>,
            ResendOtpPayload
        >({
            query: (payload) => ({
                url: '/users/auth/resend-otp',
                method: 'POST',
                data: payload,
            }),
        }),

        // ── POST /users/auth/refresh-token
        // Used by axiosBaseQuery interceptor to silently refresh expired tokens
        refreshToken: builder.mutation<
            ApiResponse<{ token: string; refreshToken: string }>,
            RefreshTokenPayload
        >({
            query: (payload) => ({
                url: '/users/auth/refresh-token',
                method: 'POST',
                data: payload,
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    const { token, refreshToken } = data.data;
                    await AsyncStorage.setItem(STORAGE_KEYS.token, token);
                    await AsyncStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);
                    dispatch(refreshUserToken({ token, refreshToken }));
                } catch {
                    // Refresh failed — force logout
                    dispatch(logoutUser());
                }
            },
        }),

        // ── POST /users/auth/logout───────
        logout: builder.mutation<ApiResponse<null>, void>({
            query: () => ({
                url: '/users/auth/logout',
                method: 'POST',
            }),
            async onQueryStarted(_, { dispatch }) {
                // Logout locally regardless of API response
                dispatch(logoutUser());
            },
        }),

        // ── GET /users/me─────────────────
        // Fetch full profile of the currently authenticated user
        getMe: builder.query<ApiResponse<{ user: UserProfile }>, void>({
            query: () => ({
                url: '/users/me',
                method: 'GET',
            }),
            providesTags: ['User'],
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setUserProfile(data.data.user));
                } catch {
                    // Silently fail — cached state still available
                }
            },
        }),


        // ── PUT /users/me─────────────────
        // Update display name, email, or address
        updateProfile: builder.mutation<
            ApiResponse<{ user: UserProfile }>,
            UpdateProfilePayload
        >({
            query: (payload) => ({
                url: '/users/complete-profile',
                method: 'PUT',
                data: payload,
            }),
            invalidatesTags: ['User'],
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setUserProfile(data.data.user));
                } catch {
                    // Error handled by component
                }
            },
        }),

        // ── POST /users/me/avatar─────────
        // Multipart FormData upload — send as { file: FormData }
        uploadAvatar: builder.mutation<
            ApiResponse<{ avatarUrl: string }>,
            FormData
        >({
            query: (formData) => ({
                url: '/users/me/avatar',
                method: 'POST',
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
            }),
            invalidatesTags: ['User'],
        }),
    }),
});

// ─── State slice──────────────────────────

const initialState: UserAuthState = {
    user:            null,
    token:           null,
    refreshToken:    null,
    isAuthenticated: false,
    loading:         false,
    error:           null,
};

const userSlice = createSlice({
    name: 'userAuth',
    initialState,
    reducers: {

        // Called after verifyOtp succeeds — persists everything
        setUserCredentials: (
            state,
            action: PayloadAction<{
                user: UserProfile;
                token: string;
                refreshToken: string;
            }>
        ) => {
            const { user, token, refreshToken } = action.payload;
            state.user            = user;
            state.token           = token;
            state.refreshToken    = refreshToken;
            state.isAuthenticated = true;
            state.error           = null;

            // Persist to AsyncStorage (fire-and-forget)
            AsyncStorage.setItem(STORAGE_KEYS.token, token);
            AsyncStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);
            AsyncStorage.setItem(STORAGE_KEYS.userData, JSON.stringify(user));
        },

        // Called when a token refresh completes successfully
        refreshUserToken: (
            state,
            action: PayloadAction<{ token: string; refreshToken: string }>
        ) => {
            state.token        = action.payload.token;
            state.refreshToken = action.payload.refreshToken;
        },

        // Syncs profile updates into state without a full re-fetch
        setUserProfile: (state, action: PayloadAction<UserProfile>) => {
            state.user = action.payload;
            AsyncStorage.setItem(STORAGE_KEYS.userData, JSON.stringify(action.payload));
        },

        // Partial in-place update (e.g. after avatar upload)
        patchUserProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
                AsyncStorage.setItem(STORAGE_KEYS.userData, JSON.stringify(state.user));
            }
        },

        // Clears everything and navigates to user login
        logoutUser: (state) => {
            state.user            = null;
            state.token           = null;
            state.refreshToken    = null;
            state.isAuthenticated = false;
            state.error           = null;

            AsyncStorage.multiRemove([
                STORAGE_KEYS.token,
                STORAGE_KEYS.refreshToken,
                STORAGE_KEYS.userData,
            ]);

            router.replace('/user/home');
        },

        // Hydrates state on app start from AsyncStorage
        initializeUserAuth: (state, action: PayloadAction<Partial<UserAuthState>>) => {
            Object.assign(state, action.payload);
        },

        clearUserError: (state) => {
            state.error = null;
        },

        setUserLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
});

// ─── Async initializer (call once in _layout.tsx) ────────────────────────────

export const initializeUserAuthAsync = () => async (dispatch: any) => {
    try {
        const [token, refreshToken, userData] = await AsyncStorage.multiGet([
            STORAGE_KEYS.token,
            STORAGE_KEYS.refreshToken,
            STORAGE_KEYS.userData,
        ]);

        dispatch(
            initializeUserAuth({
                token:           token[1],
                refreshToken:    refreshToken[1],
                user:            userData[1] ? JSON.parse(userData[1]) : null,
                isAuthenticated: !!token[1],
                loading:         false,
                error:           null,
            })
        );
    } catch {
        dispatch(initializeUserAuth({ isAuthenticated: false, loading: false }));
    }
};

// ─── Actions──────────────────────────────

export const {
    setUserCredentials,
    refreshUserToken,
    setUserProfile,
    patchUserProfile,
    logoutUser,
    initializeUserAuth,
    clearUserError,
    setUserLoading,
} = userSlice.actions;

export default userSlice.reducer;

// ─── Selectors────────────────────────────

type RootState = { userAuth: UserAuthState };

export const selectCurrentUser         = (s: RootState) => s.userAuth.user;
export const selectUserToken           = (s: RootState) => s.userAuth.token;
export const selectUserRefreshToken    = (s: RootState) => s.userAuth.refreshToken;
export const selectIsUserAuthenticated = (s: RootState) => s.userAuth.isAuthenticated;
export const selectUserLoading         = (s: RootState) => s.userAuth.loading;
export const selectUserError           = (s: RootState) => s.userAuth.error;

// Convenience — phone number is the source of truth identifier
export const selectUserPhone = (s: RootState) => s.userAuth.user?.phoneNumber ?? null;

// Is the user past OTP but hasn't set a display name yet?
export const selectNeedsProfileSetup = (s: RootState) =>
    s.userAuth.user?.onboardingStatus === 'phone_verified';

// ─── RTK Query hooks──────────────────────

export const {
    useSendOtpMutation,
    useVerifyOtpMutation,
    useResendOtpMutation,
    useRefreshTokenMutation,
    useLogoutMutation,
    useGetMeQuery,
    useUpdateProfileMutation,
    useUploadAvatarMutation,
} = userApi;
