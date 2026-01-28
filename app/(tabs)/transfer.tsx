import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/contexts';

const QUICK_AMOUNTS = [500, 1000, 2000, 5000];

export default function TransferScreen() {
    const { user } = useAuth();
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleQuickAmount = async (value: number) => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setAmount(value.toString());
    };

    const handleSend = async () => {
        if (!recipient || !amount) {
            Alert.alert('Missing Info', 'Please enter recipient and amount');
            return;
        }

        setIsLoading(true);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // Simulate API call
        setTimeout(async () => {
            setIsLoading(false);
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert('Success', `₦${amount} sent to ${recipient}`, [
                { text: 'OK', onPress: () => { setRecipient(''); setAmount(''); setDescription(''); } }
            ]);
        }, 2000);
    };

    return (
        <View className="flex-1 bg-background-dark">
            <StatusBar barStyle="light-content" />

            <SafeAreaView className="flex-1" edges={['top']}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1"
                >
                    {/* Header */}
                    <View className="px-6 py-4">
                        <Text className="text-foreground-dark text-2xl font-bold">
                            Send Money
                        </Text>
                        <Text className="text-muted-dark text-sm mt-1">
                            Transfer funds to another user
                        </Text>
                    </View>

                    <View className="flex-1 px-6">
                        {/* Recipient Input */}
                        <Animated.View
                            entering={FadeInDown.duration(400)}
                            className="mb-4"
                        >
                            <Text className="text-muted-dark text-sm mb-2 font-medium">
                                Recipient
                            </Text>
                            <View className="flex-row items-center bg-surface-dark rounded-2xl px-4 border border-border-dark">
                                <Ionicons name="person-outline" size={20} color="#64748B" />
                                <TextInput
                                    className="flex-1 py-4 px-3 text-foreground-dark text-base"
                                    placeholder="Enter email or username"
                                    placeholderTextColor="#64748B"
                                    autoCapitalize="none"
                                    value={recipient}
                                    onChangeText={setRecipient}
                                />
                            </View>
                        </Animated.View>

                        {/* Amount Input */}
                        <Animated.View
                            entering={FadeInDown.delay(100).duration(400)}
                            className="mb-4"
                        >
                            <Text className="text-muted-dark text-sm mb-2 font-medium">
                                Amount
                            </Text>
                            <View className="flex-row items-center bg-surface-dark rounded-2xl px-4 border border-border-dark">
                                <Text className="text-muted-dark text-xl">₦</Text>
                                <TextInput
                                    className="flex-1 py-4 px-3 text-foreground-dark text-2xl font-bold"
                                    placeholder="0.00"
                                    placeholderTextColor="#64748B"
                                    keyboardType="numeric"
                                    value={amount}
                                    onChangeText={setAmount}
                                />
                            </View>
                        </Animated.View>

                        {/* Quick Amounts */}
                        <Animated.View
                            entering={FadeInDown.delay(200).duration(400)}
                            className="flex-row gap-3 mb-6"
                        >
                            {QUICK_AMOUNTS.map((value) => (
                                <TouchableOpacity
                                    key={value}
                                    onPress={() => handleQuickAmount(value)}
                                    className={`flex-1 py-3 rounded-xl items-center ${amount === value.toString()
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
                        </Animated.View>

                        {/* Description Input */}
                        <Animated.View
                            entering={FadeInDown.delay(300).duration(400)}
                            className="mb-8"
                        >
                            <Text className="text-muted-dark text-sm mb-2 font-medium">
                                Note (Optional)
                            </Text>
                            <View className="flex-row items-center bg-surface-dark rounded-2xl px-4 border border-border-dark">
                                <Ionicons name="chatbubble-outline" size={20} color="#64748B" />
                                <TextInput
                                    className="flex-1 py-4 px-3 text-foreground-dark text-base"
                                    placeholder="What's this for?"
                                    placeholderTextColor="#64748B"
                                    value={description}
                                    onChangeText={setDescription}
                                />
                            </View>
                        </Animated.View>

                        {/* Send Button */}
                        <TouchableOpacity
                            onPress={handleSend}
                            disabled={isLoading}
                            activeOpacity={0.8}
                            className="overflow-hidden rounded-2xl"
                        >
                            <LinearGradient
                                colors={['#0066FF', '#0052CC']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                className="py-4 flex-row items-center justify-center"
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <>
                                        <Ionicons name="send" size={20} color="#fff" />
                                        <Text className="text-white text-base font-semibold ml-2">
                                            Send Money
                                        </Text>
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}
