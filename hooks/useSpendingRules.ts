import { useAuth } from '@/contexts';
import { orgService } from '@/services/org.service';
import type { RuleType, SpendingRule } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useSpendingRules(allocationId: string) {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const RULES_KEY = ['allocation', allocationId, 'rules'];

    // Fetch rules for allocation
    const rulesQuery = useQuery({
        queryKey: RULES_KEY,
        queryFn: () => orgService.getRules(allocationId),
        enabled: !!allocationId,
    });

    // Add new rule
    const addRuleMutation = useMutation({
        mutationFn: (data: {
            ruleType: RuleType | 'MONTHLY_LIMIT' | 'REQUIRES_APPROVAL';
            config: Record<string, unknown>;
            description?: string;
        }) => orgService.addRule(allocationId, user!.id, data as any),
        onSuccess: (newRule) => {
            queryClient.setQueryData<SpendingRule[]>(RULES_KEY, (old) =>
                old ? [...old, newRule] : [newRule]
            );
        },
    });

    // Update rule
    const updateRuleMutation = useMutation({
        mutationFn: ({ ruleId, data }: {
            ruleId: string;
            data: { config?: Record<string, unknown>; enabled?: boolean; description?: string };
        }) => orgService.updateRule(ruleId, user!.id, data),
        onSuccess: (updated) => {
            queryClient.setQueryData<SpendingRule[]>(RULES_KEY, (old) =>
                old ? old.map((r) => (r.id === updated.id ? updated : r)) : [updated]
            );
        },
    });

    // Delete rule
    const deleteRuleMutation = useMutation({
        mutationFn: (ruleId: string) => orgService.deleteRule(ruleId, user!.id),
        onSuccess: (_, deletedId) => {
            queryClient.setQueryData<SpendingRule[]>(RULES_KEY, (old) =>
                old ? old.filter((r) => r.id !== deletedId) : []
            );
        },
    });

    // Toggle rule enabled
    const toggleRule = async (ruleId: string, enabled: boolean) => {
        return updateRuleMutation.mutateAsync({ ruleId, data: { enabled } });
    };

    return {
        rules: rulesQuery.data ?? [],
        isLoading: rulesQuery.isLoading,
        error: rulesQuery.error,

        addRule: addRuleMutation.mutateAsync,
        isAdding: addRuleMutation.isPending,

        updateRule: updateRuleMutation.mutateAsync,
        isUpdating: updateRuleMutation.isPending,

        deleteRule: deleteRuleMutation.mutateAsync,
        isDeleting: deleteRuleMutation.isPending,

        toggleRule,

        refresh: () => queryClient.invalidateQueries({ queryKey: RULES_KEY }),
    };
}

// Rule type helpers
export const RULE_TYPE_INFO: Record<string, { label: string; icon: string; description: string }> = {
    TXN_LIMIT: {
        label: 'Transaction Limit',
        icon: 'card-outline',
        description: 'Maximum amount per transaction',
    },
    DAILY_LIMIT: {
        label: 'Daily Limit',
        icon: 'today-outline',
        description: 'Maximum spending per day',
    },
    MONTHLY_LIMIT: {
        label: 'Monthly Limit',
        icon: 'calendar-outline',
        description: 'Maximum spending per month',
    },
    TIME_LOCK: {
        label: 'Time Lock',
        icon: 'time-outline',
        description: 'Restrict spending to certain hours',
    },
    WHITELIST_RECIPIENTS: {
        label: 'Whitelist Recipients',
        icon: 'people-outline',
        description: 'Only allow payments to approved recipients',
    },
    REQUIRES_APPROVAL: {
        label: 'Requires Approval',
        icon: 'checkmark-circle-outline',
        description: 'Transactions need admin approval',
    },
};
