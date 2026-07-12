import { RouterModule, Routes } from '@angular/router';
import { setLayout } from './components/layout/services/page-layout-resolve.service';
import { PageLayout } from './components/layout/enums/page-layout.enum';
import { NotfoundComponent } from './components/not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/layout/components/map-layout/map-layout.component')
        .then(m => m.MapLayoutComponent),
    resolve: {
      layout: setLayout(PageLayout.unAuthorized)
    },
    children: [
      {
        path: '', pathMatch: 'full', loadComponent: () =>
          import('./components/maps/components/map-directions/map-directions.component')
            .then(m => m.MapDirectionComponent)
      },
    ]
  },
  { path: 'notfound', component: NotfoundComponent },
  { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(routes);


