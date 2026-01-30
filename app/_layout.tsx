import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import 'react-native-reanimated';
import '../global.css';

import { ToastProvider } from '@/components/Toast';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { QueryProvider } from '@/contexts/QueryProvider';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { notificationService } from '@/services/notification.service';

// Custom dark theme with OLED optimized colors
const SpewpayDarkTheme = {
  // ... (keep same)
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#000000',
    card: '#111113',
    border: '#1E293B',
    primary: '#0066FF',
    text: '#F8FAFC',
  },
};

const SpewpayLightTheme = {
  // ... (keep same)
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#FFFFFF',
    card: '#FFFFFF',
    border: '#E2E8F0',
    primary: '#0066FF',
    text: '#0F172A',
  },
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  console.log('🔐 Auth State:', { isAuthenticated, isLoading, segments });

  useEffect(() => {
    notificationService.registerForPushNotificationsAsync();
  }, []);

  useEffect(() => {
    if (isLoading) {
      console.log('⏳ Still loading auth...');
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';
    console.log('🧭 Navigation check:', { inAuthGroup, isAuthenticated });

    if (!isAuthenticated && !inAuthGroup) {
      console.log('➡️ Redirecting to welcome');
      router.replace('/(auth)/welcome');
    } else if (isAuthenticated && inAuthGroup) {
      console.log('➡️ Redirecting to tabs');
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments]);

  // Show loading screen while checking auth
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000' }}>
        <ActivityIndicator size="large" color="#0066FF" />
        <Text style={{ color: '#64748B', marginTop: 16, fontSize: 14 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? SpewpayDarkTheme : SpewpayLightTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen
          name="deposit"
          options={{
            presentation: 'modal',
            title: 'Add Money',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="withdrawal"
          options={{
            presentation: 'modal',
            title: 'Withdraw to Bank',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="qr-code"
          options={{
            presentation: 'modal',
            title: 'QR Code',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="modal"
          options={{
            presentation: 'modal',
          }}
        />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  console.log('🚀 RootLayout rendering');
  return (
    <QueryProvider>
      <AuthProvider>
        <ToastProvider>
          <RootLayoutNav />
        </ToastProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
