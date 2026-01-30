import { borderRadius, colors, spacing, typography } from '@/constants/spewpay-theme';
import { RULE_TYPE_INFO } from '@/hooks/useSpendingRules';
import type { SpendingRule } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

interface RuleItemProps {
    rule: SpendingRule;
    onToggle?: (enabled: boolean) => void;
    onPress?: () => void;
    onDelete?: () => void;
}

const formatConfig = (ruleType: string, config: Record<string, unknown>): string => {
    switch (ruleType) {
        case 'TXN_LIMIT':
            return `Max ₦${(Number(config.maxAmount) / 100).toLocaleString()} per transaction`;
        case 'DAILY_LIMIT':
            return `Max ₦${(Number(config.maxAmount) / 100).toLocaleString()} per day`;
        case 'MONTHLY_LIMIT':
            return `Max ₦${(Number(config.maxAmount) / 100).toLocaleString()} per month`;
        case 'TIME_LOCK':
            return `${config.startHour}:00 - ${config.endHour}:00`;
        case 'WHITELIST_RECIPIENTS':
            const count = Array.isArray(config.recipients) ? config.recipients.length : 0;
            return `${count} approved recipient${count !== 1 ? 's' : ''}`;
        case 'REQUIRES_APPROVAL':
            return config.threshold
                ? `Above ₦${(Number(config.threshold) / 100).toLocaleString()}`
                : 'All transactions';
        default:
            return JSON.stringify(config);
    }
};

export function RuleItem({ rule, onToggle, onPress, onDelete }: RuleItemProps) {
    const ruleInfo = RULE_TYPE_INFO[rule.ruleType] || {
        label: rule.ruleType,
        icon: 'help-circle-outline',
        description: '',
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={onPress ? 0.7 : 1}
            style={[styles.container, !rule.enabled && styles.containerDisabled]}
        >
            <View style={[styles.iconWrapper, !rule.enabled && styles.iconDisabled]}>
                <Ionicons
                    name={ruleInfo.icon as any}
                    size={20}
                    color={rule.enabled ? colors.primary : colors.textTertiary}
                />
            </View>

            <View style={styles.content}>
                <Text style={[styles.label, !rule.enabled && styles.labelDisabled]}>
                    {ruleInfo.label}
                </Text>
                <Text style={styles.config}>
                    {formatConfig(rule.ruleType, rule.config)}
                </Text>
                {rule.description && (
                    <Text style={styles.description} numberOfLines={1}>
                        {rule.description}
                    </Text>
                )}
            </View>

            {onToggle && (
                <Switch
                    value={rule.enabled}
                    onValueChange={onToggle}
                    trackColor={{ false: colors.border, true: colors.primaryLight }}
                    thumbColor={rule.enabled ? colors.primary : colors.textTertiary}
                />
            )}

            {onDelete && (
                <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
                    <Ionicons name="trash-outline" size={18} color={colors.error} />
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        marginBottom: spacing.sm,
    },
    containerDisabled: {
        opacity: 0.6,
    },
    iconWrapper: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.md,
        backgroundColor: colors.infoLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconDisabled: {
        backgroundColor: colors.border,
    },
    content: {
        flex: 1,
        marginLeft: spacing.md,
        marginRight: spacing.sm,
    },
    label: {
        ...typography.bodyBold,
        color: colors.textPrimary,
    },
    labelDisabled: {
        color: colors.textSecondary,
    },
    config: {
        ...typography.caption,
        color: colors.textSecondary,
        marginTop: 2,
    },
    description: {
        ...typography.small,
        color: colors.textTertiary,
        marginTop: 2,
    },
    deleteBtn: {
        padding: spacing.xs,
        marginLeft: spacing.sm,
    },
});
