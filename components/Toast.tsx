import { Ionicons } from '@expo/vector-icons';
import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

interface ToastContextValue {
    showToast: (message: string, type?: ToastType, duration?: number) => void;
    hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'info', duration = 3000) => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, message, type, duration }]);

        setTimeout(() => {
            hideToast(id);
        }, duration);
    }, []);

    const hideToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            {children}
            <View style={styles.container}>
                {toasts.map(toast => (
                    <ToastItem key={toast.id} toast={toast} onHide={hideToast} />
                ))}
            </View>
        </ToastContext.Provider>
    );
};

interface ToastItemProps {
    toast: Toast;
    onHide: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onHide }) => {
    const opacity = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.sequence([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.delay(toast.duration || 3000),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => onHide(toast.id));
    }, []);

    const getStyles = () => {
        switch (toast.type) {
            case 'success':
                return { bg: '#00E699', icon: 'checkmark-circle' as const };
            case 'error':
                return { bg: '#EF4444', icon: 'alert-circle' as const };
            case 'warning':
                return { bg: '#F59E0B', icon: 'warning' as const };
            default:
                return { bg: '#0066FF', icon: 'information-circle' as const };
        }
    };

    const { bg, icon } = getStyles();

    return (
        <Animated.View style={[styles.toast, { backgroundColor: bg, opacity }]}>
            <Ionicons name={icon} size={20} color="#FFFFFF" />
            <Text style={styles.message}>{toast.message}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 60,
        left: 16,
        right: 16,
        zIndex: 9999,
    },
    toast: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    message: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 12,
        flex: 1,
    },
});
