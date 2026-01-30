import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Alert,
    Dimensions,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MenuItem, MenuSection } from '@/components/Menu';
import { useAuth } from '@/contexts';

const { height: screenHeight } = Dimensions.get('window');

function Divider() {
    return <View style={styles.divider} />;
}

export default function ProfileScreen() {
    const router = useRouter();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Logout',
                style: 'destructive',
                onPress: async () => {
                    if (Platform.OS !== 'web') {
                        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    }
                    await logout();
                    router.replace('/(auth)/login');
                },
            },
        ]);
    };

    const displayName = user?.displayName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User';
    const initials = displayName
        .split(' ')
        .map((n) => n.charAt(0))
        .join('')
        .substring(0, 2)
        .toUpperCase();

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
                            <Text style={styles.title}>Profile</Text>
                        </View>

                        {/* Profile Card */}
                        <Animated.View entering={FadeInDown.duration(400)}>
                            <View style={styles.profileCard}>
                                <LinearGradient
                                    colors={['#0066FF', '#0052CC']}
                                    style={styles.avatar}
                                >
                                    <Text style={styles.avatarText}>{initials}</Text>
                                </LinearGradient>
                                <View style={styles.profileInfo}>
                                    <Text style={styles.profileName}>{displayName}</Text>
                                    <Text style={styles.profileEmail}>
                                        {user?.email || 'user@example.com'}
                                    </Text>
                                </View>
                                <TouchableOpacity style={styles.editBtn}>
                                    <Ionicons name="pencil" size={18} color="#64748B" />
                                </TouchableOpacity>
                            </View>
                        </Animated.View>

                        {/* Menu Sections */}
                        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
                            <MenuSection title="ACCOUNT">
                                <MenuItem
                                    icon="wallet-outline"
                                    label="Withdrawal / Banks"
                                    subtitle="Manage funds withdrawal"
                                    onPress={() => router.push('/withdrawal')}
                                />
                                <Divider />
                                <MenuItem
                                    icon="qr-code-outline"
                                    label="My QR Code"
                                    subtitle="Share to receive money"
                                    onPress={() => router.push('/qr-code')}
                                />
                                <Divider />
                                <MenuItem
                                    icon="shield-checkmark-outline"
                                    label="Security"
                                    subtitle="Password, biometrics"
                                    onPress={() => router.push('/settings/security')}
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
                                <MenuItem icon="help-circle-outline" label="Help Center" onPress={() => router.push('/support')} />
                                <Divider />
                                <MenuItem icon="chatbubble-outline" label="Contact Support" onPress={() => router.push('/support')} />
                            </MenuSection>

                            <MenuSection title="">
                                <MenuItem icon="log-out-outline" label="Logout" onPress={handleLogout} danger />
                            </MenuSection>
                        </Animated.View>

                        {/* Version */}
                        <Text style={styles.version}>Spewpay v1.0.0</Text>
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
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: '700',
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        marginHorizontal: 16,
        borderRadius: 24,
        padding: 20,
        marginBottom: 24,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: '700',
    },
    profileInfo: {
        flex: 1,
        marginLeft: 16,
    },
    profileName: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
    },
    profileEmail: {
        color: '#94A3B8',
        fontSize: 14,
        marginTop: 2,
    },
    editBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        marginHorizontal: 16,
    },
    version: {
        color: '#64748B',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 16,
    },
});
