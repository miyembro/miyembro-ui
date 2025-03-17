import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment as env } from '@environments/environment';
import { Observable } from "rxjs";
import { MembershipStatusResponse } from "src/app/core/models/membership-status-response";


@Injectable({
  providedIn: 'root'
})
export class MembershipStatusService {

  baseUrl = '/membership-statuses';

  constructor(
    private http: HttpClient,
  ) {
    
  }

  getApprovedMembershipStatuses(): Observable<MembershipStatusResponse[]> {
    return this.http.get(`${env.apiUrl}${this.baseUrl}/approved`, {}) as Observable<MembershipStatusResponse[]>;
  }

  getJoinReqqestsMembershipStatuses(): Observable<MembershipStatusResponse[]> {
    return this.http.get(`${env.apiUrl}${this.baseUrl}/join-requests`, {}) as Observable<MembershipStatusResponse[]>;
  }

}
