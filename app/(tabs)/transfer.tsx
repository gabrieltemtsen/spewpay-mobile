import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useToast } from '@/components/Toast';
import { useAuth } from '@/contexts';
import { transferService } from '@/services/transfer.service';

const { height: screenHeight } = Dimensions.get('window');
const QUICK_AMOUNTS = [500, 1000, 2000, 5000];

export default function TransferScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { user } = useAuth();
    const { showToast } = useToast();
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [showSearchResults, setShowSearchResults] = useState(false);

    useEffect(() => {
        if (params.recipient) {
            setRecipient(Array.isArray(params.recipient) ? params.recipient[0] : params.recipient);
        }
    }, [params.recipient]);


    const handleQuickAmount = async (value: number) => {
        if (Platform.OS !== 'web') {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        setAmount(value.toString());
    };

    const handleSearchUsers = async (query: string) => {
        setRecipient(query);
        if (query.length < 2) {
            setSearchResults([]);
            setShowSearchResults(false);
            return;
        }

        try {
            const results = await transferService.searchUsers(query);
            setSearchResults(results || []);
            setShowSearchResults(true);
        } catch (error) {
            console.error('Search error:', error);
        }
    };

    const handleSelectUser = (user: any) => {
        setRecipient(user.email);
        setShowSearchResults(false);
    };

    const handleSend = async () => {
        if (!user) {
            Alert.alert('Error', 'You must be logged in to transfer');
            return;
        }

        if (!recipient || !amount) {
            Alert.alert('Missing Info', 'Please enter recipient and amount');
            return;
        }

        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            Alert.alert('Invalid Amount', 'Please enter a valid amount');
            return;
        }

        setIsLoading(true);
        if (Platform.OS !== 'web') {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }

        try {
            // Find recipient user
            const users = await transferService.searchUsers(recipient);
            const recipientUser = users?.find((u: any) => u.email === recipient);

            if (!recipientUser) {
                throw new Error('Recipient not found');
            }

            await transferService.internalTransfer({
                sourceUserId: user.id,
                destinationUserId: recipientUser.id,
                amountInNaira: numAmount,
                description: description || undefined,
            });

            setIsLoading(false);
            if (Platform.OS !== 'web') {
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }

            showToast(`₦${numAmount.toLocaleString()} sent successfully!`, 'success');
            setRecipient('');
            setAmount('');
            setDescription('');

            // Navigate back to home
            setTimeout(() => router.push('/(tabs)'), 1000);
        } catch (error: any) {
            setIsLoading(false);
            console.error('Transfer error:', error);
            Alert.alert('Transfer Failed', error.message || 'Could not complete transfer');
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
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.keyboardView}
                    >
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.scrollContent}
                            keyboardShouldPersistTaps="handled"
                        >
                            {/* Header */}
                            <View style={styles.header}>
                                <Text style={styles.title}>Send Money</Text>
                                <Text style={styles.subtitle}>
                                    Transfer funds to another user
                                </Text>
                            </View>

                            {/* Recipient Input */}
                            <Animated.View entering={FadeInDown.duration(400)}>
                                <Text style={styles.label}>Recipient</Text>
                                <View style={styles.inputContainer}>
                                    <Ionicons name="person-outline" size={20} color="#64748B" />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter email or username"
                                        placeholderTextColor="#64748B"
                                        autoCapitalize="none"
                                        value={recipient}
                                        onChangeText={setRecipient}
                                    />
                                </View>
                            </Animated.View>

                            {/* Amount Input */}
                            <Animated.View entering={FadeInDown.delay(100).duration(400)}>
                                <Text style={styles.label}>Amount</Text>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.currencySymbol}>₦</Text>
                                    <TextInput
                                        style={styles.amountInput}
                                        placeholder="0.00"
                                        placeholderTextColor="#64748B"
                                        keyboardType="numeric"
                                        value={amount}
                                        onChangeText={setAmount}
                                    />
                                </View>
                            </Animated.View>

                            {/* Quick Amounts */}
                            <Animated.View
                                entering={FadeInDown.delay(200).duration(400)}
                                style={styles.quickAmounts}
                            >
                                {QUICK_AMOUNTS.map((value) => (
                                    <TouchableOpacity
                                        key={value}
                                        onPress={() => handleQuickAmount(value)}
                                        style={[
                                            styles.quickAmountBtn,
                                            amount === value.toString() && styles.quickAmountBtnActive,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.quickAmountText,
                                                amount === value.toString() && styles.quickAmountTextActive,
                                            ]}
                                        >
                                            ₦{value.toLocaleString()}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </Animated.View>

                            {/* Description Input */}
                            <Animated.View entering={FadeInDown.delay(300).duration(400)}>
                                <Text style={styles.label}>Note (Optional)</Text>
                                <View style={styles.inputContainer}>
                                    <Ionicons name="chatbubble-outline" size={20} color="#64748B" />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="What's this for?"
                                        placeholderTextColor="#64748B"
                                        value={description}
                                        onChangeText={setDescription}
                                    />
                                </View>
                            </Animated.View>

                            {/* Send Button */}
                            <TouchableOpacity
                                onPress={handleSend}
                                disabled={isLoading}
                                activeOpacity={0.8}
                                style={styles.buttonWrapper}
                            >
                                <LinearGradient
                                    colors={['#0066FF', '#0052CC']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.sendButton}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <>
                                            <Ionicons name="send" size={20} color="#fff" />
                                            <Text style={styles.sendButtonText}>Send Money</Text>
                                        </>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        </ScrollView>
                    </KeyboardAvoidingView>
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
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 120,
    },
    header: {
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
    label: {
        color: '#94A3B8',
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
        marginTop: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
    currencySymbol: {
        color: '#64748B',
        fontSize: 24,
    },
    amountInput: {
        flex: 1,
        paddingVertical: 16,
        paddingHorizontal: 12,
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: '700',
    },
    quickAmounts: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 16,
    },
    quickAmountBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    quickAmountBtnActive: {
        backgroundColor: '#0066FF',
        borderColor: '#0066FF',
    },
    quickAmountText: {
        color: '#94A3B8',
        fontWeight: '600',
    },
    quickAmountTextActive: {
        color: '#FFFFFF',
    },
    buttonWrapper: {
        borderRadius: 16,
        overflow: 'hidden',
        marginTop: 32,
    },
    sendButton: {
        paddingVertical: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    sendButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
