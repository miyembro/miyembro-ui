import { Injectable } from '@angular/core';
import { ConfirmDialogOptions } from '../models/confirm-dialog-options';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

   private confirmDialogSubject = new Subject<ConfirmDialogOptions>();
  
    clear(key?: string): void {
      this.setConfirmDialog({ key, clear: true });
    }
  
    getConfirmDialogs(): Observable<ConfirmDialogOptions> {
      return this.confirmDialogSubject.asObservable();
    }
  
    info(key: string, message: string, header: string, closable: boolean, acceptButtonLabel: string, accept: any) {
      this.setConfirmDialog({ key: key, type: 'info', message: message, header: header, icon: 'pi-info-circle', closable: closable, acceptButtonLabel: acceptButtonLabel, accept: null });
    }
  
    save(key: string, message: string, header: string, closable: boolean, acceptButtonLabel: string, event: Event, accept: any, reject: any) {
      this.setConfirmDialog({ key: key, type: 'save', message: message, header: header, icon: 'pi-exclamation-triangle', closable: closable,  acceptButtonLabel: acceptButtonLabel, event: event, accept: accept, reject: reject });
    }

    warning(key: string, message: string, header: string, closable: boolean, acceptButtonLabel: string, event: Event, accept: any, reject: any) {
      this.setConfirmDialog({ key: key, type: 'save', message: message, header: header, icon: 'pi-exclamation-triangle', closable: closable,  acceptButtonLabel: acceptButtonLabel, event: event, accept: accept, reject: reject, acceptButtonSeverity: 'danger' });
    }
  
    private setConfirmDialog(confirmDialogOptions: ConfirmDialogOptions): void {
      this.confirmDialogSubject.next(confirmDialogOptions);
    }
  }