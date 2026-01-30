import { useAuth } from '@/contexts';
import { orgService } from '@/services/org.service';
import type { Organization, OrgRole } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useOrgDetails(orgId: string) {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const ORG_KEY = ['organization', orgId];
    const MEMBERS_KEY = ['organization', orgId, 'members'];
    const ALLOCATIONS_KEY = ['organization', orgId, 'allocations'];

    // Fetch organization details
    const orgQuery = useQuery({
        queryKey: ORG_KEY,
        queryFn: () => orgService.getOrg(orgId),
        enabled: !!orgId,
    });

    // Fetch members
    const membersQuery = useQuery({
        queryKey: MEMBERS_KEY,
        queryFn: () => orgService.getMembers(orgId),
        enabled: !!orgId,
    });

    // Fetch allocations
    const allocationsQuery = useQuery({
        queryKey: ALLOCATIONS_KEY,
        queryFn: () => orgService.getOrgAllocations(orgId),
        enabled: !!orgId,
    });

    // Update org mutation
    const updateOrgMutation = useMutation({
        mutationFn: (data: { name?: string }) =>
            orgService.updateOrg(orgId, user!.id, data),
        onSuccess: (updated) => {
            queryClient.setQueryData<Organization>(ORG_KEY, updated);
        },
    });

    // Update member role
    const updateMemberMutation = useMutation({
        mutationFn: ({ memberId, role }: { memberId: string; role: OrgRole }) =>
            orgService.updateMember(orgId, memberId, user!.id, { role }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: MEMBERS_KEY });
        },
    });

    // Remove member
    const removeMemberMutation = useMutation({
        mutationFn: (memberId: string) =>
            orgService.removeMember(orgId, memberId, user!.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: MEMBERS_KEY });
        },
    });

    return {
        // Organization
        organization: orgQuery.data,
        isLoading: orgQuery.isLoading,
        error: orgQuery.error,
        updateOrg: updateOrgMutation.mutateAsync,

        // Members
        members: membersQuery.data ?? [],
        membersLoading: membersQuery.isLoading,
        updateMemberRole: updateMemberMutation.mutateAsync,
        removeMember: removeMemberMutation.mutateAsync,

        // Allocations
        allocations: allocationsQuery.data ?? [],
        allocationsLoading: allocationsQuery.isLoading,

        // Refresh
        refresh: () => {
            queryClient.invalidateQueries({ queryKey: ORG_KEY });
            queryClient.invalidateQueries({ queryKey: MEMBERS_KEY });
            queryClient.invalidateQueries({ queryKey: ALLOCATIONS_KEY });
        },
    };
}
