import { MembershipRequest } from "./membership-request";

export interface DenyMembershipsRequest {
    organizationId: string | null;
    membershipRequests: MembershipRequest []
}
