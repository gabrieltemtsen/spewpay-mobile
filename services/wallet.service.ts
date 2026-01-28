import type {
    LedgerEntry,
    PaginatedResponse,
    Transaction,
    Wallet,
    WalletBalance,
} from '@/types';
import apiClient from './api-client';

export const walletService = {
    /**
     * Get wallet by user ID
     */
    async getWalletByUserId(userId: string): Promise<Wallet> {
        const response = await apiClient.get<Wallet>(`/wallets/user/${userId}`);
        return response.data;
    },

    /**
     * Get detailed wallet balance (cached + ledger)
     */
    async getBalance(walletId: string): Promise<WalletBalance> {
        const response = await apiClient.get<WalletBalance>(`/wallets/${walletId}/balance`);
        return response.data;
    },

    /**
     * Get transaction history
     */
    async getTransactions(
        walletId: string,
        page: number = 1,
        limit: number = 20
    ): Promise<PaginatedResponse<Transaction>> {
        const response = await apiClient.get<PaginatedResponse<Transaction>>(
            `/wallets/${walletId}/transactions`,
            { params: { page, limit } }
        );
        return response.data;
    },

    /**
     * Get ledger entries (detailed movement tracking)
     */
    async getLedger(
        walletId: string,
        page: number = 1,
        limit: number = 50
    ): Promise<PaginatedResponse<LedgerEntry>> {
        const response = await apiClient.get<PaginatedResponse<LedgerEntry>>(
            `/wallets/${walletId}/ledger`,
            { params: { page, limit } }
        );
        return response.data;
    },
};
