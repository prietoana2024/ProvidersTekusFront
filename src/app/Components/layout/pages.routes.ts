
import { Routes } from '@angular/router';
import { Layout } from './layout';
import { HomeComponent } from './Pages/home-component/home-component';
import { ProvidersComponent } from './Pages/providers-component/providers-component';
import { UsersComponent } from './Pages/users-component/users-component';
import { ServicesComponent } from './Pages/services-component/services-component';

export const routes: Routes = [
  {
    path: '',
    component: Layout, 
    children: [
      { 
        path: '', 
        redirectTo: 'home', 
        pathMatch: 'full' 
      },
      { 
        path: 'home', 
        component: HomeComponent 
      },
      { 
        path: 'servicios', 
        component: ServicesComponent 
      },
      { 
        path: 'proveedores', 
        component: ProvidersComponent 
      },
      { 
        path: 'usuarios', 
        component: UsersComponent 
      }
    ]
  }
];
