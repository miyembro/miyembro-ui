import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from '@environments/environment';
import { Observable } from 'rxjs';
import { EventRequest } from '../models/event-request';
import { EventResponse } from '../models/event-response';
import { EventSummaryResponse } from '../models/event-summary-response';
import { EventFilters } from '../models/event-filters';
import { Page } from '../models/page';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  baseUrl = '/events';

  constructor(
    private http: HttpClient,
  ) {
    
  }

  createEvent(organizationId: string, formData: FormData): Observable<any> {
    return this.http.post(
      `${env.apiUrl}${this.baseUrl}/organizations/` + organizationId,
      formData,
      { responseType: 'text' as 'json' } 
    );
  }

  getEvent(eventId: string): Observable<EventResponse> {
    return this.http.get(
      `${env.apiUrl}${this.baseUrl}/` + eventId
    ) as Observable<EventResponse>;
  }


  getEventsByOrganizationId(organizationId: string | undefined): Observable<EventSummaryResponse []> {
    return this.http.get(`${env.apiUrl}${this.baseUrl}/organizations/` + organizationId) as Observable<EventSummaryResponse []>;
  }

  getEventsByOrganizationIdPage(organizationId: string | undefined, pageNo: number, pageSize: number, sortField: string, sortOrder: string, eventFilters: EventFilters | undefined ): Observable<Page<EventSummaryResponse>> {
    const url = `${env.apiUrl}${this.baseUrl}/page/organizations/${organizationId}`;
    const params = new HttpParams()
      .set('pageNo', pageNo.toString())
      .set('pageSize', pageSize.toString())
      .set('sortField', sortField.toString())
      .set('sortOrder', sortOrder.toString());
      return this.http.post<any>(url, eventFilters, { params }) as Observable<Page<EventSummaryResponse>>;
  }

  updateEvent(organizationId: string | undefined, eventId: string, formData: FormData): Observable<EventResponse> {
    return this.http.put(
      `${env.apiUrl}${this.baseUrl}/organizations/` + organizationId + '/events/' + eventId,
      formData
    ) as Observable<EventResponse>;
  }
  
  
}
