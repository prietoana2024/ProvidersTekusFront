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

@Component({
  selector: 'app-providers-component',
  imports: [MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatTooltipModule],
  templateUrl: './providers-component.html',
  styleUrl: './providers-component.css',
})
export class ProvidersComponent implements OnInit {
  proveedores: Proveedor[] = [];
  displayedColumns: string[] = ['nombre', 'correoElectronico', 'telefono', 'pais', 'activo', 'acciones'];
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
        if (response.status) {
          this.proveedores = response.value;
        } else {
          this.mostrarMensaje('Error al cargar proveedores', 'error');
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.mostrarMensaje('Error al conectar con el servidor', 'error');
        this.loading = false;
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

  mostrarMensaje(mensaje: string, tipo: 'success' | 'error'): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: tipo === 'success' ? 'snackbar-success' : 'snackbar-error'
    });
  }
}