import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./components/image-upload.component').then(
        (m) => m.ImageUploadComponent
      ),
    pathMatch: 'full',
  },
];
