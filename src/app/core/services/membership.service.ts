import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as env } from '@environments/environment';
import { MembershipResponse } from '../models/membership-response';
import { JoinOrganizationRequest } from '../models/join-membership-request';
import { MembershipRequest } from 'src/app/core/models/membership-request';
import { MembershipFilters } from 'src/app/core/models/membership-filters';
import { Page } from '../models/page';
import { UpdateMembershipRequests } from '../models/update-membership-requests';
import { ApproveMembershipsRequest } from '../models/approve-memberships-request';
import { DenyMembershipsRequest } from '../models/deny-memberships-request';

@Injectable({
  providedIn: 'root'
})
export class MembershipService {

  baseUrl = '/memberships';

  constructor(
    private http: HttpClient,
  ) {
    
  }

  approveMembershipRequest(organizationId: string | null, membership: MembershipRequest | undefined ) {
    return this.http.put(`${env.apiUrl}${this.baseUrl}/organizations/` + organizationId + '/memberships/' + membership?.membershipId + '/approve', membership) as Observable<MembershipResponse>;
  }

  approveMembershipRequests(organizationId: string | null, approveMembershipsRequest: ApproveMembershipsRequest | undefined ) {
    return this.http.put(`${env.apiUrl}${this.baseUrl}/organizations/` + organizationId + '/memberships/approve', approveMembershipsRequest) as Observable<MembershipResponse[]>;
  }

  deletMembershipFromOrganization(membership: MembershipRequest | undefined ) {
    return this.http.delete(`${env.apiUrl}${this.baseUrl}/organizations/` +  membership?.organizationId + '/memberships/' + membership?.membershipId) as Observable<string>;
  }

  deleteMembershipsFromOrganization(organizationId: string | null, memberships: MembershipRequest[]): Observable<string[]> {
    const url = `${env.apiUrl}${this.baseUrl}/organizations/`+ organizationId + '/memberships/delete';

    return this.http.delete<string[]>(url, {
      body: memberships,
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  deleteMembershipRequests(organizationId: string | null, memberships: MembershipRequest[]): Observable<string[]> {
    const url = `${env.apiUrl}${this.baseUrl}/organizations/`+ organizationId + '/memberships/delete-requests';

    return this.http.delete<string[]>(url, {
      body: memberships,
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  denyMembershipRequest(organizationId: string | null, membership: MembershipRequest | undefined ) {
    return this.http.put(`${env.apiUrl}${this.baseUrl}/organizations/` + organizationId + '/memberships/' + membership?.membershipId + '/deny', membership) as Observable<MembershipResponse>;
  }

  denyMembershipRequests(organizationId: string | null, denyMembershipsRequest: DenyMembershipsRequest | undefined ) {
    return this.http.put(`${env.apiUrl}${this.baseUrl}/organizations/` + organizationId + '/memberships/deny', denyMembershipsRequest) as Observable<MembershipResponse[]>;
  }
  
  getMembershipByMemberIdAndOrganizationId(organizationId: string | undefined, memberId: string | undefined): Observable<MembershipResponse> {
    return this.http.get(`${env.apiUrl}${this.baseUrl}/organizations/` + organizationId + '/members/' + memberId) as Observable<MembershipResponse>;
  }

  getMembershipsByOrganization(organizationId: string | undefined, pageNo: number | null, pageSize: number | null, sortField: string, sortOrder: string, membershipFilters: MembershipFilters | undefined ): Observable<Page<MembershipResponse>> {
    const url = `${env.apiUrl}${this.baseUrl}/organizations/${organizationId}/members`;

    let params = null;
    if(pageNo != null && pageSize != null) {
      params = new HttpParams()
      .set('pageNo', pageNo.toString())
      .set('pageSize', pageSize.toString())
      .set('sortField', sortField.toString())
      .set('sortOrder', sortOrder.toString());
    } else {
      params = new HttpParams()
      .set('sortField', sortField.toString())
      .set('sortOrder', sortOrder.toString());
    }
    return this.http.post<any>(url, membershipFilters, { params }) as Observable<Page<MembershipResponse>>;
  }

  getRequestsMembershipsByOrganization(organizationId: string | undefined, pageNo: number, pageSize: number, sortField: string, sortOrder: string , membershipFilters: MembershipFilters ): Observable<Page<MembershipResponse>> {
    const url = `${env.apiUrl}${this.baseUrl}/organizations/${organizationId}/members/requests`;

    const params = new HttpParams()
      .set('pageNo', pageNo.toString())
      .set('pageSize', pageSize.toString())
      .set('sortField', sortField.toString())
      .set('sortOrder', sortOrder.toString());
      return this.http.post<any>(url, membershipFilters, { params }) as Observable<Page<MembershipResponse>>;
  }

  requestMembership(joinOrganizationRequest: JoinOrganizationRequest | undefined): Observable<MembershipResponse> {
      return this.http.post(`${env.apiUrl}${this.baseUrl}/request`, joinOrganizationRequest) as Observable<MembershipResponse>;
  }

  updateMembershipFromOrganization(organizationId: string | null, membership: MembershipRequest | undefined ) {
    return this.http.put(`${env.apiUrl}${this.baseUrl}/organizations/` + organizationId + '/memberships/' + membership?.membershipId, membership) as Observable<MembershipResponse>;
  }

  updateMembershipsFromOrganization(organizationId: string | null, updateMembershipRequests: UpdateMembershipRequests) {
    return this.http.put(`${env.apiUrl}${this.baseUrl}/organizations/` + organizationId + '/memberships/update', updateMembershipRequests) as Observable<MembershipResponse[]>;
  }

}
