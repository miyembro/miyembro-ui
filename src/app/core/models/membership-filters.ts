export interface MembershipFilters {
    memberFirstName:string | null;
    memberEmail?: string | null;
    memberMemberAddressCity: string | null;
    memberMemberAddressCountry: string | null;
    membershipStatusNames?: any [] | null;
    membershipTypeNames?: any [] | null;
    roleNames?: any [] | null;
    startDates: Date [] | null;
    endDates: Date [] | null;
    memberIds?: (string | undefined) [];
}