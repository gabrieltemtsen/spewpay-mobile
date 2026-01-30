import { biometricService } from '@/services/biometric.service';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useState } from 'react';

const BIOMETRIC_ENABLED_KEY = 'biometric_enabled';

export const useBiometrics = () => {
    const [isSupported, setIsSupported] = useState(false);
    const [isEnabled, setIsEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [biometricType, setBiometricType] = useState('Biometrics');

    useEffect(() => {
        checkSupport();
    }, []);

    const checkSupport = async () => {
        try {
            // Check hardware support
            const { isCompatible, isEnrolled } = await biometricService.checkHardwareSupport();
            setIsSupported(isCompatible && isEnrolled);

            // Get label (FaceID/TouchID)
            if (isCompatible) {
                const label = await biometricService.getBiometricLabel();
                setBiometricType(label);
            }

            // Check if enabled in settings
            const storedValue = await SecureStore.getItemAsync(BIOMETRIC_ENABLED_KEY);
            setIsEnabled(storedValue === 'true');
        } catch (error) {
            console.error('Error checking biometrics:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleBiometrics = useCallback(async (value: boolean) => {
        try {
            if (value) {
                // Verify identity before enabling
                const authenticated = await biometricService.authenticate('Authenticate to enable biometrics');
                if (!authenticated) return false;
            }

            setIsEnabled(value);
            await SecureStore.setItemAsync(BIOMETRIC_ENABLED_KEY, String(value));
            return true;
        } catch (error) {
            console.error('Error toggling biometrics:', error);
            return false;
        }
    }, []);

    return {
        isSupported,
        isEnabled,
        biometricType,
        isLoading,
        toggleBiometrics,
    };
};
