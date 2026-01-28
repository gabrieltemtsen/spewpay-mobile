import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import * as z from 'zod';

import { useAuth } from '@/contexts';

// Updated schema to match API: displayName instead of firstName/lastName
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
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setStep(2);
        }
    };

    const onSubmit = async (data: SignupForm) => {
        try {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            await signup({
                email: data.email,
                password: data.password,
                displayName: data.displayName,
            });
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.replace('/(tabs)');
        } catch (error: any) {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
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
            keyboardType?: 'default' | 'email-address' | 'phone-pad';
            secureTextEntry?: boolean;
            autoCapitalize?: 'none' | 'words';
        }
    ) => (
        <View className="mb-4">
            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, onBlur, value } }) => (
                    <View className="flex-row items-center bg-white/10 rounded-2xl px-4 border border-white/10">
                        <Ionicons name={icon as any} size={20} color="rgba(255,255,255,0.5)" />
                        <TextInput
                            className="flex-1 py-4 px-3 text-white text-base"
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
                <Text className="text-warning-500 text-sm mt-1">
                    {errors[name]?.message}
                </Text>
            )}
        </View>
    );

    return (
        <View className="flex-1 bg-black">
            {/* Background Gradient */}
            <LinearGradient
                colors={['#000A1A', '#001433', '#002966']}
                className="absolute inset-0"
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View className="flex-1 justify-center px-6 py-12">
                        {/* Header */}
                        <View className="items-center mb-8">
                            <View className="w-16 h-16 rounded-2xl bg-accent-500 items-center justify-center mb-4">
                                <Ionicons name="person-add" size={32} color="#fff" />
                            </View>
                            <Text className="text-white text-2xl font-bold tracking-tight">
                                Create Account
                            </Text>
                            <Text className="text-muted-dark text-base mt-2">
                                {step === 1 ? 'Enter your personal details' : 'Secure your account'}
                            </Text>

                            {/* Step Indicator */}
                            <View className="flex-row mt-4 gap-2">
                                <View className={`h-1 w-12 rounded-full ${step >= 1 ? 'bg-primary-500' : 'bg-white/20'}`} />
                                <View className={`h-1 w-12 rounded-full ${step >= 2 ? 'bg-primary-500' : 'bg-white/20'}`} />
                            </View>
                        </View>

                        {/* Form Card */}
                        <BlurView intensity={20} tint="dark" className="rounded-3xl overflow-hidden">
                            <View className="p-6 bg-white/5">
                                {step === 1 ? (
                                    /* Step 1: Personal Info */
                                    <>
                                        {renderInput('displayName', 'Full Name', 'person-outline')}
                                        {renderInput('email', 'Email Address', 'mail-outline', {
                                            keyboardType: 'email-address',
                                            autoCapitalize: 'none',
                                        })}

                                        <TouchableOpacity
                                            onPress={handleNextStep}
                                            activeOpacity={0.8}
                                            className="overflow-hidden rounded-2xl mt-2"
                                        >
                                            <LinearGradient
                                                colors={['#0066FF', '#0052CC']}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 0 }}
                                                className="py-4 items-center flex-row justify-center"
                                            >
                                                <Text className="text-white text-base font-semibold mr-2">
                                                    Continue
                                                </Text>
                                                <Ionicons name="arrow-forward" size={20} color="#fff" />
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    </>
                                ) : (
                                    /* Step 2: Password */
                                    <>
                                        <TouchableOpacity
                                            onPress={() => setStep(1)}
                                            className="flex-row items-center mb-4"
                                        >
                                            <Ionicons name="arrow-back" size={20} color="rgba(255,255,255,0.7)" />
                                            <Text className="text-white/70 ml-2">Back</Text>
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
                                        <View className="mb-6 p-4 bg-white/5 rounded-xl">
                                            <Text className="text-white/70 text-sm mb-2">Password must have:</Text>
                                            <View className="flex-row items-center mb-1">
                                                <Ionicons
                                                    name={getValues('password')?.length >= 8 ? 'checkmark-circle' : 'ellipse-outline'}
                                                    size={16}
                                                    color={getValues('password')?.length >= 8 ? '#00E699' : 'rgba(255,255,255,0.3)'}
                                                />
                                                <Text className="text-white/50 text-sm ml-2">At least 8 characters</Text>
                                            </View>
                                        </View>

                                        <TouchableOpacity
                                            onPress={handleSubmit(onSubmit)}
                                            disabled={isLoading}
                                            activeOpacity={0.8}
                                            className="overflow-hidden rounded-2xl"
                                        >
                                            <LinearGradient
                                                colors={['#00E699', '#00B377']}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 0 }}
                                                className="py-4 items-center"
                                            >
                                                {isLoading ? (
                                                    <ActivityIndicator color="#fff" />
                                                ) : (
                                                    <Text className="text-white text-base font-semibold">
                                                        Create Account
                                                    </Text>
                                                )}
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    </>
                                )}
                            </View>
                        </BlurView>

                        {/* Sign In Link */}
                        <View className="flex-row justify-center mt-8">
                            <Text className="text-muted-dark text-base">
                                Already have an account?{' '}
                            </Text>
                            <Link href="/(auth)/login" asChild>
                                <TouchableOpacity>
                                    <Text className="text-primary-400 text-base font-semibold">
                                        Sign In
                                    </Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
