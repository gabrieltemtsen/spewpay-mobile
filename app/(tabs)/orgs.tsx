import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    Dimensions,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { Organization, OrgType } from '@/types';

const { height: screenHeight } = Dimensions.get('window');

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

const getOrgIcon = (type: OrgType): keyof typeof Ionicons.glyphMap => {
    const icons: Record<OrgType, keyof typeof Ionicons.glyphMap> = {
        COMPANY: 'business',
        UNIVERSITY: 'school',
        FAMILY: 'home',
        COUPLE: 'heart',
        GROUP: 'people',
    };
    return icons[type] || 'business';
};

const getOrgColor = (type: OrgType): [string, string] => {
    const colors: Record<OrgType, [string, string]> = {
        COMPANY: ['#0066FF', '#0052CC'],
        UNIVERSITY: ['#8B5CF6', '#7C3AED'],
        FAMILY: ['#00E699', '#00B377'],
        COUPLE: ['#F43F5E', '#E11D48'],
        GROUP: ['#F59E0B', '#D97706'],
    };
    return colors[type] || colors.COMPANY;
};

function OrgCard({ org, index }: { org: Organization; index: number }) {
    const handlePress = async () => {
        if (Platform.OS !== 'web') {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    };

    return (
        <Animated.View entering={FadeInDown.delay(index * 100).duration(400)}>
            <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
                <LinearGradient
                    colors={getOrgColor(org.type)}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.orgCard}
                >
                    <View style={styles.orgHeader}>
                        <View style={styles.orgIconWrapper}>
                            <Ionicons name={getOrgIcon(org.type)} size={24} color="#fff" />
                        </View>
                        <View style={styles.orgInfo}>
                            <Text style={styles.orgName}>{org.name}</Text>
                            <Text style={styles.orgType}>
                                {org.type.charAt(0) + org.type.slice(1).toLowerCase()}
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.7)" />
                    </View>

                    <View style={styles.orgBalanceRow}>
                        <View>
                            <Text style={styles.balanceLabel}>Balance</Text>
                            <Text style={styles.balanceValue}>
                                ₦{org.balance?.naira.toLocaleString()}
                            </Text>
                        </View>
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        </Animated.View>
    );
}

export default function OrgsScreen() {
    const handleAddOrg = async () => {
        if (Platform.OS !== 'web') {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    };

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
                    >
                        {/* Header */}
                        <View style={styles.header}>
                            <View>
                                <Text style={styles.title}>Organizations</Text>
                                <Text style={styles.subtitle}>Manage your groups and budgets</Text>
                            </View>
                            <TouchableOpacity style={styles.addBtn} onPress={handleAddOrg}>
                                <Ionicons name="add" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        {/* Org Cards */}
                        <View style={styles.cardsContainer}>
                            {mockOrgs.map((org, index) => (
                                <OrgCard key={org.id} org={org} index={index} />
                            ))}
                        </View>

                        {/* Empty state */}
                        {mockOrgs.length === 0 && (
                            <View style={styles.emptyState}>
                                <View style={styles.emptyIcon}>
                                    <Ionicons name="business-outline" size={36} color="#64748B" />
                                </View>
                                <Text style={styles.emptyTitle}>No Organizations</Text>
                                <Text style={styles.emptySubtitle}>
                                    Create an organization to manage shared budgets and allocations.
                                </Text>
                            </View>
                        )}

                        {/* Pending Invites */}
                        <Animated.View
                            entering={FadeInDown.delay(300).duration(400)}
                            style={styles.invitesSection}
                        >
                            <Text style={styles.sectionTitle}>Pending Invites</Text>
                            <View style={styles.inviteCard}>
                                <View style={styles.inviteIcon}>
                                    <Ionicons name="mail-outline" size={20} color="#FF7D5C" />
                                </View>
                                <Text style={styles.inviteText}>No pending invites</Text>
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
        paddingVertical: 20,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: '700',
    },
    subtitle: {
        color: '#94A3B8',
        fontSize: 14,
        marginTop: 4,
    },
    addBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#0066FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardsContainer: {
        paddingHorizontal: 16,
    },
    orgCard: {
        padding: 20,
        borderRadius: 24,
        marginBottom: 16,
    },
    orgHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    orgIconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    orgInfo: {
        flex: 1,
        marginLeft: 12,
    },
    orgName: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
    },
    orgType: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 14,
    },
    orgBalanceRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    balanceLabel: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 14,
    },
    balanceValue: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: '700',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 48,
    },
    emptyIcon: {
        width: 80,
        height: 80,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    emptyTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    emptySubtitle: {
        color: '#64748B',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 8,
        paddingHorizontal: 32,
    },
    invitesSection: {
        marginTop: 24,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    inviteCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    inviteIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 125, 92, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inviteText: {
        color: '#94A3B8',
        marginLeft: 12,
    },
});
