import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    Platform,
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
    AllocationCard,
    EmptyState,
    InviteMemberModal,
    LoadingScreen,
    MemberItem,
    useToast,
} from '@/components';
import { borderRadius, colors, shadows, spacing, typography } from '@/constants/spewpay-theme';
import { useAuth } from '@/contexts';
import { useInvites } from '@/hooks/useInvites';
import { useOrgDetails } from '@/hooks/useOrgDetails';
import type { OrgType } from '@/types';

const { height: screenHeight } = Dimensions.get('window');

const getOrgIcon = (type: OrgType): keyof typeof Ionicons.glyphMap => {
    const icons: Record<OrgType, keyof typeof Ionicons.glyphMap> = {
        COMPANY: 'business',
        UNIVERSITY: 'school',
        FAMILY: 'home',
        COUPLE: 'heart',
        GROUP: 'people',
    };
    return icons[type] || 'business';
};

const getOrgColor = (type: OrgType): string => {
    const palette: Record<OrgType, string> = {
        COMPANY: '#0066FF',
        UNIVERSITY: '#8B5CF6',
        FAMILY: '#00E699',
        COUPLE: '#F43F5E',
        GROUP: '#F59E0B',
    };
    return palette[type] || palette.COMPANY;
};

export default function OrgDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { user } = useAuth();
    const { showToast } = useToast();

    const {
        organization,
        isLoading,
        members,
        allocations,
        refresh,
    } = useOrgDetails(id!);

    const { createInvite, isCreatingInvite } = useInvites(id!);

    const [showInviteModal, setShowInviteModal] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        refresh();
        setIsRefreshing(false);
    };

    const handleInviteMember = async (data: any) => {
        try {
            await createInvite(data);
            showToast('Invite sent!', 'success');
        } catch (error: any) {
            showToast(error.message || 'Failed to send invite', 'error');
            throw error;
        }
    };

    const handleCreateAllocation = async () => {
        if (Platform.OS !== 'web') {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        router.push(`/org/${id}/allocations?action=create`);
    };

    if (isLoading || !organization) {
        return <LoadingScreen />;
    }

    const orgColor = getOrgColor(organization.type);
    const currentMember = members.find((m) => m.userId === user?.id);
    const isAdmin = currentMember?.role === 'OWNER' || currentMember?.role === 'ADMIN';

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
                            {isAdmin && (
                                <TouchableOpacity style={styles.settingsBtn}>
                                    <Ionicons name="settings-outline" size={24} color={colors.textPrimary} />
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Org Card */}
                        <Animated.View entering={FadeInDown.duration(400)} style={styles.orgCard}>
                            <LinearGradient
                                colors={[orgColor, `${orgColor}CC`]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.orgCardGradient}
                            >
                                <View style={styles.orgHeader}>
                                    <View style={styles.orgIconWrapper}>
                                        <Ionicons name={getOrgIcon(organization.type)} size={28} color="#fff" />
                                    </View>
                                    <View style={styles.orgInfo}>
                                        <Text style={styles.orgName}>{organization.name}</Text>
                                        <Text style={styles.orgType}>
                                            {organization.type.charAt(0) + organization.type.slice(1).toLowerCase()}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.balanceSection}>
                                    <Text style={styles.balanceLabel}>Organization Balance</Text>
                                    <Text style={styles.balanceValue}>
                                        ₦{organization.balance?.naira?.toLocaleString() ?? '0'}
                                    </Text>
                                </View>

                                {/* Quick Actions */}
                                <View style={styles.quickActions}>
                                    <TouchableOpacity style={styles.quickAction}>
                                        <Ionicons name="add-circle" size={20} color="#fff" />
                                        <Text style={styles.quickActionText}>Deposit</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.quickAction}>
                                        <Ionicons name="swap-horizontal" size={20} color="#fff" />
                                        <Text style={styles.quickActionText}>Transfer</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.quickAction}>
                                        <Ionicons name="stats-chart" size={20} color="#fff" />
                                        <Text style={styles.quickActionText}>Analytics</Text>
                                    </TouchableOpacity>
                                </View>
                            </LinearGradient>
                        </Animated.View>

                        {/* Members Section */}
                        <Animated.View
                            entering={FadeInDown.delay(100).duration(400)}
                            style={styles.section}
                        >
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Members ({members.length})</Text>
                                {isAdmin && (
                                    <TouchableOpacity
                                        style={styles.sectionAction}
                                        onPress={() => setShowInviteModal(true)}
                                    >
                                        <Ionicons name="person-add" size={18} color={colors.primary} />
                                        <Text style={styles.sectionActionText}>Invite</Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            <View style={styles.sectionCard}>
                                {members.slice(0, 3).map((member, index) => (
                                    <React.Fragment key={member.id}>
                                        <MemberItem member={member} currentUserId={user?.id} />
                                        {index < Math.min(members.length, 3) - 1 && <View style={styles.divider} />}
                                    </React.Fragment>
                                ))}
                                {members.length > 3 && (
                                    <TouchableOpacity
                                        style={styles.viewAllBtn}
                                        onPress={() => router.push(`/org/${id}/members`)}
                                    >
                                        <Text style={styles.viewAllText}>View all {members.length} members</Text>
                                        <Ionicons name="chevron-forward" size={16} color={colors.primary} />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </Animated.View>

                        {/* Allocations Section */}
                        <Animated.View
                            entering={FadeInDown.delay(200).duration(400)}
                            style={styles.section}
                        >
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Allocations ({allocations.length})</Text>
                                {isAdmin && (
                                    <TouchableOpacity style={styles.sectionAction} onPress={handleCreateAllocation}>
                                        <Ionicons name="add" size={18} color={colors.primary} />
                                        <Text style={styles.sectionActionText}>Create</Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            {allocations.length > 0 ? (
                                allocations.slice(0, 3).map((allocation) => (
                                    <AllocationCard key={allocation.id} allocation={allocation} />
                                ))
                            ) : (
                                <EmptyState
                                    icon="wallet-outline"
                                    title="No Allocations"
                                    description="Create allocations to manage budgets for teams or purposes."
                                />
                            )}

                            {allocations.length > 3 && (
                                <TouchableOpacity
                                    style={styles.viewAllBtnOutline}
                                    onPress={() => router.push(`/org/${id}/allocations`)}
                                >
                                    <Text style={styles.viewAllTextOutline}>View all allocations</Text>
                                </TouchableOpacity>
                            )}
                        </Animated.View>
                    </ScrollView>
                </SafeAreaView>
            </LinearGradient>

            <InviteMemberModal
                visible={showInviteModal}
                onClose={() => setShowInviteModal(false)}
                onSubmit={handleInviteMember}
                isLoading={isCreatingInvite}
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
    settingsBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    orgCard: {
        marginHorizontal: spacing.md,
        marginBottom: spacing.lg,
    },
    orgCardGradient: {
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
    },
    orgHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    orgIconWrapper: {
        width: 56,
        height: 56,
        borderRadius: borderRadius.lg,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    orgInfo: {
        flex: 1,
        marginLeft: spacing.md,
    },
    orgName: {
        ...typography.h2,
        color: '#FFFFFF',
    },
    orgType: {
        ...typography.body,
        color: 'rgba(255, 255, 255, 0.7)',
    },
    balanceSection: {
        marginBottom: spacing.lg,
    },
    balanceLabel: {
        ...typography.caption,
        color: 'rgba(255, 255, 255, 0.7)',
    },
    balanceValue: {
        fontSize: 36,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: borderRadius.md,
        padding: spacing.sm,
    },
    quickAction: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.md,
    },
    quickActionText: {
        ...typography.bodyBold,
        color: '#FFFFFF',
        marginLeft: spacing.xs,
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
    sectionCard: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.xl,
        ...shadows.sm,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: 'hidden',
    },
    divider: {
        height: 1,
        backgroundColor: colors.divider,
        marginHorizontal: spacing.md,
    },
    viewAllBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.divider,
    },
    viewAllText: {
        ...typography.body,
        color: colors.primary,
        marginRight: spacing.xs,
    },
    viewAllBtnOutline: {
        borderWidth: 1,
        borderColor: colors.primary,
        borderRadius: borderRadius.md,
        paddingVertical: spacing.sm,
        alignItems: 'center',
        marginTop: spacing.sm,
    },
    viewAllTextOutline: {
        ...typography.bodyBold,
        color: colors.primary,
    },
});
