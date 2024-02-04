import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'routes',
    loadComponent: () =>
      import('./pages/routes/routes.component').then(
        (module) => module.RoutesPageComponent
      ),
  },
  {
    path: 'routes/:id',
    loadComponent: () =>
      import('./pages/route/route.component').then(
        (module) => module.RoutePageComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'routes',
  },
];
