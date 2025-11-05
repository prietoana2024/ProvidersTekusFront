import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Proveedor } from '../../../../Interfaces/proveedor';
import { ProveedorService } from '../../../../Services/proveedor.service';
import { CampoDisponible } from '../../../../Interfaces/campoDisponible';
import { ModalProvider } from '../../Modales/modal-provider/modal-provider';
import { MatChip } from '@angular/material/chips';

@Component({
  selector: 'app-providers-component',
  imports: [MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatTooltipModule,
  MatChip],
  templateUrl: './providers-component.html',
  styleUrl: './providers-component.css',
})
export class ProvidersComponent implements OnInit {
  proveedores: Proveedor[] = [];
  camposDisponibles: CampoDisponible[] = [];
  displayedColumns: string[] = ['nombre', 'nit', 'email', 'campos', 'acciones'];
  loading = false;

  constructor(
    private proveedorService: ProveedorService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarProveedores();
  }

  cargarProveedores(): void {
    this.loading = true;
    this.proveedorService.lista().subscribe({
      next: (response) => {
        this.proveedores = response.proveedores;
        this.camposDisponibles = response.camposDisponibles;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.mostrarMensaje('Error al cargar proveedores', 'error');
        this.loading = false;
      }
    });
  }

  abrirDialogNuevo(): void {
    const dialogRef = this.dialog.open(ModalProvider, {
      width: '700px',
      data: {
        proveedor: null,
        camposDisponibles: this.camposDisponibles,
        esEdicion: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarProveedores();
      }
    });
  }

  abrirDialogEditar(proveedor: Proveedor): void {
    const dialogRef = this.dialog.open(ModalProvider, {
      width: '700px',
      data: {
        proveedor: proveedor,
        camposDisponibles: this.camposDisponibles,
        esEdicion: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarProveedores();
      }
    });
  }

  eliminarProveedor(id: number): void {
    if (confirm('¿Está seguro de eliminar este proveedor?')) {
      this.proveedorService.eliminar(id).subscribe({
        next: () => {
          this.mostrarMensaje('Proveedor eliminado correctamente', 'success');
          this.cargarProveedores();
        },
        error: (err) => {
          console.error('Error:', err);
          this.mostrarMensaje('Error al eliminar proveedor', 'error');
        }
      });
    }
  }

  getCamposPersonalizados(proveedor: Proveedor): string[] {
    const campos: string[] = [];
    this.camposDisponibles.forEach(campo => {
      const valor = proveedor[campo.nombreCampo];
      if (valor) {
        campos.push(`${campo.etiqueta}: ${valor}`);
      }
    });
    return campos;
  }

  mostrarMensaje(mensaje: string, tipo: 'success' | 'error'): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: tipo === 'success' ? 'snackbar-success' : 'snackbar-error'
    });
  }
}