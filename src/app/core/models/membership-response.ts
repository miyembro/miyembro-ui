import { MembershipStatusResponse } from "src/app/core/models/membership-status-response";
import { Member } from "./member";
import { MembershipType } from "./membership-type";
import { Role } from "./role";

export interface MembershipResponse {
    membershipId: string;
    organizationId: string;
    member: Member;
    membershipType: MembershipType | undefined;
    membershipStatus: MembershipStatusResponse;
    role?: Role;
    startDate: Date;
    endDate: Date;
}

