import { Routes } from '@angular/router';
import { NoContentComponent } from './components/no-content/no-content.component';

export const ROUTES: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./components/dashboard').then((m) => m.DashboardModule),
  },
  {
    path: 'bookings',
    loadChildren: () =>
      import('./components/bookings').then((m) => m.BookingsModule),
  },
  {
    path: 'guests',
    loadChildren: () =>
      import('./components/guests').then((m) => m.GuestsModule),
  },
  {
    path: 'rooms',
    loadChildren: () => import('./components/rooms').then((m) => m.RoomsModule),
  },
  {
    path: '**',
    component: NoContentComponent,
  },
];
