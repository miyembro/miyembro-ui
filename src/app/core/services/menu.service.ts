import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '@environments/environment';
import { MenuItemResponse } from '../models/menu-item-response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  baseUrl = '/menus';

  constructor(private http: HttpClient) {}

  getMenus(organizationId: string | undefined | null): Observable<MenuItemResponse[]> {
    let url = `${env.apiUrl}${this.baseUrl}/organizations`;

    if (organizationId) {
      url += `?organizationId=${organizationId}`;
    }

    return this.http.get<MenuItemResponse[]>(url);
  }
}
