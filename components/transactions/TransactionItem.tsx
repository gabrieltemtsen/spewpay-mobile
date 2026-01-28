import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import type { Transaction, TransactionType } from '@/types';

interface TransactionItemProps {
    transaction: Transaction;
    onPress?: () => void;
}

const getTransactionConfig = (type: TransactionType) => {
    const configs = {
        DEPOSIT: {
            icon: 'arrow-down' as const,
            color: '#00E699',
            bgColor: 'bg-accent-500/10',
            sign: '+',
        },
        WITHDRAWAL: {
            icon: 'arrow-up' as const,
            color: '#FF7D5C',
            bgColor: 'bg-warning-500/10',
            sign: '-',
        },
        TRANSFER: {
            icon: 'swap-horizontal' as const,
            color: '#0066FF',
            bgColor: 'bg-primary-500/10',
            sign: '',
        },
        REVERSAL: {
            icon: 'refresh' as const,
            color: '#F59E0B',
            bgColor: 'bg-yellow-500/10',
            sign: '+',
        },
    };
    return configs[type] || configs.TRANSFER;
};

const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
        COMPLETED: 'text-accent-500',
        PENDING: 'text-yellow-500',
        PROCESSING: 'text-primary-500',
        FAILED: 'text-error-500',
        REVERSED: 'text-warning-500',
    };
    return colors[status] || 'text-muted-dark';
};

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
        return date.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
        return 'Yesterday';
    } else if (days < 7) {
        return date.toLocaleDateString('en-NG', { weekday: 'short' });
    } else {
        return date.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' });
    }
};

const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('en-NG', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};

export function TransactionItem({ transaction, onPress }: TransactionItemProps) {
    const config = getTransactionConfig(transaction.type);

    const handlePress = async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress?.();
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            className="flex-row items-center py-4 px-4"
        >
            {/* Icon */}
            <View className={`w-12 h-12 rounded-2xl ${config.bgColor} items-center justify-center`}>
                <Ionicons name={config.icon} size={22} color={config.color} />
            </View>

            {/* Details */}
            <View className="flex-1 ml-4">
                <Text className="text-foreground-dark text-base font-medium">
                    {transaction.type.charAt(0) + transaction.type.slice(1).toLowerCase()}
                </Text>
                <View className="flex-row items-center mt-1">
                    <Text className="text-muted-dark text-sm">
                        {formatDate(transaction.createdAt)}
                    </Text>
                    {transaction.status !== 'COMPLETED' && (
                        <View className="flex-row items-center ml-2">
                            <View className="w-1.5 h-1.5 rounded-full bg-muted-dark mx-1" />
                            <Text className={`text-sm ${getStatusColor(transaction.status)}`}>
                                {transaction.status.charAt(0) + transaction.status.slice(1).toLowerCase()}
                            </Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Amount */}
            <Text
                className={`text-base font-semibold ${config.sign === '+' ? 'text-accent-500' :
                        config.sign === '-' ? 'text-foreground-dark' : 'text-foreground-dark'
                    }`}
            >
                {config.sign}₦{formatAmount(transaction.amount.naira)}
            </Text>
        </TouchableOpacity>
    );
}
