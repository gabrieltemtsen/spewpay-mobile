import { borderRadius, colors, spacing, typography } from '@/constants/spewpay-theme';
import type { Transaction } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

interface TransactionItemProps {
    transaction: Transaction;
    onPress?: () => void;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
    }).format(amount);
};

const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    }

    return date.toLocaleDateString('en-NG', {
        month: 'short',
        day: 'numeric',
    });
};

const getTransactionIcon = (type: string) => {
    switch (type) {
        case 'DEPOSIT':
            return { name: 'arrow-down' as const, color: colors.success };
        case 'WITHDRAWAL':
            return { name: 'arrow-up' as const, color: colors.warning };
        case 'TRANSFER':
            return { name: 'swap-horizontal' as const, color: colors.primary };
        default:
            return { name: 'cash' as const, color: colors.textTertiary };
    }
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'COMPLETED':
            return colors.success;
        case 'PENDING':
        case 'PROCESSING':
            return colors.warning;
        case 'FAILED':
        case 'REVERSED':
            return colors.error;
        default:
            return colors.textTertiary;
    }
};

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onPress }) => {
    const icon = getTransactionIcon(transaction.type);
    const statusColor = getStatusColor(transaction.status);
    const isCredit = transaction.type === 'DEPOSIT';
    const amount = transaction.amount?.naira || 0;

    return (
        <Animated.View entering={FadeIn}>
            <TouchableOpacity
                style={styles.container}
                onPress={onPress}
                activeOpacity={0.7}
            >
                <View style={[styles.iconContainer, { backgroundColor: `${icon.color}20` }]}>
                    <Ionicons name={icon.name} size={20} color={icon.color} />
                </View>

                <View style={styles.details}>
                    <Text style={styles.type}>{transaction.type}</Text>
                    {transaction.description && (
                        <Text style={styles.description} numberOfLines={1}>
                            {transaction.description}
                        </Text>
                    )}
                    <Text style={styles.date}>{formatDate(transaction.createdAt)}</Text>
                </View>

                <View style={styles.rightSection}>
                    <Text style={[styles.amount, isCredit && styles.credit]}>
                        {isCredit ? '+' : '-'}{formatCurrency(amount)}
                    </Text>
                    <View style={styles.statusContainer}>
                        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                        <Text style={[styles.status, { color: statusColor }]}>
                            {transaction.status}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.sm,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    details: {
        flex: 1,
    },
    type: {
        ...typography.bodyBold,
        color: colors.textPrimary,
        marginBottom: 2,
    },
    description: {
        ...typography.caption,
        color: colors.textSecondary,
        marginBottom: 2,
    },
    date: {
        ...typography.small,
        color: colors.textTertiary,
    },
    rightSection: {
        alignItems: 'flex-end',
    },
    amount: {
        ...typography.bodyBold,
        color: colors.textPrimary,
        marginBottom: 4,
    },
    credit: {
        color: colors.success,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 4,
    },
    status: {
        ...typography.small,
        textTransform: 'capitalize',
    },
});
