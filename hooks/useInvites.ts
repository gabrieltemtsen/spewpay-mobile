import { useAuth } from '@/contexts';
import { orgService } from '@/services/org.service';
import type { OrgRole } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const MY_INVITES_KEY = ['invites', 'my'];

export function useInvites(orgId?: string) {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const ORG_INVITES_KEY = orgId ? ['organization', orgId, 'invites'] : null;

    // Fetch user's pending invites
    const myInvitesQuery = useQuery({
        queryKey: MY_INVITES_KEY,
        queryFn: () => orgService.getMyInvites(user!.id, user?.email),
        enabled: !!user?.id,
    });

    // Fetch org's pending invites (for admins)
    const orgInvitesQuery = useQuery({
        queryKey: ORG_INVITES_KEY!,
        queryFn: () => orgService.getOrgInvites(orgId!, user!.id),
        enabled: !!orgId && !!user?.id,
    });

    // Accept invite
    const acceptMutation = useMutation({
        mutationFn: (inviteId: string) =>
            orgService.acceptInvite(inviteId, user!.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: MY_INVITES_KEY });
            queryClient.invalidateQueries({ queryKey: ['organizations'] });
        },
    });

    // Decline invite
    const declineMutation = useMutation({
        mutationFn: (inviteId: string) =>
            orgService.declineInvite(inviteId, user!.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: MY_INVITES_KEY });
        },
    });

    // Create invite (for admins)
    const createInviteMutation = useMutation({
        mutationFn: (data: { email: string; role: OrgRole; message?: string }) =>
            orgService.createInvite(orgId!, user!.id, data),
        onSuccess: () => {
            if (ORG_INVITES_KEY) {
                queryClient.invalidateQueries({ queryKey: ORG_INVITES_KEY });
            }
        },
    });

    return {
        // My invites
        myInvites: myInvitesQuery.data ?? [],
        myInvitesLoading: myInvitesQuery.isLoading,
        acceptInvite: acceptMutation.mutateAsync,
        declineInvite: declineMutation.mutateAsync,
        isAccepting: acceptMutation.isPending,
        isDeclining: declineMutation.isPending,

        // Org invites (admin view)
        orgInvites: orgInvitesQuery.data ?? [],
        orgInvitesLoading: orgInvitesQuery.isLoading,
        createInvite: createInviteMutation.mutateAsync,
        isCreatingInvite: createInviteMutation.isPending,

        // Refresh
        refreshMyInvites: () => queryClient.invalidateQueries({ queryKey: MY_INVITES_KEY }),
    };
}
