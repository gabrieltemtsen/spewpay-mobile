import React, { useState } from 'react';
import { StatusBar, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TransactionList } from '@/components/transactions';
import type { Transaction } from '@/types';

// Mock data
const mockTransactions: Transaction[] = [
    {
        id: '1',
        reference: 'TXN-001',
        type: 'DEPOSIT',
        status: 'COMPLETED',
        amount: { kobo: '500000', naira: 5000 },
        description: null,
        createdAt: new Date().toISOString(),
    },
    {
        id: '2',
        reference: 'TXN-002',
        type: 'TRANSFER',
        status: 'COMPLETED',
        amount: { kobo: '150000', naira: 1500 },
        description: 'Payment to John',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
        id: '3',
        reference: 'TXN-003',
        type: 'WITHDRAWAL',
        status: 'PROCESSING',
        amount: { kobo: '200000', naira: 2000 },
        description: 'Bank withdrawal',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
        id: '4',
        reference: 'TXN-004',
        type: 'DEPOSIT',
        status: 'COMPLETED',
        amount: { kobo: '1000000', naira: 10000 },
        description: null,
        createdAt: new Date(Date.now() - 259200000).toISOString(),
    },
    {
        id: '5',
        reference: 'TXN-005',
        type: 'TRANSFER',
        status: 'COMPLETED',
        amount: { kobo: '75000', naira: 750 },
        description: 'Lunch money',
        createdAt: new Date(Date.now() - 345600000).toISOString(),
    },
];

type FilterType = 'all' | 'deposit' | 'withdrawal' | 'transfer';

export default function HistoryScreen() {
    const [filter, setFilter] = useState<FilterType>('all');

    const filteredTransactions = mockTransactions.filter((t) => {
        if (filter === 'all') return true;
        return t.type.toLowerCase() === filter;
    });

    const filters: { key: FilterType; label: string }[] = [
        { key: 'all', label: 'All' },
        { key: 'deposit', label: 'Deposits' },
        { key: 'withdrawal', label: 'Withdrawals' },
        { key: 'transfer', label: 'Transfers' },
    ];

    const ListHeader = () => (
        <View className="px-4 pb-4">
            {/* Header */}
            <View className="py-4">
                <Text className="text-foreground-dark text-2xl font-bold">
                    Transaction History
                </Text>
                <Text className="text-muted-dark text-sm mt-1">
                    View all your transactions
                </Text>
            </View>

            {/* Filters */}
            <Animated.View
                entering={FadeInDown.duration(400)}
                className="flex-row gap-2"
            >
                {filters.map((f) => (
                    <TouchableOpacity
                        key={f.key}
                        onPress={() => setFilter(f.key)}
                        className={`px-4 py-2 rounded-full ${filter === f.key
                                ? 'bg-primary-500'
                                : 'bg-surface-dark border border-border-dark'
                            }`}
                    >
                        <Text className={`text-sm font-medium ${filter === f.key ? 'text-white' : 'text-muted-dark'
                            }`}>
                            {f.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </Animated.View>
        </View>
    );

    return (
        <View className="flex-1 bg-background-dark">
            <StatusBar barStyle="light-content" />

            <SafeAreaView className="flex-1" edges={['top']}>
                <TransactionList
                    transactions={filteredTransactions}
                    ListHeaderComponent={<ListHeader />}
                    onTransactionPress={(t) => console.log('View transaction', t.id)}
                />
            </SafeAreaView>
        </View>
    );
}
