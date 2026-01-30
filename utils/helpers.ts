/**
 * Format currency in Nigerian Naira
 */
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
    }).format(amount);
};

/**
 * Format date to readable string
 */
export const formatDate = (dateStr: string | Date, format: 'short' | 'long' = 'short'): string => {
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    }

    if (format === 'short') {
        return date.toLocaleDateString('en-NG', {
            month: 'short',
            day: 'numeric',
        });
    }

    return date.toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

/**
 * Format time to readable string
 */
export const formatTime = (dateStr: string | Date): string => {
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    return date.toLocaleTimeString('en-NG', {
        hour: '2-digit',
        minute: '2-digit',
    });
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Mask email for display (e.g., j***@example.com)
 */
export const maskEmail = (email: string): string => {
    const [name, domain] = email.split('@');
    if (!name || !domain) return email;
    const maskedName = name.charAt(0) + '***';
    return `${maskedName}@${domain}`;
};

/**
 * Truncate text with ellipsis
 */
export const truncate = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
};

/**
 * Generate initials from name
 */
export const getInitials = (name: string): string => {
    return name
        .split(' ')
        .map((n) => n.charAt(0))
        .join('')
        .substring(0, 2)
        .toUpperCase();
};

/**
 * Sleep/delay utility
 */
export const sleep = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
