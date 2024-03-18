import { DashboardComponent } from './home/dashboard.component';

export const routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
    ],
  },
];
