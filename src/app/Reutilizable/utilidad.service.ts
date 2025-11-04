import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from '../Interfaces/usuario';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class UtilidadService {

  constructor(
    private fb: FormBuilder,
    private _snackBar: MatSnackBar
     // ✅ Inyectar MatSnackBar
  ) { }

  /**
   * Mostrar alerta/notificación
   */
  mostrarAlerta(mensaje: string, tipo: string) {
    this._snackBar.open(mensaje, tipo, {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 3000
    });
  }

  /**
   * Obtener usuario de la sesión (localStorage)
   */
  obtenerSesionUsuario(): Usuario | null {
    try {
      const dataCadena = localStorage.getItem('usuario');
      if (!dataCadena) return null;
      
      const usuario = JSON.parse(dataCadena);
      return usuario as Usuario;
    } catch (error) {
      console.error('Error al obtener usuario de sesión:', error);
      return null;
    }
  }

  /**
   * Obtener token de la sesión
   */
  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Verificar si hay sesión activa
   */
  tieneSesionActiva(): boolean {
    const token = this.obtenerToken();
    const usuario = this.obtenerSesionUsuario();
    return !!token && !!usuario;
  }

  /**
   * Eliminar sesión del usuario
   */
  eliminarSesionUsuario(): void {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
  }

  /**
   * Guardar sesión del usuario
   */
  guardarSesionUsuario(usuario: Usuario, token: string): void {
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('token', token);
  }

  /**
   * Crear formulario de usuario (si lo necesitas en varios componentes)
   */
  crearFormularioUsuario(): FormGroup {
    return this.fb.group({
      idUsuario: [null],
      nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
      correo: ['', [Validators.required, Validators.email]],
      clave: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * Validar email
   */
  esEmailValido(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Formatear fecha
   */
  formatearFecha(fecha: Date | string): string {
    const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
