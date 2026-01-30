import { borderRadius, colors, spacing, typography } from '@/constants/spewpay-theme';
import { RULE_TYPE_INFO } from '@/hooks/useSpendingRules';
import type { RuleType } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface AddRuleModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: {
        ruleType: string;
        config: Record<string, unknown>;
        description?: string;
    }) => Promise<void>;
    isLoading?: boolean;
}

type ExtendedRuleType = RuleType | 'MONTHLY_LIMIT' | 'REQUIRES_APPROVAL';

export function AddRuleModal({ visible, onClose, onSubmit, isLoading }: AddRuleModalProps) {
    const [selectedType, setSelectedType] = useState<ExtendedRuleType | null>(null);
    const [config, setConfig] = useState<Record<string, string>>({});
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!selectedType) {
            setError('Please select a rule type');
            return;
        }

        // Validate and build config
        let finalConfig: Record<string, unknown> = {};

        try {
            switch (selectedType) {
                case 'TXN_LIMIT':
                case 'DAILY_LIMIT':
                case 'MONTHLY_LIMIT':
                    const maxAmount = parseInt(config.maxAmount || '0');
                    if (maxAmount < 100) {
                        setError('Amount must be at least ₦100');
                        return;
                    }
                    finalConfig = { maxAmount: maxAmount * 100 }; // Convert to kobo
                    break;

                case 'TIME_LOCK':
                    const start = parseInt(config.startHour || '0');
                    const end = parseInt(config.endHour || '0');
                    if (start < 0 || start > 23 || end < 0 || end > 23) {
                        setError('Hours must be between 0 and 23');
                        return;
                    }
                    finalConfig = { startHour: start, endHour: end };
                    break;

                case 'REQUIRES_APPROVAL':
                    const threshold = parseInt(config.threshold || '0');
                    finalConfig = threshold > 0 ? { threshold: threshold * 100 } : {};
                    break;

                case 'WHITELIST_RECIPIENTS':
                    finalConfig = { recipients: [] }; // Start with empty list
                    break;
            }

            await onSubmit({
                ruleType: selectedType,
                config: finalConfig,
                description: description.trim() || undefined,
            });
            handleClose();
        } catch (e: any) {
            setError(e.message || 'Failed to add rule');
        }
    };

    const handleClose = () => {
        setSelectedType(null);
        setConfig({});
        setDescription('');
        setError('');
        onClose();
    };

    const renderConfigFields = () => {
        if (!selectedType) return null;

        switch (selectedType) {
            case 'TXN_LIMIT':
            case 'DAILY_LIMIT':
            case 'MONTHLY_LIMIT':
                return (
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Maximum Amount (₦)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. 10000"
                            placeholderTextColor={colors.textTertiary}
                            value={config.maxAmount || ''}
                            onChangeText={(text) => setConfig({ ...config, maxAmount: text.replace(/[^0-9]/g, '') })}
                            keyboardType="number-pad"
                        />
                    </View>
                );

            case 'TIME_LOCK':
                return (
                    <View style={styles.timeRow}>
                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={styles.label}>Start Hour (0-23)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="9"
                                placeholderTextColor={colors.textTertiary}
                                value={config.startHour || ''}
                                onChangeText={(text) => setConfig({ ...config, startHour: text })}
                                keyboardType="number-pad"
                                maxLength={2}
                            />
                        </View>
                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={styles.label}>End Hour (0-23)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="17"
                                placeholderTextColor={colors.textTertiary}
                                value={config.endHour || ''}
                                onChangeText={(text) => setConfig({ ...config, endHour: text })}
                                keyboardType="number-pad"
                                maxLength={2}
                            />
                        </View>
                    </View>
                );

            case 'REQUIRES_APPROVAL':
                return (
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Approval Threshold (₦) - Leave empty for all</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. 50000"
                            placeholderTextColor={colors.textTertiary}
                            value={config.threshold || ''}
                            onChangeText={(text) => setConfig({ ...config, threshold: text.replace(/[^0-9]/g, '') })}
                            keyboardType="number-pad"
                        />
                    </View>
                );

            case 'WHITELIST_RECIPIENTS':
                return (
                    <Text style={styles.helperText}>
                        You can add approved recipients after creating the rule.
                    </Text>
                );

            default:
                return null;
        }
    };

    const ruleTypes = Object.keys(RULE_TYPE_INFO) as ExtendedRuleType[];

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.overlay}
            >
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Add Spending Rule</Text>
                        <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
                            <Ionicons name="close" size={24} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Rule Type Selection */}
                        {!selectedType ? (
                            <View style={styles.typeList}>
                                {ruleTypes.map((type) => {
                                    const info = RULE_TYPE_INFO[type];
                                    return (
                                        <TouchableOpacity
                                            key={type}
                                            style={styles.typeItem}
                                            onPress={() => setSelectedType(type)}
                                        >
                                            <View style={styles.typeIcon}>
                                                <Ionicons name={info.icon as any} size={24} color={colors.primary} />
                                            </View>
                                            <View style={styles.typeInfo}>
                                                <Text style={styles.typeLabel}>{info.label}</Text>
                                                <Text style={styles.typeDesc}>{info.description}</Text>
                                            </View>
                                            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        ) : (
                            <>
                                {/* Selected Type Header */}
                                <TouchableOpacity
                                    style={styles.selectedType}
                                    onPress={() => setSelectedType(null)}
                                >
                                    <View style={styles.typeIcon}>
                                        <Ionicons
                                            name={RULE_TYPE_INFO[selectedType]?.icon as any}
                                            size={24}
                                            color={colors.primary}
                                        />
                                    </View>
                                    <Text style={styles.selectedTypeLabel}>
                                        {RULE_TYPE_INFO[selectedType]?.label}
                                    </Text>
                                    <Ionicons name="chevron-down" size={20} color={colors.textTertiary} />
                                </TouchableOpacity>

                                {/* Config Fields */}
                                {renderConfigFields()}

                                {/* Description */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Description (Optional)</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="e.g. Limit for team expenses"
                                        placeholderTextColor={colors.textTertiary}
                                        value={description}
                                        onChangeText={setDescription}
                                    />
                                </View>

                                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                                {/* Submit Button */}
                                <TouchableOpacity
                                    style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
                                    onPress={handleSubmit}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator color="#FFFFFF" />
                                    ) : (
                                        <Text style={styles.submitBtnText}>Add Rule</Text>
                                    )}
                                </TouchableOpacity>
                            </>
                        )}
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: colors.background,
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        padding: spacing.xl,
        maxHeight: '85%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    title: {
        ...typography.h2,
        color: colors.textPrimary,
    },
    closeBtn: {
        padding: spacing.xs,
    },
    typeList: {
        gap: spacing.sm,
    },
    typeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    typeIcon: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.md,
        backgroundColor: colors.infoLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    typeInfo: {
        flex: 1,
        marginLeft: spacing.md,
    },
    typeLabel: {
        ...typography.bodyBold,
        color: colors.textPrimary,
    },
    typeDesc: {
        ...typography.small,
        color: colors.textSecondary,
    },
    selectedType: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.infoLight,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.xl,
    },
    selectedTypeLabel: {
        ...typography.bodyBold,
        color: colors.primary,
        flex: 1,
        marginLeft: spacing.md,
    },
    inputGroup: {
        marginBottom: spacing.lg,
    },
    label: {
        ...typography.bodyBold,
        color: colors.textSecondary,
        marginBottom: spacing.sm,
    },
    input: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        fontSize: 16,
        color: colors.textPrimary,
        borderWidth: 1,
        borderColor: colors.border,
    },
    timeRow: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    helperText: {
        ...typography.body,
        color: colors.textSecondary,
        marginBottom: spacing.lg,
    },
    errorText: {
        ...typography.small,
        color: colors.error,
        marginBottom: spacing.md,
    },
    submitBtn: {
        backgroundColor: colors.primary,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        alignItems: 'center',
        marginTop: spacing.md,
    },
    submitBtnDisabled: {
        opacity: 0.7,
    },
    submitBtnText: {
        ...typography.bodyBold,
        color: '#FFFFFF',
    },
});
