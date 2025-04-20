import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from '@environments/environment';
import { Observable, Subject } from 'rxjs';
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

  private eventUpdatedSource = new Subject<void>();
  eventUpdated$ = this.eventUpdatedSource.asObservable();

  constructor(
    private http: HttpClient,
  ) {
    
  }

  createEvent(organizationId: string | undefined, formData: FormData): Observable<any> {
    return this.http.post(
      `${env.apiUrl}${this.baseUrl}/organizations/` + organizationId,
      formData,
      { responseType: 'text' as 'json' } 
    );
  }

  deleteEventByOrganization(organizationId: string | undefined, eventId: string | undefined): Observable<string> {
    return this.http.delete(
      `${env.apiUrl}${this.baseUrl}/organizations/` + organizationId + '/events/' + eventId,
      { responseType: 'text' as 'json' } 
    ) as Observable<string>;
  }

  deleteEventsByOrganization(
    organizationId: string | undefined,
    eventIds: string[]
  ): Observable<string[]> {
    return this.http.delete<string[]>(
      `${env.apiUrl}${this.baseUrl}/organizations/${organizationId}/events`,
      {
        body: eventIds
      }
    );
  }
  
  getEvent(eventId: string | undefined): Observable<EventResponse> {
    return this.http.get(
      `${env.apiUrl}${this.baseUrl}/` + eventId
    ) as Observable<EventResponse>;
  }

  getEventSummary(eventId: string | undefined): Observable<EventSummaryResponse> {
    return this.http.get(
      `${env.apiUrl}${this.baseUrl}/` + eventId + '/summary'
    ) as Observable<EventSummaryResponse>;
  }

  getEventsByOrganizationId(organizationId: string | undefined): Observable<EventSummaryResponse []> {
    return this.http.get(`${env.apiUrl}${this.baseUrl}/organizations/` + organizationId) as Observable<EventSummaryResponse []>;
  }

  getEventsByOrganizationIdPage(organizationId: string | undefined, pageNo: number | null, pageSize: number | null, sortField: string, sortOrder: string, eventFilters: EventFilters | undefined ): Observable<Page<EventSummaryResponse>> {
    const url = `${env.apiUrl}${this.baseUrl}/page/organizations/${organizationId}`;
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
    return this.http.post<any>(url, eventFilters, { params }) as Observable<Page<EventSummaryResponse>>;
  }

  notifyEventUpdated(): void {
    this.eventUpdatedSource.next();
  }

  updateEvent(organizationId: string | undefined, eventId: string, formData: FormData): Observable<EventResponse> {
    return this.http.put(
      `${env.apiUrl}${this.baseUrl}/organizations/` + organizationId + '/events/' + eventId,
      formData
    ) as Observable<EventResponse>;
  }
  
  
}
