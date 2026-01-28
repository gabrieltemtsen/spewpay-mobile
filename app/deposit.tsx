import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const QUICK_AMOUNTS = [1000, 2000, 5000, 10000, 20000];

export default function DepositScreen() {
    const router = useRouter();
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleQuickAmount = async (value: number) => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setAmount(value.toString());
    };

    const handleDeposit = async () => {
        const numAmount = Number(amount);
        if (!amount || numAmount < 100) {
            Alert.alert('Invalid Amount', 'Minimum deposit is ₦100');
            return;
        }

        setIsLoading(true);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // In production, this would call paymentService.initializeDeposit()
        // and redirect to Paystack WebView
        setTimeout(async () => {
            setIsLoading(false);
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert(
                'Payment Initiated',
                'You would be redirected to Paystack to complete payment.',
                [{ text: 'OK', onPress: () => router.back() }]
            );
        }, 1500);
    };

    return (
        <ScrollView
            className="flex-1 bg-background-dark"
            contentContainerStyle={{ padding: 24 }}
            showsVerticalScrollIndicator={false}
        >
            {/* Amount Display */}
            <Animated.View
                entering={FadeInDown.duration(400)}
                className="items-center py-8"
            >
                <Text className="text-muted-dark text-sm mb-2">Enter Amount</Text>
                <View className="flex-row items-baseline">
                    <Text className="text-muted-dark text-3xl font-medium mr-2">₦</Text>
                    <TextInput
                        className="text-foreground-dark text-5xl font-bold text-center"
                        placeholder="0"
                        placeholderTextColor="#64748B"
                        keyboardType="numeric"
                        value={amount}
                        onChangeText={setAmount}
                        style={{ minWidth: 100 }}
                    />
                </View>
            </Animated.View>

            {/* Quick Amounts */}
            <Animated.View
                entering={FadeInDown.delay(100).duration(400)}
                className="mb-8"
            >
                <Text className="text-muted-dark text-sm mb-3">Quick Select</Text>
                <View className="flex-row flex-wrap gap-2">
                    {QUICK_AMOUNTS.map((value) => (
                        <TouchableOpacity
                            key={value}
                            onPress={() => handleQuickAmount(value)}
                            className={`px-4 py-3 rounded-xl ${amount === value.toString()
                                    ? 'bg-primary-500'
                                    : 'bg-surface-dark border border-border-dark'
                                }`}
                        >
                            <Text className={`font-semibold ${amount === value.toString() ? 'text-white' : 'text-muted-dark'
                                }`}>
                                ₦{value.toLocaleString()}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </Animated.View>

            {/* Payment Info */}
            <Animated.View
                entering={FadeInDown.delay(200).duration(400)}
                className="bg-card-dark rounded-2xl p-4 mb-8"
            >
                <View className="flex-row items-center mb-3">
                    <View className="w-8 h-8 rounded-lg bg-accent-500/10 items-center justify-center">
                        <Ionicons name="shield-checkmark" size={16} color="#00E699" />
                    </View>
                    <Text className="text-foreground-dark font-medium ml-2">
                        Secure Payment via Paystack
                    </Text>
                </View>
                <Text className="text-muted-dark text-sm">
                    Your payment is processed securely through Paystack. We accept cards, bank transfers, and USSD.
                </Text>
            </Animated.View>

            {/* Submit Button */}
            <TouchableOpacity
                onPress={handleDeposit}
                disabled={isLoading || !amount}
                activeOpacity={0.8}
                className="overflow-hidden rounded-2xl"
            >
                <LinearGradient
                    colors={amount ? ['#00E699', '#00B377'] : ['#1E293B', '#1E293B']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="py-4 flex-row items-center justify-center"
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Ionicons name="add-circle" size={20} color="#fff" />
                            <Text className="text-white text-base font-semibold ml-2">
                                Add Money
                            </Text>
                        </>
                    )}
                </LinearGradient>
            </TouchableOpacity>
        </ScrollView>
    );
}
