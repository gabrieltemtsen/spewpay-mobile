import { useAuth } from '@/contexts';
import type { BankAccount } from '@/types';
import { useCallback, useEffect, useState } from 'react';

// Mock service - replace with actual API calls
const mockBankAccounts: BankAccount[] = [];

export const useBankAccounts = () => {
    const { user } = useAuth();
    const [accounts, setAccounts] = useState<BankAccount[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAccounts = useCallback(async () => {
        if (!user) return;

        setIsLoading(true);
        setError(null);

        try {
            // TODO: Replace with actual API call
            // const response = await bankService.getBankAccounts(user.id);
            // setAccounts(response.data);
            setAccounts(mockBankAccounts);
        } catch (err: any) {
            console.error('Fetch bank accounts error:', err);
            setError(err.message || 'Failed to load bank accounts');
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    const addBankAccount = useCallback(async (accountData: Partial<BankAccount>) => {
        setIsLoading(true);
        setError(null);

        try {
            // TODO: Replace with actual API call
            // const response = await bankService.addBankAccount(accountData);
            // setAccounts(prev => [...prev, response.data]);
            console.log('Add bank account:', accountData);
        } catch (err: any) {
            console.error('Add bank account error:', err);
            setError(err.message || 'Failed to add bank account');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const removeBankAccount = useCallback(async (accountId: string) => {
        setIsLoading(true);
        setError(null);

        try {
            // TODO: Replace with actual API call
            // await bankService.removeBankAccount(accountId);
            setAccounts(prev => prev.filter(acc => acc.id !== accountId));
        } catch (err: any) {
            console.error('Remove bank account error:', err);
            setError(err.message || 'Failed to remove bank account');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user) {
            fetchAccounts();
        }
    }, [user, fetchAccounts]);

    return {
        accounts,
        isLoading,
        error,
        addBankAccount,
        removeBankAccount,
        refresh: fetchAccounts,
    };
};
