/**
 * Validation rules and schemas
 */

export const validators = {
    email: (value: string): string | null => {
        if (!value) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Invalid email address';
        return null;
    },

    password: (value: string): string | null => {
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        return null;
    },

    amount: (value: string | number): string | null => {
        const numValue = typeof value === 'string' ? parseFloat(value) : value;
        if (isNaN(numValue)) return 'Invalid amount';
        if (numValue <= 0) return 'Amount must be greater than 0';
        return null;
    },

    required: (value: any, fieldName: string = 'This field'): string | null => {
        if (!value || (typeof value === 'string' && !value.trim())) {
            return `${fieldName} is required`;
        }
        return null;
    },

    minLength: (value: string, min: number, fieldName: string = 'This field'): string | null => {
        if (value.length < min) {
            return `${fieldName} must be at least ${min} characters`;
        }
        return null;
    },

    maxLength: (value: string, max: number, fieldName: string = 'This field'): string | null => {
        if (value.length > max) {
            return `${fieldName} must be at most ${max} characters`;
        }
        return null;
    },

    phoneNumber: (value: string): string | null => {
        if (!value) return 'Phone number is required';
        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            return 'Invalid phone number';
        }
        return null;
    },
};

/**
 * Validate multiple fields at once
 */
export const validateFields = (
    fields: Record<string, any>,
    rules: Record<string, ((value: any) => string | null)[]>
): Record<string, string> => {
    const errors: Record<string, string> = {};

    Object.keys(rules).forEach((field) => {
        const fieldRules = rules[field];
        const value = fields[field];

        for (const rule of fieldRules) {
            const error = rule(value);
            if (error) {
                errors[field] = error;
                break; // Stop at first error
            }
        }
    });

    return errors;
};
