import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
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

import {
    AddRuleModal,
    EmptyState,
    FundAllocationModal,
    LoadingScreen,
    RuleItem,
    useToast,
} from '@/components';
import { borderRadius, colors, shadows, spacing, typography } from '@/constants/spewpay-theme';
import { useAllocationDetails, useAllocations } from '@/hooks/useAllocations';
import { useSpendingRules } from '@/hooks/useSpendingRules';

const { height: screenHeight } = Dimensions.get('window');

export default function AllocationDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { showToast } = useToast();

    const { allocation, isLoading, refresh: refreshAllocation } = useAllocationDetails(id!);
    const { rules, toggleRule, addRule, isAdding, deleteRule, refresh: refreshRules } = useSpendingRules(id!);

    // We need orgId to fund - get it from the allocation
    const orgId = allocation?.orgId || '';
    const { fundAllocation, isFunding, freezeAllocation, unfreezeAllocation } = useAllocations(orgId);

    const [showFundModal, setShowFundModal] = useState(false);
    const [showAddRuleModal, setShowAddRuleModal] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        refreshAllocation();
        refreshRules();
        setIsRefreshing(false);
    };

    const handleFund = async (data: { amount: number; description?: string }) => {
        try {
            await fundAllocation({ allocationId: id!, ...data });
            showToast('Allocation funded!', 'success');
            refreshAllocation();
        } catch (error: any) {
            showToast(error.message || 'Failed to fund allocation', 'error');
            throw error;
        }
    };

    const handleToggleFreeze = async () => {
        try {
            if (allocation?.status === 'FROZEN') {
                await unfreezeAllocation(id!);
                showToast('Allocation unfrozen', 'success');
            } else {
                await freezeAllocation(id!);
                showToast('Allocation frozen', 'success');
            }
            refreshAllocation();
        } catch (error: any) {
            showToast(error.message || 'Operation failed', 'error');
        }
    };

    const handleAddRule = async (data: any) => {
        try {
            await addRule(data);
            showToast('Rule added!', 'success');
        } catch (error: any) {
            showToast(error.message || 'Failed to add rule', 'error');
            throw error;
        }
    };

    const handleToggleRule = async (ruleId: string, enabled: boolean) => {
        try {
            await toggleRule(ruleId, enabled);
            showToast(enabled ? 'Rule enabled' : 'Rule disabled', 'success');
        } catch (error: any) {
            showToast(error.message || 'Failed to update rule', 'error');
        }
    };

    const handleDeleteRule = async (ruleId: string) => {
        try {
            await deleteRule(ruleId);
            showToast('Rule deleted', 'success');
        } catch (error: any) {
            showToast(error.message || 'Failed to delete rule', 'error');
        }
    };

    if (isLoading || !allocation) {
        return <LoadingScreen />;
    }

    const isFrozen = allocation.status === 'FROZEN';

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
                            <TouchableOpacity
                                style={[styles.freezeBtn, isFrozen && styles.freezeBtnActive]}
                                onPress={handleToggleFreeze}
                            >
                                <Ionicons
                                    name={isFrozen ? 'play' : 'pause'}
                                    size={18}
                                    color={isFrozen ? colors.warning : colors.textPrimary}
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Allocation Card */}
                        <Animated.View entering={FadeInDown.duration(400)} style={styles.allocationCard}>
                            <View style={styles.allocationHeader}>
                                <View style={[styles.statusBadge, isFrozen && styles.statusBadgeFrozen]}>
                                    <Text style={[styles.statusText, isFrozen && styles.statusTextFrozen]}>
                                        {allocation.status}
                                    </Text>
                                </View>
                            </View>

                            <Text style={styles.allocationName}>{allocation.name}</Text>
                            {allocation.description && (
                                <Text style={styles.allocationDesc}>{allocation.description}</Text>
                            )}

                            <View style={styles.balanceSection}>
                                <Text style={styles.balanceLabel}>Available Balance</Text>
                                <Text style={styles.balanceValue}>
                                    ₦{allocation.balance?.naira?.toLocaleString() ?? '0'}
                                </Text>
                            </View>

                            {/* Actions */}
                            <View style={styles.actions}>
                                <TouchableOpacity
                                    style={[styles.actionBtn, styles.actionBtnPrimary]}
                                    onPress={() => setShowFundModal(true)}
                                    disabled={isFrozen}
                                >
                                    <Ionicons name="add-circle" size={20} color="#fff" />
                                    <Text style={styles.actionBtnPrimaryText}>Fund</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionBtn}>
                                    <Ionicons name="swap-horizontal" size={20} color={colors.primary} />
                                    <Text style={styles.actionBtnText}>Transfer</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionBtn}>
                                    <Ionicons name="receipt-outline" size={20} color={colors.primary} />
                                    <Text style={styles.actionBtnText}>History</Text>
                                </TouchableOpacity>
                            </View>
                        </Animated.View>

                        {/* Spending Rules Section */}
                        <Animated.View
                            entering={FadeInDown.delay(100).duration(400)}
                            style={styles.section}
                        >
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Spending Rules ({rules.length})</Text>
                                <TouchableOpacity
                                    style={styles.sectionAction}
                                    onPress={() => setShowAddRuleModal(true)}
                                >
                                    <Ionicons name="add" size={18} color={colors.primary} />
                                    <Text style={styles.sectionActionText}>Add Rule</Text>
                                </TouchableOpacity>
                            </View>

                            {rules.length > 0 ? (
                                rules.map((rule) => (
                                    <RuleItem
                                        key={rule.id}
                                        rule={rule}
                                        onToggle={(enabled) => handleToggleRule(rule.id, enabled)}
                                        onDelete={() => handleDeleteRule(rule.id)}
                                    />
                                ))
                            ) : (
                                <EmptyState
                                    icon="shield-checkmark-outline"
                                    title="No Rules Set"
                                    description="Add spending rules to control how this allocation can be used."
                                />
                            )}
                        </Animated.View>
                    </ScrollView>
                </SafeAreaView>
            </LinearGradient>

            <FundAllocationModal
                visible={showFundModal}
                onClose={() => setShowFundModal(false)}
                onSubmit={handleFund}
                allocationName={allocation.name}
                isLoading={isFunding}
            />

            <AddRuleModal
                visible={showAddRuleModal}
                onClose={() => setShowAddRuleModal(false)}
                onSubmit={handleAddRule}
                isLoading={isAdding}
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
    scrollContent: {
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    freezeBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    freezeBtnActive: {
        backgroundColor: colors.warningLight,
    },
    allocationCard: {
        marginHorizontal: spacing.md,
        marginBottom: spacing.lg,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        ...shadows.sm,
        borderWidth: 1,
        borderColor: colors.border,
    },
    allocationHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: spacing.sm,
    },
    statusBadge: {
        backgroundColor: colors.successLight,
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: borderRadius.sm,
    },
    statusBadgeFrozen: {
        backgroundColor: colors.warningLight,
    },
    statusText: {
        ...typography.small,
        color: colors.success,
        fontWeight: '600',
    },
    statusTextFrozen: {
        color: colors.warning,
    },
    allocationName: {
        ...typography.h1,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    allocationDesc: {
        ...typography.body,
        color: colors.textSecondary,
        marginBottom: spacing.lg,
    },
    balanceSection: {
        marginBottom: spacing.lg,
    },
    balanceLabel: {
        ...typography.caption,
        color: colors.textSecondary,
    },
    balanceValue: {
        fontSize: 40,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    actions: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
        backgroundColor: colors.infoLight,
        gap: spacing.xs,
    },
    actionBtnPrimary: {
        backgroundColor: colors.primary,
    },
    actionBtnText: {
        ...typography.bodyBold,
        color: colors.primary,
    },
    actionBtnPrimaryText: {
        ...typography.bodyBold,
        color: '#FFFFFF',
    },
    section: {
        marginHorizontal: spacing.md,
        marginBottom: spacing.lg,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    sectionTitle: {
        ...typography.h3,
        color: colors.textPrimary,
    },
    sectionAction: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionActionText: {
        ...typography.bodyBold,
        color: colors.primary,
        marginLeft: spacing.xs,
    },
});
