import { Member } from "./member";
import { MembershipResponse } from "./membership-response";
import { OrganizationResponse } from "./organization-reponse";
import { Role } from "./role";

export interface Session {
    accessToken: string;
    tokenType: string;
    member: Member;
    role: Role;
    permissions: string [];
    organization: OrganizationResponse | undefined;
    organizationIdsOfMember: string[] | undefined;
    membership: MembershipResponse;
    isNewlyRegistered: boolean;
}
