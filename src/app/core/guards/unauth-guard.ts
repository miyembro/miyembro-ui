import { Injectable } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { SessionService } from '../services/session.service';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnAuthGuard implements CanActivate {

  constructor(
    private authenticationService: AuthenticationService, 
    private router: Router,
    private sessionService: SessionService,
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const session = this.sessionService.getSession();
    if (this.sessionService.isLoggedIn()) {
      this.router.navigate(['/home/explore']);
      return false;
    } else {
      const token: string | null = localStorage.getItem('authToken');
      return this.authenticationService.getLoginSession(token).pipe(
        map((session) => {
          this.sessionService.setSession(session);
          if(session) {
            localStorage.setItem('authToken', session.accessToken);
          }
          this.router.navigate(['/']);
          return false;
        }),
        catchError(() => {
          return of(true);
        })
      );
    }
  }
}