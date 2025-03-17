import { MembershipStatusRequest } from "src/app/core/models/membership-status-request";
import { Member } from "./member";
import { MembershipType } from "./membership-type";
import { Role } from "./role";

export interface MembershipRequest {
    membershipId: string;
    organizationId: string;
    member: Member;
    membershipType: MembershipType | undefined;
    membershipStatus: MembershipStatusRequest;
    startDate: Date;
    endDate: Date;
}

