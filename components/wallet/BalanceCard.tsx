import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    FadeInDown,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

import type { MoneyAmount } from '@/types';

interface BalanceCardProps {
    balance: MoneyAmount;
    currency?: string;
    onAddMoney?: () => void;
    onWithdraw?: () => void;
}

export function BalanceCard({
    balance,
    currency = 'NGN',
    onAddMoney,
    onWithdraw,
}: BalanceCardProps) {
    const [isHidden, setIsHidden] = useState(false);
    const scale = useSharedValue(1);

    const toggleVisibility = async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setIsHidden(!isHidden);
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.98);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1);
    };

    const formatBalance = (amount: number): string => {
        return new Intl.NumberFormat('en-NG', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    return (
        <Animated.View
            entering={FadeInDown.duration(600).springify()}
            style={animatedStyle}
        >
            <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
                <View className="rounded-4xl overflow-hidden mx-4 shadow-glow">
                    <LinearGradient
                        colors={['#0066FF', '#003D99', '#002966']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        className="p-6"
                    >
                        {/* Decorative elements */}
                        <View className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5" style={{ transform: [{ translateX: 60 }, { translateY: -60 }] }} />
                        <View className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5" style={{ transform: [{ translateX: -40 }, { translateY: 40 }] }} />

                        {/* Card Header */}
                        <View className="flex-row justify-between items-center mb-6">
                            <View>
                                <Text className="text-white/70 text-sm font-medium">
                                    Available Balance
                                </Text>
                                <Text className="text-white/50 text-xs mt-1">
                                    {currency} Wallet
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={toggleVisibility}
                                className="w-10 h-10 rounded-full bg-white/10 items-center justify-center"
                            >
                                <Ionicons
                                    name={isHidden ? 'eye-off' : 'eye'}
                                    size={20}
                                    color="rgba(255,255,255,0.8)"
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Balance Display */}
                        <Animated.View
                            entering={FadeInUp.delay(200).duration(400)}
                            className="mb-8"
                        >
                            <View className="flex-row items-baseline">
                                <Text className="text-white/70 text-2xl font-medium mr-1">₦</Text>
                                <Text className="text-white text-4xl font-bold tracking-tight">
                                    {isHidden ? '••••••' : formatBalance(balance.naira)}
                                </Text>
                            </View>
                        </Animated.View>

                        {/* Action Buttons */}
                        <View className="flex-row gap-3">
                            <TouchableOpacity
                                onPress={onAddMoney}
                                activeOpacity={0.8}
                                className="flex-1 overflow-hidden rounded-2xl"
                            >
                                <BlurView intensity={25} tint="light" className="py-3 flex-row items-center justify-center">
                                    <Ionicons name="add-circle" size={20} color="#fff" />
                                    <Text className="text-white font-semibold ml-2">Add Money</Text>
                                </BlurView>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={onWithdraw}
                                activeOpacity={0.8}
                                className="flex-1 overflow-hidden rounded-2xl"
                            >
                                <BlurView intensity={25} tint="light" className="py-3 flex-row items-center justify-center">
                                    <Ionicons name="arrow-up-circle" size={20} color="#fff" />
                                    <Text className="text-white font-semibold ml-2">Withdraw</Text>
                                </BlurView>
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                </View>
            </Pressable>
        </Animated.View>
    );
}
