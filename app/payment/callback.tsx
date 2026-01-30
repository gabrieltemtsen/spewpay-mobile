import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { paymentService } from '@/services/payment.service';

const { height: screenHeight } = Dimensions.get('window');

export default function PaymentCallbackScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
    const [message, setMessage] = useState('Verifying your payment...');

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                // Check queries from both router params and raw URL
                let reference = params.reference as string;
                let trxref = params.trxref as string;

                // If not in params, check initial URL (sometimes params are delayed)
                if (!reference && !trxref) {
                    const url = await Linking.getInitialURL();
                    if (url) {
                        const { queryParams } = Linking.parse(url);
                        if (queryParams) {
                            reference = queryParams.reference as string;
                            trxref = queryParams.trxref as string;
                        }
                    }
                }

                // Paystack returns 'reference' or 'trxref'
                const txRef = reference || trxref;

                if (!txRef) {
                    // If user cancelled, they might match this route but without ref
                    setStatus('failed');
                    setMessage('Payment was cancelled or no reference found.');
                    return;
                }

                // Verify with backend
                await paymentService.verifyDeposit(txRef);

                setStatus('success');
                setMessage('Your deposit was successful! Your balance has been updated.');
            } catch (error: any) {
                console.error('Payment verification failed:', error);
                setStatus('failed');
                setMessage(error.message || 'We could not verify your payment. Please contact support if you were debited.');
            }
        };

        verifyPayment();
    }, [params]);

    const handleContinue = () => {
        router.replace('/(tabs)');
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#000A1A', '#001433', '#000A1A']}
                style={styles.gradient}
            >
                <View style={styles.content}>
                    {status === 'verifying' && (
                        <>
                            <ActivityIndicator size="large" color="#0066FF" style={styles.icon} />
                            <Text style={styles.title}>Verifying Payment</Text>
                            <Text style={styles.message}>{message}</Text>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <View style={[styles.iconContainer, styles.successIcon]}>
                                <Ionicons name="checkmark" size={48} color="#00E699" />
                            </View>
                            <Text style={styles.title}>Payment Successful</Text>
                            <Text style={styles.message}>{message}</Text>

                            <TouchableOpacity style={styles.button} onPress={handleContinue}>
                                <Text style={styles.buttonText}>Return to Dashboard</Text>
                            </TouchableOpacity>
                        </>
                    )}

                    {status === 'failed' && (
                        <>
                            <View style={[styles.iconContainer, styles.failedIcon]}>
                                <Ionicons name="close" size={48} color="#EF4444" />
                            </View>
                            <Text style={styles.title}>Payment Failed</Text>
                            <Text style={styles.message}>{message}</Text>

                            <TouchableOpacity style={[styles.button, styles.failedButton]} onPress={handleContinue}>
                                <Text style={styles.buttonText}>Return to Dashboard</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000A1A',
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: screenHeight,
    },
    content: {
        width: '85%',
        padding: 32,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    icon: {
        marginBottom: 24,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    successIcon: {
        backgroundColor: 'rgba(0, 230, 153, 0.15)',
    },
    failedIcon: {
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
    },
    title: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 12,
        textAlign: 'center',
    },
    message: {
        color: '#94A3B8',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24,
    },
    button: {
        backgroundColor: '#0066FF',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 16,
        width: '100%',
        alignItems: 'center',
    },
    failedButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 16,
    },
});
