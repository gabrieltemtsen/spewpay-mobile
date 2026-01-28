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

const signupSchema = z.object({
    displayName: z.string().min(2, 'Display name is required'),
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupScreen() {
    const router = useRouter();
    const { signup, isLoading } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [step, setStep] = useState(1);

    const {
        control,
        handleSubmit,
        formState: { errors },
        trigger,
        getValues,
    } = useForm<SignupForm>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            displayName: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const handleNextStep = async () => {
        const isValid = await trigger(['displayName', 'email']);
        if (isValid) {
            if (Platform.OS !== 'web') {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            setStep(2);
        }
    };

    const onSubmit = async (data: SignupForm) => {
        try {
            if (Platform.OS !== 'web') {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
            await signup({
                email: data.email,
                password: data.password,
                displayName: data.displayName,
            });
            if (Platform.OS !== 'web') {
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
            router.replace('/(tabs)');
        } catch (error: any) {
            if (Platform.OS !== 'web') {
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            }
            Alert.alert(
                'Signup Failed',
                error?.message || 'Something went wrong. Please try again.'
            );
        }
    };

    const renderInput = (
        name: keyof SignupForm,
        placeholder: string,
        icon: string,
        options?: {
            keyboardType?: 'default' | 'email-address';
            secureTextEntry?: boolean;
            autoCapitalize?: 'none' | 'words';
        }
    ) => (
        <View style={styles.inputGroup}>
            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputContainer}>
                        <Ionicons name={icon as any} size={20} color="rgba(255,255,255,0.5)" />
                        <TextInput
                            style={styles.input}
                            placeholder={placeholder}
                            placeholderTextColor="rgba(255,255,255,0.3)"
                            keyboardType={options?.keyboardType || 'default'}
                            secureTextEntry={options?.secureTextEntry && !showPassword}
                            autoCapitalize={options?.autoCapitalize ?? 'words'}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                        {options?.secureTextEntry && (
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
                        )}
                    </View>
                )}
            />
            {errors[name] && (
                <Text style={styles.errorText}>{errors[name]?.message}</Text>
            )}
        </View>
    );

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
                        {/* Header */}
                        <View style={styles.header}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="person-add" size={32} color="#fff" />
                            </View>
                            <Text style={styles.title}>Create Account</Text>
                            <Text style={styles.subtitle}>
                                {step === 1 ? 'Enter your personal details' : 'Secure your account'}
                            </Text>

                            {/* Step Indicator */}
                            <View style={styles.stepIndicator}>
                                <View style={[styles.stepDot, step >= 1 && styles.stepDotActive]} />
                                <View style={[styles.stepDot, step >= 2 && styles.stepDotActive]} />
                            </View>
                        </View>

                        {/* Form Card */}
                        <View style={styles.formCard}>
                            {step === 1 ? (
                                <>
                                    {renderInput('displayName', 'Full Name', 'person-outline')}
                                    {renderInput('email', 'Email Address', 'mail-outline', {
                                        keyboardType: 'email-address',
                                        autoCapitalize: 'none',
                                    })}

                                    <TouchableOpacity
                                        onPress={handleNextStep}
                                        activeOpacity={0.8}
                                        style={styles.buttonWrapper}
                                    >
                                        <LinearGradient
                                            colors={['#0066FF', '#0052CC']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={styles.primaryButton}
                                        >
                                            <Text style={styles.buttonText}>Continue</Text>
                                            <Ionicons name="arrow-forward" size={20} color="#fff" />
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <>
                                    <TouchableOpacity
                                        onPress={() => setStep(1)}
                                        style={styles.backButton}
                                    >
                                        <Ionicons name="arrow-back" size={20} color="rgba(255,255,255,0.7)" />
                                        <Text style={styles.backButtonText}>Back</Text>
                                    </TouchableOpacity>

                                    {renderInput('password', 'Create Password', 'lock-closed-outline', {
                                        secureTextEntry: true,
                                        autoCapitalize: 'none',
                                    })}
                                    {renderInput('confirmPassword', 'Confirm Password', 'lock-closed-outline', {
                                        secureTextEntry: true,
                                        autoCapitalize: 'none',
                                    })}

                                    {/* Password Requirements */}
                                    <View style={styles.requirements}>
                                        <Text style={styles.requirementsLabel}>Password must have:</Text>
                                        <View style={styles.requirementItem}>
                                            <Ionicons
                                                name={getValues('password')?.length >= 8 ? 'checkmark-circle' : 'ellipse-outline'}
                                                size={16}
                                                color={getValues('password')?.length >= 8 ? '#00E699' : 'rgba(255,255,255,0.3)'}
                                            />
                                            <Text style={styles.requirementText}>At least 8 characters</Text>
                                        </View>
                                    </View>

                                    <TouchableOpacity
                                        onPress={handleSubmit(onSubmit)}
                                        disabled={isLoading}
                                        activeOpacity={0.8}
                                        style={styles.buttonWrapper}
                                    >
                                        <LinearGradient
                                            colors={['#00E699', '#00B377']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={styles.primaryButton}
                                        >
                                            {isLoading ? (
                                                <ActivityIndicator color="#fff" />
                                            ) : (
                                                <Text style={styles.buttonText}>Create Account</Text>
                                            )}
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>

                        {/* Sign In Link */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>
                                Already have an account?{' '}
                            </Text>
                            <Link href="/(auth)/login" asChild>
                                <TouchableOpacity>
                                    <Text style={styles.footerLink}>Sign In</Text>
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
        marginBottom: 32,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 16,
        backgroundColor: '#00E699',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 26,
        fontWeight: '700',
        letterSpacing: -0.5,
    },
    subtitle: {
        color: '#94A3B8',
        fontSize: 16,
        marginTop: 8,
    },
    stepIndicator: {
        flexDirection: 'row',
        marginTop: 16,
        gap: 8,
    },
    stepDot: {
        width: 48,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    stepDotActive: {
        backgroundColor: '#0066FF',
    },
    formCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    inputGroup: {
        marginBottom: 16,
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
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    backButtonText: {
        color: 'rgba(255, 255, 255, 0.7)',
        marginLeft: 8,
    },
    requirements: {
        padding: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        marginBottom: 16,
    },
    requirementsLabel: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 14,
        marginBottom: 8,
    },
    requirementItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    requirementText: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 14,
        marginLeft: 8,
    },
    buttonWrapper: {
        borderRadius: 16,
        overflow: 'hidden',
        marginTop: 8,
    },
    primaryButton: {
        paddingVertical: 18,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
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
