import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { RoomsController } from '../../../ducks/rooms/rooms.controller';
import { types as RoomTypes } from '../../../ducks/rooms/rooms.types';

@Component({
  selector: 'app-create-rooms',
  templateUrl: './rooms.create.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class CreateRoomComponent implements OnInit, OnDestroy {
  public id: number = -1;
  public sub: any;
  public room$: any;

  public types: any[] = [
    {
      id: 'standard',
      name: 'Standard',
    },
    {
      id: 'double',
      name: 'Double',
    },
    {
      id: 'suite',
      name: 'Suite',
    },
  ];

  public form: any = {
    name: null,
    price_night: 0,
    type: null,
    max_guests: 2,
    available: true,
  };

  constructor(
    private route: ActivatedRoute,
    private _router: Router,
    private _room: RoomsController,
    private _store: Store<any>
  ) {
    _store.select('rooms').subscribe((response) => {
      this.room$ = response;
    });
  }

  public ngOnInit() {
    this.sub = this.route.params.subscribe((params) => {
      this.id = Number(params['id']);

      if (!isNaN(this.id) || this.id == -1) {
        this._store.dispatch({
          type: RoomTypes.GET_ROOMS,
          uid: this.id,
        });

        this._room.getRoomById(this.id).subscribe(
          (data: any) => {
            this.form = {
              name: data.name,
              price_night: data.price_night,
              type: data.type,
              max_guests: data.max_guests,
              available: data.available,
            };

            this._store.dispatch({
              type: RoomTypes.GET_ROOMS_SUCCESS,
              payload: data,
            });
          },
          (error: any) => {
            this._store.dispatch({
              type: RoomTypes.GET_ROOMS_FAILURE,
              error: error.error,
            });
          }
        );
      }
    });
  }

  public ngOnDestroy() {
    this.sub.unsubscribe();
  }

  public onSubmit(e: MouseEvent) {
    e.preventDefault();

    // If there's an Id, then it's updating a room
    if (isNaN(this.id) || this.id == -1) {
      // Dispatch create
      this._store.dispatch({
        type: RoomTypes.CREATE_ROOMS,
      });

      // Create room
      this._room.createRoom(this.form).subscribe(
        (data: any) => {
          this._store.dispatch({
            type: RoomTypes.CREATE_ROOMS_SUCCESS,
            payload: data,
          });

          this._router.navigate(['/rooms/view', data.id]);
        },
        (error: any) => {
          this._store.dispatch({
            type: RoomTypes.CREATE_ROOMS_FAILURE,
            error: error.error,
          });
        }
      );
    } else {
      // Dispatch update
      this._store.dispatch({
        type: RoomTypes.UPDATE_ROOMS,
      });

      // Update room
      this._room.updateRoom(this.id, this.form).subscribe(
        (data: any) => {
          this._store.dispatch({
            type: RoomTypes.UPDATE_ROOMS_SUCCESS,
            payload: data,
          });

          this._router.navigate(['/rooms/view', data.id]);
        },
        (error: any) => {
          this._store.dispatch({
            type: RoomTypes.UPDATE_ROOMS_FAILURE,
            error: error.error,
          });
        }
      );
    }
  }
}
