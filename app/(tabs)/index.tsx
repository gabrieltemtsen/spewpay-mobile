import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/contexts';
import { useWallet } from '@/hooks/useWallet';

const { height: screenHeight } = Dimensions.get('window');

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-NG', {
    month: 'short',
    day: 'numeric',
  });
};

const getTransactionIcon = (type: string) => {
  switch (type) {
    case 'DEPOSIT':
      return { name: 'arrow-down', color: '#00E699' };
    case 'WITHDRAWAL':
      return { name: 'arrow-up', color: '#F59E0B' };
    case 'TRANSFER':
      return { name: 'swap-horizontal', color: '#0066FF' };
    default:
      return { name: 'cash', color: '#64748B' };
  }
};

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { balance, transactions, isLoading, isRefreshing, refresh } = useWallet();

  useFocusEffect(
    useCallback(() => {
      if (user) {
        refresh();
      }
    }, [user, refresh])
  );

  const handleAddMoney = () => {
    router.push('/deposit');
  };

  const handleWithdraw = () => {
    router.push('/withdraw');
  };

  const handleSend = () => {
    router.push('/(tabs)/transfer');
  };

  const handleViewAllTransactions = () => {
    router.push('/(tabs)/history');
  };

  const displayName = user?.displayName || user?.firstName || 'User';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000A1A" />

      <LinearGradient
        colors={['#000A1A', '#001433', '#000A1A']}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={refresh}
                tintColor="#FFFFFF"
                colors={['#0066FF']}
              />
            }
          >
            {/* Header */}
            <View style={styles.header}>
              <Animated.View entering={FadeInDown.duration(400)}>
                <Text style={styles.greeting}>Welcome back,</Text>
                <Text style={styles.userName}>{displayName} 👋</Text>
              </Animated.View>

              <View style={styles.headerActions}>
                <TouchableOpacity style={styles.iconButton}>
                  <Ionicons name="notifications-outline" size={22} color="#94A3B8" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                  <Ionicons name="scan-outline" size={22} color="#94A3B8" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Balance Card */}
            <Animated.View entering={FadeInDown.delay(100).duration(500)}>
              <LinearGradient
                colors={['#0066FF', '#0052CC', '#003D99']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.balanceCard}
              >
                <View style={styles.balanceHeader}>
                  <Text style={styles.balanceLabel}>Total Balance</Text>
                  <TouchableOpacity>
                    <Ionicons name="eye-outline" size={20} color="rgba(255,255,255,0.7)" />
                  </TouchableOpacity>
                </View>
                {isLoading && !balance ? (
                  <ActivityIndicator color="#fff" style={{ marginTop: 20, alignSelf: 'flex-start' }} />
                ) : (
                  <Text style={styles.balanceAmount}>
                    {formatCurrency(balance?.cachedBalance?.naira || 0)}
                  </Text>
                )}
                <Text style={styles.balanceSubtext}>Available Balance</Text>

                <View style={styles.balanceActions}>
                  <TouchableOpacity style={styles.balanceBtn} onPress={handleAddMoney}>
                    <Ionicons name="add-circle" size={20} color="#FFFFFF" />
                    <Text style={styles.balanceBtnText}>Add Money</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.balanceBtn} onPress={handleWithdraw}>
                    <Ionicons name="arrow-up-circle" size={20} color="#FFFFFF" />
                    <Text style={styles.balanceBtnText}>Withdraw</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </Animated.View>

            {/* Quick Actions */}
            <Animated.View
              entering={FadeInDown.delay(200).duration(500)}
              style={styles.quickActionsSection}
            >
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.quickActions}>
                <TouchableOpacity style={styles.quickActionItem} onPress={handleSend}>
                  <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(0, 102, 255, 0.15)' }]}>
                    <Ionicons name="paper-plane" size={24} color="#0066FF" />
                  </View>
                  <Text style={styles.quickActionLabel}>Send</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.quickActionItem} onPress={() => router.push('/qr-code')}>
                  <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(0, 230, 153, 0.15)' }]}>
                    <Ionicons name="qr-code" size={24} color="#00E699" />
                  </View>
                  <Text style={styles.quickActionLabel}>Receive</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.quickActionItem} onPress={() => router.push('/bills')}>
                  <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                    <Ionicons name="card" size={24} color="#F59E0B" />
                  </View>
                  <Text style={styles.quickActionLabel}>Pay Bills</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.quickActionItem} onPress={() => router.push('/insights')}>
                  <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(139, 92, 246, 0.15)' }]}>
                    <Ionicons name="stats-chart" size={24} color="#8B5CF6" />
                  </View>
                  <Text style={styles.quickActionLabel}>Insights</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* Recent Transactions */}
            <Animated.View
              entering={FadeInDown.delay(300).duration(500)}
              style={styles.transactionsSection}
            >
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Transactions</Text>
                <TouchableOpacity onPress={handleViewAllTransactions}>
                  <Text style={styles.viewAllLink}>View All</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.transactionsList}>
                {isLoading && transactions.length === 0 ? (
                  <ActivityIndicator color="#0066FF" style={{ padding: 20 }} />
                ) : transactions.length > 0 ? (
                  transactions.map((transaction, index) => {
                    const icon = getTransactionIcon(transaction.type);
                    return (
                      <View key={transaction.id}>
                        <View style={styles.transactionItem}>
                          <View style={[styles.transactionIcon, { backgroundColor: `${icon.color}20` }]}>
                            <Ionicons
                              name={icon.name as any}
                              size={20}
                              color={icon.color}
                            />
                          </View>
                          <View style={styles.transactionInfo}>
                            <Text style={styles.transactionType}>
                              {transaction.type.charAt(0) + transaction.type.slice(1).toLowerCase()}
                            </Text>
                            <Text style={styles.transactionDate}>
                              {formatDate(transaction.createdAt)}
                            </Text>
                          </View>
                          <View style={styles.transactionAmount}>
                            <Text
                              style={[
                                styles.amount,
                                transaction.type === 'DEPOSIT'
                                  ? styles.amountPositive
                                  : styles.amountNegative,
                              ]}
                            >
                              {transaction.type === 'DEPOSIT' ? '+' : '-'}
                              {formatCurrency(transaction.amount.naira)}
                            </Text>
                            <Text style={[
                              styles.transactionStatus,
                              transaction.status === 'COMPLETED'
                                ? styles.statusCompleted
                                : styles.statusProcessing,
                            ]}>
                              {transaction.status}
                            </Text>
                          </View>
                        </View>
                        {index < transactions.length - 1 && (
                          <View style={styles.divider} />
                        )}
                      </View>
                    );
                  })
                ) : (
                  <View style={styles.emptyState}>
                    <Ionicons name="receipt-outline" size={36} color="#64748B" />
                    <Text style={styles.emptyText}>No transactions yet</Text>
                  </View>
                )}
              </View>
            </Animated.View>
          </ScrollView>
        </SafeAreaView>
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
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  greeting: {
    color: '#94A3B8',
    fontSize: 14,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceCard: {
    marginHorizontal: 16,
    borderRadius: 24,
    padding: 24,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: '700',
    marginTop: 8,
  },
  balanceSubtext: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    marginTop: 4,
  },
  balanceActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  balanceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  balanceBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  quickActionsSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    alignItems: 'center',
    width: '22%',
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionLabel: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '500',
  },
  transactionsSection: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllLink: {
    color: '#0066FF',
    fontSize: 14,
    fontWeight: '500',
  },
  transactionsList: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    overflow: 'hidden',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  transactionType: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },
  transactionDate: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 2,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 15,
    fontWeight: '600',
  },
  amountPositive: {
    color: '#00E699',
  },
  amountNegative: {
    color: '#FFFFFF',
  },
  transactionStatus: {
    fontSize: 11,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  statusCompleted: {
    color: '#00E699',
  },
  statusProcessing: {
    color: '#F59E0B',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginHorizontal: 16,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: '#64748B',
    marginTop: 8,
  },
});
