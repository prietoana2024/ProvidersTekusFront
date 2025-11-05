import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { ProveedorService } from '../../../../Services/proveedor.service';
import { Proveedor, ProveedorRequest } from '../../../../Interfaces/proveedor';
import { CampoDisponible } from '../../../../Interfaces/campoDisponible';

@Component({
  selector: 'app-modal-provider',
  imports: [ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule],
  templateUrl: './modal-provider.html',
  styleUrl: './modal-provider.css',
})
export class ModalProvider implements OnInit {  proveedorForm!: FormGroup;
  loading = false;
  esEdicion = false;

  constructor(
    private fb: FormBuilder,
    private proveedorService: ProveedorService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ModalProvider>,
    @Inject(MAT_DIALOG_DATA) public data: {
      proveedor: Proveedor | null;
      camposDisponibles: CampoDisponible[];
      esEdicion: boolean;
    }
  ) {
    this.esEdicion = data.esEdicion;
  }

  ngOnInit(): void {
    this.crearFormulario();
    if (this.data.proveedor) {
      this.cargarDatosProveedor();
    }
  }

  crearFormulario(): void {
    // Crear FormGroup con campos base
    const formConfig: any = {
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      nit: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]]
    };

    // Agregar campos dinámicos ordenados
    const camposOrdenados = [...this.data.camposDisponibles].sort((a, b) => a.orden - b.orden);
    
    camposOrdenados.forEach(campo => {
      const validators = campo.requerido ? [Validators.required] : [];
      formConfig[campo.nombreCampo] = ['', validators];
    });

    this.proveedorForm = this.fb.group(formConfig);
  }

  cargarDatosProveedor(): void {
    if (this.data.proveedor) {
      const proveedor = this.data.proveedor;
      
      // Cargar campos base
      this.proveedorForm.patchValue({
        nombre: proveedor.nombre,
        nit: proveedor.nit,
        email: proveedor.email
      });

      // Cargar campos dinámicos
      this.data.camposDisponibles.forEach(campo => {
        const valor = proveedor[campo.nombreCampo];
        if (valor) {
          this.proveedorForm.get(campo.nombreCampo)?.setValue(valor);
        }
      });
    }
  }

  guardar(): void {
    if (this.proveedorForm.invalid) {
      this.proveedorForm.markAllAsTouched();
      this.mostrarMensaje('Por favor complete los campos requeridos', 'error');
      return;
    }

    this.loading = true;
    const formValue = this.proveedorForm.value;

    // Construir objeto para enviar a la API
    const camposPersonalizados: { [key: string]: string } = {};
    
    this.data.camposDisponibles.forEach(campo => {
      const valor = formValue[campo.nombreCampo];
      if (valor) {
        camposPersonalizados[campo.nombreCampo] = valor;
      }
    });

    const proveedorRequest: ProveedorRequest = {
      nombre: formValue.nombre,
      nit: formValue.nit,
      email: formValue.email,
      camposPersonalizados: camposPersonalizados
    };

    // Determinar la operación según si es edición o creación
    const operacion = this.esEdicion
      ? this.proveedorService.editar(this.data.proveedor!.id, proveedorRequest)
      : this.proveedorService.guardar(proveedorRequest);

    // Ejecutar la operación
    operacion.subscribe({
      next: () => {
        this.mostrarMensaje(
          this.esEdicion ? 'Proveedor actualizado correctamente' : 'Proveedor creado correctamente',
          'success'
        );
        this.loading = false;
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Error:', err);
        this.mostrarMensaje('Error al guardar el proveedor', 'error');
        this.loading = false;
      }
    });
  }

  getCampoControl(nombreCampo: string): FormControl {
    return this.proveedorForm.get(nombreCampo) as FormControl;
  }

  hasError(campo: string, error: string): boolean {
    const control = this.proveedorForm.get(campo);
    return control ? control.hasError(error) && control.touched : false;
  }

  mostrarMensaje(mensaje: string, tipo: 'success' | 'error'): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: tipo === 'success' ? 'snackbar-success' : 'snackbar-error'
    });
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}