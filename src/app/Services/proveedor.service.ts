import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResumenResponse } from '../Interfaces/resumenResponse';
import { ResumenProveedoresResponse } from '../Interfaces/ResumenProveedoresResponse';
import { ResponseApi } from '../Interfaces/response-api';
import { ProveedorSingleResponse } from '../Interfaces/proveedorsingleResponse';
import { ProveedorRequest, ProveedorResponseGET, ProveedorResponsePOST } from '../Interfaces/provider';

@Injectable({
  providedIn: 'root',
})
export class ProveedorService {
   private apiUrl = `${environment.endpoint}/Proveedores`;

  constructor(private http: HttpClient) { }

  guardar(req: ProveedorRequest): Observable<ProveedorResponsePOST> {
    return this.http.post<ProveedorResponsePOST>(this.apiUrl, req);
  }

  obtenerPorId(id: number): Observable<ProveedorResponseGET> {
    return this.http.get<ProveedorResponseGET>(`${this.apiUrl}/${id}`);
  }

  listar(): Observable<ProveedorResponseGET[]> {
    return this.http.get<ProveedorResponseGET[]>(this.apiUrl);
  }

  /** 🔹 Editar proveedor (PUT /{id}) */
  editar(id: number, req: ProveedorRequest): Observable<ProveedorResponsePOST> {
    return this.http.put<ProveedorResponsePOST>(`${this.apiUrl}/${id}`, req);
  }

  /** 🔹 Eliminar proveedor (DELETE /{id}) */
  eliminar(id: number): Observable<ResponseApi> {
    return this.http.delete<ResponseApi>(`${this.apiUrl}/${id}`);
  }
}
