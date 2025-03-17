import { Injectable } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { SessionService } from '../services/session.service';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authenticationService: AuthenticationService, 
    private router: Router,
    private sessionService: SessionService,
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.sessionService.isLoggedIn()) {
      return true;
    } else {
      const token: string | null = localStorage.getItem('authToken');
      return this.authenticationService.getLoginSession(token).pipe(
        map((session) => {
          this.sessionService.setSession(session);
          if(session) {
            localStorage.setItem('authToken', session.accessToken);
          }
          return true;
        }),
        catchError(() => {
          this.router.navigate(['/login']);
          return of(false);
        })
      );
    }
  }
}