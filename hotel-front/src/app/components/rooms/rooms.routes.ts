import { RoomsListComponent } from './list/rooms.list.component';
import { CreateRoomComponent } from './form/rooms.create.component';
import { RoomsDetailComponent } from './detail/rooms.detail.component';

export const routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: RoomsListComponent,
      },
      {
        path: 'create',
        component: CreateRoomComponent,
      },
      {
        path: 'edit/:id',
        component: CreateRoomComponent,
      },
      {
        path: 'view/:id',
        component: RoomsDetailComponent,
      },
    ],
  },
];
