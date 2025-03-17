import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlertService } from '../../../core/services/alert.service';
import { GLOBAL_ALERTS } from '../../../core/constants/global-alerts';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  imports: [Toast]
})
export class AlertComponent implements OnInit, OnDestroy {
  
  @Input() alertKey?: string;

  private unsubscribe: Subject<any> = new Subject();

  constructor(
    private alertService: AlertService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Assign a default value if alertKey is undefined
    this.alertKey = this.alertKey || this.router.url || 'default-alert-key';

    this.alertService
      .getAlerts()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((alertOptions) => {
        // if (!alertOptions) {
        //   return;
        // }

        // const key = alertOptions.key || this.alertKey;

        // // // multiple component instances, each only listens for its own key
        // // if (key !== this.alertKey) {
        // //   return;
        // // }

        // // clear request
        // if (alertOptions.clear) {
        //   this.messageService.clear(key as string);
        //   return;
        // }

        // // don't include global alerts
        // if (!alertOptions.includeGlobalAlerts && alertOptions.summary && GLOBAL_ALERTS.includes(alertOptions.summary)) {
        //   return;
        // }

        // regular message
        this.messageService.add({
          severity: alertOptions.type || 'info',
          summary: alertOptions.summary,
          detail: alertOptions.detail,
          life: 2000
        });
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next(0);
    this.unsubscribe.complete();
  }
}
