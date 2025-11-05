import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResumenResponse } from '../Interfaces/resumenResponse';
import { ResumenProveedoresResponse } from '../Interfaces/ResumenProveedoresResponse';
import { ResponseApi } from '../Interfaces/response-api';
import { Proveedor, ProveedoresResponse, ProveedorRequest } from '../Interfaces/proveedor';
import { ProveedorSingleResponse } from '../Interfaces/proveedorsingleResponse';

@Injectable({
  providedIn: 'root',
})
export class ProveedorService {
   private apiUrl = `${environment.endpoint}/Proveedores`;

  constructor(private http: HttpClient) { }

  lista(): Observable<ProveedoresResponse> {
    return this.http.get<ProveedoresResponse>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<Proveedor> {
    return this.http.get<Proveedor>(`${this.apiUrl}/${id}`);
  }

  guardar(request: ProveedorRequest): Observable<Proveedor> {
    return this.http.post<Proveedor>(this.apiUrl, request);
  }

  
  editar(id: number, request: ProveedorRequest): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, request);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
