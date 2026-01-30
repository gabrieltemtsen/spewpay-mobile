import type { ApiResponse, Transaction, User } from '@/types';
import * as Crypto from 'expo-crypto';
import apiClient from './api-client';

export const transferService = {
    /**
     * Transfer funds between users (internal P2P transfer)
     * POST /transfers/internal
     */
    async internalTransfer(params: {
        sourceUserId: string;
        destinationUserId: string;
        amountInNaira: number;
        description?: string;
        idempotencyKey?: string;
    }): Promise<Transaction> {
        const response = await apiClient.post<ApiResponse<Transaction>>('/transfers/internal', {
            sourceUserId: params.sourceUserId,
            destinationUserId: params.destinationUserId,
            amountInNaira: params.amountInNaira,
            description: params.description,
            idempotencyKey: params.idempotencyKey || Crypto.randomUUID(),
        });
        const body = response.data;
        // Unwrap if wrapped, otherwise return as-is
        return (body as any).id ? body as unknown as Transaction : (body as unknown as ApiResponse<Transaction>).data;
    },

    /**
     * Search for users to transfer to
     * GET /users
     */
    async searchUsers(query?: string): Promise<User[]> {
        const response = await apiClient.get<User[]>('/users');
        // Filter client-side if query provided
        if (query) {
            return response.data.filter(
                (user) =>
                    user.displayName?.toLowerCase().includes(query.toLowerCase()) ||
                    user.email?.toLowerCase().includes(query.toLowerCase())
            );
        }
        return response.data;
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
