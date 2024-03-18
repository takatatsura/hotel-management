import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { routes } from './rooms.routes';
import { RoomsListComponent } from './list/rooms.list.component';
import { CreateRoomComponent } from './form/rooms.create.component';
import { RoomsDetailComponent } from './detail/rooms.detail.component';

import { LoadingSpinnerModule } from '../loading-spinner/loading-spinner.module';
import { SearchFilterModule } from '../../helpers/search/searchFilter.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    LoadingSpinnerModule,
    SearchFilterModule,
  ],
  declarations: [RoomsListComponent, CreateRoomComponent, RoomsDetailComponent],
})
export class RoomsModule {
  public static routes = routes;
}
