import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import type { Transaction } from '@/types';
import { TransactionItem } from './TransactionItem';

interface TransactionListProps {
    transactions: Transaction[];
    isLoading?: boolean;
    onRefresh?: () => void;
    isRefreshing?: boolean;
    onEndReached?: () => void;
    onTransactionPress?: (transaction: Transaction) => void;
    ListHeaderComponent?: React.ReactElement;
}

function EmptyState() {
    return (
        <Animated.View
            entering={FadeInDown.duration(400)}
            className="items-center py-12"
        >
            <View className="w-20 h-20 rounded-3xl bg-surface-dark items-center justify-center mb-4">
                <Ionicons name="receipt-outline" size={36} color="#64748B" />
            </View>
            <Text className="text-foreground-dark text-lg font-semibold">
                No Transactions Yet
            </Text>
            <Text className="text-muted-dark text-sm mt-2 text-center px-8">
                Your transaction history will appear here when you start using your wallet.
            </Text>
        </Animated.View>
    );
}

function LoadingState() {
    return (
        <View className="py-12 items-center">
            <ActivityIndicator size="large" color="#0066FF" />
            <Text className="text-muted-dark mt-4">Loading transactions...</Text>
        </View>
    );
}

function ItemSeparator() {
    return (
        <View className="h-px bg-border-dark mx-4" />
    );
}

export function TransactionList({
    transactions,
    isLoading,
    onRefresh,
    isRefreshing,
    onEndReached,
    onTransactionPress,
    ListHeaderComponent,
}: TransactionListProps) {
    if (isLoading && transactions.length === 0) {
        return (
            <View className="flex-1">
                {ListHeaderComponent}
                <LoadingState />
            </View>
        );
    }

    return (
        <FlashList
            data={transactions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <TransactionItem
                    transaction={item}
                    onPress={() => onTransactionPress?.(item)}
                />
            )}
            ItemSeparatorComponent={ItemSeparator}
            ListHeaderComponent={ListHeaderComponent}
            ListEmptyComponent={EmptyState}
            onRefresh={onRefresh}
            refreshing={isRefreshing}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
        />
    );
}
