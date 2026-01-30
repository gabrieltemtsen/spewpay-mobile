import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useToast } from '@/components/Toast';
import { borderRadius, colors, spacing, typography } from '@/constants/spewpay-theme';
import { useAuth } from '@/contexts';
import { validators } from '@/utils/validation';

const NIGERIAN_BANKS = [
    { code: '044', name: 'Access Bank' },
    { code: '063', name: 'Access Bank (Diamond)' },
    { code: '023', name: 'Citibank' },
    { code: '050', name: 'Ecobank' },
    { code: '070', name: 'Fidelity Bank' },
    { code: '011', name: 'First Bank' },
    { code: '214', name: 'First City Monument Bank' },
    { code: '058', name: 'Guaranty Trust Bank' },
    { code: '030', name: 'Heritage Bank' },
    { code: '301', name: 'Jaiz Bank' },
    { code: '082', name: 'Keystone Bank' },
    { code: '526', name: 'Parallex Bank' },
    { code: '076', name: 'Polaris Bank' },
    { code: '101', name: 'Providus Bank' },
    { code: '221', name: 'Stanbic IBTC Bank' },
    { code: '068', name: 'Standard Chartered Bank' },
    { code: '232', name: 'Sterling Bank' },
    { code: '100', name: 'Suntrust Bank' },
    { code: '032', name: 'Union Bank' },
    { code: '033', name: 'United Bank for Africa' },
    { code: '215', name: 'Unity Bank' },
    { code: '035', name: 'Wema Bank' },
    { code: '057', name: 'Zenith Bank' },
];

