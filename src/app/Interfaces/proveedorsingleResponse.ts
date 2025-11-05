import { Proveedor } from "./provider";

export interface ProveedorSingleResponse {
  status: boolean;
  value: Proveedor;
  msg: string | null;
}