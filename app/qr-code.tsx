import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { QRCodeGenerator } from '@/components/QRCodeGenerator';
import { QRCodeScanner } from '@/components/QRCodeScanner';
import { useToast } from '@/components/Toast';
import { borderRadius, colors, spacing, typography } from '@/constants/spewpay-theme';
import { useAuth } from '@/contexts';

export default function QRCodeScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<'my-code' | 'scan'>('my-code');

    const handleScan = (data: string) => {
        // Expected format: spewpay:user:email@example.com
        if (data.startsWith('spewpay:user:')) {
            const email = data.split(':')[2];
            if (email) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                // Navigate to transfer screen with recipient pre-filled using router params
                router.push({
                    pathname: '/(tabs)/transfer',
                    params: { recipient: email }
                });
            } else {
                showToast('Invalid QR code format', 'error');
            }
        } else {
            showToast('Not a SpewPay QR code', 'warning');
        }
    };

    const qrValue = user ? `spewpay:user:${user.email}` : '';

    if (activeTab === 'scan') {
        return (
            <QRCodeScanner
                onScan={handleScan}
                onClose={() => setActiveTab('my-code')}
            />
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[colors.background, colors.backgroundSecondary, colors.background]}
                style={styles.gradient}
            >
                <SafeAreaView style={styles.safeArea} edges={['top']}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                        </TouchableOpacity>
                        <Text style={styles.title}>QR Code</Text>
                        <View style={{ width: 40 }} />
                    </View>

                    {/* Toggle */}
                    <View style={styles.toggleContainer}>
                        <TouchableOpacity
                            style={[styles.toggleBtn, activeTab === 'my-code' && styles.toggleBtnActive]}
                            onPress={() => setActiveTab('my-code')}
                        >
                            <Text style={[styles.toggleText, activeTab === 'my-code' && styles.toggleTextActive]}>
                                My Code
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.toggleBtn, activeTab === 'scan' && styles.toggleBtnActive]}
                            onPress={() => setActiveTab('scan')}
                        >
                            <Text style={[styles.toggleText, activeTab === 'scan' && styles.toggleTextActive]}>
                                Scan Code
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <View style={styles.content}>
                        <View style={styles.card}>
                            <View style={styles.userInfo}>
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>
                                        {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                                    </Text>
                                </View>
                                <Text style={styles.userName}>
                                    {user?.firstName} {user?.lastName}
                                </Text>
                                <Text style={styles.userEmail}>{user?.email}</Text>
                            </View>

                            <View style={styles.qrWrapper}>
                                <QRCodeGenerator value={qrValue} size={200} />
                            </View>

                            <Text style={styles.instruction}>
                                Scan this code to pay me on SpewPay
                            </Text>
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    gradient: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    backButton: {
        padding: spacing.xs,
    },
    title: {
        ...typography.h3,
        color: colors.textPrimary,
    },
    toggleContainer: {
        flexDirection: 'row',
        marginHorizontal: spacing.lg,
        marginVertical: spacing.lg,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: 4,
    },
    toggleBtn: {
        flex: 1,
        paddingVertical: spacing.sm,
        alignItems: 'center',
        borderRadius: borderRadius.md,
    },
    toggleBtnActive: {
        backgroundColor: colors.primary,
    },
    toggleText: {
        ...typography.bodyBold,
        color: colors.textSecondary,
    },
    toggleTextActive: {
        color: colors.textPrimary,
    },
    content: {
        flex: 1,
        paddingHorizontal: spacing.lg,
        justifyContent: 'center',
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
        alignItems: 'center',
        ...shadows.lg,
        borderWidth: 1,
        borderColor: colors.border,
    },
    userInfo: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    avatarText: {
        ...typography.h2,
        color: colors.textPrimary,
    },
    userName: {
        ...typography.h3,
        color: colors.textPrimary,
        marginBottom: 4,
    },
    userEmail: {
        ...typography.body,
        color: colors.textSecondary,
    },
    qrWrapper: {
        padding: spacing.lg,
        backgroundColor: 'white',
        borderRadius: borderRadius.xl,
        marginBottom: spacing.lg,
    },
    instruction: {
        ...typography.body,
        color: colors.textSecondary,
        textAlign: 'center',
    },
});
