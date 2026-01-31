import { borderRadius, colors, shadows, spacing, typography } from '@/constants/spewpay-theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface QRCodeGeneratorProps {
    value: string;
    size?: number;
    logo?: any;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
    value,
    size = 200,
    logo,
}) => {
    if (!value) return null;

    return (
        <View style={styles.container}>
            <View style={styles.qrContainer}>
                <QRCode
                    value={value}
                    size={size}
                    color="black"
                    backgroundColor="white"
                    logo={logo}
                    logoSize={size * 0.2}
                    logoBackgroundColor="white"
                    logoMargin={2}
                    logoBorderRadius={10}
                />
            </View>
            <Text style={styles.helperText}>Scan to pay</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        gap: spacing.lg,
    },
    qrContainer: {
        padding: spacing.xl,
        backgroundColor: 'white',
        borderRadius: borderRadius.xl,
        ...shadows.lg,
    },
    helperText: {
        ...typography.body,
        color: colors.textSecondary,
        textAlign: 'center',
    },
});
