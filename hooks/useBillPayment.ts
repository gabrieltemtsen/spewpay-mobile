import { useAuth } from '@/contexts';
import { BillCategory, BillPaymentRequest, BillProvider, billService, CablePlan, DataPlan } from '@/services/bill.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { v4 as uuid } from 'uuid';

export function useBillPayment() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [selectedCategory, setSelectedCategory] = useState<BillCategory | null>(null);
    const [selectedProvider, setSelectedProvider] = useState<BillProvider | null>(null);

    // Get providers for selected category
    const providers = selectedCategory ? billService.getProviders(selectedCategory) : [];

    // Get plans based on provider
    const dataPlans: DataPlan[] = selectedProvider?.category === 'data'
        ? billService.getDataPlans(selectedProvider.slug)
        : [];

    const cablePlans: CablePlan[] = selectedProvider?.category === 'cable'
        ? billService.getCablePlans(selectedProvider.slug)
        : [];

    // Verify customer mutation
    const verifyMutation = useMutation({
        mutationFn: ({ customerNumber }: { customerNumber: string }) =>
            billService.verifyCustomer(selectedCategory!, selectedProvider!.id, customerNumber),
    });

    // Pay bill mutation
    const payBillMutation = useMutation({
        mutationFn: (request: Omit<BillPaymentRequest, 'userId' | 'idempotencyKey'>) =>
            billService.payBill({
                ...request,
                userId: user!.id,
                idempotencyKey: uuid(),
            }),
        onSuccess: () => {
            // Invalidate wallet and transactions
            queryClient.invalidateQueries({ queryKey: ['wallet'] });
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        },
    });

    const selectCategory = useCallback((category: BillCategory) => {
        setSelectedCategory(category);
        setSelectedProvider(null);
    }, []);

    const selectProvider = useCallback((provider: BillProvider) => {
        setSelectedProvider(provider);
    }, []);

    const verifyCustomer = useCallback((customerNumber: string) => {
        return verifyMutation.mutateAsync({ customerNumber });
    }, [verifyMutation]);

    const payBill = useCallback(async (request: Omit<BillPaymentRequest, 'userId' | 'idempotencyKey' | 'category' | 'providerId'>) => {
        if (!selectedCategory || !selectedProvider) {
            throw new Error('Please select a category and provider');
        }
        return payBillMutation.mutateAsync({
            ...request,
            category: selectedCategory,
            providerId: selectedProvider.id,
        });
    }, [selectedCategory, selectedProvider, payBillMutation]);

    const reset = useCallback(() => {
        setSelectedCategory(null);
        setSelectedProvider(null);
        verifyMutation.reset();
        payBillMutation.reset();
    }, [verifyMutation, payBillMutation]);

    return {
        // State
        selectedCategory,
        selectedProvider,
        providers,
        dataPlans,
        cablePlans,

        // Actions
        selectCategory,
        selectProvider,
        verifyCustomer,
        payBill,
        reset,

        // Loading states
        isVerifying: verifyMutation.isPending,
        isPaying: payBillMutation.isPending,
        verifiedCustomer: verifyMutation.data,
        paymentResult: payBillMutation.data,
        verifyError: verifyMutation.error,
        paymentError: payBillMutation.error,
    };
}

export const BILL_CATEGORIES: { category: BillCategory; label: string; icon: string; color: string }[] = [
    { category: 'airtime', label: 'Airtime', icon: 'phone-portrait-outline', color: '#00E699' },
    { category: 'data', label: 'Data', icon: 'wifi-outline', color: '#0066FF' },
    { category: 'electricity', label: 'Electricity', icon: 'flash-outline', color: '#F59E0B' },
    { category: 'cable', label: 'Cable TV', icon: 'tv-outline', color: '#8B5CF6' },
];
