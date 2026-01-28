import { authService, LoginRequest, RegisterRequest } from '@/services/auth.service';
import type { User } from '@/types';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

interface AuthContextType extends AuthState {
    login: (data: LoginRequest) => Promise<void>;
    signup: (data: RegisterRequest) => Promise<void>;
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
            const isAuth = await authService.isAuthenticated();
            if (isAuth) {
                const storedUser = await authService.getStoredUser();
                setUser(storedUser);
            }
        } catch (error) {
            console.error('Error checking auth state:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = useCallback(async (data: LoginRequest) => {
        try {
            const response = await authService.login(data);
            setUser(response.user);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }, []);

    const signup = useCallback(async (data: RegisterRequest) => {
        try {
            const response = await authService.register(data);
            setUser(response.user);
        } catch (error) {
            console.error('Signup error:', error);
            throw error;
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await authService.logout();
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    }, []);

    const refreshUser = useCallback(async () => {
        try {
            const storedUser = await authService.getStoredUser();
            setUser(storedUser);
        } catch (error) {
            console.error('Error refreshing user:', error);
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
