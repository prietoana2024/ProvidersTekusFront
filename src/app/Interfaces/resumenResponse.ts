import { ServiciosPorPais } from "./serviciosPorPais";

export interface ResumenResponse {
  status: boolean;
  value: ServiciosPorPais[];
  msg: string | null;
}