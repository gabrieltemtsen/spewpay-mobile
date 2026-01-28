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
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // In production, this would call paymentService.initiateWithdrawal()
        setTimeout(async () => {
            setIsLoading(false);
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert(
                'Withdrawal Initiated',
                'Your withdrawal is being processed. You will receive the funds shortly.',
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
            {/* Amount Input */}
            <Animated.View
                entering={FadeInDown.duration(400)}
                className="items-center py-8"
            >
                <Text className="text-muted-dark text-sm mb-2">Withdrawal Amount</Text>
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

            {/* Bank Account Selection */}
            <Animated.View
                entering={FadeInDown.delay(100).duration(400)}
                className="mb-6"
            >
                <Text className="text-muted-dark text-sm mb-3">Select Bank Account</Text>
                {mockBankAccounts.map((account) => (
                    <TouchableOpacity
                        key={account.id}
                        onPress={async () => {
                            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            setSelectedAccount(account.id);
                        }}
                        className={`p-4 rounded-2xl mb-2 flex-row items-center ${selectedAccount === account.id
                                ? 'bg-primary-500/10 border-2 border-primary-500'
                                : 'bg-surface-dark border border-border-dark'
                            }`}
                    >
                        <View className="w-10 h-10 rounded-xl bg-primary-500/10 items-center justify-center">
                            <Ionicons name="business" size={20} color="#0066FF" />
                        </View>
                        <View className="ml-3 flex-1">
                            <Text className="text-foreground-dark font-medium">{account.bankName}</Text>
                            <Text className="text-muted-dark text-sm">
                                {account.accountNumber} • {account.accountName}
                            </Text>
                        </View>
                        {selectedAccount === account.id && (
                            <View className="w-6 h-6 rounded-full bg-primary-500 items-center justify-center">
                                <Ionicons name="checkmark" size={14} color="#fff" />
                            </View>
                        )}
                    </TouchableOpacity>
                ))}

                {/* Add New Account */}
                <TouchableOpacity
                    className="p-4 rounded-2xl border border-dashed border-border-dark flex-row items-center justify-center"
                    onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                >
                    <Ionicons name="add-circle-outline" size={20} color="#64748B" />
                    <Text className="text-muted-dark ml-2">Add New Bank Account</Text>
                </TouchableOpacity>
            </Animated.View>

            {/* Warning */}
            <Animated.View
                entering={FadeInDown.delay(200).duration(400)}
                className="bg-warning-500/10 rounded-2xl p-4 mb-8"
            >
                <View className="flex-row items-center">
                    <Ionicons name="warning" size={20} color="#FF7D5C" />
                    <Text className="text-warning-500 font-medium ml-2">Processing Time</Text>
                </View>
                <Text className="text-muted-dark text-sm mt-2">
                    Withdrawals typically take 5-30 minutes to reflect in your bank account.
                </Text>
            </Animated.View>

            {/* Submit Button */}
            <TouchableOpacity
                onPress={handleWithdraw}
                disabled={isLoading || !amount || !selectedAccount}
                activeOpacity={0.8}
                className="overflow-hidden rounded-2xl"
            >
                <LinearGradient
                    colors={amount && selectedAccount ? ['#FF7D5C', '#CC644A'] : ['#1E293B', '#1E293B']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="py-4 flex-row items-center justify-center"
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Ionicons name="arrow-up-circle" size={20} color="#fff" />
                            <Text className="text-white text-base font-semibold ml-2">
                                Withdraw to Bank
                            </Text>
                        </>
                    )}
                </LinearGradient>
            </TouchableOpacity>
        </ScrollView>
    );
}
