import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmDialogService } from 'src/app/core/services/confirm-dialog.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-confirm-dialog',
  imports: [ConfirmDialogModule, ToastModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent implements OnInit, OnDestroy{

  @Input() confirmDialogKey?: string;
  
  private unsubscribe: Subject<any> = new Subject();

  constructor(
    private confirmDialogService: ConfirmDialogService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) {}

   ngOnInit(): void {
      // Assign a default value if alertKey is undefined
      this.confirmDialogKey = this.confirmDialogKey || this.router.url || 'default-alert-key';
  
      this.confirmDialogService
        .getConfirmDialogs()
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((confirmDialogOptions) => {
          this.confirmationService.confirm({
            target: confirmDialogOptions?.event ? confirmDialogOptions.event.target as EventTarget : undefined,
            message: confirmDialogOptions.message,
            header: confirmDialogOptions.header,
            closable: true,
            closeOnEscape: true,
            icon: 'pi ' + confirmDialogOptions.icon,
            rejectButtonProps: {
                label: 'Cancel',
                severity: 'secondary',
                size: 'small',
                raised: true
            },
            acceptButtonProps: {
                label: confirmDialogOptions.acceptButtonLabel,
                severity: confirmDialogOptions.acceptButtonSeverity ? confirmDialogOptions.acceptButtonSeverity : 'primary',
                size: 'small',
                raised: true
            },
            accept: confirmDialogOptions.accept,
            reject: confirmDialogOptions.reject
        });
        });
    }
  
    ngOnDestroy(): void {
      this.unsubscribe.next(0);
      this.unsubscribe.complete();
    }
}
