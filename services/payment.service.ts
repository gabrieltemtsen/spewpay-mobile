import type { Bank, BankAccount, DepositInitResponse, Transaction, WithdrawalResult } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import apiClient from './api-client';

// Paystack callback URL for mobile
const PAYSTACK_CALLBACK_URL = 'spewpay://payment/callback';

export const paymentService = {
    // ============ DEPOSITS ============

    /**
     * Initialize a deposit transaction
     * POST /payments/deposits/initialize
     */
    async initializeDeposit(params: {
        userId: string;
        email: string;
        amountInNaira: number;
        callbackUrl?: string;
        idempotencyKey?: string;
    }): Promise<DepositInitResponse> {
        const response = await apiClient.post<DepositInitResponse>('/payments/deposits/initialize', {
            userId: params.userId,
            email: params.email,
            amountInNaira: params.amountInNaira,
            callbackUrl: params.callbackUrl || PAYSTACK_CALLBACK_URL,
            idempotencyKey: params.idempotencyKey || uuidv4(),
        });
        return response.data;
    },

    /**
     * Verify a deposit transaction
     * GET /payments/deposits/{reference}/verify
     */
    async verifyDeposit(reference: string): Promise<Transaction> {
        const response = await apiClient.get<Transaction>(`/payments/deposits/${reference}/verify`);
        return response.data;
    },

    // ============ BANK ACCOUNTS (via Transfers endpoint) ============

    /**
     * List all supported banks
     * GET /transfers/banks
     */
    async listBanks(): Promise<Bank[]> {
        const response = await apiClient.get<Bank[]>('/transfers/banks');
        return response.data;
    },

    /**
     * Resolve bank account to get account name
     * POST /transfers/resolve-account
     */
    async resolveAccount(accountNumber: string, bankCode: string): Promise<{ account_name: string; account_number: string }> {
        const response = await apiClient.post('/transfers/resolve-account', {
            accountNumber,
            bankCode,
        });
        return response.data;
    },

    /**
     * Get all bank accounts for a user
     * GET /transfers/recipients?userId=xxx
     */
    async listBankAccounts(userId: string): Promise<BankAccount[]> {
        const response = await apiClient.get<BankAccount[]>('/transfers/recipients', {
            params: { userId },
        });
        return response.data;
    },

    /**
     * Add a bank account for withdrawals
     * POST /transfers/recipients
     */
    async addBankAccount(params: {
        userId: string;
        accountNumber: string;
        bankCode: string;
        isDefault?: boolean;
    }): Promise<BankAccount> {
        const response = await apiClient.post<BankAccount>('/transfers/recipients', params);
        return response.data;
    },

    /**
     * Delete a bank account
     * DELETE /transfers/recipients/{recipientId}?userId=xxx
     */
    async deleteBankAccount(recipientId: string, userId: string): Promise<void> {
        await apiClient.delete(`/transfers/recipients/${recipientId}`, {
            params: { userId },
        });
    },

    // ============ WITHDRAWALS ============

    /**
     * Initiate a withdrawal to a bank account
     * POST /transfers/withdraw
     */
    async initiateWithdrawal(params: {
        userId: string;
        recipientId: string;
        amountInNaira: number;
        reason?: string;
        idempotencyKey?: string;
    }): Promise<WithdrawalResult> {
        const response = await apiClient.post<WithdrawalResult>('/transfers/withdraw', {
            userId: params.userId,
            recipientId: params.recipientId,
            amountInNaira: params.amountInNaira,
            reason: params.reason,
            idempotencyKey: params.idempotencyKey || uuidv4(),
        });
        return response.data;
    },
};
