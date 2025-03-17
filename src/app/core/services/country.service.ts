import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Country } from '../models/country';
import { Observable } from 'rxjs';
import { environment as env } from '@environments/environment';
import { State } from '../models/state';
import { City } from '../models/city';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  baseUrl = '/countries';
  
    constructor(
      private http: HttpClient,
    ) {
      
    }
  

  getCountries(): Observable<Country[]> {
    return this.http.get(`${env.countryUrl}${this.baseUrl}`, {})  as Observable<Country[]>;
  }

  getCitiesByCountry(iso2CountryCode: string | undefined): Observable<City[]> {
    return this.http.get(`${env.countryUrl}${this.baseUrl}/${iso2CountryCode}/cities`, {})  as Observable<City[]>;
  }

  getCitiesByStateAndCountry(iso2CountryCode: string | undefined, iso2StateCode: string | undefined): Observable<City[]> {
    return this.http.get(`${env.countryUrl}${this.baseUrl}/${iso2CountryCode}/states/${iso2StateCode}/cities`, {})  as Observable<City[]>;
  }

  getStatesByCountry(iso2CountryCode: string | undefined): Observable<State[]> {
    return this.http.get(`${env.countryUrl}${this.baseUrl}/${iso2CountryCode}/states`, {})  as Observable<State[]>;
  }
 
}
