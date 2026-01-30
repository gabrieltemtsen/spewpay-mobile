import { colors } from '@/constants/spewpay-theme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';

interface LoadingScreenProps {
    message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Loading...' }) => {
    return (
        <LinearGradient
            colors={[colors.background, colors.backgroundSecondary, colors.background]}
            style={styles.container}
        >
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.message}>{message}</Text>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    message: {
        color: colors.textSecondary,
        fontSize: 16,
        marginTop: 16,
    },
});
