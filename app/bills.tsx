import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useToast } from '@/components';
import { borderRadius, colors, spacing, typography } from '@/constants/spewpay-theme';
import { BILL_CATEGORIES, useBillPayment } from '@/hooks/useBillPayment';
import type { BillCategory, BillProvider, CablePlan, DataPlan } from '@/services/bill.service';

const { height: screenHeight } = Dimensions.get('window');

// Quick amounts for airtime
const QUICK_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];

export default function BillsScreen() {
    const router = useRouter();
    const { showToast } = useToast();

    const {
        selectedCategory,
        selectedProvider,
        providers,
        dataPlans,
        cablePlans,
        selectCategory,
        selectProvider,
        verifyCustomer,
        payBill,
        reset,
        isVerifying,
        isPaying,
        verifiedCustomer,
        paymentResult,
    } = useBillPayment();

    const [step, setStep] = useState<'category' | 'provider' | 'details' | 'confirm' | 'success'>('category');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [customerNumber, setCustomerNumber] = useState('');
    const [selectedPlan, setSelectedPlan] = useState<DataPlan | CablePlan | null>(null);

    const handleCategorySelect = (category: BillCategory) => {
        selectCategory(category);
        setStep('provider');
    };

    const handleProviderSelect = (provider: BillProvider) => {
        selectProvider(provider);
        setStep('details');
    };

    const handleVerify = async () => {
        try {
            await verifyCustomer(customerNumber);
            setStep('confirm');
        } catch (error: any) {
            showToast(error.message || 'Failed to verify', 'error');
        }
    };

    const handlePay = async () => {
        try {
            const paymentAmount = selectedPlan
                ? (selectedPlan as DataPlan).price || (selectedPlan as CablePlan).price
                : parseInt(amount);

            await payBill({
                amount: paymentAmount * 100, // Convert to kobo
                phoneNumber: phoneNumber || undefined,
                meterNumber: selectedCategory === 'electricity' ? customerNumber : undefined,
                smartcardNumber: selectedCategory === 'cable' ? customerNumber : undefined,
                planId: selectedPlan?.id,
            });
            setStep('success');
        } catch (error: any) {
            showToast(error.message || 'Payment failed', 'error');
        }
    };

    const handleReset = () => {
        reset();
        setStep('category');
        setPhoneNumber('');
        setAmount('');
        setCustomerNumber('');
        setSelectedPlan(null);
    };

    // Render category selection
    const renderCategories = () => (
        <Animated.View entering={FadeInDown.duration(400)} style={styles.section}>
            <Text style={styles.sectionTitle}>Select Service</Text>
            <View style={styles.categoriesGrid}>
                {BILL_CATEGORIES.map((cat) => (
                    <TouchableOpacity
                        key={cat.category}
                        style={styles.categoryCard}
                        onPress={() => handleCategorySelect(cat.category)}
                    >
                        <View style={[styles.categoryIcon, { backgroundColor: `${cat.color}20` }]}>
                            <Ionicons name={cat.icon as any} size={28} color={cat.color} />
                        </View>
                        <Text style={styles.categoryLabel}>{cat.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </Animated.View>
    );

    // Render provider selection
    const renderProviders = () => (
        <Animated.View entering={FadeInDown.duration(400)} style={styles.section}>
            <Text style={styles.sectionTitle}>Select Provider</Text>
            <View style={styles.providersList}>
                {providers.map((provider) => (
                    <TouchableOpacity
                        key={provider.id}
                        style={styles.providerCard}
                        onPress={() => handleProviderSelect(provider)}
                    >
                        <View style={styles.providerIcon}>
                            <Ionicons name="cellular" size={24} color={colors.primary} />
                        </View>
                        <Text style={styles.providerName}>{provider.name}</Text>
                        <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
                    </TouchableOpacity>
                ))}
            </View>
        </Animated.View>
    );

    // Render details form based on category
    const renderDetails = () => {
        if (selectedCategory === 'airtime') {
            return (
                <Animated.View entering={FadeInDown.duration(400)} style={styles.section}>
                    <Text style={styles.sectionTitle}>Buy Airtime</Text>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Phone Number</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="08012345678"
                            placeholderTextColor={colors.textTertiary}
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            keyboardType="phone-pad"
                            maxLength={11}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Amount</Text>
                        <View style={styles.amountInput}>
                            <Text style={styles.currencySymbol}>₦</Text>
                            <TextInput
                                style={styles.amountField}
                                placeholder="0"
                                placeholderTextColor={colors.textTertiary}
                                value={amount}
                                onChangeText={setAmount}
                                keyboardType="number-pad"
                            />
                        </View>
                    </View>
                    <View style={styles.quickAmounts}>
                        {QUICK_AMOUNTS.map((amt) => (
                            <TouchableOpacity
                                key={amt}
                                style={[styles.quickBtn, amount === String(amt) && styles.quickBtnActive]}
                                onPress={() => setAmount(String(amt))}
                            >
                                <Text style={[styles.quickBtnText, amount === String(amt) && styles.quickBtnTextActive]}>
                                    ₦{amt}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <TouchableOpacity
                        style={[styles.payBtn, (!phoneNumber || !amount) && styles.payBtnDisabled]}
                        onPress={() => setStep('confirm')}
                        disabled={!phoneNumber || !amount}
                    >
                        <Text style={styles.payBtnText}>Continue</Text>
                    </TouchableOpacity>
                </Animated.View>
            );
        }

        if (selectedCategory === 'data') {
            return (
                <Animated.View entering={FadeInDown.duration(400)} style={styles.section}>
                    <Text style={styles.sectionTitle}>Buy Data</Text>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Phone Number</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="08012345678"
                            placeholderTextColor={colors.textTertiary}
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            keyboardType="phone-pad"
                            maxLength={11}
                        />
                    </View>
                    <Text style={styles.label}>Select Plan</Text>
                    <View style={styles.plansList}>
                        {dataPlans.map((plan) => (
                            <TouchableOpacity
                                key={plan.id}
                                style={[styles.planCard, selectedPlan?.id === plan.id && styles.planCardSelected]}
                                onPress={() => setSelectedPlan(plan)}
                            >
                                <View style={styles.planInfo}>
                                    <Text style={styles.planSize}>{plan.dataSize}</Text>
                                    <Text style={styles.planValidity}>{plan.validity}</Text>
                                </View>
                                <Text style={styles.planPrice}>₦{plan.price.toLocaleString()}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <TouchableOpacity
                        style={[styles.payBtn, (!phoneNumber || !selectedPlan) && styles.payBtnDisabled]}
                        onPress={() => setStep('confirm')}
                        disabled={!phoneNumber || !selectedPlan}
                    >
                        <Text style={styles.payBtnText}>Continue</Text>
                    </TouchableOpacity>
                </Animated.View>
            );
        }

        if (selectedCategory === 'electricity') {
            return (
                <Animated.View entering={FadeInDown.duration(400)} style={styles.section}>
                    <Text style={styles.sectionTitle}>Pay Electricity</Text>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Meter Number</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter meter number"
                            placeholderTextColor={colors.textTertiary}
                            value={customerNumber}
                            onChangeText={setCustomerNumber}
                            keyboardType="number-pad"
                        />
                    </View>
                    {verifiedCustomer && (
                        <View style={styles.verifiedCard}>
                            <Ionicons name="checkmark-circle" size={24} color={colors.success} />
                            <View style={styles.verifiedInfo}>
                                <Text style={styles.verifiedName}>{verifiedCustomer.name}</Text>
                                <Text style={styles.verifiedAddress}>{verifiedCustomer.address}</Text>
                            </View>
                        </View>
                    )}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Amount</Text>
                        <View style={styles.amountInput}>
                            <Text style={styles.currencySymbol}>₦</Text>
                            <TextInput
                                style={styles.amountField}
                                placeholder="0"
                                placeholderTextColor={colors.textTertiary}
                                value={amount}
                                onChangeText={setAmount}
                                keyboardType="number-pad"
                            />
                        </View>
                    </View>
                    <TouchableOpacity
                        style={[styles.payBtn, (!customerNumber || !amount) && styles.payBtnDisabled]}
                        onPress={verifiedCustomer ? () => setStep('confirm') : handleVerify}
                        disabled={!customerNumber || (!verifiedCustomer && !amount) || isVerifying}
                    >
                        {isVerifying ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.payBtnText}>
                                {verifiedCustomer ? 'Continue' : 'Verify Meter'}
                            </Text>
                        )}
                    </TouchableOpacity>
                </Animated.View>
            );
        }

        if (selectedCategory === 'cable') {
            return (
                <Animated.View entering={FadeInDown.duration(400)} style={styles.section}>
                    <Text style={styles.sectionTitle}>Pay Cable TV</Text>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Smartcard Number</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter smartcard number"
                            placeholderTextColor={colors.textTertiary}
                            value={customerNumber}
                            onChangeText={setCustomerNumber}
                            keyboardType="number-pad"
                        />
                    </View>
                    <Text style={styles.label}>Select Package</Text>
                    <View style={styles.plansList}>
                        {cablePlans.map((plan) => (
                            <TouchableOpacity
                                key={plan.id}
                                style={[styles.planCard, selectedPlan?.id === plan.id && styles.planCardSelected]}
                                onPress={() => setSelectedPlan(plan)}
                            >
                                <View style={styles.planInfo}>
                                    <Text style={styles.planSize}>{plan.name}</Text>
                                    <Text style={styles.planValidity}>{plan.duration}</Text>
                                </View>
                                <Text style={styles.planPrice}>₦{plan.price.toLocaleString()}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <TouchableOpacity
                        style={[styles.payBtn, (!customerNumber || !selectedPlan) && styles.payBtnDisabled]}
                        onPress={() => setStep('confirm')}
                        disabled={!customerNumber || !selectedPlan}
                    >
                        <Text style={styles.payBtnText}>Continue</Text>
                    </TouchableOpacity>
                </Animated.View>
            );
        }

        return null;
    };

    // Render confirmation
    const renderConfirm = () => {
        const paymentAmount = selectedPlan
            ? (selectedPlan as DataPlan).price || (selectedPlan as CablePlan).price
            : parseInt(amount);

        return (
            <Animated.View entering={FadeInDown.duration(400)} style={styles.section}>
                <Text style={styles.sectionTitle}>Confirm Payment</Text>
                <View style={styles.confirmCard}>
                    <View style={styles.confirmRow}>
                        <Text style={styles.confirmLabel}>Service</Text>
                        <Text style={styles.confirmValue}>
                            {selectedCategory?.charAt(0).toUpperCase()}{selectedCategory?.slice(1)}
                        </Text>
                    </View>
                    <View style={styles.confirmRow}>
                        <Text style={styles.confirmLabel}>Provider</Text>
                        <Text style={styles.confirmValue}>{selectedProvider?.name}</Text>
                    </View>
                    {phoneNumber && (
                        <View style={styles.confirmRow}>
                            <Text style={styles.confirmLabel}>Phone</Text>
                            <Text style={styles.confirmValue}>{phoneNumber}</Text>
                        </View>
                    )}
                    {customerNumber && (
                        <View style={styles.confirmRow}>
                            <Text style={styles.confirmLabel}>
                                {selectedCategory === 'electricity' ? 'Meter No.' : 'Smartcard No.'}
                            </Text>
                            <Text style={styles.confirmValue}>{customerNumber}</Text>
                        </View>
                    )}
                    {selectedPlan && (
                        <View style={styles.confirmRow}>
                            <Text style={styles.confirmLabel}>Plan</Text>
                            <Text style={styles.confirmValue}>{(selectedPlan as any).name || (selectedPlan as any).dataSize}</Text>
                        </View>
                    )}
                    <View style={[styles.confirmRow, styles.confirmTotal]}>
                        <Text style={styles.confirmTotalLabel}>Total</Text>
                        <Text style={styles.confirmTotalValue}>₦{paymentAmount?.toLocaleString()}</Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={[styles.payBtn, isPaying && styles.payBtnDisabled]}
                    onPress={handlePay}
                    disabled={isPaying}
                >
                    {isPaying ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.payBtnText}>Pay Now</Text>
                    )}
                </TouchableOpacity>
            </Animated.View>
        );
    };

    // Render success
    const renderSuccess = () => (
        <Animated.View entering={FadeInDown.duration(400)} style={styles.successContainer}>
            <View style={styles.successIcon}>
                <Ionicons name="checkmark-circle" size={80} color={colors.success} />
            </View>
            <Text style={styles.successTitle}>Payment Successful!</Text>
            <Text style={styles.successDesc}>
                Your {selectedCategory} payment has been processed successfully.
            </Text>
            {paymentResult?.token && (
                <View style={styles.tokenCard}>
                    <Text style={styles.tokenLabel}>Your Token</Text>
                    <Text style={styles.tokenValue}>{paymentResult.token}</Text>
                </View>
            )}
            <Text style={styles.successRef}>
                Reference: {paymentResult?.reference}
            </Text>
            <TouchableOpacity style={styles.payBtn} onPress={handleReset}>
                <Text style={styles.payBtnText}>Done</Text>
            </TouchableOpacity>
        </Animated.View>
    );

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
                    >
                        {/* Header */}
                        <View style={styles.header}>
                            <TouchableOpacity
                                onPress={step === 'category' ? () => router.back() : () => setStep(
                                    step === 'provider' ? 'category' :
                                        step === 'details' ? 'provider' :
                                            step === 'confirm' ? 'details' : 'category'
                                )}
                                style={styles.backBtn}
                            >
                                <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                            </TouchableOpacity>
                            <Text style={styles.title}>Pay Bills</Text>
                            <View style={styles.placeholder} />
                        </View>

                        {/* Content based on step */}
                        {step === 'category' && renderCategories()}
                        {step === 'provider' && renderProviders()}
                        {step === 'details' && renderDetails()}
                        {step === 'confirm' && renderConfirm()}
                        {step === 'success' && renderSuccess()}
                    </ScrollView>
                </SafeAreaView>
            </LinearGradient>
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
        alignItems: 'center',
        justifyContent: 'space-between',
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
    title: {
        ...typography.h2,
        color: colors.textPrimary,
    },
    placeholder: {
        width: 44,
    },
    section: {
        paddingHorizontal: spacing.md,
    },
    sectionTitle: {
        ...typography.h3,
        color: colors.textPrimary,
        marginBottom: spacing.lg,
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
    },
    categoryCard: {
        width: '47%',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    categoryIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
    },
    categoryLabel: {
        ...typography.bodyBold,
        color: colors.textPrimary,
    },
    providersList: {
        gap: spacing.sm,
    },
    providerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    providerIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.infoLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    providerName: {
        ...typography.bodyBold,
        color: colors.textPrimary,
        flex: 1,
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
    amountInput: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: spacing.md,
    },
    currencySymbol: {
        ...typography.h2,
        color: colors.textSecondary,
    },
    amountField: {
        flex: 1,
        fontSize: 24,
        fontWeight: '700',
        color: colors.textPrimary,
        paddingVertical: spacing.md,
        marginLeft: spacing.sm,
    },
    quickAmounts: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
        marginBottom: spacing.lg,
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
    plansList: {
        gap: spacing.sm,
        marginBottom: spacing.lg,
    },
    planCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    planCardSelected: {
        borderColor: colors.primary,
        backgroundColor: colors.primaryLight,
    },
    planInfo: {},
    planSize: {
        ...typography.bodyBold,
        color: colors.textPrimary,
    },
    planValidity: {
        ...typography.small,
        color: colors.textSecondary,
    },
    planPrice: {
        ...typography.h3,
        color: colors.primary,
    },
    verifiedCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.successLight,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.lg,
    },
    verifiedInfo: {
        marginLeft: spacing.md,
    },
    verifiedName: {
        ...typography.bodyBold,
        color: colors.success,
    },
    verifiedAddress: {
        ...typography.small,
        color: colors.textSecondary,
    },
    payBtn: {
        backgroundColor: colors.primary,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        alignItems: 'center',
        marginTop: spacing.md,
    },
    payBtnDisabled: {
        opacity: 0.7,
    },
    payBtnText: {
        ...typography.bodyBold,
        color: '#FFFFFF',
    },
    confirmCard: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
    },
    confirmRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.sm,
    },
    confirmLabel: {
        ...typography.body,
        color: colors.textSecondary,
    },
    confirmValue: {
        ...typography.bodyBold,
        color: colors.textPrimary,
    },
    confirmTotal: {
        marginTop: spacing.md,
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.divider,
    },
    confirmTotalLabel: {
        ...typography.h3,
        color: colors.textPrimary,
    },
    confirmTotalValue: {
        ...typography.h2,
        color: colors.primary,
    },
    successContainer: {
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.xl * 2,
    },
    successIcon: {
        marginBottom: spacing.lg,
    },
    successTitle: {
        ...typography.h1,
        color: colors.success,
        marginBottom: spacing.sm,
    },
    successDesc: {
        ...typography.body,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    tokenCard: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        alignItems: 'center',
        marginBottom: spacing.lg,
        width: '100%',
        borderWidth: 1,
        borderColor: colors.border,
    },
    tokenLabel: {
        ...typography.caption,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    tokenValue: {
        ...typography.h2,
        color: colors.primary,
        letterSpacing: 2,
    },
    successRef: {
        ...typography.small,
        color: colors.textTertiary,
        marginBottom: spacing.xl,
    },
});
