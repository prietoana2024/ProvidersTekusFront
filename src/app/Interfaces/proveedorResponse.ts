import { Proveedor } from "./proveedor";

export interface ProveedorResponse {
  status: boolean;
  value: Proveedor[];
  msg: string | null;
}