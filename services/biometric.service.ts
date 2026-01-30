import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';

export interface BiometricStatus {
    isCompatible: boolean;
    isEnrolled: boolean;
    biometricTypes: LocalAuthentication.AuthenticationType[];
}

export const biometricService = {
    /**
     * Check if device supports biometrics and has enrolled records
     */
    checkHardwareSupport: async (): Promise<BiometricStatus> => {
        try {
            const isCompatible = await LocalAuthentication.hasHardwareAsync();
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();
            const biometricTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

            return { isCompatible, isEnrolled, biometricTypes };
        } catch (error) {
            console.error('Biometric check failed', error);
            return { isCompatible: false, isEnrolled: false, biometricTypes: [] };
        }
    },

    /**
     * Prompt user for authentication
     */
    authenticate: async (promptMessage = 'Authenticate to continue'): Promise<boolean> => {
        try {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage,
                fallbackLabel: 'Use PIN',
                disableDeviceFallback: false,
                cancelLabel: 'Cancel',
            });
            return result.success;
        } catch (error) {
            console.error('Authentication failed', error);
            return false;
        }
    },

    /**
     * Get readable name for available biometric type
     */
    getBiometricLabel: async (): Promise<string> => {
        if (Platform.OS === 'web') return 'Password';

        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
            return Platform.OS === 'ios' ? 'Face ID' : 'Face Unlock';
        }
        if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
            return Platform.OS === 'ios' ? 'Touch ID' : 'Fingerprint';
        }
        return 'Biometrics';
    }
};
