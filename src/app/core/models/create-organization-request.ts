import { MembershipType } from "./membership-type";
import { MembershipTypeRequest } from "./membership-type-request";
import { OrganizationRequest } from "./organization-request";

export interface CreateOrganizationRequest {
    organizationRequest: OrganizationRequest;
    membershipTypes: MembershipTypeRequest [];
  }