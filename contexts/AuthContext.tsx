import { authService, TokenStorage } from '@/services';
import type { LoginRequest, SignupRequest, User } from '@/types';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (data: LoginRequest) => Promise<void>;
    signup: (data: SignupRequest) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check auth state on mount
    useEffect(() => {
        checkAuthState();
    }, []);

    const checkAuthState = async () => {
        try {
            const hasToken = await authService.isAuthenticated();
            if (hasToken) {
                const profile = await authService.getProfile();
                setUser(profile);
            }
        } catch (error) {
            // Token might be expired, clear it
            await TokenStorage.clearTokens();
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = useCallback(async (data: LoginRequest) => {
        setIsLoading(true);
        try {
            const response = await authService.login(data);
            setUser(response.user);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const signup = useCallback(async (data: SignupRequest) => {
        setIsLoading(true);
        try {
            const response = await authService.signup(data);
            setUser(response.user);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        setIsLoading(true);
        try {
            await authService.logout();
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const refreshUser = useCallback(async () => {
        try {
            const profile = await authService.getProfile();
            setUser(profile);
        } catch {
            // Silently fail
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                signup,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
