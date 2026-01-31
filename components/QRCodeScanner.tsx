import { borderRadius, colors, spacing, typography } from '@/constants/spewpay-theme';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from './Button';

interface QRCodeScannerProps {
    onScan: (data: string) => void;
    onClose: () => void;
}

const { width } = Dimensions.get('window');
const SCAN_SIZE = width * 0.7;

export const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onScan, onClose }) => {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        if (!permission) {
            requestPermission();
        }
    }, [permission, requestPermission]);

    if (!permission) {
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.permissionText}>We need your permission to show the camera</Text>
                <Button title="Grant Permission" onPress={requestPermission} />
                <Button title="Cancel" variant="ghost" onPress={onClose} style={{ marginTop: spacing.md }} />
            </View>
        );
    }

    const handleBarCodeScanned = ({ data }: { data: string }) => {
        if (scanned) return;
        setScanned(true);
        // Haptic feedback could be added here
        onScan(data);
        // Reset scanned state after a delay if needed, or rely on parent to close/change view
        setTimeout(() => setScanned(false), 2000);
    };

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing="back"
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                }}
            >
                <View style={styles.overlay}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="white" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Scan QR Code</Text>
                        <View style={{ width: 40 }} />
                    </View>

                    <View style={styles.middleRow}>
                        <View style={styles.sideOverlay} />
                        <View style={styles.scanFrame}>
                            <View style={styles.cornerTL} />
                            <View style={styles.cornerTR} />
                            <View style={styles.cornerBL} />
                            <View style={styles.cornerBR} />
                        </View>
                        <View style={styles.sideOverlay} />
                    </View>

                    <View style={styles.bottomOverlay}>
                        <Text style={styles.helperText}>
                            Align the QR code within the frame to scan
                        </Text>
                    </View>
                </View>
            </CameraView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
    },
    camera: {
        flex: 1,
    },
    permissionText: {
        ...typography.body,
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: spacing.lg,
        paddingHorizontal: spacing.xl,
    },
    overlay: {
        flex: 1,
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: spacing.lg,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingBottom: spacing.lg,
    },
    closeButton: {
        padding: spacing.sm,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: borderRadius.round,
    },
    headerTitle: {
        ...typography.h3,
        color: 'white',
    },
    middleRow: {
        flexDirection: 'row',
        flex: 1,
    },
    sideOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    scanFrame: {
        width: SCAN_SIZE,
        height: SCAN_SIZE,
        backgroundColor: 'transparent',
        position: 'relative',
    },
    bottomOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        paddingTop: spacing.xl,
    },
    helperText: {
        ...typography.body,
        color: 'white',
        textAlign: 'center',
        opacity: 0.8,
    },
    // Corners
    cornerTL: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 20,
        height: 20,
        borderTopWidth: 4,
        borderLeftWidth: 4,
        borderColor: colors.primary,
    },
    cornerTR: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 20,
        height: 20,
        borderTopWidth: 4,
        borderRightWidth: 4,
        borderColor: colors.primary,
    },
    cornerBL: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: 20,
        height: 20,
        borderBottomWidth: 4,
        borderLeftWidth: 4,
        borderColor: colors.primary,
    },
    cornerBR: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 20,
        height: 20,
        borderBottomWidth: 4,
        borderRightWidth: 4,
        borderColor: colors.primary,
    },
});
