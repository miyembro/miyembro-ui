import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AlertOptions } from '../models/alert-options';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  
  private alertsSubject = new Subject<AlertOptions>();

  clear(key?: string): void {
    this.setAlert({ key, clear: true });
  }

  error(key: string, summary: string, detail: string) {
    this.setAlert({ key: key, type: 'error', summary: summary, detail: detail });
  }

  getAlerts(): Observable<AlertOptions> {
    return this.alertsSubject.asObservable();
  }

  info(key: string, summary: string, detail: string) {
    this.setAlert({ key: key, type: 'info', summary: summary, detail: detail });
  }

  success(key: string, summary: string, detail: string) {
    this.setAlert({ key: key, type: 'success', summary: summary, detail: detail });
  }

  private setAlert(alertOptions: AlertOptions): void {
    this.alertsSubject.next(alertOptions);
  }
}



  // error(error: ErrorResponse, opts?: { key?: string; includeGlobalAlerts?: boolean }): void {
  //   const alert = Object.assign(error, opts, { type: 'error' }) as AlertOptions;
  //   if(alert.detail) {
  //     alert.summary = "";
  //   }
  //   this.setAlert({ key: key, type: 'error', summary: summary, detail: detail });
  // }

  // info(detail: string, opts?: { key?: string; includeGlobalAlerts?: boolean }): void {
  //   const alert = Object.assign(detail, opts, { type: 'info' }) as AlertOptions;
  //   this.setAlert(alert);
  // }