import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface QuickAction {
    id: string;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    bgColor: string;
    onPress: () => void;
}

interface QuickActionsProps {
    onSend: () => void;
    onReceive: () => void;
    onAddMoney: () => void;
    onWithdraw: () => void;
}

export function QuickActions({ onSend, onReceive, onAddMoney, onWithdraw }: QuickActionsProps) {
    const actions: QuickAction[] = [
        {
            id: 'send',
            label: 'Send',
            icon: 'arrow-up',
            color: '#0066FF',
            bgColor: 'bg-primary-500/10',
            onPress: onSend,
        },
        {
            id: 'receive',
            label: 'Receive',
            icon: 'arrow-down',
            color: '#00E699',
            bgColor: 'bg-accent-500/10',
            onPress: onReceive,
        },
        {
            id: 'add',
            label: 'Add Money',
            icon: 'add',
            color: '#8B5CF6',
            bgColor: 'bg-purple-500/10',
            onPress: onAddMoney,
        },
        {
            id: 'withdraw',
            label: 'Withdraw',
            icon: 'wallet-outline',
            color: '#FF7D5C',
            bgColor: 'bg-warning-500/10',
            onPress: onWithdraw,
        },
    ];

    const handlePress = async (action: QuickAction) => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        action.onPress();
    };

    return (
        <Animated.View
            entering={FadeInDown.delay(200).duration(500)}
            className="px-4 mt-6"
        >
            <Text className="text-foreground-dark text-lg font-semibold mb-4">
                Quick Actions
            </Text>
            <View className="flex-row justify-between">
                {actions.map((action, index) => (
                    <TouchableOpacity
                        key={action.id}
                        onPress={() => handlePress(action)}
                        activeOpacity={0.7}
                        className="items-center flex-1"
                    >
                        <View className={`w-14 h-14 rounded-2xl ${action.bgColor} items-center justify-center mb-2`}>
                            <Ionicons name={action.icon} size={24} color={action.color} />
                        </View>
                        <Text className="text-muted-dark text-xs font-medium">
                            {action.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </Animated.View>
    );
}
