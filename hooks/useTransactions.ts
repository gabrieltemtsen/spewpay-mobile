import { useAuth } from '@/contexts';
import { walletService } from '@/services/wallet.service';
import type { Transaction } from '@/types';
import { useCallback, useEffect, useState } from 'react';

export const useTransactions = () => {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchTransactions = useCallback(async (pageNum: number = 1, isRefresh: boolean = false) => {
        if (!user) return;

        try {
            if (isRefresh) {
                setIsRefreshing(true);
            } else if (pageNum === 1) {
                setIsLoading(true);
            }

            setError(null);

            // Get user wallet first
            const userWallet = await walletService.getUserWallet(user.id);
            if (!userWallet?.id) {
                throw new Error('Wallet not found');
            }

            // Fetch transactions
            const result = await walletService.getTransactions(userWallet.id, pageNum, 20);

            // Handle both wrapped and unwrapped responses
            const txData = Array.isArray(result.data) ? result.data : [];

            if (pageNum === 1 || isRefresh) {
                setTransactions(txData);
            } else {
                setTransactions(prev => [...prev, ...txData]);
            }

            // Check if there are more pages
            setHasMore(txData.length === 20);
            setPage(pageNum);
        } catch (err: any) {
            console.error('Fetch transactions error:', err);
            setError(err.message || 'Failed to load transactions');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [user]);

    const refresh = useCallback(() => {
        fetchTransactions(1, true);
    }, [fetchTransactions]);

    const loadMore = useCallback(() => {
        if (!isLoading && hasMore) {
            fetchTransactions(page + 1);
        }
    }, [isLoading, hasMore, page, fetchTransactions]);

    useEffect(() => {
        if (user) {
            fetchTransactions(1);
        }
    }, [user]);

    return {
        transactions,
        isLoading,
        isRefreshing,
        error,
        hasMore,
        refresh,
        loadMore,
    };
};
