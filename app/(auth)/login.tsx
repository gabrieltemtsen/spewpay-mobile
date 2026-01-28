import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import * as z from 'zod';

import { useAuth } from '@/contexts';

const { height: screenHeight } = Dimensions.get('window');

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
    const router = useRouter();
    const { login, isLoading } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginForm) => {
        try {
            if (Platform.OS !== 'web') {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
            await login(data);
            if (Platform.OS !== 'web') {
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
            router.replace('/(tabs)');
        } catch (error: any) {
            if (Platform.OS !== 'web') {
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            }
            Alert.alert(
                'Login Failed',
                error?.message || 'Please check your credentials and try again.'
            );
        }
    };

    return (
        <View style={styles.wrapper}>
            <LinearGradient
                colors={['#000A1A', '#001433', '#002966']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Logo & Title */}
                        <View style={styles.header}>
                            <LinearGradient
                                colors={['#0066FF', '#0052CC']}
                                style={styles.logo}
                            >
                                <Text style={styles.logoText}>SP</Text>
                            </LinearGradient>
                            <Text style={styles.title}>Welcome Back</Text>
                            <Text style={styles.subtitle}>
                                Sign in to your Spewpay account
                            </Text>
                        </View>

                        {/* Form Card */}
                        <View style={styles.formCard}>
                            {/* Email Input */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Email Address</Text>
                                <Controller
                                    control={control}
                                    name="email"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <View style={styles.inputContainer}>
                                            <Ionicons name="mail-outline" size={20} color="rgba(255,255,255,0.5)" />
                                            <TextInput
                                                style={styles.input}
                                                placeholder="you@example.com"
                                                placeholderTextColor="rgba(255,255,255,0.3)"
                                                keyboardType="email-address"
                                                autoCapitalize="none"
                                                autoComplete="email"
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                            />
                                        </View>
                                    )}
                                />
                                {errors.email && (
                                    <Text style={styles.errorText}>{errors.email.message}</Text>
                                )}
                            </View>

                            {/* Password Input */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Password</Text>
                                <Controller
                                    control={control}
                                    name="password"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <View style={styles.inputContainer}>
                                            <Ionicons name="lock-closed-outline" size={20} color="rgba(255,255,255,0.5)" />
                                            <TextInput
                                                style={styles.input}
                                                placeholder="••••••••"
                                                placeholderTextColor="rgba(255,255,255,0.3)"
                                                secureTextEntry={!showPassword}
                                                autoCapitalize="none"
                                                autoComplete="password"
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                            />
                                            <TouchableOpacity
                                                onPress={() => setShowPassword(!showPassword)}
                                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                            >
                                                <Ionicons
                                                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                                    size={20}
                                                    color="rgba(255,255,255,0.5)"
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                />
                                {errors.password && (
                                    <Text style={styles.errorText}>{errors.password.message}</Text>
                                )}
                            </View>

                            {/* Login Button */}
                            <TouchableOpacity
                                onPress={handleSubmit(onSubmit)}
                                disabled={isLoading}
                                activeOpacity={0.8}
                                style={styles.buttonWrapper}
                            >
                                <LinearGradient
                                    colors={['#0066FF', '#0052CC']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.primaryButton}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text style={styles.buttonText}>Sign In</Text>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>

                            {/* Forgot Password */}
                            <TouchableOpacity style={styles.forgotPassword}>
                                <Text style={styles.forgotPasswordText}>
                                    Forgot your password?
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Sign Up Link */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>
                                Don't have an account?{' '}
                            </Text>
                            <Link href="/(auth)/signup" asChild>
                                <TouchableOpacity>
                                    <Text style={styles.footerLink}>Sign Up</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
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
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
        minHeight: screenHeight,
    },
    header: {
        alignItems: 'center',
        marginBottom: 48,
    },
    logo: {
        width: 80,
        height: 80,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    logoText: {
        color: '#FFFFFF',
        fontSize: 30,
        fontWeight: '700',
    },
    title: {
        color: '#FFFFFF',
        fontSize: 30,
        fontWeight: '700',
        letterSpacing: -0.5,
    },
    subtitle: {
        color: '#94A3B8',
        fontSize: 16,
        marginTop: 8,
    },
    formCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 16,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    input: {
        flex: 1,
        paddingVertical: 16,
        paddingHorizontal: 12,
        color: '#FFFFFF',
        fontSize: 16,
    },
    errorText: {
        color: '#F59E0B',
        fontSize: 12,
        marginTop: 6,
    },
    buttonWrapper: {
        borderRadius: 16,
        overflow: 'hidden',
        marginTop: 8,
    },
    primaryButton: {
        paddingVertical: 18,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    forgotPassword: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    forgotPasswordText: {
        color: '#60A5FA',
        fontSize: 14,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 32,
    },
    footerText: {
        color: '#94A3B8',
        fontSize: 16,
    },
    footerLink: {
        color: '#60A5FA',
        fontSize: 16,
        fontWeight: '600',
    },
});
