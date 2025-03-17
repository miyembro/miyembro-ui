import { HttpHandler, HttpHandlerFn, HttpInterceptor, HttpInterceptorFn, HttpRequest, HttpXsrfTokenExtractor } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { SessionService } from "../services/session.service";
import { environment as env } from '@environments/environment';

export const JwtTokenInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const tokenService = inject(SessionService);

  const authToken = tokenService.getSession()?.accessToken != null ? tokenService.getSession()?.accessToken : null;

  // Define base URLs for your APIs
  const api1BaseUrl = env.apiUrl;
  const api2BaseUrl = 'https://api.countrystatecity.in/v1';

  let modifiedReq = req;

  if (req.url.startsWith(api1BaseUrl) && authToken) {
    modifiedReq = req.clone({ setHeaders: { Authorization: `Bearer ${authToken}` } });
  } else if (req.url.startsWith(api2BaseUrl)) {
    modifiedReq = req.clone({ setHeaders: { 'X-CSCAPI-KEY': 'YmZnbEhCWVJOUVhGRGh2MlUzbGxIWFBRcjZQWlMyNHdZMG1Hd3V0UA==' } });
  }

  return next(modifiedReq);

  // const authReq = authToken
  // ? req.clone({ setHeaders: { Authorization: `Bearer ${authToken}` } })
  // : req;

  // return next(authReq);
};