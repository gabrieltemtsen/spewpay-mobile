import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Dimensions,
    Platform,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CreateOrgModal, EmptyState, InviteCard, OrgCard, useToast } from '@/components';
import { colors, spacing, typography } from '@/constants/spewpay-theme';
import { useInvites } from '@/hooks/useInvites';
import { useOrganizations } from '@/hooks/useOrganizations';

const { height: screenHeight } = Dimensions.get('window');

export default function OrgsScreen() {
    const { organizations, isLoading, isRefreshing, refresh, createOrg, isCreating } = useOrganizations();
    const { myInvites, acceptInvite, declineInvite, isAccepting, isDeclining, refreshMyInvites } = useInvites();
    const { showToast } = useToast();
    const [showCreateModal, setShowCreateModal] = useState(false);

    const handleAddOrg = async () => {
        if (Platform.OS !== 'web') {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        setShowCreateModal(true);
    };

    const handleCreateOrg = async (data: { name: string; type: any }) => {
        try {
            await createOrg(data);
            showToast('Organization created!', 'success');
        } catch (error: any) {
            showToast(error.message || 'Failed to create organization', 'error');
            throw error;
        }
    };

    const handleAcceptInvite = async (inviteId: string) => {
        try {
            await acceptInvite(inviteId);
            showToast('Invite accepted!', 'success');
        } catch (error: any) {
            showToast(error.message || 'Failed to accept invite', 'error');
        }
    };

    const handleDeclineInvite = async (inviteId: string) => {
        try {
            await declineInvite(inviteId);
            showToast('Invite declined', 'info');
        } catch (error: any) {
            showToast(error.message || 'Failed to decline invite', 'error');
        }
    };

    const handleRefresh = () => {
        refresh();
        refreshMyInvites();
    };

    const pendingInvites = myInvites.filter((i) => i.status === 'PENDING');

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000A1A" />

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
                            <View>
                                <Text style={styles.title}>Organizations</Text>
                                <Text style={styles.subtitle}>Manage your groups and budgets</Text>
                            </View>
                            <TouchableOpacity style={styles.addBtn} onPress={handleAddOrg}>
                                <Ionicons name="add" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        {/* Pending Invites */}
                        {pendingInvites.length > 0 && (
                            <Animated.View
                                entering={FadeInDown.delay(100).duration(400)}
                                style={styles.section}
                            >
                                <Text style={styles.sectionTitle}>
                                    Pending Invites ({pendingInvites.length})
                                </Text>
                                {pendingInvites.map((invite) => (
                                    <InviteCard
                                        key={invite.id}
                                        invite={invite}
                                        onAccept={() => handleAcceptInvite(invite.id)}
                                        onDecline={() => handleDeclineInvite(invite.id)}
                                        isAccepting={isAccepting}
                                        isDeclining={isDeclining}
                                    />
                                ))}
                            </Animated.View>
                        )}

                        {/* Org Cards */}
                        {organizations.length > 0 ? (
                            <View style={styles.cardsContainer}>
                                {organizations.map((org, index) => (
                                    <OrgCard key={org.id} org={org} index={index} />
                                ))}
                            </View>
                        ) : !isLoading ? (
                            <EmptyState
                                icon="business-outline"
                                title="No Organizations"
                                description="Create an organization to manage shared budgets and allocations."
                                action={{
                                    label: 'Create Organization',
                                    onPress: handleAddOrg,
                                }}
                            />
                        ) : null}
                    </ScrollView>
                </SafeAreaView>
            </LinearGradient>

            <CreateOrgModal
                visible={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreateOrg}
                isLoading={isCreating}
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
        paddingBottom: 120,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.lg,
    },
    title: {
        ...typography.h1,
        color: '#FFFFFF',
    },
    subtitle: {
        ...typography.body,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
    addBtn: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    section: {
        paddingHorizontal: spacing.md,
        marginBottom: spacing.lg,
    },
    sectionTitle: {
        ...typography.h3,
        color: '#FFFFFF',
        marginBottom: spacing.md,
    },
    cardsContainer: {
        paddingHorizontal: spacing.md,
    },
});
