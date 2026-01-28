import type { User } from '@/types';
import apiClient, { TokenStorage } from './api-client';

// Registration request matches API spec
export interface RegisterRequest {
    email: string;
    displayName: string;
    password: string;
}

// Login request matches API spec
export interface LoginRequest {
    email: string;
    password: string;
}

// Auth response from API
export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken?: string;
}

export const authService = {
    /**
     * Register a new user
     * POST /auth/register
     */
    async register(data: RegisterRequest): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/register', data);

        // Store tokens and user
        if (response.data.accessToken) {
            await TokenStorage.setToken(response.data.accessToken);
        }
        if (response.data.refreshToken) {
            await TokenStorage.setRefreshToken(response.data.refreshToken);
        }
        if (response.data.user) {
            await TokenStorage.setUser(response.data.user);
        }

        return response.data;
    },

    /**
     * Login with email and password
     * POST /auth/login
     */
    async login(data: LoginRequest): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/login', data);

        // Store tokens and user
        if (response.data.accessToken) {
            await TokenStorage.setToken(response.data.accessToken);
        }
        if (response.data.refreshToken) {
            await TokenStorage.setRefreshToken(response.data.refreshToken);
        }
        if (response.data.user) {
            await TokenStorage.setUser(response.data.user);
        }

        return response.data;
    },

    /**
     * Request password reset
     * POST /auth/forgot-password
     */
    async forgotPassword(email: string): Promise<void> {
        await apiClient.post('/auth/forgot-password', { email });
    },

    /**
     * Reset password with token
     * POST /auth/reset-password
     */
    async resetPassword(token: string, password: string): Promise<void> {
        await apiClient.post('/auth/reset-password', { token, password });
    },

    /**
     * Verify email with token
     * POST /auth/verify-email
     */
    async verifyEmail(email: string, token: string): Promise<void> {
        await apiClient.post('/auth/verify-email', { email, token });
    },

    /**
     * Logout - clear all stored tokens
     */
    async logout(): Promise<void> {
        await TokenStorage.clearTokens();
    },

    /**
     * Get stored user
     */
    async getStoredUser(): Promise<User | null> {
        const user = await TokenStorage.getUser();
        return user as User | null;
    },

    /**
     * Check if user is authenticated
     */
    async isAuthenticated(): Promise<boolean> {
        const token = await TokenStorage.getToken();
        return !!token;
    },

    /**
     * Get user by ID
     * GET /users/{id}
     */
    async getUserById(userId: string): Promise<User> {
        const response = await apiClient.get<User>(`/users/${userId}`);
        return response.data;
    },
};
