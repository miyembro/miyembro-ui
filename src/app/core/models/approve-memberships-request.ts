import { MembershipRequest } from "./membership-request";
import { MembershipType } from "./membership-type";

export interface ApproveMembershipsRequest {
    membershipType: MembershipType | undefined;
    organizationId: string | null;
    membershipRequests: MembershipRequest []
}
