import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
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

const { height: screenHeight } = Dimensions.get('window');

export default function WelcomeScreen() {
    const router = useRouter();

    console.log('👋 WelcomeScreen rendering, screenHeight:', screenHeight);

    const handleGetStarted = async () => {
        if (Platform.OS !== 'web') {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        router.push('/(auth)/signup');
    };

    const handleSignIn = async () => {
        if (Platform.OS !== 'web') {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        router.push('/(auth)/login');
    };

    return (
        <View style={styles.wrapper}>
            <LinearGradient
                colors={['#000A1A', '#001433', '#002966']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <StatusBar barStyle="light-content" backgroundColor="#000A1A" />

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Logo Section */}
                    <View style={styles.logoSection}>
                        <LinearGradient
                            colors={['#0066FF', '#0052CC']}
                            style={styles.logo}
                        >
                            <Text style={styles.logoText}>SP</Text>
                        </LinearGradient>
                        <Text style={styles.appName}>Spewpay</Text>
                    </View>

                    {/* Hero Section */}
                    <View style={styles.heroSection}>
                        <Text style={styles.title}>Banking</Text>
                        <View style={styles.titleRow}>
                            <Text style={styles.title}>Made </Text>
                            <Text style={[styles.title, styles.highlight]}>Simple</Text>
                        </View>

                        <Text style={styles.subtitle}>
                            Send money instantly, manage your finances, and organize group spending—all in one app.
                        </Text>

                        {/* Features */}
                        <View style={styles.featuresRow}>
                            <View style={styles.featurePill}>
                                <Ionicons name="flash" size={18} color="#0066FF" />
                                <Text style={styles.featureLabel}>Instant</Text>
                            </View>
                            <View style={styles.featurePill}>
                                <Ionicons name="shield-checkmark" size={18} color="#00E699" />
                                <Text style={styles.featureLabel}>Secure</Text>
                            </View>
                            <View style={styles.featurePill}>
                                <Ionicons name="people" size={18} color="#F59E0B" />
                                <Text style={styles.featureLabel}>Groups</Text>
                            </View>
                        </View>
                    </View>

                    {/* CTA Section */}
                    <View style={styles.ctaSection}>
                        <TouchableOpacity onPress={handleGetStarted} activeOpacity={0.9}>
                            <LinearGradient
                                colors={['#0066FF', '#0052CC']}
                                style={styles.primaryBtn}
                            >
                                <Text style={styles.primaryBtnText}>Get Started</Text>
                                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleSignIn}
                            activeOpacity={0.8}
                            style={styles.secondaryBtn}
                        >
                            <Text style={styles.secondaryBtnText}>I already have an account</Text>
                        </TouchableOpacity>

                        <Text style={styles.terms}>
                            By continuing, you agree to our Terms & Privacy Policy
                        </Text>
                    </View>
                </ScrollView>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        height: '100%',
        minHeight: screenHeight,
        backgroundColor: '#000A1A',
    },
    gradient: {
        flex: 1,
        height: '100%',
        minHeight: screenHeight,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'ios' ? 80 : 60,
        paddingBottom: 40,
        minHeight: screenHeight,
    },
    logoSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: 80,
        height: 80,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoText: {
        color: '#FFFFFF',
        fontSize: 32,
        fontWeight: '700',
    },
    appName: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '600',
        marginTop: 12,
        letterSpacing: 1,
    },
    heroSection: {
        flex: 1,
        justifyContent: 'center',
        minHeight: 280,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 44,
        fontWeight: '700',
        lineHeight: 52,
    },
    titleRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    highlight: {
        color: '#60A5FA',
    },
    subtitle: {
        color: '#94A3B8',
        fontSize: 16,
        lineHeight: 26,
        marginTop: 20,
        marginBottom: 30,
    },
    featuresRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    featurePill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 50,
        gap: 8,
    },
    featureLabel: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500',
    },
    ctaSection: {
        paddingTop: 30,
    },
    primaryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        borderRadius: 16,
        gap: 10,
    },
    primaryBtnText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    secondaryBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        borderRadius: 16,
        marginTop: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    secondaryBtnText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
    },
    terms: {
        color: '#64748B',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 24,
    },
});
