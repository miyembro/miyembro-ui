import { LoginType } from "./login-type.enum";
import { MemberAddress } from "./member-address";

export interface MemberRequest {
    memberId: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    loginType: LoginType;
    memberAddress: MemberAddress;
}

