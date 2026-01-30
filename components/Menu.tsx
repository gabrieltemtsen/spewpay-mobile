import { borderRadius, colors, shadows, spacing, typography } from '@/constants/spewpay-theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MenuItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    subtitle?: string;
    onPress: () => void;
    danger?: boolean;
    rightElement?: React.ReactNode;
    showChevron?: boolean;
}

export function MenuItem({
    icon,
    label,
    subtitle,
    onPress,
    danger,
    rightElement,
    showChevron = true
}: MenuItemProps) {
    const handlePress = async () => {
        if (Platform.OS !== 'web') {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPress();
    };

    return (
        <TouchableOpacity onPress={handlePress} style={styles.menuItem} activeOpacity={0.7}>
            <View style={[styles.menuIcon, danger ? styles.menuIconDanger : styles.menuIconPrimary]}>
                <Ionicons name={icon} size={20} color={danger ? colors.error : colors.primary} />
            </View>
            <View style={styles.menuInfo}>
                <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>{label}</Text>
                {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
            </View>
            {rightElement}
            {showChevron && !rightElement && (
                <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            )}
        </TouchableOpacity>
    );
}

export function MenuSection({ title, children }: { title?: string; children: React.ReactNode }) {
    return (
        <View style={styles.menuSection}>
            {title ? <Text style={styles.sectionTitle}>{title}</Text> : null}
            <View style={styles.menuCard}>{children}</View>
        </View>
    );
}

const styles = StyleSheet.create({
    menuSection: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        ...typography.caption,
        color: colors.textSecondary,
        marginBottom: spacing.sm,
        marginLeft: spacing.sm,
        textTransform: 'uppercase',
    },
    menuCard: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.xl,
        padding: spacing.sm,
        ...shadows.sm,
        borderWidth: 1,
        borderColor: colors.border,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
    },
    menuIcon: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    menuIconPrimary: {
        backgroundColor: colors.infoLight,
    },
    menuIconDanger: {
        backgroundColor: colors.errorLight,
    },
    menuInfo: {
        flex: 1,
    },
    menuLabel: {
        ...typography.bodyBold,
        color: colors.textPrimary,
    },
    menuLabelDanger: {
        color: colors.error,
    },
    menuSubtitle: {
        ...typography.small,
        color: colors.textSecondary,
        marginTop: 2,
    },
});
