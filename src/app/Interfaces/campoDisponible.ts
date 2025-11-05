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