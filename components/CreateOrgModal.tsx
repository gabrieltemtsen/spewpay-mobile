import { borderRadius, colors, spacing, typography } from '@/constants/spewpay-theme';
import type { OrgType } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface CreateOrgModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; type: OrgType }) => Promise<void>;
    isLoading?: boolean;
}

const ORG_TYPES: { type: OrgType; label: string; icon: string; description: string }[] = [
    { type: 'COMPANY', label: 'Company', icon: 'business', description: 'Business or corporate account' },
    { type: 'FAMILY', label: 'Family', icon: 'home', description: 'Shared household budget' },
    { type: 'GROUP', label: 'Group', icon: 'people', description: 'Friends, clubs, or teams' },
    { type: 'COUPLE', label: 'Couple', icon: 'heart', description: 'Joint account for partners' },
    { type: 'UNIVERSITY', label: 'University', icon: 'school', description: 'Educational institution' },
];

export function CreateOrgModal({ visible, onClose, onSubmit, isLoading }: CreateOrgModalProps) {
    const [name, setName] = useState('');
    const [selectedType, setSelectedType] = useState<OrgType>('COMPANY');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!name.trim()) {
            setError('Organization name is required');
            return;
        }
        if (name.length < 3) {
            setError('Name must be at least 3 characters');
            return;
        }

        try {
            await onSubmit({ name: name.trim(), type: selectedType });
            setName('');
            setSelectedType('COMPANY');
            setError('');
            onClose();
        } catch (e: any) {
            setError(e.message || 'Failed to create organization');
        }
    };

    const handleClose = () => {
        setName('');
        setSelectedType('COMPANY');
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
                        <Text style={styles.title}>Create Organization</Text>
                        <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
                            <Ionicons name="close" size={24} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Name Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Organization Name</Text>
                            <TextInput
                                style={[styles.input, error && styles.inputError]}
                                placeholder="e.g. Acme Corporation"
                                placeholderTextColor={colors.textTertiary}
                                value={name}
                                onChangeText={(text) => {
                                    setName(text);
                                    setError('');
                                }}
                                autoFocus
                            />
                            {error ? <Text style={styles.errorText}>{error}</Text> : null}
                        </View>

                        {/* Type Selection */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Organization Type</Text>
                            <View style={styles.typeGrid}>
                                {ORG_TYPES.map((item) => (
                                    <TouchableOpacity
                                        key={item.type}
                                        style={[
                                            styles.typeCard,
                                            selectedType === item.type && styles.typeCardSelected,
                                        ]}
                                        onPress={() => setSelectedType(item.type)}
                                    >
                                        <Ionicons
                                            name={item.icon as any}
                                            size={24}
                                            color={selectedType === item.type ? colors.primary : colors.textSecondary}
                                        />
                                        <Text
                                            style={[
                                                styles.typeLabel,
                                                selectedType === item.type && styles.typeLabelSelected,
                                            ]}
                                        >
                                            {item.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </ScrollView>

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
                        onPress={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.submitBtnText}>Create Organization</Text>
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
        maxHeight: '85%',
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
        marginBottom: spacing.xl,
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
    errorText: {
        ...typography.small,
        color: colors.error,
        marginTop: spacing.xs,
    },
    typeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    typeCard: {
        width: '48%',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.border,
    },
    typeCardSelected: {
        borderColor: colors.primary,
        backgroundColor: colors.infoLight,
    },
    typeLabel: {
        ...typography.bodyBold,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
    typeLabelSelected: {
        color: colors.primary,
    },
    submitBtn: {
        backgroundColor: colors.primary,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        alignItems: 'center',
        marginTop: spacing.lg,
    },
    submitBtnDisabled: {
        opacity: 0.7,
    },
    submitBtnText: {
        ...typography.bodyBold,
        color: '#FFFFFF',
    },
});
