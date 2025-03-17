import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MembershipTypeValidity } from '../models/membership-type-validity';
import { environment as env } from '@environments/environment';
import { MembershipType } from 'src/app/core/models/membership-type';

@Injectable({
  providedIn: 'root'
})
export class MembershipTypeService {

  baseUrl = '/membership-types';
  
  constructor(
      private http: HttpClient,
    ) {

  }

  getAllMembershipTypeValidity(): Observable<MembershipTypeValidity[]> {
    return this.http.get(`${env.apiUrl}${this.baseUrl}/validities`) as Observable<MembershipTypeValidity[]>;
  }

  getMembershipTypesByOrganizationId(organizationId: string | null | undefined): Observable<MembershipType[]> {
    return this.http.get(`${env.apiUrl}${this.baseUrl}/organizations/`+ organizationId) as Observable<MembershipType[]>;
  }

}
