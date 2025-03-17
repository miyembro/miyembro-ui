import { Injectable } from '@angular/core';
import { Session } from '../models/session';
import { Member } from '../models/member';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  organizationId: string | null = null;
  private session: Session | null = null; 

  clearSession(): void {
    this.session = null;
  }

  getSession(): Session | null {
    return this.session;
  }

  hasPermission(permissionName: string): boolean {
    return this.session?.permissions?.includes(permissionName) || false;
  }

  isLoggedIn(): boolean {
    const selectedOrganization = this.session?.organization;
    const organizationsOfMember = this.session?.organizationIdsOfMember;
    
    const notRegistered: boolean = selectedOrganization === null && organizationsOfMember === null;
    const onlyOneOrganization: boolean =  selectedOrganization !== null && (organizationsOfMember !== null && organizationsOfMember?.length == 1);
    const twoOrMoreOrganization: boolean = selectedOrganization !== null && (organizationsOfMember !== undefined && organizationsOfMember.length >= 2);

    return this.session !== null  && (notRegistered || onlyOneOrganization || twoOrMoreOrganization);
  }

  setSession(session: Session): void {
    this.session = session;
    if(this.session.organization?.organizationId) {
      this.organizationId = this.session.organization.organizationId;
    }
  }

  updateMember(member: Member) {
    if (this.session) {
      this.session.member = member;
    }
  }
  
}
