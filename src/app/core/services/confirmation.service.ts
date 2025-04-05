import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from '@environments/environment';
import { Observable } from 'rxjs';
import { RegistrationEmailConfirmationResponse } from '../models/registration-email-confirmation-response';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {
  private baseUrl = `${env.apiUrl}/confirmations`;

  constructor(private http: HttpClient) {}

  confirmMemberEmail(memberId: string): Observable<RegistrationEmailConfirmationResponse> {
    return this.http.put(
      `${this.baseUrl}/members/${memberId}/emails`,
      null
    ) as Observable<RegistrationEmailConfirmationResponse>;
  }
}