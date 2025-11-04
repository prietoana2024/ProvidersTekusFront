import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../../Services/auth.service';
import { Usuario } from '../../Interfaces/usuario';

@Component({
  selector: 'app-layout',
  imports: [CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout implements OnInit {

  usuarioActual: Usuario | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Suscribirse a los cambios del usuario actual
    this.authService.currentUser$.subscribe(user => {
      this.usuarioActual = user;
    });
  }

  cerrarSesion(): void {
    this.authService.logout();
    // El servicio ya hace navigate a /login
  }

  navegarA(ruta: string): void {
    this.router.navigate([`/pages/${ruta}`]);
  }
}