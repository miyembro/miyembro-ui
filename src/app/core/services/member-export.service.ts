import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MembershipFilters } from '../models/membership-filters';
import { MembershipResponse } from '../models/membership-response';
import { Page } from '../models/page';
import { environment as env } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MemberExportService {

  baseUrl = '/member-exports';
  
  constructor(
    private http: HttpClient,
  ) {
    
  }

  exportActiveMembers(organizationId: string | undefined): Observable<Blob> {
    const url = `${env.apiUrl}${this.baseUrl}/organizations/${organizationId}/members/excel/active`;
    return this.http.post(url, null, {
      responseType: 'blob'
    });
  }

  exportAllMembers(organizationId: string | undefined): Observable<Blob> {
    const url = `${env.apiUrl}${this.baseUrl}/organizations/${organizationId}/members/excel/all`;
    return this.http.post(url, null, {
      responseType: 'blob'
    });
  }

  exportMembers(organizationId: string | undefined, pageNo: number | null, pageSize: number | null, sortField: string, sortOrder: string, membershipFilters: MembershipFilters | undefined ): Observable<Blob> {
    const url = `${env.apiUrl}${this.baseUrl}/organizations/${organizationId}/members/excel/filtered`;

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
    console.log(params);

    return this.http.post(url, membershipFilters, {
      params: params,
      responseType: 'blob'
    });
  }

  exportSelectedMembers(organizationId: string | undefined, memberIds: string []): Observable<Blob> {
    const url = `${env.apiUrl}${this.baseUrl}/organizations/${organizationId}/members/excel/selected`;
    return this.http.post(url, memberIds, {
      responseType: 'blob'
    });
  }



}
