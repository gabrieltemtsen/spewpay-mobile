
export type BillCategory = 'airtime' | 'data' | 'electricity' | 'cable' | 'internet' | 'betting';

export interface BillProvider {
    id: string;
    name: string;
    slug: string;
    category: BillCategory;
    logo?: string;
    minAmount?: number;
    maxAmount?: number;
}

export interface DataPlan {
    id: string;
    name: string;
    price: number;
    validity: string;
    dataSize: string;
}

export interface CablePlan {
    id: string;
    name: string;
    price: number;
    duration: string;
}

export interface BillPaymentRequest {
    userId: string;
    category: BillCategory;
    providerId: string;
    amount: number;
    phoneNumber?: string;
    meterNumber?: string;
    smartcardNumber?: string;
    planId?: string;
    idempotencyKey?: string;
}

export interface BillPaymentResponse {
    success: boolean;
    transactionId: string;
    reference: string;
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    amount: number;
    token?: string; // For electricity prepaid
}

// Mock providers
const AIRTIME_PROVIDERS: BillProvider[] = [
    { id: 'mtn', name: 'MTN', slug: 'mtn', category: 'airtime', minAmount: 50, maxAmount: 50000 },
    { id: 'glo', name: 'Glo', slug: 'glo', category: 'airtime', minAmount: 50, maxAmount: 50000 },
    { id: 'airtel', name: 'Airtel', slug: 'airtel', category: 'airtime', minAmount: 50, maxAmount: 50000 },
    { id: '9mobile', name: '9mobile', slug: '9mobile', category: 'airtime', minAmount: 50, maxAmount: 50000 },
];

const DATA_PROVIDERS: BillProvider[] = [
    { id: 'mtn-data', name: 'MTN Data', slug: 'mtn', category: 'data' },
    { id: 'glo-data', name: 'Glo Data', slug: 'glo', category: 'data' },
    { id: 'airtel-data', name: 'Airtel Data', slug: 'airtel', category: 'data' },
    { id: '9mobile-data', name: '9mobile Data', slug: '9mobile', category: 'data' },
];

const ELECTRICITY_PROVIDERS: BillProvider[] = [
    { id: 'ikeja', name: 'Ikeja Electric', slug: 'ikeja', category: 'electricity' },
    { id: 'eko', name: 'Eko Electric', slug: 'eko', category: 'electricity' },
    { id: 'abuja', name: 'Abuja Electric', slug: 'abuja', category: 'electricity' },
    { id: 'ibadan', name: 'Ibadan Electric', slug: 'ibadan', category: 'electricity' },
    { id: 'enugu', name: 'Enugu Electric', slug: 'enugu', category: 'electricity' },
    { id: 'ph', name: 'Port Harcourt Electric', slug: 'ph', category: 'electricity' },
];

const CABLE_PROVIDERS: BillProvider[] = [
    { id: 'dstv', name: 'DSTV', slug: 'dstv', category: 'cable' },
    { id: 'gotv', name: 'GOtv', slug: 'gotv', category: 'cable' },
    { id: 'startimes', name: 'StarTimes', slug: 'startimes', category: 'cable' },
];

const DATA_PLANS: Record<string, DataPlan[]> = {
    'mtn': [
        { id: 'mtn-1gb', name: '1GB', price: 300, validity: '1 day', dataSize: '1GB' },
        { id: 'mtn-2gb', name: '2GB', price: 500, validity: '2 days', dataSize: '2GB' },
        { id: 'mtn-5gb', name: '5GB', price: 1500, validity: '30 days', dataSize: '5GB' },
        { id: 'mtn-10gb', name: '10GB', price: 3000, validity: '30 days', dataSize: '10GB' },
        { id: 'mtn-20gb', name: '20GB', price: 5000, validity: '30 days', dataSize: '20GB' },
    ],
    'glo': [
        { id: 'glo-1gb', name: '1GB', price: 250, validity: '1 day', dataSize: '1GB' },
        { id: 'glo-2gb', name: '2GB', price: 500, validity: '2 days', dataSize: '2GB' },
        { id: 'glo-5gb', name: '5GB', price: 1500, validity: '30 days', dataSize: '5GB' },
    ],
    'airtel': [
        { id: 'airtel-1gb', name: '1GB', price: 300, validity: '1 day', dataSize: '1GB' },
        { id: 'airtel-2gb', name: '2GB', price: 500, validity: '2 days', dataSize: '2GB' },
        { id: 'airtel-6gb', name: '6GB', price: 1500, validity: '7 days', dataSize: '6GB' },
    ],
    '9mobile': [
        { id: '9mobile-1gb', name: '1GB', price: 300, validity: '1 day', dataSize: '1GB' },
        { id: '9mobile-2gb', name: '2.5GB', price: 500, validity: '2 days', dataSize: '2.5GB' },
    ],
};

