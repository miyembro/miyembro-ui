import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { EventAttendanceRequest } from '../models/event-attendance-request';
import { EventConfirmationRequest } from '../models/event-confirmation-request';
import { EventConfirmationResponse } from '../models/event-confirmation-response';
import { environment as env } from '@environments/environment';
import { EventFilters } from '../models/event-filters';
import { Page } from '../models/page';
import { EventConfirmationFilters } from '../models/event-confirmation-filters';

@Injectable({
  providedIn: 'root'
})
export class EventConfirmationService {

  baseUrl = '/event-confirmations';

  private eventConfirmationUpdatedSource = new Subject<void>();
  eventConfirmationUpdated$ = this.eventConfirmationUpdatedSource.asObservable();

  constructor(
    private http: HttpClient,
  ) {
    
  }

  createEventConfirmation(memberId: string | undefined, eventId: string | undefined, eventConfirmationRequest: EventConfirmationRequest): Observable<EventConfirmationResponse> {
    return this.http.post<EventConfirmationResponse>(
      `${env.apiUrl}${this.baseUrl}/events/${eventId}/members/${memberId}`,
      eventConfirmationRequest
    ) as Observable<EventConfirmationResponse>;
  }

  createEventConfirmations(eventId: string, eventConfirmationRequests: EventConfirmationRequest []): Observable<EventConfirmationResponse []> {
    return this.http.post<EventConfirmationResponse []>(
      `${env.apiUrl}${this.baseUrl}/events/${eventId}`,
      eventConfirmationRequests
    ) as Observable<EventConfirmationResponse []>;
  }

  getEventConfirmation(organizationId: string | undefined, eventId: string | undefined, memberId: string | undefined): Observable<EventConfirmationResponse> {
    return this.http.get<EventConfirmationResponse>(
      `${env.apiUrl}${this.baseUrl}/organizations/${organizationId}/events/${eventId}/members/${memberId}`
    ) as Observable<EventConfirmationResponse>;
  }

  getEventConfirmations(eventId: string | undefined, pageNo: number | null, pageSize: number | null, sortField: string, sortOrder: string, eventConfirmationFilters: EventConfirmationFilters | undefined ): Observable<Page<EventConfirmationResponse>> {
    const url = `${env.apiUrl}${this.baseUrl}/page/events/${eventId}`;
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
      
    return this.http.post<any>(url, eventConfirmationFilters, { params }) as Observable<Page<EventConfirmationResponse>>;
  }

  notifyEventConfirmationUpdated(): void {
    this.eventConfirmationUpdatedSource.next();
  }

  updateEventConfirmation(memberId: string | undefined, eventConfirmationId: string | undefined, request: EventConfirmationRequest): Observable<EventConfirmationResponse> {
    return this.http.put<EventConfirmationResponse>(
      `${env.apiUrl}${this.baseUrl}/members/` + memberId + `/eventConfirmations/${eventConfirmationId}`,
      request
    ) as Observable<EventConfirmationResponse>;
  }

  updateEventConfirmations(eventId: string, eventConfirmationRequests: EventConfirmationRequest []): Observable<EventConfirmationResponse []> {
    return this.http.put<EventConfirmationResponse []>(
      `${env.apiUrl}${this.baseUrl}/events/` + eventId,
      eventConfirmationRequests
    ) as Observable<EventConfirmationResponse []>;
  }


  
}
