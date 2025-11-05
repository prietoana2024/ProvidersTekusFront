import { CommonModule } from '@angular/common';
import { Register } from '../../../../Interfaces/register';
import { AuthService } from '../../../../Services/auth.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';

@Component({
  selector: 'app-modal-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './modal-register.html',
  styleUrls: ['./modal-register.css']
})
export class ModalRegister {
  formularioRegister: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ModalRegister>,
    private authService: AuthService,
    //private utilidadService: UtilidadService
  ) {
    this.formularioRegister = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  cerrar(): void {
    this.dialogRef.close(false);
  }

  registrar(): void {
    if (this.formularioRegister.invalid) {
      //this.utilidadService.mostrarAlerta('Complete todos los campos correctamente', 'Error');
      return;
    }

    this.loading = true;
    const data: Register = this.formularioRegister.value;

    this.authService.register(data).subscribe({
      next: (resp) => {
        this.loading = false;
        if (resp.success) {
          //this.utilidadService.mostrarAlerta('Usuario registrado correctamente', 'Éxito');
          this.dialogRef.close(true);
        } else {
          //this.utilidadService.mostrarAlerta(resp.message || 'Error en el registro', 'Error');
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Error en registro:', err);
        //this.utilidadService.mostrarAlerta('Error al registrar el usuario', 'Error');
      }
    });
  }
}