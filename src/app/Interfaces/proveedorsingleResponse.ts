import { Proveedor } from "./proveedor";

export interface ProveedorSingleResponse {
  status: boolean;
  value: Proveedor;
  msg: string | null;
}