import { ApiError } from '@/types';
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Production API URL
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.spewpay.com/api/v1';
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_data';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Platform-aware storage helper
// expo-secure-store only works on iOS/Android, use localStorage on web
const Storage = {
    async getItem(key: string): Promise<string | null> {
        if (Platform.OS === 'web') {
            return localStorage.getItem(key);
        }
        return await SecureStore.getItemAsync(key);
    },

    async setItem(key: string, value: string): Promise<void> {
        if (Platform.OS === 'web') {
            localStorage.setItem(key, value);
            return;
        }
        await SecureStore.setItemAsync(key, value);
    },

    async removeItem(key: string): Promise<void> {
        if (Platform.OS === 'web') {
            localStorage.removeItem(key);
            return;
        }
        await SecureStore.deleteItemAsync(key);
    },
};

// Token management - uses platform-aware storage
export const TokenStorage = {
    async getToken(): Promise<string | null> {
        try {
            return await Storage.getItem(TOKEN_KEY);
        } catch {
            return null;
        }
    },

    async setToken(token: string): Promise<void> {
        await Storage.setItem(TOKEN_KEY, token);
    },

    async getRefreshToken(): Promise<string | null> {
        try {
            return await Storage.getItem(REFRESH_TOKEN_KEY);
        } catch {
            return null;
        }
    },

    async setRefreshToken(token: string): Promise<void> {
        await Storage.setItem(REFRESH_TOKEN_KEY, token);
    },

    async clearTokens(): Promise<void> {
        await Storage.removeItem(TOKEN_KEY);
        await Storage.removeItem(REFRESH_TOKEN_KEY);
        await Storage.removeItem(USER_KEY);
    },

    async setUser(user: object): Promise<void> {
        await Storage.setItem(USER_KEY, JSON.stringify(user));
    },

    async getUser(): Promise<object | null> {
        try {
            const userStr = await Storage.getItem(USER_KEY);
            return userStr ? JSON.parse(userStr) : null;
        } catch {
            return null;
        }
    },
};

// Request interceptor - add auth token
apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const token = await TokenStorage.getToken();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Log requests in development
        if (__DEV__) {
            console.log(`🌐 ${config.method?.toUpperCase()} ${config.url}`, config.data || '');
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
    (response) => {
        if (__DEV__) {
            console.log(`✅ ${response.config.url}`, response.data);
        }
        return response;
    },
    async (error: AxiosError<ApiError>) => {
        if (__DEV__) {
            console.error(`❌ ${error.config?.url}`, error.response?.data || error.message);
        }

        // Handle 401 - clear tokens and redirect to login
        if (error.response?.status === 401) {
            await TokenStorage.clearTokens();
            // Auth context will handle the redirect
        }

        // Normalize error
        const apiError: ApiError = error.response?.data || {
            statusCode: error.response?.status || 500,
            message: error.message || 'An unexpected error occurred',
            error: 'Network Error',
        };

        return Promise.reject(apiError);
    }
);

export default apiClient;
