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
        const response = await apiClient.get<any>(`/wallets/user/${userId}`);
        const body = response.data;
        // If body has 'id', it's the wallet. If not and has 'data', it's wrapped.
        return (body.id) ? body : body.data;
    },

    /**
     * Get wallet balance
     * GET /wallets/{walletId}/balance
     */
    async getBalance(walletId: string): Promise<WalletBalance> {
        const response = await apiClient.get<any>(`/wallets/${walletId}/balance`);
        const body = response.data;
        return (body.walletId || body.cachedBalance) ? body : body.data;
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
        const response = await apiClient.get<any>(
            `/wallets/${walletId}/transactions`,
            { params: { page, limit } }
        );
        const body = response.data;
        // If body.data is Array, it's flat PaginatedResponse.
        // If body.data is Object, it's wrapped (because data.data would be array)
        return Array.isArray(body.data) ? body : body.data;
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
        const response = await apiClient.get<any>(
            `/wallets/${walletId}/ledger`,
            { params: { page, limit } }
        );
        const body = response.data;
        return Array.isArray(body.data) ? body : body.data;
    },
};
