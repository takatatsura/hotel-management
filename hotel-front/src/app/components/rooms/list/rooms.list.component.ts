import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';

import { RoomsController } from '../../../ducks/rooms/rooms.controller';
import { types } from '../../../ducks/rooms/rooms.types';

@Component({
  selector: 'app-list-rooms',
  templateUrl: './rooms.list.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class RoomsListComponent implements OnInit {
  public rooms$: any;

  constructor(private _rooms: RoomsController, private _store: Store<any>) {
    _store.select('rooms').subscribe((response) => {
      this.rooms$ = response;
    });
  }

  public ngOnInit() {
    this._store.dispatch({
      type: types.LIST_ROOMS,
    });

    this._rooms.getRooms().subscribe(
      (data: any) => {
        this._store.dispatch({
          type: types.LIST_ROOMS_SUCCESS,
          payload: data,
        });
      },
      (error: any) => {
        this._store.dispatch({
          type: types.LIST_ROOMS_FAILURE,
        });
      }
    );
  }
}
