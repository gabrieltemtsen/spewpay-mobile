import { borderRadius, colors, spacing, typography } from '@/constants/spewpay-theme';
import type { SpendingCategory } from '@/hooks/useSpendingInsights';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

interface SpendingChartProps {
    categories: SpendingCategory[];
    totalSpent: number;
}

const { width: screenWidth } = Dimensions.get('window');

export function SpendingChart({ categories, totalSpent }: SpendingChartProps) {
    if (categories.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Ionicons name="pie-chart-outline" size={48} color={colors.textTertiary} />
                <Text style={styles.emptyText}>No spending data available</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Donut Chart Representation */}
            <View style={styles.chartContainer}>
                <View style={styles.donutOuter}>
                    {categories.map((cat, index) => {
                        const rotation = categories.slice(0, index).reduce((acc, c) => acc + (c.percentage * 3.6), 0);
                        const sweep = cat.percentage * 3.6;

                        return (
                            <View
                                key={cat.category}
                                style={[
                                    styles.segment,
                                    {
                                        backgroundColor: cat.color,
                                        transform: [{ rotate: `${rotation}deg` }],
                                        width: sweep > 180 ? '100%' : `${(sweep / 180) * 100}%`,
                                    },
                                ]}
                            />
                        );
                    })}
                    <View style={styles.donutInner}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>₦{totalSpent.toLocaleString()}</Text>
                    </View>
                </View>
            </View>

            {/* Legend */}
            <View style={styles.legend}>
                {categories.map((cat) => (
                    <View key={cat.category} style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: cat.color }]} />
                        <View style={styles.legendInfo}>
                            <Text style={styles.legendCategory}>{cat.category}</Text>
                            <Text style={styles.legendAmount}>₦{cat.amount.toLocaleString()}</Text>
                        </View>
                        <Text style={styles.legendPercentage}>{cat.percentage.toFixed(0)}%</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

interface TrendCardProps {
    title: string;
    value: number;
    trend: number;
    icon: string;
    color: string;
}

export function TrendCard({ title, value, trend, icon, color }: TrendCardProps) {
    const isPositive = trend > 0;
    const trendColor = isPositive ? colors.error : colors.success;
    const trendIcon = isPositive ? 'trending-up' : 'trending-down';

    return (
        <View style={styles.trendCard}>
            <View style={[styles.trendIcon, { backgroundColor: `${color}20` }]}>
                <Ionicons name={icon as any} size={24} color={color} />
            </View>
            <Text style={styles.trendTitle}>{title}</Text>
            <Text style={styles.trendValue}>₦{value.toLocaleString()}</Text>
            <View style={styles.trendBadge}>
                <Ionicons name={trendIcon} size={14} color={trendColor} />
                <Text style={[styles.trendText, { color: trendColor }]}>
                    {Math.abs(trend).toFixed(0)}%
                </Text>
            </View>
        </View>
    );
}

interface DailyChartProps {
    data: { date: string; amount: number }[];
}

export function DailySpendingChart({ data }: DailyChartProps) {
    const maxAmount = Math.max(...data.map(d => d.amount), 1);

    return (
        <View style={styles.dailyChart}>
            <Text style={styles.dailyTitle}>Daily Spending</Text>
            <View style={styles.barsContainer}>
                {data.map((day, index) => {
                    const height = (day.amount / maxAmount) * 100;
                    const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });

                    return (
                        <View key={day.date} style={styles.barWrapper}>
                            <View style={styles.barContainer}>
                                <LinearGradient
                                    colors={[colors.primary, colors.secondary]}
                                    style={[styles.bar, { height: `${Math.max(height, 5)}%` }]}
                                />
                            </View>
                            <Text style={styles.barLabel}>{dayName}</Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: spacing.md,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.xl * 2,
    },
    emptyText: {
        ...typography.body,
        color: colors.textTertiary,
        marginTop: spacing.md,
    },
    chartContainer: {
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    donutOuter: {
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
    },
    segment: {
        position: 'absolute',
        width: '50%',
        height: '100%',
        left: '50%',
        transformOrigin: 'left center',
    },
    donutInner: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
    },
    totalLabel: {
        ...typography.caption,
        color: colors.textSecondary,
    },
    totalValue: {
        ...typography.h2,
        color: colors.textPrimary,
    },
    legend: {
        gap: spacing.sm,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.xs,
    },
    legendDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: spacing.sm,
    },
    legendInfo: {
        flex: 1,
    },
    legendCategory: {
        ...typography.bodyBold,
        color: colors.textPrimary,
    },
    legendAmount: {
        ...typography.small,
        color: colors.textSecondary,
    },
    legendPercentage: {
        ...typography.bodyBold,
        color: colors.textSecondary,
    },
    trendCard: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        flex: 1,
        borderWidth: 1,
        borderColor: colors.border,
    },
    trendIcon: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
    },
    trendTitle: {
        ...typography.caption,
        color: colors.textSecondary,
    },
    trendValue: {
        ...typography.h3,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    trendBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    trendText: {
        ...typography.small,
        fontWeight: '600',
    },
    dailyChart: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    dailyTitle: {
        ...typography.bodyBold,
        color: colors.textPrimary,
        marginBottom: spacing.md,
    },
    barsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 120,
        gap: spacing.xs,
    },
    barWrapper: {
        flex: 1,
        alignItems: 'center',
    },
    barContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-end',
    },
    bar: {
        width: '100%',
        borderRadius: borderRadius.sm,
        minHeight: 4,
    },
    barLabel: {
        ...typography.small,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
});
