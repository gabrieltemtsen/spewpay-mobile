import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TransactionItem } from '@/components/transactions';
import { BalanceCard, QuickActions } from '@/components/wallet';
import { useAuth } from '@/contexts';
import type { Transaction } from '@/types';

// Mock data for demo - will be replaced with real API data
const mockTransactions: Transaction[] = [
  {
    id: '1',
    reference: 'TXN-001',
    type: 'DEPOSIT',
    status: 'COMPLETED',
    amount: { kobo: '500000', naira: 5000 },
    description: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    reference: 'TXN-002',
    type: 'TRANSFER',
    status: 'COMPLETED',
    amount: { kobo: '150000', naira: 1500 },
    description: 'Payment to John',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    reference: 'TXN-003',
    type: 'WITHDRAWAL',
    status: 'PROCESSING',
    amount: { kobo: '200000', naira: 2000 },
    description: 'Bank withdrawal',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const handleAddMoney = () => {
    router.push('/deposit');
  };

  const handleWithdraw = () => {
    router.push('/withdraw');
  };

  const handleSend = () => {
    router.push('/(tabs)/transfer');
  };

  const handleReceive = () => {
    // Show receive modal or QR code
  };

  const handleViewAllTransactions = () => {
    router.push('/(tabs)/history');
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
          <View className="flex-row justify-between items-center px-6 py-4">
            <Animated.View entering={FadeInDown.duration(400)}>
              <Text className="text-muted-dark text-sm">Welcome back,</Text>
              <Text className="text-foreground-dark text-xl font-bold">
                {user?.firstName || 'User'} 👋
              </Text>
            </Animated.View>

            <View className="flex-row gap-2">
              <TouchableOpacity className="w-10 h-10 rounded-full bg-surface-dark items-center justify-center">
                <Ionicons name="notifications-outline" size={22} color="#64748B" />
              </TouchableOpacity>
              <TouchableOpacity className="w-10 h-10 rounded-full bg-surface-dark items-center justify-center">
                <Ionicons name="scan-outline" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Balance Card */}
          <BalanceCard
            balance={{ kobo: '3350000', naira: 33500 }}
            onAddMoney={handleAddMoney}
            onWithdraw={handleWithdraw}
          />

          {/* Quick Actions */}
          <QuickActions
            onSend={handleSend}
            onReceive={handleReceive}
            onAddMoney={handleAddMoney}
            onWithdraw={handleWithdraw}
          />

          {/* Recent Transactions */}
          <Animated.View
            entering={FadeInDown.delay(300).duration(500)}
            className="mt-8"
          >
            <View className="flex-row justify-between items-center px-4 mb-4">
              <Text className="text-foreground-dark text-lg font-semibold">
                Recent Transactions
              </Text>
              <TouchableOpacity onPress={handleViewAllTransactions}>
                <Text className="text-primary-500 text-sm font-medium">
                  View All
                </Text>
              </TouchableOpacity>
            </View>

            <View className="bg-card-dark mx-4 rounded-3xl overflow-hidden">
              {mockTransactions.length > 0 ? (
                mockTransactions.map((transaction, index) => (
                  <View key={transaction.id}>
                    <TransactionItem transaction={transaction} />
                    {index < mockTransactions.length - 1 && (
                      <View className="h-px bg-border-dark mx-4" />
                    )}
                  </View>
                ))
              ) : (
                <View className="py-8 items-center">
                  <Ionicons name="receipt-outline" size={36} color="#64748B" />
                  <Text className="text-muted-dark mt-2">No transactions yet</Text>
                </View>
              )}
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
