import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common'; // <-- Importante
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { ProveedorService } from '../../../../Services/proveedor.service';
import { ProveedorResponseGET } from '../../../../Interfaces/provider';
import { ModalProvider } from '../../Modales/modal-provider/modal-provider';

@Component({
  selector: 'app-providers-component',
  templateUrl: './providers-component.html',
  styleUrls: ['./providers-component.css'],
  standalone: true,
  imports: [
    CommonModule, // <-- Necesario para ngIf
    NgIf,        // <-- Necesario para *ngIf
    NgFor,       // <-- Necesario para *ngFor
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatTooltipModule,
    MatChipsModule
  ]
})
export class ProvidersComponent implements OnInit {
  proveedores: ProveedorResponseGET[] = [];
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
    this.proveedorService.listar().subscribe({
      next: (response) => {
        this.proveedores = response;
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
      data: { proveedor: null, esEdicion: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.cargarProveedores();
    });
  }

  abrirDialogEditar(proveedor: ProveedorResponseGET): void {
    const dialogRef = this.dialog.open(ModalProvider, {
      width: '700px',
      data: { proveedor, esEdicion: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.cargarProveedores();
    });
  }

  eliminarProveedor(id: number): void {
    if (!confirm('¿Está seguro de eliminar este proveedor?')) return;

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

  getCamposPersonalizados(proveedor: ProveedorResponseGET): string[] {
    if (!proveedor.camposPersonalizados) return [];
    return Object.entries(proveedor.camposPersonalizados)
      .map(([key, value]) => `${key}: ${value}`);
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
