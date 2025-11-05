import { CampoDisponible } from "./campoDisponible";
import { Proveedor } from "./proveedor";

export interface ProveedoresResponse {
  camposDisponibles: CampoDisponible[];
  proveedores: Proveedor[];
}