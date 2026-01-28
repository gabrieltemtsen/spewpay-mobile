import type {
    LedgerEntry,
    PaginatedResponse,
    Transaction,
    Wallet,
    WalletBalance
} from '@/types';
import apiClient from './api-client';

export const walletService = {
    /**
     * Get wallet for a user
     * GET /wallets/user/{userId}
     */
    async getUserWallet(userId: string): Promise<Wallet> {
        const response = await apiClient.get<Wallet>(`/wallets/user/${userId}`);
        return response.data;
    },

    /**
     * Get wallet balance
     * GET /wallets/{walletId}/balance
     */
    async getBalance(walletId: string): Promise<WalletBalance> {
        const response = await apiClient.get<WalletBalance>(`/wallets/${walletId}/balance`);
        return response.data;
    },

    /**
     * Get wallet transaction history
     * GET /wallets/{walletId}/transactions
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
     * Get wallet ledger entries (detailed statement)
     * GET /wallets/{walletId}/ledger
     */
    async getLedgerEntries(
        walletId: string,
        page: number = 1,
        limit: number = 20
    ): Promise<PaginatedResponse<LedgerEntry>> {
        const response = await apiClient.get<PaginatedResponse<LedgerEntry>>(
            `/wallets/${walletId}/ledger`,
            { params: { page, limit } }
        );
        return response.data;
    },
};
