import type {
    AddBankAccountRequest,
    Bank,
    BankAccount,
    InitializeDepositRequest,
    InitializeDepositResponse,
    InitiateWithdrawalRequest,
    ResolveAccountRequest,
    ResolvedAccount,
    VerifyDepositResponse,
    WithdrawalResponse,
} from '@/types';
import apiClient from './api-client';

export const paymentService = {
    // ============ Deposit Operations ============

    /**
     * Initialize a deposit (fund wallet)
     */
    async initializeDeposit(data: InitializeDepositRequest): Promise<InitializeDepositResponse['data']> {
        const response = await apiClient.post<InitializeDepositResponse>(
            '/payments/deposits/initialize',
            data
        );
        return response.data.data;
    },

    /**
     * Verify deposit status
     */
    async verifyDeposit(reference: string): Promise<VerifyDepositResponse['data']> {
        const response = await apiClient.get<VerifyDepositResponse>(
            `/payments/deposits/${reference}/verify`
        );
        return response.data.data;
    },

    // ============ Bank Account Operations ============

    /**
     * Get list of supported banks
     */
    async getBanks(): Promise<Bank[]> {
        const response = await apiClient.get<{ success: true; data: Bank[] }>('/transfers/banks');
        return response.data.data;
    },

    /**
     * Resolve bank account (verify before adding)
     */
    async resolveAccount(data: ResolveAccountRequest): Promise<ResolvedAccount> {
        const response = await apiClient.post<{ success: true; data: ResolvedAccount }>(
            '/transfers/resolve-account',
            data
        );
        return response.data.data;
    },

    /**
     * Add a new bank account
     */
    async addBankAccount(data: AddBankAccountRequest): Promise<BankAccount> {
        const response = await apiClient.post<{ success: true; data: BankAccount }>(
            '/transfers/recipients',
            data
        );
        return response.data.data;
    },

    /**
     * Get user's saved bank accounts
     */
    async getBankAccounts(userId: string): Promise<BankAccount[]> {
        const response = await apiClient.get<{ success: true; data: BankAccount[] }>(
            '/transfers/recipients',
            { params: { userId } }
        );
        return response.data.data;
    },

    /**
     * Delete a bank account
     */
    async deleteBankAccount(recipientId: string, userId: string): Promise<void> {
        await apiClient.delete(`/transfers/recipients/${recipientId}`, {
            params: { userId },
        });
    },

    // ============ Withdrawal Operations ============

    /**
     * Initiate withdrawal to bank account
     */
    async initiateWithdrawal(data: InitiateWithdrawalRequest): Promise<WithdrawalResponse['data']> {
        const response = await apiClient.post<WithdrawalResponse>('/transfers/withdraw', data);
        return response.data.data;
    },
};