const CABLE_PLANS: Record<string, CablePlan[]> = {
    'dstv': [
        { id: 'dstv-padi', name: 'DStv Padi', price: 2500, duration: '1 month' },
        { id: 'dstv-yanga', name: 'DStv Yanga', price: 3500, duration: '1 month' },
        { id: 'dstv-confam', name: 'DStv Confam', price: 6200, duration: '1 month' },
        { id: 'dstv-compact', name: 'DStv Compact', price: 10500, duration: '1 month' },
        { id: 'dstv-compact-plus', name: 'DStv Compact Plus', price: 16600, duration: '1 month' },
        { id: 'dstv-premium', name: 'DStv Premium', price: 24500, duration: '1 month' },
    ],
    'gotv': [
        { id: 'gotv-smallie', name: 'GOtv Smallie', price: 1100, duration: '1 month' },
        { id: 'gotv-jinja', name: 'GOtv Jinja', price: 2250, duration: '1 month' },
        { id: 'gotv-jolli', name: 'GOtv Jolli', price: 3300, duration: '1 month' },
        { id: 'gotv-max', name: 'GOtv Max', price: 4850, duration: '1 month' },
        { id: 'gotv-supa', name: 'GOtv Supa', price: 6400, duration: '1 month' },
    ],
    'startimes': [
        { id: 'startimes-nova', name: 'Nova', price: 1200, duration: '1 month' },
        { id: 'startimes-basic', name: 'Basic', price: 1850, duration: '1 month' },
        { id: 'startimes-smart', name: 'Smart', price: 2600, duration: '1 month' },
        { id: 'startimes-classic', name: 'Classic', price: 2750, duration: '1 month' },
    ],
};

export const billService = {
    // Get providers by category
    getProviders(category: BillCategory): BillProvider[] {
        switch (category) {
            case 'airtime':
                return AIRTIME_PROVIDERS;
            case 'data':
                return DATA_PROVIDERS;
            case 'electricity':
                return ELECTRICITY_PROVIDERS;
            case 'cable':
                return CABLE_PROVIDERS;
            default:
                return [];
        }
    },

    // Get data plans for a provider
    getDataPlans(providerSlug: string): DataPlan[] {
        return DATA_PLANS[providerSlug] || [];
    },

    // Get cable plans for a provider
    getCablePlans(providerSlug: string): CablePlan[] {
        return CABLE_PLANS[providerSlug] || [];
    },

    // Verify meter/smartcard number  
    async verifyCustomer(category: BillCategory, providerId: string, customerNumber: string): Promise<{ name: string; address?: string }> {
        // In production, this would call the actual API
        // For now, return mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
            name: 'John Doe',
            address: '123 Lagos Street, Lagos',
        };
    },

    // Process bill payment
    async payBill(request: BillPaymentRequest): Promise<BillPaymentResponse> {
        // In production, this would call the actual API
        // POST /bills/pay
        // For now, simulate success
        await new Promise(resolve => setTimeout(resolve, 2000));

        return {
            success: true,
            transactionId: `TXN${Date.now()}`,
            reference: `REF${Date.now()}`,
            status: 'COMPLETED',
            amount: request.amount,
            token: request.category === 'electricity' ? '1234-5678-9012-3456' : undefined,
        };
    },
};
