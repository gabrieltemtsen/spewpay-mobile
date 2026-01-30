import { borderRadius, colors, shadows, spacing, typography } from '@/constants/spewpay-theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface ConfirmationModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'info' | 'warning' | 'danger';
    loading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    visible,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'info',
    loading = false,
}) => {
    const getIconConfig = () => {
        switch (type) {
            case 'warning':
                return { name: 'warning' as const, color: colors.warning };
            case 'danger':
                return { name: 'alert-circle' as const, color: colors.error };
            default:
                return { name: 'information-circle' as const, color: colors.info };
        }
    };

    const icon = getIconConfig();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
                    <View style={styles.iconContainer}>
                        <Ionicons name={icon.name} size={48} color={icon.color} />
                    </View>

                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress={onClose}
                            style={[styles.button, styles.cancelButton]}
                            disabled={loading}
                        >
                            <Text style={styles.cancelButtonText}>{cancelText}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={onConfirm}
                            disabled={loading}
                            activeOpacity={0.8}
                            style={styles.button}
                        >
                            <LinearGradient
                                colors={[colors.primary, colors.primaryDark]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.confirmButton}
                            >
                                <Text style={styles.confirmButtonText}>
                                    {loading ? 'Processing...' : confirmText}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: colors.overlay,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.lg,
    },
    modalContent: {
        backgroundColor: colors.backgroundSecondary,
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
        width: '100%',
        maxWidth: 400,
        ...shadows.lg,
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    title: {
        ...typography.h2,
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    message: {
        ...typography.body,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    button: {
        flex: 1,
        borderRadius: borderRadius.md,
        overflow: 'hidden',
    },
    cancelButton: {
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 14,
    },
    cancelButtonText: {
        ...typography.bodyBold,
        color: colors.textSecondary,
    },
    confirmButton: {
        paddingVertical: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmButtonText: {
        ...typography.bodyBold,
        color: colors.textPrimary,
    },
});
