import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function AuthLayout() {
    return (
        <View className="flex-1 bg-background-dark">
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: 'transparent' },
                    animation: 'slide_from_right',
                }}
            >
                <Stack.Screen name="welcome" />
                <Stack.Screen name="login" />
                <Stack.Screen name="signup" />
            </Stack>
        </View>
    );
}
