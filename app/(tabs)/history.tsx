import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    RefreshControl,
    StatusBar,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState, FilterChips, SearchBar, TransactionItem } from '@/components';
import { TransactionDetailModal } from '@/components/TransactionDetailModal';
import { colors } from '@/constants/spewpay-theme';
import { useTransactions } from '@/hooks/useTransactions';
import type { Transaction } from '@/types';

const { height: screenHeight } = Dimensions.get('window');

type FilterType = 'all' | 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';

const FILTER_OPTIONS = [
    { label: 'All', value: 'all' },
    { label: 'Deposits', value: 'DEPOSIT' },
    { label: 'Withdrawals', value: 'WITHDRAWAL' },
    { label: 'Transfers', value: 'TRANSFER' },
];

export default function HistoryScreen() {
    const { transactions, isLoading, isRefreshing, hasMore, refresh, loadMore } = useTransactions();
    const [filter, setFilter] = useState<FilterType>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTransactions = useMemo(() => {
        let result = transactions;

        // Apply type filter
        if (filter !== 'all') {
            result = result.filter((t) => t.type === filter);
        }

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter((t) =>
                t.type.toLowerCase().includes(query) ||
                t.reference.toLowerCase().includes(query) ||
                t.description?.toLowerCase().includes(query) ||
                t.status.toLowerCase().includes(query)
            );
        }

        return result;
    }, [transactions, filter, searchQuery]);

    const renderFooter = () => {
        if (!hasMore) return null;
        return (
            <View style={styles.footer}>
                <ActivityIndicator color={colors.primary} />
            </View>
        );
    };

    const ListHeaderComponent = () => (
        <View style={styles.headerContainer}>
            <View style={styles.header}>
                <Text style={styles.title}>Transaction History</Text>
                <Text style={styles.subtitle}>
                    View all your transactions
                </Text>
            </View>

            <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search transactions..."
            />

            <FilterChips
                options={FILTER_OPTIONS}
                selectedValue={filter}
                onSelect={(value) => setFilter(value as FilterType)}
            />
        </View>
    );

    if (isLoading && transactions.length === 0) {
        return (
            <View style={styles.container}>
                <LinearGradient
                    colors={['#000A1A', '#001433', '#000A1A']}
                    style={styles.gradient}
                >
                    <SafeAreaView style={styles.safeArea} edges={['top']}>
                        <ListHeaderComponent />
                        <View style={styles.centered}>
                            <ActivityIndicator size="large" color={colors.primary} />
                        </View>
                    </SafeAreaView>
                </LinearGradient>
            </View>
        );
    }

    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

    // ... existing useMemo ...

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000A1A" />
            <LinearGradient
                colors={['#000A1A', '#001433', '#000A1A']}
                style={styles.gradient}
            >
                <SafeAreaView style={styles.safeArea} edges={['top']}>
                    <FlatList
                        data={filteredTransactions}
                        renderItem={({ item }) => (
                            <TransactionItem
                                transaction={item}
                                onPress={() => setSelectedTransaction(item)}
                            />
                        )}
                        keyExtractor={(item) => item.id}
                        ListHeaderComponent={ListHeaderComponent}
                        ListEmptyComponent={
                            <EmptyState
                                icon="receipt-outline"
                                title="No transactions found"
                                description={searchQuery || filter !== 'all'
                                    ? "Try adjusting your search or filters"
                                    : "Your transactions will appear here"}
                            />
                        }
                        ListFooterComponent={renderFooter}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefreshing}
                                onRefresh={refresh}
                                tintColor={colors.primary}
                                colors={[colors.primary]}
                            />
                        }
                        onEndReached={loadMore}
                        onEndReachedThreshold={0.5}
                    />
                </SafeAreaView>
            </LinearGradient>

            <TransactionDetailModal
                visible={!!selectedTransaction}
                transaction={selectedTransaction}
                onClose={() => setSelectedTransaction(null)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000A1A',
        minHeight: screenHeight,
    },
    gradient: {
        flex: 1,
        minHeight: screenHeight,
    },
    safeArea: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 120,
    },
    headerContainer: {
        paddingBottom: 20,
    },
    header: {
        paddingVertical: 20,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: '700',
    },
    subtitle: {
        color: '#94A3B8',
        fontSize: 14,
        marginTop: 4,
        marginBottom: 16,
    },
    filters: {
        flexDirection: 'row',
        gap: 8,
    },
    filterBtn: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    filterText: {
        color: '#94A3B8',
        fontSize: 14,
        fontWeight: '500',
    },
    filterTextActive: {
        color: '#FFFFFF',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        paddingVertical: 20,
        alignItems: 'center',
    },
});
