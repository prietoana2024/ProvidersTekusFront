import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResumenResponse } from '../Interfaces/resumenResponse';
import { ResumenProveedoresResponse } from '../Interfaces/ResumenProveedoresResponse';

@Injectable({
  providedIn: 'root',
})
export class ResumenService {
   private apiUrl = `${environment.endpoint}/Resumen`;

  constructor(private http: HttpClient) { }

  getServicesForCountries(): Observable<ResumenResponse> {
    return this.http.get<ResumenResponse>(`${this.apiUrl}/ServicesForContries`);
  }

  getClientsForCountries(): Observable<ResumenProveedoresResponse> {
    return this.http.get<ResumenProveedoresResponse>(`${this.apiUrl}/ProvidersForContries`);
  }
}
