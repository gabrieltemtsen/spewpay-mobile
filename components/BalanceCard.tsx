import { borderRadius, colors, shadows, spacing, typography } from '@/constants/spewpay-theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

interface BalanceCardProps {
    balance: number;
    label?: string;
    showCurrency?: boolean;
    compact?: boolean;
    style?: ViewStyle;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
    }).format(amount);
};

export const BalanceCard: React.FC<BalanceCardProps> = ({
    balance,
    label = 'Available Balance',
    showCurrency = true,
    compact = false,
    style,
}) => {
    return (
        <View style={[styles.container, compact && styles.containerCompact, style]}>
            <LinearGradient
                colors={[colors.primary, colors.primaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <View style={styles.content}>
                    <View style={styles.labelRow}>
                        <Ionicons name="wallet" size={compact ? 16 : 20} color={colors.textPrimary} />
                        <Text style={[styles.label, compact && styles.labelCompact]}>{label}</Text>
                    </View>
                    <Text style={[styles.balance, compact && styles.balanceCompact]}>
                        {showCurrency ? formatCurrency(balance) : balance.toLocaleString()}
                    </Text>
                </View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        ...shadows.md,
    },
    containerCompact: {
        borderRadius: borderRadius.md,
    },
    gradient: {
        padding: spacing.lg,
    },
    content: {
        gap: spacing.sm,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    label: {
        ...typography.caption,
        color: colors.textPrimary,
        opacity: 0.9,
    },
    labelCompact: {
        fontSize: 12,
    },
    balance: {
        ...typography.h1,
        color: colors.textPrimary,
    },
    balanceCompact: {
        fontSize: 24,
    },
});
