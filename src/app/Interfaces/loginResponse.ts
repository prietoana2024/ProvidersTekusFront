import { Usuario } from "./usuario";

export interface LoginResponse {
  success: boolean;
  token?: string;
  message?: string;
  usuario?: Usuario;
}