import { useAuth } from '@/contexts';
import { orgService } from '@/services/org.service';
import type { Organization, OrgType } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const ORGS_KEY = ['organizations'];

export function useOrganizations() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const orgsQuery = useQuery({
        queryKey: ORGS_KEY,
        queryFn: () => orgService.getMyOrgs(user!.id),
        enabled: !!user?.id,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const createOrgMutation = useMutation({
        mutationFn: (data: { name: string; type: OrgType }) =>
            orgService.createOrg(user!.id, data),
        onSuccess: (newOrg) => {
            queryClient.setQueryData<Organization[]>(ORGS_KEY, (old) =>
                old ? [...old, newOrg] : [newOrg]
            );
        },
    });

    return {
        organizations: orgsQuery.data ?? [],
        isLoading: orgsQuery.isLoading,
        isRefreshing: orgsQuery.isRefetching,
        error: orgsQuery.error,
        refresh: () => queryClient.invalidateQueries({ queryKey: ORGS_KEY }),
        createOrg: createOrgMutation.mutateAsync,
        isCreating: createOrgMutation.isPending,
    };
}
