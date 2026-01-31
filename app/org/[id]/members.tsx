import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState, InviteMemberModal, LoadingScreen, MemberItem, SearchBar, useToast } from '@/components';
import { colors, spacing, typography } from '@/constants/spewpay-theme';
import { useAuth } from '@/contexts';
import { useInvites } from '@/hooks/useInvites';
import { useOrgDetails } from '@/hooks/useOrgDetails';
import type { OrgMember, OrgRole } from '@/types';

const { height: screenHeight } = Dimensions.get('window');

export default function OrgMembersScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { user } = useAuth();
    const { showToast } = useToast();

    const {
        organization,
        members,
        membersLoading,
        updateMemberRole,
        removeMember,
        refresh,
    } = useOrgDetails(id!);

    const { createInvite, isCreatingInvite } = useInvites(id!);

    const [searchQuery, setSearchQuery] = useState('');
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

    const handleRoleChange = async (memberId: string, newRole: OrgRole) => {
        try {
            await updateMemberRole({ memberId, role: newRole });
            showToast('Role updated', 'success');
        } catch (error: any) {
            showToast(error.message || 'Failed to update role', 'error');
        }
    };

    const handleRemoveMember = async (memberId: string) => {
        try {
            await removeMember(memberId);
            showToast('Member removed', 'success');
        } catch (error: any) {
            showToast(error.message || 'Failed to remove member', 'error');
        }
    };

    const currentMember = members.find((m) => m.userId === user?.id);
    const isAdmin = currentMember?.role === 'OWNER' || currentMember?.role === 'ADMIN';

    const filteredMembers = members.filter((member) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            member.user.displayName.toLowerCase().includes(query) ||
            member.user.email.toLowerCase().includes(query)
        );
    });

    const renderMember = ({ item, index }: { item: OrgMember; index: number }) => (
        <Animated.View entering={FadeInDown.delay(index * 50).duration(300)}>
            <MemberItem
                member={item}
                currentUserId={user?.id}
                onRoleChange={isAdmin ? (_, role) => handleRoleChange(item.id, role) : undefined}
                onRemove={isAdmin && item.userId !== user?.id ? () => handleRemoveMember(item.id) : undefined}
            />
        </Animated.View>
    );

    if (membersLoading && members.length === 0) {
        return <LoadingScreen />;
    }

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#000A1A', '#001433', '#000A1A']}
                style={styles.gradient}
            >
                <SafeAreaView style={styles.safeArea} edges={['top']}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                        </TouchableOpacity>
                        <View style={styles.headerCenter}>
                            <Text style={styles.title}>Members</Text>
                            <Text style={styles.subtitle}>{organization?.name}</Text>
                        </View>
                        {isAdmin && (
                            <TouchableOpacity
                                style={styles.addBtn}
                                onPress={() => setShowInviteModal(true)}
                            >
                                <Ionicons name="person-add" size={20} color="#fff" />
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Search */}
                    <View style={styles.searchContainer}>
                        <SearchBar
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholder="Search members..."
                        />
                    </View>

                    {/* Members List */}
                    <FlatList
                        data={filteredMembers}
                        renderItem={renderMember}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefreshing}
                                onRefresh={handleRefresh}
                                tintColor={colors.primary}
                            />
                        }
                        ListEmptyComponent={
                            <EmptyState
                                icon="people-outline"
                                title="No Members Found"
                                description={searchQuery ? 'Try a different search term' : 'No members in this organization'}
                            />
                        }
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                    />
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
    header: {
        flexDirection: 'row',
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
    headerCenter: {
        flex: 1,
        marginLeft: spacing.md,
    },
    title: {
        ...typography.h2,
        color: colors.textPrimary,
    },
    subtitle: {
        ...typography.caption,
        color: colors.textSecondary,
    },
    addBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchContainer: {
        paddingHorizontal: spacing.md,
        marginBottom: spacing.md,
    },
    listContent: {
        paddingHorizontal: spacing.md,
        paddingBottom: 40,
    },
    separator: {
        height: 1,
        backgroundColor: colors.divider,
        marginHorizontal: spacing.md,
    },
});
