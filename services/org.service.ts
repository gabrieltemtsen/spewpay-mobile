import type {
    Allocation,
    Organization,
    OrgInvite,
    OrgMember,
    OrgRole,
    OrgType,
    SpendingRule
} from '@/types';
import apiClient from './api-client';

export const orgService = {
    // ============ ORGANIZATIONS ============

    /**
     * Create a new organization
     * POST /orgs?userId=xxx
     */
    async createOrg(
        userId: string,
        data: { name: string; type: OrgType; metadata?: object }
    ): Promise<Organization> {
        const response = await apiClient.post<Organization>('/orgs', data, {
            params: { userId },
        });
        return response.data;
    },

    /**
     * Get organizations for current user
     * GET /orgs/my?userId=xxx
     */
    async getMyOrgs(userId: string): Promise<Organization[]> {
        const response = await apiClient.get<Organization[]>('/orgs/my', {
            params: { userId },
        });
        return response.data;
    },

    /**
     * Get organization details
     * GET /orgs/{orgId}
     */
    async getOrg(orgId: string): Promise<Organization> {
        const response = await apiClient.get<Organization>(`/orgs/${orgId}`);
        return response.data;
    },

    /**
     * Update organization
     * PATCH /orgs/{orgId}?userId=xxx
     */
    async updateOrg(
        orgId: string,
        userId: string,
        data: { name?: string; metadata?: object }
    ): Promise<Organization> {
        const response = await apiClient.patch<Organization>(`/orgs/${orgId}`, data, {
            params: { userId },
        });
        return response.data;
    },

    // ============ INVITES ============

    /**
     * Create invitation to join org
     * POST /orgs/{orgId}/invites?userId=xxx
     */
    async createInvite(
        orgId: string,
        userId: string,
        data: { email?: string; phone?: string; userId?: string; role: OrgRole; message?: string }
    ): Promise<OrgInvite> {
        const response = await apiClient.post<OrgInvite>(`/orgs/${orgId}/invites`, data, {
            params: { userId },
        });
        return response.data;
    },

    /**
     * Get pending invites for org
     * GET /orgs/{orgId}/invites?userId=xxx
     */
    async getOrgInvites(orgId: string, userId: string): Promise<OrgInvite[]> {
        const response = await apiClient.get<OrgInvite[]>(`/orgs/${orgId}/invites`, {
            params: { userId },
        });
        return response.data;
    },

    /**
     * Get invites for current user
     * GET /orgs/invites/my?userId=xxx
     */
    async getMyInvites(userId: string, email?: string): Promise<OrgInvite[]> {
        const response = await apiClient.get<OrgInvite[]>('/orgs/invites/my', {
            params: { userId, email },
        });
        return response.data;
    },

    /**
     * Accept an invitation
     * POST /orgs/invites/{inviteId}/accept
     */
    async acceptInvite(inviteId: string, userId: string): Promise<void> {
        await apiClient.post(`/orgs/invites/${inviteId}/accept`, { userId });
    },

    /**
     * Decline an invitation
     * POST /orgs/invites/{inviteId}/decline?userId=xxx
     */
    async declineInvite(inviteId: string, userId: string): Promise<void> {
        await apiClient.post(`/orgs/invites/${inviteId}/decline`, null, {
            params: { userId },
        });
    },

    // ============ MEMBERS ============

    /**
     * Get org members
     * GET /orgs/{orgId}/members
     */
    async getMembers(orgId: string): Promise<OrgMember[]> {
        const response = await apiClient.get<OrgMember[]>(`/orgs/${orgId}/members`);
        return response.data;
    },

    /**
     * Update member role
     * PATCH /orgs/{orgId}/members/{memberId}?userId=xxx
     */
    async updateMember(
        orgId: string,
        memberId: string,
        userId: string,
        data: { role: OrgRole }
    ): Promise<OrgMember> {
        const response = await apiClient.patch<OrgMember>(
            `/orgs/${orgId}/members/${memberId}`,
            data,
            { params: { userId } }
        );
        return response.data;
    },

    /**
     * Remove member from org
     * DELETE /orgs/{orgId}/members/{memberId}?userId=xxx
     */
    async removeMember(orgId: string, memberId: string, userId: string): Promise<void> {
        await apiClient.delete(`/orgs/${orgId}/members/${memberId}`, {
            params: { userId },
        });
    },

    // ============ ALLOCATIONS ============

    /**
     * Create an allocation in an organization
     * POST /orgs/{orgId}/allocations?userId=xxx
     */
    async createAllocation(
        orgId: string,
        userId: string,
        data: {
            name: string;
            description?: string;
            managerMemberId: string;
            parentAllocationId?: string;
            metadata?: object;
        }
    ): Promise<Allocation> {
        const response = await apiClient.post<Allocation>(`/orgs/${orgId}/allocations`, data, {
            params: { userId },
        });
        return response.data;
    },

    /**
     * Get all allocations for an organization
     * GET /orgs/{orgId}/allocations
     */
    async getOrgAllocations(orgId: string): Promise<Allocation[]> {
        const response = await apiClient.get<Allocation[]>(`/orgs/${orgId}/allocations`);
        return response.data;
    },

    /**
     * Get allocation details
     * GET /allocations/{allocationId}
     */
    async getAllocation(allocationId: string): Promise<Allocation> {
        const response = await apiClient.get<Allocation>(`/allocations/${allocationId}`);
        return response.data;
    },

    /**
     * Update an allocation
     * PATCH /allocations/{allocationId}?userId=xxx
     */
    async updateAllocation(
        allocationId: string,
        userId: string,
        data: { name?: string; description?: string; managerMemberId?: string; metadata?: object }
    ): Promise<Allocation> {
        const response = await apiClient.patch<Allocation>(`/allocations/${allocationId}`, data, {
            params: { userId },
        });
        return response.data;
    },

    /**
     * Freeze an allocation
     * POST /allocations/{allocationId}/freeze?userId=xxx
     */
    async freezeAllocation(allocationId: string, userId: string): Promise<void> {
        await apiClient.post(`/allocations/${allocationId}/freeze`, null, {
            params: { userId },
        });
    },

    /**
     * Unfreeze an allocation
     * POST /allocations/{allocationId}/unfreeze?userId=xxx
     */
    async unfreezeAllocation(allocationId: string, userId: string): Promise<void> {
        await apiClient.post(`/allocations/${allocationId}/unfreeze`, null, {
            params: { userId },
        });
    },

    /**
     * Fund allocation from org wallet
     * POST /allocations/{allocationId}/fund?userId=xxx
     */
    async fundFromOrg(
        allocationId: string,
        userId: string,
        data: { amount: number; description?: string }
    ): Promise<void> {
        await apiClient.post(`/allocations/${allocationId}/fund`, data, {
            params: { userId },
        });
    },

    /**
     * Fund allocation from parent allocation
     * POST /allocations/{allocationId}/fund-from-parent?userId=xxx
     */
    async fundFromParent(
        allocationId: string,
        userId: string,
        data: { amount: number; description?: string }
    ): Promise<void> {
        await apiClient.post(`/allocations/${allocationId}/fund-from-parent`, data, {
            params: { userId },
        });
    },

    // ============ SPENDING RULES ============

    /**
     * Add a spending rule to an allocation
     * POST /allocations/{allocationId}/rules?userId=xxx
     */
    async addRule(
        allocationId: string,
        userId: string,
        data: {
            ruleType: 'TXN_LIMIT' | 'DAILY_LIMIT' | 'MONTHLY_LIMIT' | 'TIME_LOCK' | 'WHITELIST_RECIPIENTS' | 'REQUIRES_APPROVAL';
            config: object;
            description?: string;
        }
    ): Promise<SpendingRule> {
        const response = await apiClient.post<SpendingRule>(
            `/allocations/${allocationId}/rules`,
            data,
            { params: { userId } }
        );
        return response.data;
    },

    /**
     * Get all rules for an allocation
     * GET /allocations/{allocationId}/rules
     */
    async getRules(allocationId: string): Promise<SpendingRule[]> {
        const response = await apiClient.get<SpendingRule[]>(`/allocations/${allocationId}/rules`);
        return response.data;
    },

    /**
     * Update a spending rule
     * PATCH /rules/{ruleId}?userId=xxx
     */
    async updateRule(
        ruleId: string,
        userId: string,
        data: { config?: object; enabled?: boolean; description?: string }
    ): Promise<SpendingRule> {
        const response = await apiClient.patch<SpendingRule>(`/rules/${ruleId}`, data, {
            params: { userId },
        });
        return response.data;
    },

    /**
     * Delete a spending rule
     * DELETE /rules/{ruleId}?userId=xxx
     */
    async deleteRule(ruleId: string, userId: string): Promise<void> {
        await apiClient.delete(`/rules/${ruleId}`, {
            params: { userId },
        });
    },
};
