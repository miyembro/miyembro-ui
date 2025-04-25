import { HttpHandler, HttpHandlerFn, HttpInterceptor, HttpInterceptorFn, HttpRequest, HttpXsrfTokenExtractor } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { SessionService } from "../services/session.service";
import { environment as env } from '@environments/environment';
import { catchError, EMPTY, throwError } from "rxjs";
import { Router } from "@angular/router";
import { AlertService } from "../services/alert.service";
import { LoaderService } from "../services/loader.service";

export const JwtTokenInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const tokenService = inject(SessionService);
  const router = inject(Router);
  const alertService = inject(AlertService);
  const loaderService = inject(LoaderService);

  const authToken = tokenService.getSession()?.accessToken;
  const api1BaseUrl = env.apiUrl;
  const api2BaseUrl = 'https://api.countrystatecity.in/v1';

  let modifiedReq = req;

  // Header modification logic
  if (req.url.startsWith(api1BaseUrl) && authToken) {
    modifiedReq = req.clone({ 
      setHeaders: { Authorization: `Bearer ${authToken}` } 
    });
  } else if (req.url.startsWith(api2BaseUrl)) {
    modifiedReq = req.clone({ 
      setHeaders: { 'X-CSCAPI-KEY': 'YmZnbEhCWVJOUVhGRGh2MlUzbGxIWFBRcjZQWlMyNHdZMG1Hd3V0UA==' } 
    });
  }

  return next(modifiedReq).pipe(
    catchError((error) => {
      if (error.status === 401 || error.status === 403) {



        // if (!tokenService.isLoggedIn()) return EMPTY; 

        // alertService.error(
        //   '/login', 
        //   'Session Expired', 
        //   'Your session has expired. Please log in again.'
        // );

        // loaderService.hideLoader(router.url);
        
        // tokenService.clearSession();
        // router.navigate(['/login']);
        // return EMPTY; 
        // Skip if session timer already handled it
        if (tokenService.isLoggedIn()) {
            tokenService.clearSession();
            loaderService.hideLoader(router.url);
            router.navigate(['/login']);
        }
        return EMPTY;
      }
      return throwError(() => error); // Propagate other errors
    })
  );
};