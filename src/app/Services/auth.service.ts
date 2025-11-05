/*import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';
import { LoginResponse } from '../Interfaces/loginResponse';
import { Login } from '../Interfaces/login';
import { Register } from '../Interfaces/register';
import { Usuario } from '../Interfaces/usuario';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.endpoint}/Auth`;
  private tokenKey = 'token';
  private usuarioKey = 'usuario';

  // Observable para saber si el usuario está autenticado
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  // Observable con los datos del usuario actual
  private currentUserSubject = new BehaviorSubject<Usuario | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login(loginDto: Login): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/Login`, loginDto)
      .pipe(
        tap(response => {
          if (response.success && response.token) {
            this.setSession(response.token, response.usuario!);
          }
        })
      );
  }

  register(registerDto: Register): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/Register`, registerDto)
      .pipe(
        tap(response => {
          if (response.success && response.token) {
            this.setSession(response.token, response.usuario!);
          }
        })
      );
  }

  private setSession(token: string, usuario: Usuario): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.usuarioKey, JSON.stringify(usuario));
    this.isAuthenticatedSubject.next(true);
    this.currentUserSubject.next(usuario);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.usuarioKey);
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    return !this.isTokenExpired(token);
  }

  private getUserFromStorage(): Usuario | null {
    const userJson = localStorage.getItem(this.usuarioKey);
    return userJson ? JSON.parse(userJson) : null;
  }

  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp;
      return (Math.floor((new Date).getTime() / 1000)) >= expiry;
    } catch (error) {
      return true;
    }
  }
  getTokenClaims(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      return null;
    }
  }
}*/

import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment.development';
import { LoginResponse } from '../Interfaces/loginResponse';
import { Login } from '../Interfaces/login';
import { Register } from '../Interfaces/register';
import { Usuario } from '../Interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.endpoint}/Auth`;
  private tokenKey = 'token';
  private usuarioKey = 'usuario';
  private isBrowser: boolean;

  private isAuthenticatedSubject: BehaviorSubject<boolean>;
  public isAuthenticated$: Observable<boolean>;

  private currentUserSubject: BehaviorSubject<Usuario | null>;
  public currentUser$: Observable<Usuario | null>;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(
      this.isBrowser ? this.hasToken() : false
    );
    this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    this.currentUserSubject = new BehaviorSubject<Usuario | null>(
      this.isBrowser ? this.getUserFromStorage() : null
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  login(loginDto: Login): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/Login`, loginDto)
      .pipe(
        tap(response => {
          if (response.success && response.token) {
            this.setSession(response.token, response.usuario!);
          }
        })
      );
  }
  register(registerDto: Register): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/Register`, registerDto)
      .pipe(
        tap(response => {
          if (response.success && response.token) {
            this.setSession(response.token, response.usuario!);
          }
        })
      );
  }

  private setSession(token: string, usuario: Usuario): void {
    if (!this.isBrowser) return; // Evita error en SSR
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.usuarioKey, JSON.stringify(usuario));
    this.isAuthenticatedSubject.next(true);
    this.currentUserSubject.next(usuario);
  }

  logout(): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.usuarioKey);
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(this.tokenKey);
  }

  private hasToken(): boolean {
    if (!this.isBrowser) return false;
    return !!this.getToken();
  }

isAuthenticated(): boolean {
  if (!this.isBrowser) return false;

  const token = this.getToken();
  if (!token) {
    console.log('[AuthService] No hay token → usuario no autenticado');
    return false;
  }

  const expired = this.isTokenExpired(token);
  console.log('[AuthService] Token expirado:', expired);
  return !expired;
}

  private getUserFromStorage(): Usuario | null {
    if (!this.isBrowser) return null;
    const userJson = localStorage.getItem(this.usuarioKey);
    return userJson ? JSON.parse(userJson) : null;
  }

  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp;
      return (Math.floor((new Date).getTime() / 1000)) >= expiry;
    } catch (error) {
      return true;
    }
  }

  getTokenClaims(): any {
    if (!this.isBrowser) return null;
    const token = this.getToken();
    if (!token) return null;

    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      return null;
    }
  }
}
