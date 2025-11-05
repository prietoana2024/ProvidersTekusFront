import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { AuthService } from '../../Services/auth.service';
import { UtilidadService } from '../../Reutilizable/utilidad.service';
import { Login } from '../../Interfaces/login';
import {MatDividerModule} from '@angular/material/divider';
@Component({
  selector: 'app-login-component',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,MatDialogModule,MatButtonModule, MatIconModule
  ],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent implements OnInit {

  formularioLogin: FormGroup;
  ocultarPassword: boolean = true;
  mostrarLoading: boolean = false;
  returnUrl: string = '/pages';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private utilidadService: UtilidadService,
    private dialog: MatDialog
  ) {
    this.formularioLogin = this.fb.group({
      email: ['prietoana54321@gmail.com', [Validators.required, Validators.email]],
      password: ['Hannah2022*', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
  console.log('isAuthenticated:', this.authService.isAuthenticated());
  if (this.authService.isAuthenticated()) {
    this.router.navigate(['/pages']);
    return;
  }
}

  iniciarSesion(): void {
    if (this.formularioLogin.invalid) {
      this.utilidadService.mostrarAlerta('Complete todos los campos correctamente', 'Error');
      return;
    }

    this.mostrarLoading = true;
    const loginData: Login = {
      email: this.formularioLogin.value.email,
      password: this.formularioLogin.value.password
    };
    console.log('loginData', loginData);

    this.authService.login(loginData).subscribe({
      next: (response) => {
        this.mostrarLoading = false;
        if (response.success && response.token) {
          this.utilidadService.mostrarAlerta(`Bienvenido ${response.usuario?.nombre}`, 'Éxito');
          this.router.navigateByUrl(this.returnUrl);
        } else {
          this.utilidadService.mostrarAlerta(response.message || 'Error al iniciar sesión', 'Error');
        }
      },
      error: (error) => {
        this.mostrarLoading = false;
        console.error('Error en login:', error);

        const mensaje = error.status === 401
          ? 'Credenciales incorrectas'
          : error.error?.message || 'Error al conectar con el servidor';

        this.utilidadService.mostrarAlerta(mensaje, 'Error');
      }
    });
  }

  abrirModalRegistro(): void {
    console.log('this.router', this.router);
  this.router.navigate(['/register']);
}
  togglePasswordVisibility(): void {
    this.ocultarPassword = !this.ocultarPassword;
  }
}