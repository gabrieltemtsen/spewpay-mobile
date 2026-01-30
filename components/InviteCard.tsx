import { borderRadius, colors, shadows, spacing, typography } from '@/constants/spewpay-theme';
import type { OrgInvite } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface InviteCardProps {
    invite: OrgInvite & { orgName?: string };
    onAccept?: () => void;
    onDecline?: () => void;
    isAccepting?: boolean;
    isDeclining?: boolean;
}

export function InviteCard({ invite, onAccept, onDecline, isAccepting, isDeclining }: InviteCardProps) {
    const isPending = invite.status === 'PENDING';
    const isLoading = isAccepting || isDeclining;

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.iconWrapper}>
                    <Ionicons name="mail-outline" size={20} color={colors.warning} />
                </View>
                <View style={styles.info}>
                    <Text style={styles.title}>
                        {invite.orgName || 'Organization Invite'}
                    </Text>
                    <Text style={styles.role}>
                        Invited as <Text style={styles.roleHighlight}>{invite.role}</Text>
                    </Text>
                </View>
            </View>

            {invite.message && (
                <Text style={styles.message}>"{invite.message}"</Text>
            )}

            {isPending && (
                <View style={styles.actions}>
                    <TouchableOpacity
                        style={[styles.btn, styles.declineBtn]}
                        onPress={onDecline}
                        disabled={isLoading}
                    >
                        {isDeclining ? (
                            <ActivityIndicator size="small" color={colors.error} />
                        ) : (
                            <Text style={styles.declineBtnText}>Decline</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.btn, styles.acceptBtn]}
                        onPress={onAccept}
                        disabled={isLoading}
                    >
                        {isAccepting ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                            <Text style={styles.acceptBtnText}>Accept</Text>
                        )}
                    </TouchableOpacity>
                </View>
            )}

            {!isPending && (
                <View style={styles.statusRow}>
                    <Text style={[
                        styles.status,
                        invite.status === 'ACCEPTED' && styles.statusAccepted,
                        invite.status === 'REJECTED' && styles.statusRejected,
                        invite.status === 'EXPIRED' && styles.statusExpired,
                    ]}>
                        {invite.status}
                    </Text>
                </View>
            )}
        </View>
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
    },
    iconWrapper: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.warningLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    info: {
        flex: 1,
        marginLeft: spacing.md,
    },
    title: {
        ...typography.bodyBold,
        color: colors.textPrimary,
    },
    role: {
        ...typography.caption,
        color: colors.textSecondary,
        marginTop: 2,
    },
    roleHighlight: {
        color: colors.primary,
        fontWeight: '600',
    },
    message: {
        ...typography.body,
        color: colors.textSecondary,
        fontStyle: 'italic',
        marginTop: spacing.md,
        paddingLeft: spacing.md,
        borderLeftWidth: 2,
        borderLeftColor: colors.border,
    },
    actions: {
        flexDirection: 'row',
        marginTop: spacing.lg,
        gap: spacing.md,
    },
    btn: {
        flex: 1,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    declineBtn: {
        backgroundColor: colors.errorLight,
    },
    declineBtnText: {
        ...typography.bodyBold,
        color: colors.error,
    },
    acceptBtn: {
        backgroundColor: colors.primary,
    },
    acceptBtnText: {
        ...typography.bodyBold,
        color: '#FFFFFF',
    },
    statusRow: {
        marginTop: spacing.md,
        alignItems: 'flex-start',
    },
    status: {
        ...typography.small,
        fontWeight: '600',
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: borderRadius.sm,
        overflow: 'hidden',
    },
    statusAccepted: {
        backgroundColor: colors.successLight,
        color: colors.success,
    },
    statusRejected: {
        backgroundColor: colors.errorLight,
        color: colors.error,
    },
    statusExpired: {
        backgroundColor: colors.surface,
        color: colors.textTertiary,
    },
});
