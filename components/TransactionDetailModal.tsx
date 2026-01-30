import { borderRadius, colors, shadows, spacing, typography } from '@/constants/spewpay-theme';
import type { Transaction } from '@/types';
import { formatCurrency, formatDate, formatTime } from '@/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface TransactionDetailModalProps {
    visible: boolean;
    transaction: Transaction | null;
    onClose: () => void;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'COMPLETED':
            return colors.success;
        case 'PENDING':
        case 'PROCESSING':
            return colors.warning;
        case 'FAILED':
        case 'REVERSED':
            return colors.error;
        default:
            return colors.textTertiary;
    }
};

const getTransactionIcon = (type: string) => {
    switch (type) {
        case 'DEPOSIT':
            return { name: 'arrow-down' as const, color: colors.success };
        case 'WITHDRAWAL':
            return { name: 'arrow-up' as const, color: colors.warning };
        case 'TRANSFER':
            return { name: 'swap-horizontal' as const, color: colors.primary };
        default:
            return { name: 'cash' as const, color: colors.textTertiary };
    }
};

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
    visible,
    transaction,
    onClose,
}) => {
    if (!transaction) return null;

    const icon = getTransactionIcon(transaction.type);
    const statusColor = getStatusColor(transaction.status);
    const isCredit = transaction.type === 'DEPOSIT';
    const amount = transaction.amount?.naira || 0;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color={colors.textPrimary} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Transaction Details</Text>
                        <View style={styles.placeholder} />
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Status Icon */}
                        <View style={styles.iconSection}>
                            <View style={[styles.iconContainer, { backgroundColor: `${icon.color}20` }]}>
                                <Ionicons name={icon.name} size={48} color={icon.color} />
                            </View>
                        </View>

                        {/* Amount */}
                        <View style={styles.amountSection}>
                            <Text style={[styles.amount, isCredit && styles.amountCredit]}>
                                {isCredit ? '+' : '-'}{formatCurrency(amount)}
                            </Text>
                            <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}>
                                <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                                <Text style={[styles.statusText, { color: statusColor }]}>
                                    {transaction.status}
                                </Text>
                            </View>
                        </View>

                        {/* Details */}
                        <View style={styles.detailsSection}>
                            <DetailRow label="Type" value={transaction.type} />
                            <DetailRow label="Reference" value={transaction.reference} />
                            <DetailRow label="Date" value={formatDate(transaction.createdAt, 'long')} />
                            <DetailRow label="Time" value={formatTime(transaction.createdAt)} />
                            {transaction.description && (
                                <DetailRow label="Description" value={transaction.description} />
                            )}
                        </View>

                        {/* Action Buttons */}
                        {transaction.status === 'COMPLETED' && (
                            <View style={styles.actionsSection}>
                                <TouchableOpacity style={styles.actionButton}>
                                    <Ionicons name="download-outline" size={20} color={colors.primary} />
                                    <Text style={styles.actionText}>Download Receipt</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionButton}>
                                    <Ionicons name="share-outline" size={20} color={colors.primary} />
                                    <Text style={styles.actionText}>Share</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </ScrollView>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

interface DetailRowProps {
    label: string;
    value: string;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => (
    <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: colors.overlay,
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.background,
        borderTopLeftRadius: borderRadius.xxl,
        borderTopRightRadius: borderRadius.xxl,
        maxHeight: '90%',
        ...shadows.lg,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    closeButton: {
        padding: spacing.xs,
    },
    headerTitle: {
        ...typography.h3,
        color: colors.textPrimary,
    },
    placeholder: {
        width: 32,
    },
    iconSection: {
        alignItems: 'center',
        paddingVertical: spacing.xl,
    },
    iconContainer: {
        width: 96,
        height: 96,
        borderRadius: borderRadius.xxl,
        justifyContent: 'center',
        alignItems: 'center',
    },
    amountSection: {
        alignItems: 'center',
        paddingBottom: spacing.xl,
    },
    amount: {
        ...typography.h1,
        fontSize: 36,
        color: colors.textPrimary,
        marginBottom: spacing.md,
    },
    amountCredit: {
        color: colors.success,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.lg,
        gap: spacing.xs,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statusText: {
        ...typography.caption,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    detailsSection: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.lg,
        gap: spacing.md,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: spacing.sm,
    },
    detailLabel: {
        ...typography.body,
        color: colors.textSecondary,
    },
    detailValue: {
        ...typography.bodyBold,
        color: colors.textPrimary,
        textAlign: 'right',
        flex: 1,
        marginLeft: spacing.md,
    },
    actionsSection: {
        flexDirection: 'row',
        gap: spacing.md,
        padding: spacing.lg,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },
    actionText: {
        ...typography.bodyBold,
        color: colors.primary,
    },
});
