import type { InternalTransferRequest, TransferResponse, User } from '@/types';
import apiClient from './api-client';

export const transferService = {
    /**
     * Internal P2P transfer between users
     */
    async sendMoney(data: InternalTransferRequest): Promise<TransferResponse['data']> {
        const response = await apiClient.post<TransferResponse>('/transfers/internal', data);
        return response.data.data;
    },

    /**
     * Search for users to transfer to
     */
    async searchUsers(query: string): Promise<User[]> {
        const response = await apiClient.get<{ success: true; data: User[] }>('/users/search', {
            params: { q: query },
        });
        return response.data.data;
    },

    /**
     * Get user by ID (for recipient details)
     */
    async getUserById(userId: string): Promise<User> {
        const response = await apiClient.get<{ success: true; data: User }>(`/users/${userId}`);
        return response.data.data;
    },
};
