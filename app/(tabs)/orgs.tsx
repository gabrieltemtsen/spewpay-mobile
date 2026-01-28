import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { Organization, OrgType } from '@/types';

// Mock data
const mockOrgs: Organization[] = [
    {
        id: '1',
        name: 'Acme Corporation',
        type: 'COMPANY',
        walletId: 'w1',
        balance: { kobo: '5000000', naira: 50000 },
        createdAt: new Date().toISOString(),
    },
    {
        id: '2',
        name: 'Family Budget',
        type: 'FAMILY',
        walletId: 'w2',
        balance: { kobo: '1500000', naira: 15000 },
        createdAt: new Date().toISOString(),
    },
];

const getOrgIcon = (type: OrgType) => {
    const icons: Record<OrgType, string> = {
        COMPANY: 'business',
        UNIVERSITY: 'school',
        FAMILY: 'home',
        COUPLE: 'heart',
        GROUP: 'people',
    };
    return icons[type] || 'business';
};

const getOrgColor = (type: OrgType) => {
    const colors: Record<OrgType, string[]> = {
        COMPANY: ['#0066FF', '#0052CC'],
        UNIVERSITY: ['#8B5CF6', '#7C3AED'],
        FAMILY: ['#00E699', '#00B377'],
        COUPLE: ['#F43F5E', '#E11D48'],
        GROUP: ['#F59E0B', '#D97706'],
    };
    return colors[type] || colors.COMPANY;
};

function OrgCard({ org }: { org: Organization }) {
    const handlePress = async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    return (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
            <LinearGradient
                colors={getOrgColor(org.type) as [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="p-5 rounded-3xl mb-4"
            >
                <View className="flex-row items-center mb-4">
                    <View className="w-12 h-12 rounded-2xl bg-white/20 items-center justify-center">
                        <Ionicons name={getOrgIcon(org.type) as any} size={24} color="#fff" />
                    </View>
                    <View className="ml-3 flex-1">
                        <Text className="text-white font-bold text-lg">{org.name}</Text>
                        <Text className="text-white/70 text-sm">
                            {org.type.charAt(0) + org.type.slice(1).toLowerCase()}
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.7)" />
                </View>

                <View className="flex-row items-end justify-between">
                    <View>
                        <Text className="text-white/70 text-sm">Balance</Text>
                        <Text className="text-white text-2xl font-bold">
                            ₦{org.balance?.naira.toLocaleString()}
                        </Text>
                    </View>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
}

export default function OrgsScreen() {
    return (
        <View className="flex-1 bg-background-dark">
            <StatusBar barStyle="light-content" />

            <SafeAreaView className="flex-1" edges={['top']}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 120 }}
                >
                    {/* Header */}
                    <View className="px-6 py-4 flex-row justify-between items-center">
                        <View>
                            <Text className="text-foreground-dark text-2xl font-bold">
                                Organizations
                            </Text>
                            <Text className="text-muted-dark text-sm mt-1">
                                Manage your groups and budgets
                            </Text>
                        </View>

                        <TouchableOpacity
                            className="w-10 h-10 rounded-full bg-primary-500 items-center justify-center"
                            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                        >
                            <Ionicons name="add" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* Org Cards */}
                    <View className="px-4">
                        {mockOrgs.map((org, index) => (
                            <Animated.View
                                key={org.id}
                                entering={FadeInDown.delay(index * 100).duration(400)}
                            >
                                <OrgCard org={org} />
                            </Animated.View>
                        ))}
                    </View>

                    {/* Empty state if no orgs */}
                    {mockOrgs.length === 0 && (
                        <View className="items-center py-16">
                            <View className="w-20 h-20 rounded-3xl bg-surface-dark items-center justify-center mb-4">
                                <Ionicons name="business-outline" size={36} color="#64748B" />
                            </View>
                            <Text className="text-foreground-dark text-lg font-semibold">
                                No Organizations
                            </Text>
                            <Text className="text-muted-dark text-sm mt-2 text-center px-8">
                                Create an organization to manage shared budgets and allocations.
                            </Text>
                        </View>
                    )}

                    {/* Pending Invites Section */}
                    <Animated.View
                        entering={FadeInDown.delay(300).duration(400)}
                        className="mt-6 px-4"
                    >
                        <Text className="text-foreground-dark text-lg font-semibold mb-4">
                            Pending Invites
                        </Text>
                        <View className="bg-card-dark rounded-2xl p-4 border border-border-dark">
                            <View className="flex-row items-center">
                                <View className="w-10 h-10 rounded-full bg-warning-500/10 items-center justify-center">
                                    <Ionicons name="mail-outline" size={20} color="#FF7D5C" />
                                </View>
                                <Text className="text-muted-dark ml-3">
                                    No pending invites
                                </Text>
                            </View>
                        </View>
                    </Animated.View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
