import { Component, OnInit } from '@angular/core';
import { ServiciosPorPais } from '../../../../Interfaces/serviciosPorPais';
import { ResumenService } from '../../../../Services/resumen-service';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import {ChangeDetectionStrategy, signal} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { ProveedoresPorPais } from '../../../../Interfaces/proveedoresPorPais';

@Component({
  selector: 'app-home-component',
  imports: [MatCardModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatBadgeModule,
  MatTabsModule],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  
 serviciosPorPais: ServiciosPorPais[] = [];
  proveedoresPorPais: ProveedoresPorPais[] = [];
  
  loadingServicios = false;
  loadingProveedores = false;
  
  errorServicios: string | null = null;
  errorProveedores: string | null = null;

  constructor(private resumenService: ResumenService) {}

  ngOnInit(): void {
    this.cargarServicios();
    this.cargarProveedores();
  }

  cargarServicios(): void {
    this.loadingServicios = true;
    this.errorServicios = null;

    this.resumenService.getServicesForCountries().subscribe({
      next: (response) => {
        if (response.status) {
          this.serviciosPorPais = response.value;
        } else {
          this.errorServicios = response.msg || 'Error al cargar los servicios';
        }
        this.loadingServicios = false;
      },
      error: (err) => {
        console.error('Error al cargar servicios:', err);
        this.errorServicios = 'Error al conectar con el servidor. Verifica tu autenticación.';
        this.loadingServicios = false;
      }
    });
  }

  cargarProveedores(): void {
    this.loadingProveedores = true;
    this.errorProveedores = null;

    this.resumenService.getClientsForCountries().subscribe({
      next: (response) => {
        if (response.status) {
          this.proveedoresPorPais = response.value;
        } else {
          this.errorProveedores = response.msg || 'Error al cargar los proveedores';
        }
        this.loadingProveedores = false;
      },
      error: (err) => {
        console.error('Error al cargar proveedores:', err);
        this.errorProveedores = 'Error al conectar con el servidor. Verifica tu autenticación.';
        this.loadingProveedores = false;
      }
    });
  }

  getServiciosArray(servicios: string): string[] {
    return servicios.split(', ');
  }

  getProveedoresArray(proveedores: string): string[] {
    return proveedores.split(', ');
  }

  getPaisIcon(pais: string): string {
    const icons: { [key: string]: string } = {
      'Argentina': 'location_city',
      'Brasil': 'location_city',
      'Chile': 'location_city',
      'Colombia': 'location_city',
      'México': 'location_city',
      'Perú': 'location_city',
      'Uruguay': 'location_city'
    };
    return icons[pais] || 'public';
  }
}