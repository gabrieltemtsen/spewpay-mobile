import { MenuItem, MenuSection } from '@/components/Menu';
import { useToast } from '@/components/Toast';
import { colors, spacing } from '@/constants/spewpay-theme';
import { useAuth } from '@/contexts';
import { useBiometrics } from '@/hooks/useBiometrics';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Switch, View } from 'react-native';

export default function SecuritySettings() {
    const router = useRouter();
    const { user } = useAuth();
    const { showToast } = useToast();
    const { isSupported, isEnabled, isLoading, biometricType, toggleBiometrics } = useBiometrics();

    const handleBiometricToggle = async (value: boolean) => {
        const success = await toggleBiometrics(value);
        if (success) {
            showToast(`${biometricType} ${value ? 'enabled' : 'disabled'}`, 'success');
        } else {
            showToast('Authentication failed', 'error');
        }
    };

    const handleChangePassword = () => {
        // Navigate to change password screen
        showToast('Change password feature coming soon', 'info');
    };

    const handleChangePIN = () => {
        // Navigate to change PIN screen
        showToast('Change PIN feature coming soon', 'info');
    };

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerTitle: 'Security',
                    headerStyle: { backgroundColor: colors.background },
                    headerTintColor: colors.textPrimary,
                    headerShadowVisible: false,
                }}
            />

            <ScrollView contentContainerStyle={styles.content}>
                {isSupported && (
                    <MenuSection title="Biometrics">
                        <MenuItem
                            icon="finger-print"
                            label={`Use ${biometricType}`}
                            subtitle={`Unlock app with ${biometricType}`}
                            onPress={() => handleBiometricToggle(!isEnabled)}
                            showChevron={false}
                            rightElement={
                                <Switch
                                    value={isEnabled}
                                    onValueChange={handleBiometricToggle}
                                    trackColor={{ false: colors.textTertiary, true: colors.primary }}
                                    thumbColor={'#FFFFFF'}
                                    disabled={isLoading}
                                />
                            }
                        />
                    </MenuSection>
                )}

                <MenuSection title="Access">
                    <MenuItem
                        icon="key-outline"
                        label="Change Password"
                        subtitle="Update your login password"
                        onPress={handleChangePassword}
                    />
                    <MenuItem
                        icon="keypad-outline"
                        label="Change Transaction PIN"
                        subtitle="Update your 4-digit PIN"
                        onPress={handleChangePIN}
                    />
                </MenuSection>

                <MenuSection title="Devices">
                    <MenuItem
                        icon="phone-portrait-outline"
                        label="Trusted Devices"
                        subtitle="Manage devices connected to your account"
                        onPress={() => { }}
                    />
                </MenuSection>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: spacing.lg,
    },
});
