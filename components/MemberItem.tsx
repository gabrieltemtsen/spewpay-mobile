import { borderRadius, colors, spacing, typography } from '@/constants/spewpay-theme';
import type { OrgMember, OrgRole } from '@/types';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MemberItemProps {
    member: OrgMember;
    currentUserId?: string;
    onPress?: () => void;
    onRoleChange?: (memberId: string, newRole: OrgRole) => void;
    onRemove?: (memberId: string) => void;
}

const getRoleBadgeColor = (role: OrgRole) => {
    switch (role) {
        case 'OWNER':
            return { bg: colors.warningLight, text: colors.warning };
        case 'ADMIN':
            return { bg: colors.errorLight, text: colors.error };
        case 'MANAGER':
            return { bg: colors.infoLight, text: colors.info };
        case 'MEMBER':
        default:
            return { bg: colors.surface, text: colors.textSecondary };
    }
};

export function MemberItem({ member, currentUserId, onPress, onRoleChange, onRemove }: MemberItemProps) {
    const roleColors = getRoleBadgeColor(member.role);
    const isCurrentUser = member.userId === currentUserId;
    const initials = member.user.displayName
        .split(' ')
        .map((n) => n.charAt(0))
        .join('')
        .substring(0, 2)
        .toUpperCase();

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={onPress ? 0.7 : 1}
            style={styles.container}
        >
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
            </View>

            <View style={styles.info}>
                <View style={styles.nameRow}>
                    <Text style={styles.name}>{member.user.displayName}</Text>
                    {isCurrentUser && <Text style={styles.youBadge}>You</Text>}
                </View>
                <Text style={styles.email}>{member.user.email}</Text>
            </View>

            <View style={[styles.roleBadge, { backgroundColor: roleColors.bg }]}>
                <Text style={[styles.roleText, { color: roleColors.text }]}>
                    {member.role}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        ...typography.bodyBold,
        color: '#FFFFFF',
    },
    info: {
        flex: 1,
        marginLeft: spacing.md,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    name: {
        ...typography.bodyBold,
        color: colors.textPrimary,
    },
    youBadge: {
        ...typography.small,
        color: colors.primary,
        marginLeft: spacing.xs,
        fontWeight: '600',
    },
    email: {
        ...typography.caption,
        color: colors.textSecondary,
        marginTop: 2,
    },
    roleBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: borderRadius.sm,
    },
    roleText: {
        ...typography.small,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
});
