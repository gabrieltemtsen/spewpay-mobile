// ============ Money Types ============

export interface MoneyAmount {
    kobo: string;  // bigint as string for precision
    naira: number; // for display
}

// ============ Wallet Types ============

export type WalletStatus = 'ACTIVE' | 'FROZEN' | 'CLOSED';

export interface Wallet {
    id: string;
    userId: string;
    currency: 'NGN';
    status: WalletStatus;
    balance: MoneyAmount;
    createdAt: string;
}

export interface WalletBalance {
    walletId: string;
    currency: 'NGN';
    cachedBalance: MoneyAmount;
    ledgerBalance: MoneyAmount;
}

// ============ Transaction Types ============

export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'REVERSAL';
export type TransactionStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REVERSED';

export interface Transaction {
    id: string;
    reference: string;
    type: TransactionType;
    status: TransactionStatus;
    amount: MoneyAmount;
    description: string | null;
    createdAt: string;
}

export interface LedgerEntry {
    id: string;
    transactionId: string;
    direction: 'CREDIT' | 'DEBIT';
    amount: MoneyAmount;
    balanceAfter: MoneyAmount;
    createdAt: string;
}

// ============ User Types ============

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    avatar?: string;
    createdAt: string;
}

// ============ Auth Types ============

export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

// ============ Deposit Types ============

export interface InitializeDepositRequest {
    userId: string;
    email: string;
    amountInNaira: number;
    callbackUrl?: string;
    idempotencyKey?: string;
}

export interface InitializeDepositResponse {
    success: true;
    data: {
        transactionId: string;
        reference: string;
        authorizationUrl: string;
        accessCode: string;
        amount: MoneyAmount;
    };
}

export interface VerifyDepositResponse {
    success: true;
    data: {
        transactionId: string;
        reference: string;
        status: TransactionStatus;
        amount: MoneyAmount;
    };
}

// ============ Bank Types ============

export interface Bank {
    id: number;
    name: string;
    code: string;
}

export interface ResolveAccountRequest {
    accountNumber: string;
    bankCode: string;
}

export interface ResolvedAccount {
    accountNumber: string;
    accountName: string;
    bankCode: string;
}

export interface BankAccount {
    id: string;
    bankName: string;
    bankCode: string;
    accountNumber: string;
    accountName: string;
    isDefault: boolean;
    isVerified: boolean;
}

export interface AddBankAccountRequest {
    userId: string;
    accountNumber: string;
    bankCode: string;
    isDefault?: boolean;
}

// ============ Withdrawal Types ============

export interface InitiateWithdrawalRequest {
    userId: string;
    recipientId: string;
    amountInNaira: number;
    reason?: string;
    idempotencyKey?: string;
}

export interface WithdrawalResponse {
    success: true;
    data: {
        transactionId: string;
        reference: string;
        status: TransactionStatus;
        amount: MoneyAmount;
    };
}

// ============ Transfer Types ============

export interface InternalTransferRequest {
    sourceUserId: string;
    destinationUserId: string;
    amountInNaira: number;
    description?: string;
    idempotencyKey?: string;
}

export interface TransferResponse {
    success: true;
    data: {
        transactionId: string;
        reference: string;
        status: TransactionStatus;
        amount: MoneyAmount;
    };
}

// ============ Organization Types ============

export type OrgType = 'COMPANY' | 'UNIVERSITY' | 'FAMILY' | 'COUPLE' | 'GROUP';
export type OrgRole = 'OWNER' | 'ADMIN' | 'MANAGER' | 'MEMBER';

export interface Organization {
    id: string;
    name: string;
    type: OrgType;
    walletId: string;
    balance?: MoneyAmount;
    createdAt: string;
}

export interface OrgMember {
    id: string;
    userId: string;
    role: OrgRole;
    user: User;
    joinedAt: string;
}

export interface OrgInvite {
    id: string;
    email: string;
    role: OrgRole;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
    message?: string;
    createdAt: string;
}

export interface CreateOrgRequest {
    name: string;
    type: OrgType;
}

export interface InviteMemberRequest {
    email: string;
    role: OrgRole;
    message?: string;
}

// ============ Allocation Types ============

export type AllocationStatus = 'ACTIVE' | 'FROZEN' | 'CLOSED';
export type RuleType = 'TXN_LIMIT' | 'DAILY_LIMIT' | 'TIME_LOCK' | 'WHITELIST_RECIPIENTS';

export interface Allocation {
    id: string;
    orgId: string;
    name: string;
    description?: string;
    walletId: string;
    status: AllocationStatus;
    balance?: MoneyAmount;
    createdAt: string;
}

export interface AllocationRule {
    id: string;
    allocationId: string;
    ruleType: RuleType;
    config: Record<string, unknown>;
    description?: string;
    enabled: boolean;
}

export interface CreateAllocationRequest {
    name: string;
    description?: string;
    managerMemberId?: string;
}

export interface FundAllocationRequest {
    amount: number; // in kobo
    description?: string;
}

export interface AddRuleRequest {
    ruleType: RuleType;
    config: Record<string, unknown>;
    description?: string;
}

// ============ Pagination Types ============

export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
}

// ============ API Response Types ============

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface ApiError {
    statusCode: number;
    message: string | string[];
    error: string;
}
