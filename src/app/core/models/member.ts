import { LoginType } from "./login-type.enum";
import { MemberAddress } from "./member-address";

export interface Member {
    memberId: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    profilePicUrl: string;
    birthDate: Date;
    loginType: LoginType;
    memberAddress: MemberAddress;
}

