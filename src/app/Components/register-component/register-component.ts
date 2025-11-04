import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

// Material imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { AuthService } from '../../Services/auth.service';
import { UtilidadService } from '../../Reutilizable/utilidad.service';
import { Register } from '../../Interfaces/register';

@Component({
  selector: 'app-register-component',
  imports: [CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule],
  templateUrl: './register-component.html',
  styleUrl: './register-component.css',
})
export class RegisterComponent {

  formularioRegistro: FormGroup;
  ocultarPassword: boolean = true;
  ocultarConfirmPassword: boolean = true;
  mostrarLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private utilidadService: UtilidadService,
    private router: Router
  ) {
    this.formularioRegistro = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password?.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  registrar(): void {
    if (this.formularioRegistro.invalid) {
      this.utilidadService.mostrarAlerta('Complete todos los campos correctamente', 'Error');
      return;
    }

    this.mostrarLoading = true;

    const registerData: Register = {
      nombre: this.formularioRegistro.value.nombre,
      email: this.formularioRegistro.value.email,
      password: this.formularioRegistro.value.password
    };

    this.authService.register(registerData).subscribe({
      next: (response) => {
        this.mostrarLoading = false;
        
        if (response.success && response.token) {
          this.utilidadService.mostrarAlerta('Registro exitoso', 'Éxito');
          
          // ✅ Redirigir a home después de registro exitoso
          this.router.navigate(['/pages/home']);
        } else {
          this.utilidadService.mostrarAlerta(
            response.message || 'Error al registrar', 
            'Error'
          );
        }
      },
      error: (error) => {
        this.mostrarLoading = false;
        console.error('Error en registro:', error);
        
        const mensaje = error.error?.message || 'Error al conectar con el servidor';
        this.utilidadService.mostrarAlerta(mensaje, 'Error');
      }
    });
  }

  irALogin(): void {
    this.router.navigate(['/login']);
  }

  togglePasswordVisibility(): void {
    this.ocultarPassword = !this.ocultarPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.ocultarConfirmPassword = !this.ocultarConfirmPassword;
  }
}

