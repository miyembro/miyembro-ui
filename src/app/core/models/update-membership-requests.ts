import { MembershipRequest } from "./membership-request";
import { MembershipStatusRequest } from "./membership-status-request";
import { MembershipType } from "./membership-type";
import { Role } from "./role";

export interface UpdateMembershipRequests {
    membershipType: MembershipType | undefined;
    membershipStatus: MembershipStatusRequest;
    role: Role;
    startDate: Date;
    endDate: Date;
    organizationId: string | null;
    membershipRequests: MembershipRequest []
}
