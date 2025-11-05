import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResumenResponse } from '../Interfaces/resumenResponse';
import { ResumenProveedoresResponse } from '../Interfaces/ResumenProveedoresResponse';
import { ResponseApi } from '../Interfaces/response-api';
import { Proveedor } from '../Interfaces/proveedor';
import { ProveedorResponse } from '../Interfaces/proveedorResponse';
import { ProveedorSingleResponse } from '../Interfaces/proveedorsingleResponse';

@Injectable({
  providedIn: 'root',
})
export class ProveedorService {
   private apiUrl = `${environment.endpoint}/Proveedores`;

  constructor(private http: HttpClient) { }

  lista(): Observable<ProveedorResponse> {
    return this.http.get<ProveedorResponse>(this.apiUrl);
  }
  obtenerPorId(id: number): Observable<ProveedorSingleResponse> {
    return this.http.get<ProveedorSingleResponse>(`${this.apiUrl}/${id}`);
  }

  guardar(proveedor: Proveedor): Observable<ProveedorSingleResponse> {
    return this.http.post<ProveedorSingleResponse>(this.apiUrl, proveedor);
  }

  editar(id: number, proveedor: Proveedor): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, proveedor);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
