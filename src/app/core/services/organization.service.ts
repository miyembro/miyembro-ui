import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment as env } from '@environments/environment';
import { OrganizationResponse } from 'src/app/core/models/organization-reponse';
import { Page } from 'src/app/core/models/page';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  private organizationSubject = new Subject<OrganizationResponse>();
  
  baseUrl = '/organizations';

  constructor(
    private http: HttpClient,
  ) {
  }

  /*internal communication service method */
  getOrganizationUpdate(): Observable<OrganizationResponse> {
    return this.organizationSubject.asObservable();
  }

  /*internal communication service method */
  setOrganization(organizationResponse: OrganizationResponse): void {
    this.organizationSubject.next(organizationResponse);
  }

  createOrganization(formData: FormData): Observable<any> {
    return this.http.post(`${env.apiUrl}${this.baseUrl}`, formData);
  }

  getMyOrganizationById(organizationId: string | null | undefined ): Observable<OrganizationResponse> {
    return this.http.get(`${env.apiUrl}${this.baseUrl}/${organizationId}/current`) as Observable<OrganizationResponse>;
  }

  getOrganizations(page: number, size: number, name: string | null, countryName: string | null, cityName: string | null): Observable<Page<OrganizationResponse>> {
    const url = `${env.apiUrl}${this.baseUrl}`;

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
  
    if (name) {
      params = params.set('name', name);
    }
    if(countryName) {
      params = params.set('countryName', countryName);
    }
    if(cityName) {
      params = params.set('cityName', cityName);
    }
    return this.http.get<any>(url, { params }) as Observable<Page<OrganizationResponse>>;
  }

  getOrganizationsByMemberId(memberId: string | undefined): Observable<OrganizationResponse[]> {
    return this.http.get(`${env.apiUrl}${this.baseUrl}/members/${memberId}`) as Observable<OrganizationResponse[]>;
  }

  getUniqueOrganizationCountries(): Observable<string[]> {
    return this.http.get(`${env.apiUrl}${this.baseUrl}/countries`) as Observable<string []>;
  }
    
  updateOrganization(organizationId :string, organization: OrganizationResponse | undefined): Observable<OrganizationResponse> {
    return this.http.put(`${env.apiUrl}${this.baseUrl}/` + organizationId, organization) as Observable<OrganizationResponse>;
  }

  updateOrganizationPhoto(organizationId:string | undefined, formData: FormData): Observable<OrganizationResponse> {
    return this.http.post(`${env.apiUrl}${this.baseUrl}/` + organizationId + '/photo', formData) as Observable<OrganizationResponse>;
  }

  /*check this*/
  getOrganizationCitiesByCountry(country : string): Observable<string[]> {
    const params = new HttpParams()
    .set('country', country.toString());
    return this.http.get(`${env.apiUrl}${this.baseUrl}/organizationCitiesByCountry`, { params }) as Observable<string []>;
  }
   
}

