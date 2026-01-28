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
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import * as z from 'zod';

import { useAuth } from '@/contexts';

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
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            await login(data);
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.replace('/(tabs)');
        } catch (error: any) {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert(
                'Login Failed',
                error?.message || 'Please check your credentials and try again.'
            );
        }
    };

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
                <View className="flex-1 justify-center px-6">
                    {/* Logo & Title */}
                    <View className="items-center mb-12">
                        <View className="w-20 h-20 rounded-3xl bg-primary-500 items-center justify-center mb-6 shadow-glow">
                            <Text className="text-white text-3xl font-bold">SP</Text>
                        </View>
                        <Text className="text-white text-3xl font-bold tracking-tight">
                            Welcome Back
                        </Text>
                        <Text className="text-muted-dark text-base mt-2">
                            Sign in to your Spewpay account
                        </Text>
                    </View>

                    {/* Form Card */}
                    <BlurView intensity={20} tint="dark" className="rounded-3xl overflow-hidden">
                        <View className="p-6 bg-white/5">
                            {/* Email Input */}
                            <View className="mb-4">
                                <Text className="text-white/70 text-sm mb-2 font-medium">
                                    Email Address
                                </Text>
                                <Controller
                                    control={control}
                                    name="email"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <View className="flex-row items-center bg-white/10 rounded-2xl px-4 border border-white/10">
                                            <Ionicons name="mail-outline" size={20} color="rgba(255,255,255,0.5)" />
                                            <TextInput
                                                className="flex-1 py-4 px-3 text-white text-base"
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
                                    <Text className="text-warning-500 text-sm mt-1">
                                        {errors.email.message}
                                    </Text>
                                )}
                            </View>

                            {/* Password Input */}
                            <View className="mb-6">
                                <Text className="text-white/70 text-sm mb-2 font-medium">
                                    Password
                                </Text>
                                <Controller
                                    control={control}
                                    name="password"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <View className="flex-row items-center bg-white/10 rounded-2xl px-4 border border-white/10">
                                            <Ionicons name="lock-closed-outline" size={20} color="rgba(255,255,255,0.5)" />
                                            <TextInput
                                                className="flex-1 py-4 px-3 text-white text-base"
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
                                    <Text className="text-warning-500 text-sm mt-1">
                                        {errors.password.message}
                                    </Text>
                                )}
                            </View>

                            {/* Login Button */}
                            <TouchableOpacity
                                onPress={handleSubmit(onSubmit)}
                                disabled={isLoading}
                                activeOpacity={0.8}
                                className="overflow-hidden rounded-2xl"
                            >
                                <LinearGradient
                                    colors={['#0066FF', '#0052CC']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    className="py-4 items-center"
                                >
                                    {isLoading ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text className="text-white text-base font-semibold">
                                            Sign In
                                        </Text>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>

                            {/* Forgot Password */}
                            <TouchableOpacity className="py-4 items-center">
                                <Text className="text-primary-400 text-sm">
                                    Forgot your password?
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </BlurView>

                    {/* Sign Up Link */}
                    <View className="flex-row justify-center mt-8">
                        <Text className="text-muted-dark text-base">
                            Don't have an account?{' '}
                        </Text>
                        <Link href="/(auth)/signup" asChild>
                            <TouchableOpacity>
                                <Text className="text-primary-400 text-base font-semibold">
                                    Sign Up
                                </Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}
