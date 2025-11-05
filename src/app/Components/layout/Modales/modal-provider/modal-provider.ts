import { Component, Inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';

import { ProveedorService } from '../../../../Services/proveedor.service';
import { CampoDisponible } from '../../../../Interfaces/campoDisponible';
import { ProveedorConCamposPersonalizados, ProveedorRequest } from '../../../../Interfaces/provider';

@Component({
  selector: 'app-modal-provider',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule
  ],
  templateUrl: './modal-provider.html',
  styleUrls: ['./modal-provider.css']
})
export class ModalProvider implements OnInit {

  proveedorForm!: FormGroup;
  camposExtras!: FormArray;
  esEdicion = false;
  camposDisponibles: CampoDisponible[] = [];
  loading = signal(false);

  constructor(
    private fb: FormBuilder,
    private proveedorService: ProveedorService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ModalProvider>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      proveedor: ProveedorConCamposPersonalizados | null, 
      camposDisponibles: CampoDisponible[], 
      esEdicion: boolean 
    }
  ) {
    this.esEdicion = data.esEdicion;
    this.camposDisponibles = data.camposDisponibles || [];
  }

  ngOnInit(): void {
    this.camposExtras = this.fb.array([]);
    this.crearFormulario();

    if (this.data.proveedor) {
      this.cargarDatosProveedor();
    }
  }

  crearFormulario(): void {
    const formConfig: any = {
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      nit: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      camposExtras: this.camposExtras
    };

    // Agregar campos predefinidos al formulario
    this.camposDisponibles.forEach(campo => {
      const validators = campo.requerido ? [Validators.required] : [];
      formConfig[campo.nombreCampo] = ['', validators];
    });

    this.proveedorForm = this.fb.group(formConfig);
  }

  cargarDatosProveedor(): void {
    if (!this.data.proveedor) return;

    const proveedor = this.data.proveedor;
    
    // Cargar datos básicos
    this.proveedorForm.patchValue({
      nombre: proveedor.nombre,
      nit: proveedor.nit,
      email: proveedor.email
    });

    this.camposExtras.clear();

    // Cargar campos personalizados
    if (proveedor.camposPersonalizados) {
      Object.entries(proveedor.camposPersonalizados).forEach(([key, valor]) => {
        const campoExiste = this.camposDisponibles.find(c => c.nombreCampo === key);
        
        if (!campoExiste) {
          // Si no está en los predefinidos, agregar como campo extra
          this.camposExtras.push(this.fb.group({ 
            nombre: [key, Validators.required], 
            valor: [valor, Validators.required] 
          }));
        } else {
          // Si está predefinido, cargar su valor
          this.proveedorForm.get(key)?.setValue(valor);
        }
      });
    }
  }

  get camposExtrasControls(): FormGroup[] {
    return this.camposExtras.controls as FormGroup[];
  }

  agregarCampoExtra(): void {
    this.camposExtras.push(this.fb.group({ 
      nombre: ['', Validators.required], 
      valor: ['', Validators.required] 
    }));
  }

  eliminarCampoExtra(index: number): void {
    this.camposExtras.removeAt(index);
  }

  guardar(): void {
    // Marcar todos los campos como touched para mostrar errores
    this.proveedorForm.markAllAsTouched();
    
    // Validar campos extras
    this.camposExtras.controls.forEach(control => {
      control.markAllAsTouched();
    });

    if (this.proveedorForm.invalid) {
      this.mostrarMensaje('Por favor complete todos los campos requeridos correctamente', 'error');
      return;
    }

    const formValue = this.proveedorForm.value;
    const camposPersonalizados: { [key: string]: string } = {};
    
    // Agregar campos predefinidos al objeto de campos personalizados
    this.camposDisponibles.forEach(campo => {
      const valor = formValue[campo.nombreCampo];
      if (valor && valor.trim() !== '') {
        camposPersonalizados[campo.nombreCampo] = valor.trim();
      }
    });

    // Agregar campos extras al objeto de campos personalizados
    if (formValue.camposExtras && Array.isArray(formValue.camposExtras)) {
      formValue.camposExtras.forEach((campo: any) => {
        if (campo.nombre && campo.nombre.trim() && campo.valor && campo.valor.trim()) {
          camposPersonalizados[campo.nombre.trim()] = campo.valor.trim();
        }
      });
    }

    // Construir el request
    const proveedorRequest: ProveedorRequest = {
      nit: formValue.nit.trim(),
      nombre: formValue.nombre.trim(),
      email: formValue.email.trim(),
      camposPersonalizados
    };

    // Agregar ID solo si estamos editando
    if (this.esEdicion && this.data.proveedor?.id) {
      proveedorRequest.id = this.data.proveedor.id;
    }

    console.log('Enviando request:', proveedorRequest);

    this.loading.set(true);

    const operacion = this.esEdicion
      ? this.proveedorService.editar(proveedorRequest.id!, proveedorRequest)
      : this.proveedorService.guardar(proveedorRequest);

    operacion.subscribe({
      next: (response) => {
        console.log('✅ Respuesta exitosa:', response);
        this.mostrarMensaje(
          this.esEdicion ? 'Proveedor actualizado correctamente' : 'Proveedor creado correctamente', 
          'success'
        );
        this.loading.set(false);
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('❌ Error al guardar:', err);
        
        let mensajeError = 'Error al guardar el proveedor';
        
        if (err.error?.message) {
          mensajeError = err.error.message;
        } else if (err.error?.errors) {
          mensajeError = Object.values(err.error.errors).flat().join(', ');
        } else if (err.message) {
          mensajeError = err.message;
        }
        
        this.mostrarMensaje(mensajeError, 'error');
        this.loading.set(false);
      }
    });
  }

  mostrarMensaje(mensaje: string, tipo: 'success' | 'error'): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: tipo === 'success' ? 'snackbar-success' : 'snackbar-error'
    });
  }

  cerrar(): void {
    this.dialogRef.close(false);
  }
}