import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '@/contexts';
import { walletService } from '@/services/wallet.service';
import type { Transaction, Wallet, WalletBalance } from '@/types';

export function useWallet() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [balance, setBalance] = useState<WalletBalance | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const fetchData = useCallback(async (refreshing = false) => {
        if (!user) return;

        try {
            if (refreshing) {
                setIsRefreshing(true);
            } else {
                setIsLoading(true);
            }
            setError(null);

            // 1. Get wallet (if we don't have ID yet, we'd loop up by user)
            // Ideally backend provides this. For now let's assume we fetch user wallet first
            const userWallet = await walletService.getUserWallet(user.id);
            setWallet(userWallet);

            if (userWallet?.id) {
                // 2. Fetch balance and recent transactions
                const [balanceData, transactionsData] = await Promise.all([
                    walletService.getBalance(userWallet.id),
                    walletService.getTransactions(userWallet.id, 1, 10), // fetch top 10
                ]);

                setBalance(balanceData);

                // Robust check for transactions data structure
                console.log('📊 Transactions response:', JSON.stringify(transactionsData, null, 2));

                let txList: Transaction[] = [];
                if (transactionsData && Array.isArray(transactionsData.data)) {
                    txList = transactionsData.data;
                } else if (Array.isArray(transactionsData)) {
                    // Handle case where API returns raw array
                    txList = transactionsData as any;
                }

                setTransactions(txList);
            }
        } catch (err: any) {
            console.error('Failed to fetch wallet data:', err);
            setError(err.message || 'Failed to load wallet data');
            // Ensure we don't leave it in weird state, but keep existing data if any
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [user]);

    // Initial fetch handled by component or separate effect if needed
    // but usually triggered on mount or focus

    // Memoize the public functions
    const refresh = useCallback(() => fetchData(true), [fetchData]);
    const manualFetch = useCallback(() => fetchData(false), [fetchData]);

    // Automatically fetch when user is available (mount/user change)
    useEffect(() => {
        if (user) {
            fetchData(false);
        }
    }, [fetchData, user]);

    return {
        wallet,
        balance,
        transactions,
        isLoading,
        isRefreshing,
        error,
        refresh,
        fetchData: manualFetch,
    };
}
