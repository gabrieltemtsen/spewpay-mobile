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
const QUICK_AMOUNTS = [1000, 2000, 5000, 10000, 20000];

export default function DepositScreen() {
    const router = useRouter();
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleQuickAmount = async (value: number) => {
        if (Platform.OS !== 'web') {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        setAmount(value.toString());
    };

    const handleDeposit = async () => {
        const numAmount = Number(amount);
        if (!amount || numAmount < 100) {
            Alert.alert('Invalid Amount', 'Minimum deposit is ₦100');
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
                'Payment Initiated',
                'You would be redirected to Paystack to complete payment.',
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
                    {/* Amount Display */}
                    <Animated.View entering={FadeInDown.duration(400)} style={styles.amountSection}>
                        <Text style={styles.amountLabel}>Enter Amount</Text>
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

                    {/* Quick Amounts */}
                    <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.quickSection}>
                        <Text style={styles.sectionLabel}>Quick Select</Text>
                        <View style={styles.quickAmounts}>
                            {QUICK_AMOUNTS.map((value) => (
                                <TouchableOpacity
                                    key={value}
                                    onPress={() => handleQuickAmount(value)}
                                    style={[
                                        styles.quickBtn,
                                        amount === value.toString() && styles.quickBtnActive,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.quickBtnText,
                                            amount === value.toString() && styles.quickBtnTextActive,
                                        ]}
                                    >
                                        ₦{value.toLocaleString()}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </Animated.View>

                    {/* Payment Info */}
                    <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <View style={styles.infoIcon}>
                                <Ionicons name="shield-checkmark" size={16} color="#00E699" />
                            </View>
                            <Text style={styles.infoTitle}>Secure Payment via Paystack</Text>
                        </View>
                        <Text style={styles.infoText}>
                            Your payment is processed securely through Paystack. We accept cards, bank transfers, and USSD.
                        </Text>
                    </Animated.View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        onPress={handleDeposit}
                        disabled={isLoading || !amount}
                        activeOpacity={0.8}
                        style={styles.buttonWrapper}
                    >
                        <LinearGradient
                            colors={amount ? ['#00E699', '#00B377'] : ['#1E293B', '#1E293B']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.submitButton}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <>
                                    <Ionicons name="add-circle" size={20} color="#fff" />
                                    <Text style={styles.submitButtonText}>Add Money</Text>
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
    quickSection: {
        marginBottom: 32,
    },
    sectionLabel: {
        color: '#94A3B8',
        fontSize: 14,
        marginBottom: 12,
    },
    quickAmounts: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    quickBtn: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    quickBtnActive: {
        backgroundColor: '#0066FF',
        borderColor: '#0066FF',
    },
    quickBtnText: {
        color: '#94A3B8',
        fontWeight: '600',
    },
    quickBtnTextActive: {
        color: '#FFFFFF',
    },
    infoCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 32,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    infoIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: 'rgba(0, 230, 153, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoTitle: {
        color: '#FFFFFF',
        fontWeight: '500',
        marginLeft: 8,
    },
    infoText: {
        color: '#94A3B8',
        fontSize: 14,
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
