import { borderRadius, colors, shadows, spacing, typography } from '@/constants/spewpay-theme';
import type { Allocation, AllocationStatus } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AllocationCardProps {
    allocation: Allocation;
    onPress?: () => void;
}

const getStatusColor = (status: AllocationStatus) => {
    switch (status) {
        case 'ACTIVE':
            return colors.success;
        case 'FROZEN':
            return colors.warning;
        case 'CLOSED':
            return colors.error;
        default:
            return colors.textTertiary;
    }
};

export function AllocationCard({ allocation, onPress }: AllocationCardProps) {
    const router = useRouter();

    const handlePress = async () => {
        if (Platform.OS !== 'web') {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        if (onPress) {
            onPress();
        } else {
            router.push(`/allocation/${allocation.id}`);
        }
    };

    const statusColor = getStatusColor(allocation.status);

    return (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.7} style={styles.card}>
            <View style={styles.header}>
                <View style={styles.iconWrapper}>
                    <Ionicons name="wallet-outline" size={20} color={colors.primary} />
                </View>
                <View style={styles.info}>
                    <Text style={styles.name}>{allocation.name}</Text>
                    {allocation.description && (
                        <Text style={styles.description} numberOfLines={1}>
                            {allocation.description}
                        </Text>
                    )}
                </View>
                <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}>
                    <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                    <Text style={[styles.statusText, { color: statusColor }]}>
                        {allocation.status}
                    </Text>
                </View>
            </View>

            <View style={styles.balanceRow}>
                <View>
                    <Text style={styles.balanceLabel}>Available</Text>
                    <Text style={styles.balanceValue}>
                        ₦{allocation.balance?.naira?.toLocaleString() ?? '0'}
                    </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        marginBottom: spacing.md,
        ...shadows.sm,
        borderWidth: 1,
        borderColor: colors.border,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    iconWrapper: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.md,
        backgroundColor: colors.infoLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    info: {
        flex: 1,
        marginLeft: spacing.md,
    },
    name: {
        ...typography.bodyBold,
        color: colors.textPrimary,
    },
    description: {
        ...typography.caption,
        color: colors.textSecondary,
        marginTop: 2,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: borderRadius.sm,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 4,
    },
    statusText: {
        ...typography.small,
        fontWeight: '600',
    },
    balanceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    balanceLabel: {
        ...typography.caption,
        color: colors.textSecondary,
    },
    balanceValue: {
        ...typography.h3,
        color: colors.textPrimary,
    },
});
