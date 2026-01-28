import { Stack } from 'expo-router';
import { Dimensions, StyleSheet, View } from 'react-native';

const { height: screenHeight } = Dimensions.get('window');

export default function AuthLayout() {
    return (
        <View style={styles.container}>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000A1A',
        minHeight: screenHeight,
    },
});
