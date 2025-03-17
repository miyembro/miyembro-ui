import { MembershipTypeValidity } from "./membership-type-validity";

export interface MembershipType {
    membershipTypeId: string;
    organizationId: string;
    membershipTypeValidity: MembershipTypeValidity;
    name: string;
    description: string;
}
