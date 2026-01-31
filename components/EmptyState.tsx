import { colors, spacing, typography } from '@/constants/spewpay-theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ActionObject {
    label: string;
    onPress: () => void;
}

interface EmptyStateProps {
    icon?: keyof typeof Ionicons.glyphMap;
    title: string;
    description?: string;
    action?: React.ReactNode | ActionObject;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon = 'folder-open-outline',
    title,
    description,
    action,
}) => {
    // Handle action as either ReactNode or { label, onPress } object
    const renderAction = () => {
        if (!action) return null;

        // Check if action is an object with label and onPress
        if (typeof action === 'object' && 'label' in action && 'onPress' in action) {
            const actionObj = action as ActionObject;
            return (
                <TouchableOpacity style={styles.actionButton} onPress={actionObj.onPress}>
                    <Text style={styles.actionButtonText}>{actionObj.label}</Text>
                </TouchableOpacity>
            );
        }

        // Otherwise render as ReactNode
        return action;
    };

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Ionicons name={icon} size={64} color={colors.textTertiary} />
            </View>
            <Text style={styles.title}>{title}</Text>
            {description && <Text style={styles.description}>{description}</Text>}
            {action && <View style={styles.actionContainer}>{renderAction()}</View>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    iconContainer: {
        marginBottom: spacing.lg,
        opacity: 0.6,
    },
    title: {
        ...typography.h3,
        color: colors.textPrimary,
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    description: {
        ...typography.body,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    actionContainer: {
        marginTop: spacing.md,
    },
    actionButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderRadius: 12,
    },
    actionButtonText: {
        ...typography.bodyBold,
        color: '#FFFFFF',
    },
});
