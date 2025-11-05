

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

export interface ProveedorRequest {
  nit: string;
  nombre: string;
  email: string;
  camposPersonalizados: { [key: string]: string };
}

export interface ProveedoresResponse {
  camposDisponibles: CampoDisponible[];
  proveedores: Proveedor[];
}