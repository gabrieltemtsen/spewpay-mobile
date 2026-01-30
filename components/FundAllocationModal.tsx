import { borderRadius, colors, spacing, typography } from '@/constants/spewpay-theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface FundAllocationModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: { amount: number; description?: string }) => Promise<void>;
    allocationName: string;
    maxAmount?: number;
    isLoading?: boolean;
}

const QUICK_AMOUNTS = [5000, 10000, 25000, 50000];

export function FundAllocationModal({
    visible,
    onClose,
    onSubmit,
    allocationName,
    maxAmount,
    isLoading,
}: FundAllocationModalProps) {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    const handleAmountChange = (text: string) => {
        const cleaned = text.replace(/[^0-9]/g, '');
        setAmount(cleaned);
        setError('');
    };

    const handleQuickAmount = (value: number) => {
        setAmount(String(value));
        setError('');
    };

    const handleSubmit = async () => {
        const numAmount = parseInt(amount);

        if (!amount || numAmount <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        if (numAmount < 100) {
            setError('Minimum amount is ₦100');
            return;
        }

        if (maxAmount && numAmount > maxAmount) {
            setError(`Maximum available: ₦${maxAmount.toLocaleString()}`);
            return;
        }

        try {
            // Convert to kobo for API
            await onSubmit({
                amount: numAmount * 100,
                description: description.trim() || undefined,
            });
            handleClose();
        } catch (e: any) {
            setError(e.message || 'Failed to fund allocation');
        }
    };

    const handleClose = () => {
        setAmount('');
        setDescription('');
        setError('');
        onClose();
    };

    const numericAmount = parseInt(amount) || 0;

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.overlay}
            >
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Fund Allocation</Text>
                        <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
                            <Ionicons name="close" size={24} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.subtitle}>
                        Transfer funds to <Text style={styles.allocationName}>{allocationName}</Text>
                    </Text>

                    {/* Amount Input */}
                    <View style={styles.amountContainer}>
                        <Text style={styles.currencySymbol}>₦</Text>
                        <TextInput
                            style={styles.amountInput}
                            placeholder="0"
                            placeholderTextColor={colors.textTertiary}
                            value={amount}
                            onChangeText={handleAmountChange}
                            keyboardType="number-pad"
                            maxLength={10}
                        />
                    </View>

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    {/* Quick Amounts */}
                    <View style={styles.quickAmounts}>
                        {QUICK_AMOUNTS.map((value) => (
                            <TouchableOpacity
                                key={value}
                                style={[
                                    styles.quickBtn,
                                    numericAmount === value && styles.quickBtnActive,
                                ]}
                                onPress={() => handleQuickAmount(value)}
                            >
                                <Text
                                    style={[
                                        styles.quickBtnText,
                                        numericAmount === value && styles.quickBtnTextActive,
                                    ]}
                                >
                                    ₦{value.toLocaleString()}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Description */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Note (Optional)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Monthly budget top-up"
                            placeholderTextColor={colors.textTertiary}
                            value={description}
                            onChangeText={setDescription}
                        />
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
                        onPress={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <>
                                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                                <Text style={styles.submitBtnText}>
                                    Fund ₦{numericAmount.toLocaleString()}
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
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
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    title: {
        ...typography.h2,
        color: colors.textPrimary,
    },
    closeBtn: {
        padding: spacing.xs,
    },
    subtitle: {
        ...typography.body,
        color: colors.textSecondary,
        marginBottom: spacing.xl,
    },
    allocationName: {
        color: colors.primary,
        fontWeight: '600',
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
    },
    currencySymbol: {
        ...typography.h1,
        color: colors.textSecondary,
        marginRight: spacing.xs,
    },
    amountInput: {
        fontSize: 48,
        fontWeight: '700',
        color: colors.textPrimary,
        minWidth: 100,
        textAlign: 'center',
    },
    errorText: {
        ...typography.small,
        color: colors.error,
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    quickAmounts: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacing.sm,
        marginBottom: spacing.xl,
    },
    quickBtn: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },
    quickBtnActive: {
        backgroundColor: colors.primaryLight,
        borderColor: colors.primary,
    },
    quickBtnText: {
        ...typography.body,
        color: colors.textSecondary,
    },
    quickBtnTextActive: {
        color: colors.primary,
        fontWeight: '600',
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
    submitBtn: {
        flexDirection: 'row',
        backgroundColor: colors.primary,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
    },
    submitBtnDisabled: {
        opacity: 0.7,
    },
    submitBtnText: {
        ...typography.bodyBold,
        color: '#FFFFFF',
    },
});
