import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications should be handled when the app is in foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export const notificationService = {
    /**
     * Register for push notifications and get the token
     */
    registerForPushNotificationsAsync: async (): Promise<string | undefined> => {
        let token;

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                console.log('Failed to get push token for push notification!');
                return;
            }

            try {
                const projectId = 'your-project-id'; // Should come from config
                token = (await Notifications.getExpoPushTokenAsync({
                    projectId,
                })).data;
                console.log('Push token:', token);
            } catch (e) {
                console.error('Error fetching push token', e);
            }
        } else {
            console.log('Must use physical device for Push Notifications');
        }

        return token;
    },

    /**
     * Send a local notification immediately
     */
    sendLocalNotification: async (title: string, body: string, data = {}) => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                data,
                sound: true,
            },
            trigger: null, // Send immediately
        });
    },

    /**
     * Schedule a notification for later
     */
    scheduleNotification: async (title: string, body: string, seconds: number, data = {}) => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                data,
            },
            trigger: { seconds } as any,
        });
    }
};
