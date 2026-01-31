import { borderRadius, spacing, typography } from '@/constants/spewpay-theme';
import type { Organization, OrgType } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface OrgCardProps {
    org: Organization;
    index?: number;
}

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
    const palette: Record<OrgType, [string, string]> = {
        COMPANY: ['#0066FF', '#0052CC'],
        UNIVERSITY: ['#8B5CF6', '#7C3AED'],
        FAMILY: ['#00E699', '#00B377'],
        COUPLE: ['#F43F5E', '#E11D48'],
        GROUP: ['#F59E0B', '#D97706'],
    };
    return palette[type] || palette.COMPANY;
};

export function OrgCard({ org, index = 0 }: OrgCardProps) {
    const router = useRouter();

    const handlePress = async () => {
        if (Platform.OS !== 'web') {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        router.push(`/org/${org.id}` as any);
    };

    return (
        <Animated.View entering={FadeInDown.delay(index * 100).duration(400)}>
            <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
                <LinearGradient
                    colors={getOrgColor(org.type)}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.card}
                >
                    <View style={styles.header}>
                        <View style={styles.iconWrapper}>
                            <Ionicons name={getOrgIcon(org.type)} size={24} color="#fff" />
                        </View>
                        <View style={styles.info}>
                            <Text style={styles.name}>{org.name}</Text>
                            <Text style={styles.type}>
                                {org.type.charAt(0) + org.type.slice(1).toLowerCase()}
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.7)" />
                    </View>

                    <View style={styles.balanceRow}>
                        <View>
                            <Text style={styles.balanceLabel}>Balance</Text>
                            <Text style={styles.balanceValue}>
                                ₦{org.balance?.naira?.toLocaleString() ?? '0'}
                            </Text>
                        </View>
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: spacing.lg,
        borderRadius: borderRadius.xl,
        marginBottom: spacing.md,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    iconWrapper: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.md,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    info: {
        flex: 1,
        marginLeft: spacing.md,
    },
    name: {
        ...typography.h3,
        color: '#FFFFFF',
    },
    type: {
        ...typography.body,
        color: 'rgba(255, 255, 255, 0.7)',
    },
    balanceRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    balanceLabel: {
        ...typography.caption,
        color: 'rgba(255, 255, 255, 0.7)',
    },
    balanceValue: {
        ...typography.h2,
        color: '#FFFFFF',
    },
});
