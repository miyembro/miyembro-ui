import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, Subscription, timer } from 'rxjs';
import { SessionService } from './session.service';
import { AuthenticationService } from './authentication.service';
import { SessionWarningComponent } from '../auth/components/session-warning/session-warning.component';
import { AlertService } from './alert.service';

@Injectable({ providedIn: 'root' })
export class SessionTimerService implements OnDestroy {
  private serviceDestroy$ = new Subject<void>();
  private stopTimer$ = new Subject<void>();
  private timerSub?: Subscription;
  private warningIsOpen = false;
  private logoutCalled = false;

  private readonly warningTime = 30;    // seconds before expiration
  private readonly checkInterval = 1000; // ms between checks

  constructor(
    private alertService: AlertService,
    private authenticationService: AuthenticationService,
    private sessionService: SessionService,
    private dialogService: DialogService,
    private router: Router,
  ) {}

  ngOnDestroy(): void {
    this.stopTimer$.next();
    this.serviceDestroy$.next();
    this.serviceDestroy$.complete();
  }

  /**
   * Start or restart the session countdown.
   */
  startTimer(): void {
    this.logoutCalled = false;
    this.stopTimer$.next();
    this.warningIsOpen = false;

    const expiration = this.getTokenExpiration();
    if (!expiration) {
      console.debug('SessionTimerService: no expiration, timer cancelled.');
      return;
    }

    this.timerSub = timer(0, this.checkInterval).subscribe(() => {
      const secondsLeft = Math.floor((expiration - Date.now()) / 1000);
      console.debug(`⏱️ seconds until expiration: ${secondsLeft}`);

      if (secondsLeft <= this.warningTime && !this.warningIsOpen) {
        this.maybeOpenWarning(secondsLeft);
      }
    });

    this.timerSub.add(
      this.stopTimer$.subscribe(() => this.timerSub?.unsubscribe())
    );
  }

  /**
   * Open the warning dialog once, pausing the timer.
   */
  private maybeOpenWarning(seconds: number): void {
    this.warningIsOpen = true;
    this.stopTimer$.next();
    this.timerSub?.unsubscribe();

    const ref = this.dialogService.open(SessionWarningComponent, {
      header: 'Session Expiring Soon',
      modal: true,
      contentStyle: { overflow: 'auto' },
      breakpoints: { '960px': '75vw', '640px': '90vw' },
      data: { seconds },
      closable: false
    });

    ref.onClose.subscribe((continueSession: boolean) => {
      this.warningIsOpen = false;
      if (continueSession) {
        this.refreshSession();
      } else {
        this.performLogout();
      }
    });
  }

  /**
   * Refresh the token and restart timer.
   */
  private refreshSession(): void {
    const token = this.sessionService.getSession()?.accessToken;
    if (!token) {
      return this.performLogout();
    }

    this.authenticationService.refreshToken(token).subscribe({
      next: newSession => {
        this.sessionService.setSession(newSession);
        this.startTimer();
        this.alertService.success(
          this.router.url,
          'Session Extended',
          'Your session has been renewed'
        );
      },
      error: () => this.performLogout()
    });
  }

  /**
   * Compute JWT expiration timestamp in ms.
   */
  private getTokenExpiration(): number | null {
    const token = this.sessionService.getSession()?.accessToken;
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000;
    } catch {
      return null;
    }
  }

  /**
   * Perform logout exactly once, closing all dialogs.
   */
  private performLogout(): void {
    if (this.logoutCalled) return;
    this.logoutCalled = true;

    // Stop countdown
    this.stopTimer$.next();
    this.timerSub?.unsubscribe();
    this.warningIsOpen = false;

    // Close all PrimeNG dialogs using built-in tracking
    this.dialogService.dialogComponentRefMap.forEach(ref => ref.destroy());

    // Backend logout
    this.authenticationService.logout().subscribe({
      next: () => {
        this.sessionService.clearSession();
        localStorage.removeItem('authToken');
        this.router.navigate(['/login']);
        this.alertService.success(
          this.router.url,
          'Logged Out',
          'You have been logged out'
        );
      },
      error: (err) => console.error('Logout error:', err)
    });
  }
}