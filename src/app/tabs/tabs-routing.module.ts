import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { loginGuard } from '../login.guard';


const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule),
        canActivate: [loginGuard]
      },
      {
        path: 'cart',
        loadChildren: () => import('../carrito/carrito.module').then(m => m.CarritoPageModule),
        canActivate: [loginGuard],
      },
      {
        path: 'favorites',
        loadChildren: () => import('../favoritos/favoritos.module').then(m => m.FavoritosPageModule),
        canActivate: [loginGuard],
      },
      {
        path: 'profile',
        loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule),
        canActivate: [loginGuard]
      },
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
