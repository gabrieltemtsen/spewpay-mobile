import type { AuthResponse, LoginRequest, SignupRequest, User } from '@/types';
import apiClient, { TokenStorage } from './api-client';

export const authService = {
    /**
     * Login with email and password
     */
    async login(data: LoginRequest): Promise<AuthResponse> {
        const response = await apiClient.post<{ success: true; data: AuthResponse }>(
            '/auth/login',
            data
        );

        // Store tokens
        await TokenStorage.setToken(response.data.data.accessToken);
        await TokenStorage.setRefreshToken(response.data.data.refreshToken);

        return response.data.data;
    },

    /**
     * Register a new user
     */
    async signup(data: SignupRequest): Promise<AuthResponse> {
        const response = await apiClient.post<{ success: true; data: AuthResponse }>(
            '/auth/register',
            data
        );

        // Store tokens
        await TokenStorage.setToken(response.data.data.accessToken);
        await TokenStorage.setRefreshToken(response.data.data.refreshToken);

        return response.data.data;
    },

    /**
     * Logout - clear tokens
     */
    async logout(): Promise<void> {
        await TokenStorage.clearTokens();
    },

    /**
     * Get current user profile
     */
    async getProfile(): Promise<User> {
        const response = await apiClient.get<{ success: true; data: User }>('/auth/me');
        return response.data.data;
    },

    /**
     * Check if user is authenticated
     */
    async isAuthenticated(): Promise<boolean> {
        const token = await TokenStorage.getToken();
        return !!token;
    },

    /**
     * Refresh access token
     */
    async refreshToken(): Promise<string> {
        const refreshToken = await TokenStorage.getRefreshToken();
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await apiClient.post<{ success: true; data: { accessToken: string } }>(
            '/auth/refresh',
            { refreshToken }
        );

        const newToken = response.data.data.accessToken;
        await TokenStorage.setToken(newToken);

        return newToken;
    },
};
