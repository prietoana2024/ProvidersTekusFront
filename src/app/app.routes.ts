/*import { Routes } from '@angular/router';

export const routes: Routes = [];
*/
import { Routes } from '@angular/router';
import { authGuard } from './Guards/auth.guard';
import { LoginComponent } from './Components/login-component/login-component';
import { RegisterComponent } from './Components/register-component/register-component';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'login', 
    pathMatch: 'full' 
  },
  
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: 'register', 
    component: RegisterComponent 
  },
  
  { 
    path: 'pages',
    canActivate: [authGuard], // ✅ Protegido con guard
    loadChildren: () => import('./Components/layout/pages.routes').then(m => m.routes)
  },
  
  
];