import { useAuth } from '@/contexts';
import type { Transaction } from '@/types';
import { useQuery } from '@tanstack/react-query';

interface SpendingCategory {
    category: string;
    amount: number;
    percentage: number;
    count: number;
    color: string;
}

interface SpendingInsight {
    totalSpent: number;
    totalReceived: number;
    netFlow: number;
    transactionCount: number;
    averageTransaction: number;
    topCategories: SpendingCategory[];
    dailySpending: { date: string; amount: number }[];
    weeklyTrend: number; // percentage change from last week
    monthlyTrend: number; // percentage change from last month
}

const CATEGORY_COLORS: Record<string, string> = {
    'Transfer': '#0066FF',
    'Bills': '#8B5CF6',
    'Shopping': '#00E699',
    'Food': '#F59E0B',
    'Transport': '#F43F5E',
    'Entertainment': '#06B6D4',
    'Other': '#64748B',
};

// Categorize transaction based on description/type
const categorizeTransaction = (tx: Transaction): string => {
    const desc = (tx.description || '').toLowerCase();
    if (desc.includes('airtime') || desc.includes('data') || desc.includes('electricity') || desc.includes('cable')) {
        return 'Bills';
    }
    if (desc.includes('food') || desc.includes('restaurant') || desc.includes('eat')) {
        return 'Food';
    }
    if (desc.includes('uber') || desc.includes('bolt') || desc.includes('transport') || desc.includes('fuel')) {
        return 'Transport';
    }
    if (desc.includes('netflix') || desc.includes('spotify') || desc.includes('movie')) {
        return 'Entertainment';
    }
    if (desc.includes('shop') || desc.includes('store') || desc.includes('buy')) {
        return 'Shopping';
    }
    if (tx.type === 'TRANSFER') {
        return 'Transfer';
    }
    return 'Other';
};

// Calculate insights from transactions
const calculateInsights = (transactions: Transaction[]): SpendingInsight => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    // Filter completed transactions
    const completed = transactions.filter(tx => tx.status === 'COMPLETED');

    // Calculate totals
    let totalSpent = 0;
    let totalReceived = 0;
    const categoryTotals: Record<string, { amount: number; count: number }> = {};
    const dailyTotals: Record<string, number> = {};

    // Last week/month spending for trends
    let lastWeekSpent = 0;
    let previousWeekSpent = 0;
    let lastMonthSpent = 0;
    let previousMonthSpent = 0;

    completed.forEach(tx => {
        const amount = tx.amount.naira;
        const date = new Date(tx.createdAt);
        const dateKey = date.toISOString().split('T')[0];

        if (tx.type === 'WITHDRAWAL' || tx.type === 'TRANSFER') {
            totalSpent += amount;

            // Category tracking
            const category = categorizeTransaction(tx);
            if (!categoryTotals[category]) {
                categoryTotals[category] = { amount: 0, count: 0 };
            }
            categoryTotals[category].amount += amount;
            categoryTotals[category].count += 1;

            // Daily tracking
            dailyTotals[dateKey] = (dailyTotals[dateKey] || 0) + amount;

            // Weekly trends
            if (date >= oneWeekAgo) {
                lastWeekSpent += amount;
            } else if (date >= twoWeeksAgo) {
                previousWeekSpent += amount;
            }

            // Monthly trends
            if (date >= oneMonthAgo) {
                lastMonthSpent += amount;
            } else if (date >= twoMonthsAgo) {
                previousMonthSpent += amount;
            }
        } else if (tx.type === 'DEPOSIT') {
            totalReceived += amount;
        }
    });

    // Build top categories
    const topCategories: SpendingCategory[] = Object.entries(categoryTotals)
        .map(([category, data]) => ({
            category,
            amount: data.amount,
            percentage: totalSpent > 0 ? (data.amount / totalSpent) * 100 : 0,
            count: data.count,
            color: CATEGORY_COLORS[category] || CATEGORY_COLORS.Other,
        }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);

    // Build daily spending (last 7 days)
    const dailySpending: { date: string; amount: number }[] = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dateKey = date.toISOString().split('T')[0];
        dailySpending.push({
            date: dateKey,
            amount: dailyTotals[dateKey] || 0,
        });
    }

    // Calculate trends
    const weeklyTrend = previousWeekSpent > 0
        ? ((lastWeekSpent - previousWeekSpent) / previousWeekSpent) * 100
        : 0;
    const monthlyTrend = previousMonthSpent > 0
        ? ((lastMonthSpent - previousMonthSpent) / previousMonthSpent) * 100
        : 0;

    return {
        totalSpent,
        totalReceived,
        netFlow: totalReceived - totalSpent,
        transactionCount: completed.length,
        averageTransaction: completed.length > 0 ? totalSpent / completed.length : 0,
        topCategories,
        dailySpending,
        weeklyTrend,
        monthlyTrend,
    };
};

export function useSpendingInsights(period: 'week' | 'month' | 'all' = 'month') {
    const { user } = useAuth();

    // In a real app, this would fetch from an API
    // For now, we'll use mock data
    const insightsQuery = useQuery({
        queryKey: ['spending-insights', user?.id, period],
        queryFn: async () => {
            // Simulate API call with mock data
            const mockTransactions: Transaction[] = [
                { id: '1', reference: 'TXN001', type: 'WITHDRAWAL', status: 'COMPLETED', amount: { kobo: '500000', naira: 5000 }, description: 'Electricity bill', createdAt: new Date().toISOString() },
                { id: '2', reference: 'TXN002', type: 'TRANSFER', status: 'COMPLETED', amount: { kobo: '200000', naira: 2000 }, description: 'Transfer to friend', createdAt: new Date().toISOString() },
                { id: '3', reference: 'TXN003', type: 'WITHDRAWAL', status: 'COMPLETED', amount: { kobo: '150000', naira: 1500 }, description: 'Uber ride', createdAt: new Date(Date.now() - 86400000).toISOString() },
                { id: '4', reference: 'TXN004', type: 'DEPOSIT', status: 'COMPLETED', amount: { kobo: '2000000', naira: 20000 }, description: 'Salary', createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
                { id: '5', reference: 'TXN005', type: 'WITHDRAWAL', status: 'COMPLETED', amount: { kobo: '350000', naira: 3500 }, description: 'Netflix subscription', createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
                { id: '6', reference: 'TXN006', type: 'TRANSFER', status: 'COMPLETED', amount: { kobo: '100000', naira: 1000 }, description: 'Food delivery', createdAt: new Date(Date.now() - 86400000 * 4).toISOString() },
                { id: '7', reference: 'TXN007', type: 'WITHDRAWAL', status: 'COMPLETED', amount: { kobo: '800000', naira: 8000 }, description: 'Shopping', createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
            ];

            return calculateInsights(mockTransactions);
        },
        enabled: !!user?.id,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    return {
        insights: insightsQuery.data,
        isLoading: insightsQuery.isLoading,
        error: insightsQuery.error,
        refresh: insightsQuery.refetch,
    };
}

export { CATEGORY_COLORS };
export type { SpendingCategory, SpendingInsight };

