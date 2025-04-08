import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlertService } from '../../../core/services/alert.service';
import { Toast } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { ToastPositionType } from 'primeng/toast'; // Import the correct type

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  imports: [Toast, CommonModule]
})
export class AlertComponent implements OnInit, OnDestroy {
  
  @Input() alertKey?: string;
  isMobile = false;
  mobileBreakpoint = 768;
  toastClasses = '';
  toastPosition: ToastPositionType = 'bottom-center'; 

  private unsubscribe: Subject<any> = new Subject();

  constructor(
    private alertService: AlertService,
    private messageService: MessageService,
    private router: Router
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }

  ngOnInit(): void {
    this.alertKey = this.alertKey || this.router.url || 'default-alert-key';
    this.setupAlertSubscription();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next(0);
    this.unsubscribe.complete();
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth < this.mobileBreakpoint;
    this.toastPosition = this.isMobile ? 'bottom-center' : 'top-right';
    this.updateToastClasses();
  }

  private setupAlertSubscription() {
    this.checkScreenSize();
    this.alertService
    .getAlerts()
    .pipe(takeUntil(this.unsubscribe))
    .subscribe((alertOptions) => {
      this.messageService.add({
        severity: alertOptions.type || 'info',
        summary: alertOptions.summary,
        detail: alertOptions.detail,
        life: 4000,
      });
    });
  }

  private updateToastClasses() {
    const baseClasses = 'text-xs sm:text-xs md:text-sm w-[80vw] sm:w-[80vw] md:w-[25vw]';
    this.toastClasses = this.isMobile 
      ? `p-toast-text ${baseClasses}` 
      : baseClasses;
  }

}
