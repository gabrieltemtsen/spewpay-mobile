import { MenuItem, MenuSection } from '@/components/Menu';
import { colors, spacing, typography } from '@/constants/spewpay-theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SupportScreen() {
    const router = useRouter();

    const handleContactEmail = () => {
        Linking.openURL('mailto:support@spewpay.com');
    };

    const handleContactPhone = () => {
        Linking.openURL('tel:+234800SPEWPAY');
    };

    const handleWebsite = () => {
        Linking.openURL('https://spewpay.com/help');
    };

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
                        <Text style={styles.title}>Help & Support</Text>
                        <View style={{ width: 40 }} />
                    </View>

                    <ScrollView contentContainerStyle={styles.content}>
                        <View style={styles.hero}>
                            <Ionicons name="chatbubbles-outline" size={64} color={colors.primary} />
                            <Text style={styles.heroTitle}>How can we help you?</Text>
                            <Text style={styles.heroSubtitle}>
                                Our team is available 24/7 to assist you with any issues.
                            </Text>
                        </View>

                        <MenuSection>
                            <MenuItem
                                icon="mail-outline"
                                label="Email Support"
                                subtitle="support@spewpay.com"
                                onPress={handleContactEmail}
                            />
                            <View style={styles.divider} />
                            <MenuItem
                                icon="call-outline"
                                label="Call Us"
                                subtitle="+234 800 SPEWPAY"
                                onPress={handleContactPhone}
                            />
                            <View style={styles.divider} />
                            <MenuItem
                                icon="globe-outline"
                                label="Visit Help Center"
                                subtitle="FAQs and Guides"
                                onPress={handleWebsite}
                            />
                        </MenuSection>

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
    content: {
        padding: spacing.lg,
    },
    hero: {
        alignItems: 'center',
        marginVertical: spacing.xl,
    },
    heroTitle: {
        ...typography.h2,
        color: colors.textPrimary,
        marginTop: spacing.md,
        marginBottom: spacing.xs,
    },
    heroSubtitle: {
        ...typography.body,
        color: colors.textSecondary,
        textAlign: 'center',
        maxWidth: '80%',
    },
    divider: {
        height: 1,
        backgroundColor: colors.divider,
        marginHorizontal: spacing.md,
    },
    version: {
        ...typography.caption,
        color: colors.textTertiary,
        textAlign: 'center',
        marginTop: spacing.xl,
    },
});
