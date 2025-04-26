import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as env, environment } from '@environments/environment';
import { EventAttendanceSummary } from '../models/event-attendance-summary';
import { EventAttendanceSummaryResponse } from '../models/event-attendance-summary-response';

@Injectable({
  providedIn: 'root'
})
export class EventAttendanceSummaryService {


  baseUrl = '/event-attendance-summaries';

  constructor(
    private http: HttpClient,
  ) {
    
  }

  getEventAttendanceSummaries(eventId: string | undefined): Observable<EventAttendanceSummary[]> {
    return this.http.get<EventAttendanceSummary[]>(
      `${env.apiUrl}${this.baseUrl}/events/${eventId}`
    );
  }

  getEventAttendanceSummariesBetweenDates(
    startDate: Date, 
    endDate: Date
  ): Observable<EventAttendanceSummaryResponse[]> {

     // Clone dates to avoid mutation
    const start = new Date(startDate);
    const end = new Date(endDate);

    end.setHours(23, 59, 59, 999);

    const params = new HttpParams()
      .set('startDate', start.toISOString())
      .set('endDate', end.toISOString());

    return this.http.get<EventAttendanceSummaryResponse[]>(
      `${env.apiUrl}${this.baseUrl}/events/summary`,
      { params }
    );
  }

}
