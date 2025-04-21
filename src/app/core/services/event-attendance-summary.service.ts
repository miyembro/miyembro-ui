import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as env } from '@environments/environment';
import { EventAttendanceSummary } from '../models/event-attendance-summary';

@Injectable({
  providedIn: 'root'
})
export class EventAttendanceSummaryService {


  baseUrl = '/event-attendance-summaries';

  constructor(
    private http: HttpClient,
  ) {
    
  }

  getEventAttendanceSummaries(eventId: string): Observable<EventAttendanceSummary[]> {
    return this.http.get<EventAttendanceSummary[]>(
      `${env.apiUrl}${this.baseUrl}/events/${eventId}`
    );
  }

}
