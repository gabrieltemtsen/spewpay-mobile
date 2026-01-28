import type {
    AddRuleRequest,
    Allocation,
    AllocationRule,
    CreateAllocationRequest,
    CreateOrgRequest,
    FundAllocationRequest,
    InviteMemberRequest,
    Organization,
    OrgInvite,
    OrgMember,
} from '@/types';
import apiClient from './api-client';

export const orgService = {
    // ============ Organization Operations ============

    /**
     * Create a new organization
     */
    async createOrg(data: CreateOrgRequest, userId: string): Promise<Organization> {
        const response = await apiClient.post<{ success: true; data: Organization }>(
            '/orgs',
            data,
            { params: { userId } }
        );
        return response.data.data;
    },

    /**
     * Get organizations the user belongs to
     */
    async getMyOrgs(userId: string): Promise<Organization[]> {
        const response = await apiClient.get<{ success: true; data: Organization[] }>(
            '/orgs/my',
            { params: { userId } }
        );
        return response.data.data;
    },

    /**
     * Get organization details
     */
    async getOrg(orgId: string): Promise<Organization> {
        const response = await apiClient.get<{ success: true; data: Organization }>(`/orgs/${orgId}`);
        return response.data.data;
    },

    // ============ Member Operations ============

    /**
     * Get organization members
     */
    async getMembers(orgId: string): Promise<OrgMember[]> {
        const response = await apiClient.get<{ success: true; data: OrgMember[] }>(
            `/orgs/${orgId}/members`
        );
        return response.data.data;
    },

    /**
     * Invite a member to organization
     */
    async inviteMember(
        orgId: string,
        data: InviteMemberRequest,
        inviterId: string
    ): Promise<OrgInvite> {
        const response = await apiClient.post<{ success: true; data: OrgInvite }>(
            `/orgs/${orgId}/invites`,
            data,
            { params: { userId: inviterId } }
        );
        return response.data.data;
    },

    /**
     * Get pending invites for user
     */
    async getMyInvites(userId: string, email: string): Promise<OrgInvite[]> {
        const response = await apiClient.get<{ success: true; data: OrgInvite[] }>(
            '/orgs/invites/my',
            { params: { userId, email } }
        );
        return response.data.data;
    },

    /**
     * Accept an invite
     */
    async acceptInvite(inviteId: string, userId: string): Promise<void> {
        await apiClient.post(`/invites/${inviteId}/accept`, { userId });
    },

    // ============ Allocation Operations ============

    /**
     * Create an allocation
     */
    async createAllocation(
        orgId: string,
        data: CreateAllocationRequest,
        userId: string
    ): Promise<Allocation> {
        const response = await apiClient.post<{ success: true; data: Allocation }>(
            `/orgs/${orgId}/allocations`,
            data,
            { params: { userId } }
        );
        return response.data.data;
    },

    /**
     * Get allocations for an org
     */
    async getAllocations(orgId: string): Promise<Allocation[]> {
        const response = await apiClient.get<{ success: true; data: Allocation[] }>(
            `/orgs/${orgId}/allocations`
        );
        return response.data.data;
    },

    /**
     * Get allocation details
     */
    async getAllocation(allocationId: string): Promise<Allocation> {
        const response = await apiClient.get<{ success: true; data: Allocation }>(
            `/allocations/${allocationId}`
        );
        return response.data.data;
    },

    /**
     * Fund an allocation from org wallet
     */
    async fundAllocation(
        allocationId: string,
        data: FundAllocationRequest,
        userId: string
    ): Promise<void> {
        await apiClient.post(`/allocations/${allocationId}/fund`, data, {
            params: { userId },
        });
    },

    // ============ Rules Operations ============

    /**
     * Add a spending rule
     */
    async addRule(
        allocationId: string,
        data: AddRuleRequest,
        userId: string
    ): Promise<AllocationRule> {
        const response = await apiClient.post<{ success: true; data: AllocationRule }>(
            `/allocations/${allocationId}/rules`,
            data,
            { params: { userId } }
        );
        return response.data.data;
    },

    /**
     * Get rules for an allocation
     */
    async getRules(allocationId: string): Promise<AllocationRule[]> {
        const response = await apiClient.get<{ success: true; data: AllocationRule[] }>(
            `/allocations/${allocationId}/rules`
        );
        return response.data.data;
    },

    /**
     * Toggle rule enabled state
     */
    async updateRule(
        ruleId: string,
        enabled: boolean,
        userId: string
    ): Promise<AllocationRule> {
        const response = await apiClient.patch<{ success: true; data: AllocationRule }>(
            `/rules/${ruleId}`,
            { enabled },
            { params: { userId } }
        );
        return response.data.data;
    },

    /**
     * Delete a rule
     */
    async deleteRule(ruleId: string, userId: string): Promise<void> {
        await apiClient.delete(`/rules/${ruleId}`, { params: { userId } });
    },
};
