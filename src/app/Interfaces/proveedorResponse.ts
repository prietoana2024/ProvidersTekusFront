import { CampoDisponible } from "./campoDisponible";
import { Proveedor } from "./provider";

export interface ProveedoresResponse {
  camposDisponibles: CampoDisponible[];
  proveedores: Proveedor[];
}