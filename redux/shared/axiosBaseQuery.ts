import { server } from "@/config/server";
import toaster from "@/config/toaster";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { router } from "expo-router";
import { jwtDecode } from "jwt-decode";
export type TokenOwner = "business" | "user" | "auto" | "none";

const TOKEN_KEYS: Record<"business" | "user" | 'none', string> = {
    business: "business_token",
    user: "user_token",
    none: "",
};

export const getToken = async (owner: TokenOwner = "auto"): Promise<string | null> => {
    if (owner === "auto") {
        const business = await AsyncStorage.getItem(TOKEN_KEYS.business);
        if (business) return business;
        return AsyncStorage.getItem(TOKEN_KEYS.user);
    }
    return AsyncStorage.getItem(TOKEN_KEYS[owner]);
};

export const isAuthenticated = async (owner: TokenOwner = "auto"): Promise<boolean> => {
    try {
        const token = await getToken(owner);
        console.log("Token for owner", owner, ":", token);
        if (!token) return false;
        const decoded = jwtDecode<{ exp?: number }>(token);

        console.log(decoded)

        if (typeof decoded.exp !== "number") return false;
        return decoded.exp > Date.now() / 1000;
    } catch {
        return false;
    }
};

export const clearAllTokens = async () => {
    await AsyncStorage.removeItem("business_token");
    await AsyncStorage.removeItem("business_refresh_token");
    await AsyncStorage.removeItem("business_data");
    await AsyncStorage.removeItem("user_token");
    await AsyncStorage.removeItem("user_refresh_token");
    await AsyncStorage.removeItem("user_data");
};

export type AxiosBaseQueryArgs = {
    url: string;
    method: AxiosRequestConfig["method"];
    data?: AxiosRequestConfig["data"];
    params?: AxiosRequestConfig["params"];
    headers?: Record<string, string>;
    tokenOwner?: TokenOwner;
    skipErrorHandling?: boolean;
};

interface CustomError {
    status: number | string;
    data: any;
}

export const axiosBaseQuery =
    (defaultTokenOwner: TokenOwner | "none" = "auto"): BaseQueryFn<AxiosBaseQueryArgs, unknown, CustomError> =>
    async ({ url, method, data, params, headers = {}, tokenOwner, skipErrorHandling = false }) => {
        const owner = (tokenOwner ?? defaultTokenOwner) as TokenOwner | "none";
        try {
            let authHeader: Record<string, string> = {};

            if (owner !== "none") {
                const token = await getToken(owner as TokenOwner);
                if (token) authHeader = { Authorization: `Bearer ${token}` };
            }

            const res = await axios({
                url: `${server}/api/v1${url}`,
                method,
                data,
                params,
                headers: { "Content-Type": "application/json", ...authHeader, ...headers },
                timeout: 12000,
            });

            return { data: res.data };
        } catch (err) {
            const axiosErr = err as AxiosError;
            const status = axiosErr.response?.status ?? "NETWORK_ERROR";
            const errorData = axiosErr.response?.data ?? { message: axiosErr.message };

            if (!skipErrorHandling) {
                // Network error → broken screen
                if (!axiosErr.response) {
                    const netInfo = await NetInfo.fetch();
                    if (!netInfo.isConnected) {
                        router.push({ pathname: "/broken", params: { errorType: "network" } });
                        return { error: { status, data: errorData } };
                    }
                }

                const isAuthed = await isAuthenticated(owner);

                console.log(owner, isAuthed)

                // Auth error, clear tokens + go to login
                if (status === 401 || status === 403 || !isAuthed) {
                    await clearAllTokens();
                    router.push({pathname:"/auth/Login", params: {party: owner}});
                    return { error: { status, data: errorData } };
                }

                if (typeof status === "number" && status >= 500) {
                    toaster({ type: "error", message: "Server error. Please try again." });
                }
            }

            return { error: { status, data: errorData } };
        }
    };
