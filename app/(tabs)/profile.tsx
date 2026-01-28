import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/contexts';

interface MenuItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    subtitle?: string;
    onPress: () => void;
    danger?: boolean;
}

function MenuItem({ icon, label, subtitle, onPress, danger }: MenuItemProps) {
    const handlePress = async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            className="flex-row items-center py-4 px-4"
            activeOpacity={0.7}
        >
            <View className={`w-10 h-10 rounded-xl items-center justify-center ${danger ? 'bg-error-500/10' : 'bg-primary-500/10'
                }`}>
                <Ionicons
                    name={icon}
                    size={20}
                    color={danger ? '#EF4444' : '#0066FF'}
                />
            </View>
            <View className="flex-1 ml-3">
                <Text className={`text-base font-medium ${danger ? 'text-error-500' : 'text-foreground-dark'
                    }`}>
                    {label}
                </Text>
                {subtitle && (
                    <Text className="text-muted-dark text-sm mt-0.5">{subtitle}</Text>
                )}
            </View>
            <Ionicons name="chevron-forward" size={20} color="#64748B" />
        </TouchableOpacity>
    );
}

function MenuSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <View className="mb-6">
            <Text className="text-muted-dark text-sm font-medium mb-2 px-4">
                {title}
            </Text>
            <View className="bg-card-dark rounded-2xl overflow-hidden">
                {children}
            </View>
        </View>
    );
}

function Divider() {
    return <View className="h-px bg-border-dark mx-4" />;
}

export default function ProfileScreen() {
    const router = useRouter();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                        await logout();
                        router.replace('/(auth)/login');
                    }
                },
            ]
        );
    };

    return (
        <View className="flex-1 bg-background-dark">
            <StatusBar barStyle="light-content" />

            <SafeAreaView className="flex-1" edges={['top']}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 120 }}
                >
                    {/* Header */}
                    <View className="px-6 py-4">
                        <Text className="text-foreground-dark text-2xl font-bold">
                            Profile
                        </Text>
                    </View>

                    {/* Profile Card */}
                    <Animated.View
                        entering={FadeInDown.duration(400)}
                        className="mx-4 mb-6"
                    >
                        <View className="bg-card-dark rounded-3xl p-5 flex-row items-center">
                            <View className="w-16 h-16 rounded-2xl bg-primary-500 items-center justify-center">
                                <Text className="text-white text-2xl font-bold">
                                    {user?.firstName?.charAt(0) || 'U'}
                                    {user?.lastName?.charAt(0) || ''}
                                </Text>
                            </View>
                            <View className="ml-4 flex-1">
                                <Text className="text-foreground-dark text-lg font-bold">
                                    {user?.firstName} {user?.lastName}
                                </Text>
                                <Text className="text-muted-dark text-sm">
                                    {user?.email || 'user@example.com'}
                                </Text>
                            </View>
                            <TouchableOpacity className="w-10 h-10 rounded-full bg-surface-dark items-center justify-center">
                                <Ionicons name="pencil" size={18} color="#64748B" />
                            </TouchableOpacity>
                        </View>
                    </Animated.View>

                    {/* Menu Sections */}
                    <Animated.View
                        entering={FadeInDown.delay(100).duration(400)}
                        className="px-4"
                    >
                        <MenuSection title="ACCOUNT">
                            <MenuItem
                                icon="wallet-outline"
                                label="Bank Accounts"
                                subtitle="Manage withdrawal accounts"
                                onPress={() => { }}
                            />
                            <Divider />
                            <MenuItem
                                icon="receipt-outline"
                                label="Ledger"
                                subtitle="Detailed transaction log"
                                onPress={() => { }}
                            />
                            <Divider />
                            <MenuItem
                                icon="shield-checkmark-outline"
                                label="Security"
                                subtitle="Password, biometrics"
                                onPress={() => { }}
                            />
                        </MenuSection>

                        <MenuSection title="PREFERENCES">
                            <MenuItem
                                icon="moon-outline"
                                label="Appearance"
                                subtitle="Dark mode"
                                onPress={() => { }}
                            />
                            <Divider />
                            <MenuItem
                                icon="notifications-outline"
                                label="Notifications"
                                subtitle="Push, email preferences"
                                onPress={() => { }}
                            />
                        </MenuSection>

                        <MenuSection title="SUPPORT">
                            <MenuItem
                                icon="help-circle-outline"
                                label="Help Center"
                                onPress={() => { }}
                            />
                            <Divider />
                            <MenuItem
                                icon="chatbubble-outline"
                                label="Contact Support"
                                onPress={() => { }}
                            />
                        </MenuSection>

                        <MenuSection title="">
                            <MenuItem
                                icon="log-out-outline"
                                label="Logout"
                                onPress={handleLogout}
                                danger
                            />
                        </MenuSection>
                    </Animated.View>

                    {/* Version */}
                    <Text className="text-center text-muted-dark text-sm mt-4">
                        Spewpay v1.0.0
                    </Text>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
