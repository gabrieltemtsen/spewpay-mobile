import { borderRadius, colors, shadows, typography } from '@/constants/spewpay-theme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'small' | 'medium' | 'large';
    loading?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    loading = false,
    disabled = false,
    fullWidth = false,
    style,
    textStyle,
}) => {
    const isPrimary = variant === 'primary';
    const isDisabled = disabled || loading;

    const getButtonStyles = (): ViewStyle[] => {
        const baseStyles = [styles.button];

        if (size === 'small') baseStyles.push(styles.buttonSmall);
        if (size === 'large') baseStyles.push(styles.buttonLarge);
        if (fullWidth) baseStyles.push(styles.fullWidth);
        if (isDisabled) baseStyles.push(styles.disabled);

        switch (variant) {
            case 'secondary':
                baseStyles.push(styles.secondary);
                break;
            case 'outline':
                baseStyles.push(styles.outline);
                break;
            case 'ghost':
                baseStyles.push(styles.ghost);
                break;
        }

        if (style) baseStyles.push(style);
        return baseStyles;
    };

    const getTextStyles = (): TextStyle[] => {
        const baseStyles = [styles.text];

        if (size === 'small') baseStyles.push(styles.textSmall);
        if (size === 'large') baseStyles.push(styles.textLarge);

        if (variant === 'outline' || variant === 'ghost') {
            baseStyles.push(styles.textOutline);
        }

        if (textStyle) baseStyles.push(textStyle);
        return baseStyles;
    };

    if (isPrimary) {
        return (
            <TouchableOpacity
                onPress={onPress}
                disabled={isDisabled}
                activeOpacity={0.8}
                style={getButtonStyles()}
            >
                <LinearGradient
                    colors={[colors.primary, colors.primaryDark]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradient}
                >
                    {loading ? (
                        <ActivityIndicator color={colors.textPrimary} />
                    ) : (
                        <Text style={getTextStyles()}>{title}</Text>
                    )}
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.8}
            style={getButtonStyles()}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? colors.primary : colors.textPrimary} />
            ) : (
                <Text style={getTextStyles()}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: borderRadius.md,
        overflow: 'hidden',
        ...shadows.sm,
    },
    buttonSmall: {
        height: 36,
    },
    buttonLarge: {
        height: 56,
    },
    fullWidth: {
        width: '100%',
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 24,
    },
    secondary: {
        backgroundColor: colors.surface,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: colors.primary,
    },
    ghost: {
        backgroundColor: 'transparent',
    },
    disabled: {
        opacity: 0.5,
    },
    text: {
        ...typography.bodyBold,
        color: colors.textPrimary,
    },
    textSmall: {
        fontSize: 14,
    },
    textLarge: {
        fontSize: 18,
    },
    textOutline: {
        color: colors.primary,
    },
});
