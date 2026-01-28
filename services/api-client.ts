import { ApiError } from '@/types';
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';

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

// Token management
export const TokenStorage = {
    async getToken(): Promise<string | null> {
        try {
            return await SecureStore.getItemAsync(TOKEN_KEY);
        } catch {
            return null;
        }
    },

    async setToken(token: string): Promise<void> {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
    },

    async getRefreshToken(): Promise<string | null> {
        try {
            return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
        } catch {
            return null;
        }
    },

    async setRefreshToken(token: string): Promise<void> {
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
    },

    async clearTokens(): Promise<void> {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
        await SecureStore.deleteItemAsync(USER_KEY);
    },

    async setUser(user: object): Promise<void> {
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    },

    async getUser(): Promise<object | null> {
        try {
            const userStr = await SecureStore.getItemAsync(USER_KEY);
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
