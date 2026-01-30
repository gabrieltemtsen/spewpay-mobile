/**
 * Logger utility for consistent logging across the app
 */

const isDevelopment = __DEV__;

class Logger {
    private prefix = '[SpewPay]';

    info(message: string, ...args: any[]) {
        if (isDevelopment) {
            console.log(`${this.prefix} ℹ️`, message, ...args);
        }
    }

    warn(message: string, ...args: any[]) {
        if (isDevelopment) {
            console.warn(`${this.prefix} ⚠️`, message, ...args);
        }
    }

    error(message: string, error?: any) {
        console.error(`${this.prefix} ❌`, message, error);
        // TODO: Send to error tracking service (Sentry, etc.)
    }

    debug(message: string, ...args: any[]) {
        if (isDevelopment) {
            console.debug(`${this.prefix} 🐛`, message, ...args);
        }
    }

    success(message: string, ...args: any[]) {
        if (isDevelopment) {
            console.log(`${this.prefix} ✅`, message, ...args);
        }
    }

    api(method: string, endpoint: string, data?: any) {
        if (isDevelopment) {
            console.log(`${this.prefix} 🌐 API ${method}`, endpoint, data);
        }
    }
}

export const logger = new Logger();
