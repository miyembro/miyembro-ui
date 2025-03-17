import { MembershipTypeValidity } from "./membership-type-validity";

export interface MembershipTypeRequest {
    membershipTypeId: string;
    organizationId: string;
    membershipTypeValidity: MembershipTypeValidity;
    name: string;
    description: string;
    isDefault: boolean;

}
