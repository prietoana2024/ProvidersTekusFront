import { ProveedoresPorPais } from "./proveedoresPorPais";

export interface ResumenProveedoresResponse {
  status: boolean;
  value: ProveedoresPorPais[];
  msg: string | null;
}