export interface CampoDisponible {
  id: number;
  nombreCampo: string;
  etiqueta: string;
  tipoDato: string;
  requerido: boolean;
  orden: number;
  activo: boolean;
  fechaCreacion: string;
}
export interface Proveedor {
  id: number;
  nombre: string;
  nit: string;
  email: string;
  fechaCreacion: string;
  [key: string]: any;
}
export interface ProveedorCampoValor {
  id: number;
  proveedorId: number;
  campoPersonalizadoId: number;
  valor: string;
  campoPersonalizado: CampoDisponible;
  proveedor?: Proveedor | null;
}


export interface ProveedorResponsePOST {
  id: number;
  nit: string;
  nombre: string;
  email: string;
  fechaCreacion: string;
  proveedorCamposValores: ProveedorCampoValor[];
}
export interface ProveedorResponseGET {
  id: number;
  nit: string;
  nombre: string;
  email: string;
  camposPersonalizados: { [key: string]: string };
  servicios: Servicio[];
}

export interface ProveedorRequest {
  id?: number;
  nit: string;
  nombre: string;
  email: string;
  camposPersonalizados: { [key: string]: string };
}

export interface ProveedoresResponse {
  camposDisponibles: CampoDisponible[];
  proveedores: ProveedorResponseGET[];
}

export interface Servicio {
  id: number;
  nombre: string;
  valorHora: number;
  paises: string;
  idProveedor: number;
  nombreProveedor: string;
}


export interface ProveedorConCamposPersonalizados {
  id: number;
  nit: string;
  nombre: string;
  email: string;
  fechaCreacion?: string;
  camposPersonalizados: { [key: string]: string }; 
  servicios?: Servicio[]; 
}