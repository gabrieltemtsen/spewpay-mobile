import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { height: screenHeight } = Dimensions.get('window');

// Mock bank accounts
const mockBankAccounts = [
    { id: '1', bankName: 'Access Bank', accountNumber: '0123456789', accountName: 'John Doe' },
    { id: '2', bankName: 'GTBank', accountNumber: '9876543210', accountName: 'John Doe' },
];

export default function WithdrawScreen() {
    const router = useRouter();
    const [amount, setAmount] = useState('');
    const [selectedAccount, setSelectedAccount] = useState(mockBankAccounts[0]?.id);
    const [isLoading, setIsLoading] = useState(false);

    const handleAccountSelect = async (accountId: string) => {
        if (Platform.OS !== 'web') {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        setSelectedAccount(accountId);
    };

    const handleWithdraw = async () => {
        const numAmount = Number(amount);
        if (!amount || numAmount < 100) {
            Alert.alert('Invalid Amount', 'Minimum withdrawal is ₦100');
            return;
        }

        if (!selectedAccount) {
            Alert.alert('Select Account', 'Please select a bank account');
            return;
        }

        setIsLoading(true);
        if (Platform.OS !== 'web') {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }

        setTimeout(async () => {
            setIsLoading(false);
            if (Platform.OS !== 'web') {
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
            Alert.alert(
                'Withdrawal Initiated',
                'Your withdrawal is being processed. You will receive the funds shortly.',
                [{ text: 'OK', onPress: () => router.back() }]
            );
        }, 1500);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000A1A" />

            <LinearGradient
                colors={['#000A1A', '#001433', '#000A1A']}
                style={styles.gradient}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Amount Input */}
                    <Animated.View entering={FadeInDown.duration(400)} style={styles.amountSection}>
                        <Text style={styles.amountLabel}>Withdrawal Amount</Text>
                        <View style={styles.amountRow}>
                            <Text style={styles.currencySymbol}>₦</Text>
                            <TextInput
                                style={styles.amountInput}
                                placeholder="0"
                                placeholderTextColor="#64748B"
                                keyboardType="numeric"
                                value={amount}
                                onChangeText={setAmount}
                            />
                        </View>
                    </Animated.View>

                    {/* Bank Account Selection */}
                    <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.accountsSection}>
                        <Text style={styles.sectionLabel}>Select Bank Account</Text>
                        {mockBankAccounts.map((account) => (
                            <TouchableOpacity
                                key={account.id}
                                onPress={() => handleAccountSelect(account.id)}
                                style={[
                                    styles.accountCard,
                                    selectedAccount === account.id && styles.accountCardActive,
                                ]}
                            >
                                <View style={styles.accountIcon}>
                                    <Ionicons name="business" size={20} color="#0066FF" />
                                </View>
                                <View style={styles.accountInfo}>
                                    <Text style={styles.bankName}>{account.bankName}</Text>
                                    <Text style={styles.accountDetails}>
                                        {account.accountNumber} • {account.accountName}
                                    </Text>
                                </View>
                                {selectedAccount === account.id && (
                                    <View style={styles.checkIcon}>
                                        <Ionicons name="checkmark" size={14} color="#fff" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}

                        {/* Add New Account */}
                        <TouchableOpacity
                            style={styles.addAccountBtn}
                            onPress={() => {
                                if (Platform.OS !== 'web') {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                }
                            }}
                        >
                            <Ionicons name="add-circle-outline" size={20} color="#64748B" />
                            <Text style={styles.addAccountText}>Add New Bank Account</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Warning */}
                    <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.warningCard}>
                        <View style={styles.warningRow}>
                            <Ionicons name="warning" size={20} color="#FF7D5C" />
                            <Text style={styles.warningTitle}>Processing Time</Text>
                        </View>
                        <Text style={styles.warningText}>
                            Withdrawals typically take 5-30 minutes to reflect in your bank account.
                        </Text>
                    </Animated.View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        onPress={handleWithdraw}
                        disabled={isLoading || !amount || !selectedAccount}
                        activeOpacity={0.8}
                        style={styles.buttonWrapper}
                    >
                        <LinearGradient
                            colors={amount && selectedAccount ? ['#FF7D5C', '#CC644A'] : ['#1E293B', '#1E293B']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.submitButton}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <>
                                    <Ionicons name="arrow-up-circle" size={20} color="#fff" />
                                    <Text style={styles.submitButtonText}>Withdraw to Bank</Text>
                                </>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </ScrollView>
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
    scrollContent: {
        padding: 24,
        paddingBottom: 48,
    },
    amountSection: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    amountLabel: {
        color: '#94A3B8',
        fontSize: 14,
        marginBottom: 8,
    },
    amountRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    currencySymbol: {
        color: '#64748B',
        fontSize: 32,
        fontWeight: '500',
        marginRight: 8,
    },
    amountInput: {
        color: '#FFFFFF',
        fontSize: 48,
        fontWeight: '700',
        textAlign: 'center',
        minWidth: 100,
    },
    accountsSection: {
        marginBottom: 24,
    },
    sectionLabel: {
        color: '#94A3B8',
        fontSize: 14,
        marginBottom: 12,
    },
    accountCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        marginBottom: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    accountCardActive: {
        backgroundColor: 'rgba(0, 102, 255, 0.1)',
        borderWidth: 2,
        borderColor: '#0066FF',
    },
    accountIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(0, 102, 255, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    accountInfo: {
        flex: 1,
        marginLeft: 12,
    },
    bankName: {
        color: '#FFFFFF',
        fontWeight: '500',
    },
    accountDetails: {
        color: '#94A3B8',
        fontSize: 14,
        marginTop: 2,
    },
    checkIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#0066FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addAccountBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    addAccountText: {
        color: '#94A3B8',
        marginLeft: 8,
    },
    warningCard: {
        backgroundColor: 'rgba(255, 125, 92, 0.1)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 32,
    },
    warningRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    warningTitle: {
        color: '#FF7D5C',
        fontWeight: '500',
        marginLeft: 8,
    },
    warningText: {
        color: '#94A3B8',
        fontSize: 14,
        marginTop: 8,
        lineHeight: 20,
    },
    buttonWrapper: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    submitButton: {
        paddingVertical: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
