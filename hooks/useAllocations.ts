import { useAuth } from '@/contexts';
import { orgService } from '@/services/org.service';
import type { Allocation } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useAllocations(orgId: string) {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const ALLOCATIONS_KEY = ['organization', orgId, 'allocations'];

    // Fetch all allocations for org
    const allocationsQuery = useQuery({
        queryKey: ALLOCATIONS_KEY,
        queryFn: () => orgService.getOrgAllocations(orgId),
        enabled: !!orgId,
    });

    // Create allocation
    const createMutation = useMutation({
        mutationFn: (data: {
            name: string;
            description?: string;
            managerMemberId: string;
            parentAllocationId?: string;
        }) => orgService.createAllocation(orgId, user!.id, data),
        onSuccess: (newAllocation) => {
            queryClient.setQueryData<Allocation[]>(ALLOCATIONS_KEY, (old) =>
                old ? [...old, newAllocation] : [newAllocation]
            );
        },
    });

    // Fund allocation from org wallet
    const fundMutation = useMutation({
        mutationFn: ({ allocationId, amount, description }: {
            allocationId: string;
            amount: number;
            description?: string;
        }) => orgService.fundFromOrg(allocationId, user!.id, { amount, description }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ALLOCATIONS_KEY });
        },
    });

    // Freeze allocation
    const freezeMutation = useMutation({
        mutationFn: (allocationId: string) =>
            orgService.freezeAllocation(allocationId, user!.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ALLOCATIONS_KEY });
        },
    });

    // Unfreeze allocation
    const unfreezeMutation = useMutation({
        mutationFn: (allocationId: string) =>
            orgService.unfreezeAllocation(allocationId, user!.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ALLOCATIONS_KEY });
        },
    });

    return {
        allocations: allocationsQuery.data ?? [],
        isLoading: allocationsQuery.isLoading,
        error: allocationsQuery.error,

        createAllocation: createMutation.mutateAsync,
        isCreating: createMutation.isPending,

        fundAllocation: fundMutation.mutateAsync,
        isFunding: fundMutation.isPending,

        freezeAllocation: freezeMutation.mutateAsync,
        unfreezeAllocation: unfreezeMutation.mutateAsync,

        refresh: () => queryClient.invalidateQueries({ queryKey: ALLOCATIONS_KEY }),
    };
}

// Hook for single allocation details
export function useAllocationDetails(allocationId: string) {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const ALLOCATION_KEY = ['allocation', allocationId];
    const RULES_KEY = ['allocation', allocationId, 'rules'];

    const allocationQuery = useQuery({
        queryKey: ALLOCATION_KEY,
        queryFn: () => orgService.getAllocation(allocationId),
        enabled: !!allocationId,
    });

    const rulesQuery = useQuery({
        queryKey: RULES_KEY,
        queryFn: () => orgService.getRules(allocationId),
        enabled: !!allocationId,
    });

    const updateMutation = useMutation({
        mutationFn: (data: { name?: string; description?: string }) =>
            orgService.updateAllocation(allocationId, user!.id, data),
        onSuccess: (updated) => {
            queryClient.setQueryData<Allocation>(ALLOCATION_KEY, updated);
        },
    });

    return {
        allocation: allocationQuery.data,
        isLoading: allocationQuery.isLoading,
        error: allocationQuery.error,

        rules: rulesQuery.data ?? [],
        rulesLoading: rulesQuery.isLoading,

        updateAllocation: updateMutation.mutateAsync,

        refresh: () => {
            queryClient.invalidateQueries({ queryKey: ALLOCATION_KEY });
            queryClient.invalidateQueries({ queryKey: RULES_KEY });
        },
    };
}
