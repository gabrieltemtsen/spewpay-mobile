import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Dimensions,
    FlatList,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { Transaction } from '@/types';

const { height: screenHeight } = Dimensions.get('window');

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

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
    }).format(amount);
};

const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-NG', {
        month: 'short',
        day: 'numeric',
    });
};

const getTransactionIcon = (type: string) => {
    switch (type) {
        case 'DEPOSIT':
            return { name: 'arrow-down', color: '#00E699' };
        case 'WITHDRAWAL':
            return { name: 'arrow-up', color: '#F59E0B' };
        case 'TRANSFER':
            return { name: 'swap-horizontal', color: '#0066FF' };
        default:
            return { name: 'cash', color: '#64748B' };
    }
};

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

    const renderTransactionItem = ({ item: transaction, index }: { item: Transaction; index: number }) => {
        const icon = getTransactionIcon(transaction.type);
        return (
            <Animated.View entering={FadeInDown.delay(index * 50).duration(400)}>
                <View style={styles.transactionItem}>
                    <View style={[styles.transactionIcon, { backgroundColor: `${icon.color}20` }]}>
                        <Ionicons name={icon.name as any} size={20} color={icon.color} />
                    </View>
                    <View style={styles.transactionInfo}>
                        <Text style={styles.transactionType}>
                            {transaction.type.charAt(0) + transaction.type.slice(1).toLowerCase()}
                        </Text>
                        <Text style={styles.transactionDate}>
                            {formatDate(transaction.createdAt)}
                            {transaction.description && ` • ${transaction.description}`}
                        </Text>
                    </View>
                    <View style={styles.transactionAmount}>
                        <Text
                            style={[
                                styles.amount,
                                transaction.type === 'DEPOSIT'
                                    ? styles.amountPositive
                                    : styles.amountNegative,
                            ]}
                        >
                            {transaction.type === 'DEPOSIT' ? '+' : '-'}
                            {formatCurrency(transaction.amount.naira)}
                        </Text>
                        <Text
                            style={[
                                styles.transactionStatus,
                                transaction.status === 'COMPLETED'
                                    ? styles.statusCompleted
                                    : styles.statusProcessing,
                            ]}
                        >
                            {transaction.status}
                        </Text>
                    </View>
                </View>
            </Animated.View>
        );
    };

    const ListHeader = () => (
        <View style={styles.headerContainer}>
            <View style={styles.header}>
                <Text style={styles.title}>Transaction History</Text>
                <Text style={styles.subtitle}>View all your transactions</Text>
            </View>

            <Animated.View entering={FadeInDown.duration(400)} style={styles.filters}>
                {filters.map((f) => (
                    <TouchableOpacity
                        key={f.key}
                        onPress={() => setFilter(f.key)}
                        style={[
                            styles.filterBtn,
                            filter === f.key && styles.filterBtnActive,
                        ]}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                filter === f.key && styles.filterTextActive,
                            ]}
                        >
                            {f.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </Animated.View>
        </View>
    );

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
                        renderItem={renderTransactionItem}
                        keyExtractor={(item) => item.id}
                        ListHeaderComponent={<ListHeader />}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                    />
                </SafeAreaView>
            </LinearGradient>
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
        paddingBottom: 120,
    },
    headerContainer: {
        paddingHorizontal: 20,
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
    filterBtnActive: {
        backgroundColor: '#0066FF',
        borderColor: '#0066FF',
    },
    filterText: {
        color: '#94A3B8',
        fontSize: 14,
        fontWeight: '500',
    },
    filterTextActive: {
        color: '#FFFFFF',
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    transactionIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    transactionInfo: {
        flex: 1,
        marginLeft: 12,
    },
    transactionType: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '500',
    },
    transactionDate: {
        color: '#64748B',
        fontSize: 13,
        marginTop: 2,
    },
    transactionAmount: {
        alignItems: 'flex-end',
    },
    amount: {
        fontSize: 15,
        fontWeight: '600',
    },
    amountPositive: {
        color: '#00E699',
    },
    amountNegative: {
        color: '#FFFFFF',
    },
    transactionStatus: {
        fontSize: 11,
        marginTop: 2,
        textTransform: 'capitalize',
    },
    statusCompleted: {
        color: '#00E699',
    },
    statusProcessing: {
        color: '#F59E0B',
    },
    separator: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        marginHorizontal: 20,
    },
});
