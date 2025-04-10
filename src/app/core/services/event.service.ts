import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from '@environments/environment';
import { Observable } from 'rxjs';
import { EventRequest } from '../models/event-request';
import { EventResponse } from '../models/event-response';

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

  getEventsByOrganizationId(organizationId: string | undefined): Observable<EventResponse []> {
    return this.http.get(`${env.apiUrl}${this.baseUrl}/organizations/` + organizationId) as Observable<EventResponse []>;
  }
  
  
}
