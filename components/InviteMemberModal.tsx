import { borderRadius, colors, spacing, typography } from '@/constants/spewpay-theme';
import type { OrgRole } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface InviteMemberModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: { email: string; role: OrgRole; message?: string }) => Promise<void>;
    isLoading?: boolean;
}

const ROLES: { role: OrgRole; label: string; description: string }[] = [
    { role: 'ADMIN', label: 'Admin', description: 'Full access to manage org' },
    { role: 'MANAGER', label: 'Manager', description: 'Can manage allocations' },
    { role: 'MEMBER', label: 'Member', description: 'Basic access' },
];

export function InviteMemberModal({ visible, onClose, onSubmit, isLoading }: InviteMemberModalProps) {
    const [email, setEmail] = useState('');
    const [selectedRole, setSelectedRole] = useState<OrgRole>('MEMBER');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        const trimmedEmail = email.trim().toLowerCase();

        if (!trimmedEmail) {
            setError('Email is required');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            setError('Please enter a valid email');
            return;
        }

        try {
            await onSubmit({
                email: trimmedEmail,
                role: selectedRole,
                message: message.trim() || undefined,
            });
            handleClose();
        } catch (e: any) {
            setError(e.message || 'Failed to send invite');
        }
    };

    const handleClose = () => {
        setEmail('');
        setSelectedRole('MEMBER');
        setMessage('');
        setError('');
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.overlay}
            >
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Invite Member</Text>
                        <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
                            <Ionicons name="close" size={24} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    {/* Email Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email Address</Text>
                        <TextInput
                            style={[styles.input, error && styles.inputError]}
                            placeholder="member@example.com"
                            placeholderTextColor={colors.textTertiary}
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                setError('');
                            }}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoFocus
                        />
                        {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    </View>

                    {/* Role Selection */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Role</Text>
                        <View style={styles.roleList}>
                            {ROLES.map((item) => (
                                <TouchableOpacity
                                    key={item.role}
                                    style={[
                                        styles.roleItem,
                                        selectedRole === item.role && styles.roleItemSelected,
                                    ]}
                                    onPress={() => setSelectedRole(item.role)}
                                >
                                    <View style={styles.roleRadio}>
                                        {selectedRole === item.role && (
                                            <View style={styles.roleRadioInner} />
                                        )}
                                    </View>
                                    <View style={styles.roleInfo}>
                                        <Text style={styles.roleLabel}>{item.label}</Text>
                                        <Text style={styles.roleDesc}>{item.description}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Message (Optional) */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Message (Optional)</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Add a personal note..."
                            placeholderTextColor={colors.textTertiary}
                            value={message}
                            onChangeText={setMessage}
                            multiline
                            numberOfLines={3}
                        />
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
                        onPress={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <>
                                <Ionicons name="send" size={18} color="#FFFFFF" />
                                <Text style={styles.submitBtnText}>Send Invite</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: colors.background,
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        padding: spacing.xl,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    title: {
        ...typography.h2,
        color: colors.textPrimary,
    },
    closeBtn: {
        padding: spacing.xs,
    },
    inputGroup: {
        marginBottom: spacing.lg,
    },
    label: {
        ...typography.bodyBold,
        color: colors.textSecondary,
        marginBottom: spacing.sm,
    },
    input: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        fontSize: 16,
        color: colors.textPrimary,
        borderWidth: 1,
        borderColor: colors.border,
    },
    inputError: {
        borderColor: colors.error,
    },
    textArea: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    errorText: {
        ...typography.small,
        color: colors.error,
        marginTop: spacing.xs,
    },
    roleList: {
        gap: spacing.sm,
    },
    roleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    roleItemSelected: {
        borderColor: colors.primary,
    },
    roleRadio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    roleRadioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.primary,
    },
    roleInfo: {
        flex: 1,
    },
    roleLabel: {
        ...typography.bodyBold,
        color: colors.textPrimary,
    },
    roleDesc: {
        ...typography.small,
        color: colors.textSecondary,
    },
    submitBtn: {
        flexDirection: 'row',
        backgroundColor: colors.primary,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        marginTop: spacing.md,
    },
    submitBtnDisabled: {
        opacity: 0.7,
    },
    submitBtnText: {
        ...typography.bodyBold,
        color: '#FFFFFF',
    },
});
