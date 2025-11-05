import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
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
    MatButtonModule,
  RouterLink,       
    RouterLinkActive],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout implements OnInit {

  usuarioActual: Usuario | null = null;
  opened = signal(true);

  menuItems = [
    { path: '/pages/home', icon: 'dashboard', label: 'Dashboard' },
    { path: '/pages/servicios', icon: 'build', label: 'Servicios' },
    { path: '/pages/proveedores', icon: 'business', label: 'Proveedores' },
    { path: '/pages/usuarios', icon: 'people', label: 'Usuarios' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.usuarioActual = user;
    });
  }

  cerrarSesion(): void {
    this.authService.logout();
  }

  navegarA(ruta: string): void {
    this.router.navigate([`/pages/${ruta}`]);
  }

  toggleSidenav(): void {
    this.opened.set(!this.opened());
  }
}