export default function WithdrawalScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const { showToast } = useToast();

    const [bankCode, setBankCode] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [accountName, setAccountName] = useState('');
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showBankPicker, setShowBankPicker] = useState(false);

    const selectedBank = NIGERIAN_BANKS.find(b => b.code === bankCode);

    const handleVerifyAccount = async () => {
        if (!bankCode || !accountNumber) {
            showToast('Please select bank and enter account number', 'warning');
            return;
        }

        if (accountNumber.length !== 10) {
            showToast('Account number must be 10 digits', 'error');
            return;
        }

        setIsLoading(true);
        try {
            // TODO: Call actual account verification API
            await new Promise(resolve => setTimeout(resolve, 1500));
            setAccountName('John Doe'); // Mock response
            showToast('Account verified successfully', 'success');
        } catch (error) {
            showToast('Failed to verify account', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleWithdraw = async () => {
        if (!accountName) {
            showToast('Please verify account first', 'warning');
            return;
        }

        const amountError = validators.amount(amount);
        if (amountError) {
            showToast(amountError, 'error');
            return;
        }

        setIsLoading(true);
        try {
            // TODO: Call actual withdrawal API
            await new Promise(resolve => setTimeout(resolve, 2000));
            showToast('Withdrawal initiated successfully', 'success');
            router.back();
        } catch (error) {
            showToast('Withdrawal failed', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[colors.background, colors.backgroundSecondary, colors.background]}
                style={styles.gradient}
            >
                <SafeAreaView style={styles.safeArea} edges={['top']}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                        </TouchableOpacity>
                        <Text style={styles.title}>Withdraw to Bank</Text>
                        <View style={styles.placeholder} />
                    </View>

                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        {/* Bank Selection */}
                        <View style={styles.section}>
                            <Text style={styles.label}>Bank</Text>
                            <TouchableOpacity
                                style={styles.input}
                                onPress={() => setShowBankPicker(!showBankPicker)}
                            >
                                <Text style={selectedBank ? styles.inputText : styles.placeholderText}>
                                    {selectedBank ? selectedBank.name : 'Select Bank'}
                                </Text>
                                <Ionicons
                                    name={showBankPicker ? 'chevron-up' : 'chevron-down'}
                                    size={20}
                                    color={colors.textSecondary}
                                />
                            </TouchableOpacity>

                            {showBankPicker && (
                                <View style={styles.bankList}>
                                    <ScrollView style={styles.bankListScroll} nestedScrollEnabled>
                                        {NIGERIAN_BANKS.map((bank) => (
                                            <TouchableOpacity
                                                key={bank.code}
                                                style={styles.bankItem}
                                                onPress={() => {
                                                    setBankCode(bank.code);
                                                    setShowBankPicker(false);
                                                    setAccountName('');
                                                }}
                                            >
                                                <Text style={styles.bankName}>{bank.name}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            )}
                        </View>

                        {/* Account Number */}
                        <View style={styles.section}>
                            <Text style={styles.label}>Account Number</Text>
                            <View style={styles.inputRow}>
                                <TextInput
                                    style={[styles.input, styles.inputFlex]}
                                    value={accountNumber}
                                    onChangeText={(text) => {
                                        setAccountNumber(text.replace(/[^0-9]/g, ''));
                                        setAccountName('');
                                    }}
                                    placeholder="0000000000"
                                    placeholderTextColor={colors.textTertiary}
                                    keyboardType="number-pad"
                                    maxLength={10}
                                />
                                <TouchableOpacity
                                    style={styles.verifyButton}
                                    onPress={handleVerifyAccount}
                                    disabled={isLoading || accountNumber.length !== 10 || !bankCode}
                                >
                                    <Text style={styles.verifyText}>Verify</Text>
                                </TouchableOpacity>
                            </View>
                            {accountName && (
                                <View style={styles.accountNameContainer}>
                                    <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                                    <Text style={styles.accountName}>{accountName}</Text>
                                </View>
                            )}
                        </View>

                        {/* Amount */}
                        <View style={styles.section}>
                            <Text style={styles.label}>Amount</Text>
                            <View style={styles.amountInputContainer}>
                                <Text style={styles.currencySymbol}>₦</Text>
                                <TextInput
                                    style={styles.amountInput}
                                    value={amount}
                                    onChangeText={setAmount}
                                    placeholder="0.00"
                                    placeholderTextColor={colors.textTertiary}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>

                        {/* Withdraw Button */}
                        <TouchableOpacity
                            style={styles.buttonWrapper}
                            onPress={handleWithdraw}
                            disabled={isLoading || !accountName || !amount}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={[colors.primary, colors.primaryDark]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.withdrawButton}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color={colors.textPrimary} />
                                ) : (
                                    <>
                                        <Ionicons name="cash-outline" size={20} color={colors.textPrimary} />
                                        <Text style={styles.buttonText}>Withdraw Money</Text>
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </ScrollView>
                </SafeAreaView>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    gradient: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    backButton: {
        padding: spacing.xs,
    },
    title: {
        ...typography.h3,
        color: colors.textPrimary,
    },
    placeholder: {
        width: 32,
    },
    content: {
        flex: 1,
        paddingHorizontal: spacing.lg,
    },
    section: {
        marginBottom: spacing.xl,
    },
    label: {
        ...typography.caption,
        color: colors.textSecondary,
        marginBottom: spacing.sm,
    },
    input: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    inputFlex: {
        flex: 1,
    },
    inputText: {
        ...typography.body,
        color: colors.textPrimary,
    },
    placeholderText: {
        ...typography.body,
        color: colors.textTertiary,
    },
    inputRow: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    verifyButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
        justifyContent: 'center',
    },
    verifyText: {
        ...typography.bodyBold,
        color: colors.textPrimary,
    },
    accountNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginTop: spacing.sm,
        paddingHorizontal: spacing.sm,
    },
    accountName: {
        ...typography.body,
        color: colors.success,
    },
    bankList: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        marginTop: spacing.sm,
        maxHeight: 300,
        borderWidth: 1,
        borderColor: colors.border,
    },
    bankListScroll: {
        maxHeight: 300,
    },
    bankItem: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
    },
    bankName: {
        ...typography.body,
        color: colors.textPrimary,
    },
    amountInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    currencySymbol: {
        ...typography.h3,
        color: colors.textTertiary,
        marginRight: spacing.sm,
    },
    amountInput: {
        flex: 1,
        ...typography.h3,
        color: colors.textPrimary,
        paddingVertical: spacing.md,
    },
    buttonWrapper: {
        borderRadius: borderRadius.md,
        overflow: 'hidden',
        marginTop: spacing.xl,
        marginBottom: spacing.xxl,
    },
    withdrawButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        paddingVertical: spacing.md,
    },
    buttonText: {
        ...typography.bodyBold,
        fontSize: 16,
        color: colors.textPrimary,
    },
});
