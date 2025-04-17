import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { EventAttendanceRequest } from '../models/event-attendance-request';
import { EventConfirmationRequest } from '../models/event-confirmation-request';
import { EventConfirmationResponse } from '../models/event-confirmation-response';
import { environment as env } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventConfirmationService {

  baseUrl = '/event-confirmations';

  private eventUpdatedSource = new Subject<void>();
  eventUpdated$ = this.eventUpdatedSource.asObservable();

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

  getEventConfirmation(organizationId: string | undefined, eventId: string | undefined, memberId: string | undefined): Observable<EventConfirmationResponse> {
    return this.http.get<EventConfirmationResponse>(
      `${env.apiUrl}${this.baseUrl}/organizations/${organizationId}/events/${eventId}/members/${memberId}`
    ) as Observable<EventConfirmationResponse>;
  }

  updateEventConfirmation(memberId: string | undefined, eventConfirmationId: string | undefined, request: EventConfirmationRequest): Observable<EventConfirmationResponse> {
    return this.http.put<EventConfirmationResponse>(
      `${env.apiUrl}${this.baseUrl}/members/` + memberId + `/eventConfirmations/${eventConfirmationId}`,
      request
    ) as Observable<EventConfirmationResponse>;
  }
  
}
