import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LoadingScreen } from '@/components';
import { DailySpendingChart, SpendingChart, TrendCard } from '@/components/SpendingCharts';
import { borderRadius, colors, shadows, spacing, typography } from '@/constants/spewpay-theme';
import { useSpendingInsights } from '@/hooks/useSpendingInsights';

const { height: screenHeight } = Dimensions.get('window');

type Period = 'week' | 'month' | 'all';

export default function InsightsScreen() {
    const router = useRouter();
    const [period, setPeriod] = useState<Period>('month');
    const { insights, isLoading, refresh } = useSpendingInsights(period);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refresh();
        setIsRefreshing(false);
    };

    if (isLoading && !insights) {
        return <LoadingScreen />;
    }

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#000A1A', '#001433', '#000A1A']}
                style={styles.gradient}
            >
                <SafeAreaView style={styles.safeArea} edges={['top']}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefreshing}
                                onRefresh={handleRefresh}
                                tintColor={colors.primary}
                            />
                        }
                    >
                        {/* Header */}
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                                <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                            </TouchableOpacity>
                            <Text style={styles.title}>Spending Insights</Text>
                            <View style={styles.placeholder} />
                        </View>

                        {/* Period Selector */}
                        <View style={styles.periodSelector}>
                            {(['week', 'month', 'all'] as Period[]).map((p) => (
                                <TouchableOpacity
                                    key={p}
                                    style={[styles.periodBtn, period === p && styles.periodBtnActive]}
                                    onPress={() => setPeriod(p)}
                                >
                                    <Text style={[styles.periodText, period === p && styles.periodTextActive]}>
                                        {p === 'week' ? 'This Week' : p === 'month' ? 'This Month' : 'All Time'}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {insights && (
                            <>
                                {/* Summary Cards */}
                                <Animated.View
                                    entering={FadeInDown.duration(400)}
                                    style={styles.summaryRow}
                                >
                                    <TrendCard
                                        title="Total Spent"
                                        value={insights.totalSpent}
                                        trend={insights.weeklyTrend}
                                        icon="arrow-up-circle"
                                        color={colors.error}
                                    />
                                    <TrendCard
                                        title="Total Received"
                                        value={insights.totalReceived}
                                        trend={-insights.monthlyTrend}
                                        icon="arrow-down-circle"
                                        color={colors.success}
                                    />
                                </Animated.View>

                                {/* Net Flow Card */}
                                <Animated.View
                                    entering={FadeInDown.delay(100).duration(400)}
                                    style={styles.netFlowCard}
                                >
                                    <View style={styles.netFlowHeader}>
                                        <Text style={styles.netFlowLabel}>Net Cash Flow</Text>
                                        <View style={[
                                            styles.netFlowBadge,
                                            { backgroundColor: insights.netFlow >= 0 ? colors.successLight : colors.errorLight }
                                        ]}>
                                            <Text style={[
                                                styles.netFlowBadgeText,
                                                { color: insights.netFlow >= 0 ? colors.success : colors.error }
                                            ]}>
                                                {insights.netFlow >= 0 ? 'Positive' : 'Negative'}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text style={[
                                        styles.netFlowValue,
                                        { color: insights.netFlow >= 0 ? colors.success : colors.error }
                                    ]}>
                                        {insights.netFlow >= 0 ? '+' : ''}₦{insights.netFlow.toLocaleString()}
                                    </Text>
                                    <Text style={styles.netFlowDesc}>
                                        {insights.transactionCount} transactions • Avg ₦{insights.averageTransaction.toLocaleString()}
                                    </Text>
                                </Animated.View>

                                {/* Spending by Category */}
                                <Animated.View
                                    entering={FadeInDown.delay(200).duration(400)}
                                    style={styles.section}
                                >
                                    <Text style={styles.sectionTitle}>Spending by Category</Text>
                                    <View style={styles.chartCard}>
                                        <SpendingChart
                                            categories={insights.topCategories}
                                            totalSpent={insights.totalSpent}
                                        />
                                    </View>
                                </Animated.View>

                                {/* Daily Spending */}
                                <Animated.View
                                    entering={FadeInDown.delay(300).duration(400)}
                                    style={styles.section}
                                >
                                    <DailySpendingChart data={insights.dailySpending} />
                                </Animated.View>

                                {/* Tips Section */}
                                <Animated.View
                                    entering={FadeInDown.delay(400).duration(400)}
                                    style={styles.tipsCard}
                                >
                                    <View style={styles.tipsHeader}>
                                        <Ionicons name="bulb-outline" size={24} color={colors.warning} />
                                        <Text style={styles.tipsTitle}>Smart Tip</Text>
                                    </View>
                                    <Text style={styles.tipsText}>
                                        {insights.topCategories[0]?.category === 'Transfer'
                                            ? 'Your transfers are the biggest expense. Consider setting up allocations for better budget control.'
                                            : `${insights.topCategories[0]?.category || 'Your spending'} is your top category at ${insights.topCategories[0]?.percentage.toFixed(0) || 0}%. You might want to look into ways to reduce it.`}
                                    </Text>
                                </Animated.View>
                            </>
                        )}
                    </ScrollView>
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
    scrollContent: {
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        ...typography.h2,
        color: colors.textPrimary,
    },
    placeholder: {
        width: 44,
    },
    periodSelector: {
        flexDirection: 'row',
        marginHorizontal: spacing.md,
        marginBottom: spacing.lg,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: 4,
        borderWidth: 1,
        borderColor: colors.border,
    },
    periodBtn: {
        flex: 1,
        paddingVertical: spacing.sm,
        alignItems: 'center',
        borderRadius: borderRadius.sm,
    },
    periodBtnActive: {
        backgroundColor: colors.primary,
    },
    periodText: {
        ...typography.body,
        color: colors.textSecondary,
    },
    periodTextActive: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    summaryRow: {
        flexDirection: 'row',
        gap: spacing.md,
        paddingHorizontal: spacing.md,
        marginBottom: spacing.md,
    },
    netFlowCard: {
        marginHorizontal: spacing.md,
        marginBottom: spacing.lg,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        ...shadows.sm,
        borderWidth: 1,
        borderColor: colors.border,
    },
    netFlowHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    netFlowLabel: {
        ...typography.bodyBold,
        color: colors.textSecondary,
    },
    netFlowBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: borderRadius.sm,
    },
    netFlowBadgeText: {
        ...typography.small,
        fontWeight: '600',
    },
    netFlowValue: {
        fontSize: 36,
        fontWeight: '700',
        marginBottom: spacing.xs,
    },
    netFlowDesc: {
        ...typography.body,
        color: colors.textSecondary,
    },
    section: {
        marginHorizontal: spacing.md,
        marginBottom: spacing.lg,
    },
    sectionTitle: {
        ...typography.h3,
        color: colors.textPrimary,
        marginBottom: spacing.md,
    },
    chartCard: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.xl,
        ...shadows.sm,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: 'hidden',
    },
    tipsCard: {
        marginHorizontal: spacing.md,
        backgroundColor: colors.warningLight,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.warning,
    },
    tipsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    tipsTitle: {
        ...typography.bodyBold,
        color: colors.warning,
        marginLeft: spacing.sm,
    },
    tipsText: {
        ...typography.body,
        color: colors.textPrimary,
    },
});
