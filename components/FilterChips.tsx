import { borderRadius, colors, spacing, typography } from '@/constants/spewpay-theme';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

type FilterOption = {
    label: string;
    value: string;
};

interface FilterChipsProps {
    options: FilterOption[];
    selectedValue: string;
    onSelect: (value: string) => void;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
    options,
    selectedValue,
    onSelect,
}) => {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            {options.map((option) => {
                const isSelected = option.value === selectedValue;
                return (
                    <TouchableOpacity
                        key={option.value}
                        style={[
                            styles.chip,
                            isSelected && styles.chipSelected,
                        ]}
                        onPress={() => onSelect(option.value)}
                        activeOpacity={0.7}
                    >
                        <Text
                            style={[
                                styles.chipText,
                                isSelected && styles.chipTextSelected,
                            ]}
                        >
                            {option.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: spacing.sm,
        gap: spacing.sm,
    },
    chip: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },
    chipSelected: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    chipText: {
        ...typography.caption,
        color: colors.textSecondary,
        fontWeight: '600',
    },
    chipTextSelected: {
        color: colors.textPrimary,
    },
});
