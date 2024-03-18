import {
  Component,
  OnInit,
  ViewEncapsulation,
  OnDestroy,
  Inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { Store } from '@ngrx/store';

import { RoomsController } from '../../../ducks/rooms/rooms.controller';
import { types } from '../../../ducks/rooms/rooms.types';
import { DateFormats } from '../../../helpers/dateFormat/dateFormat';

@Component({
  selector: 'app-detail-rooms',
  templateUrl: './rooms.detail.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class RoomsDetailComponent implements OnInit, OnDestroy {
  public id: number = -1;
  public sub: any;
  public room$: any;
  public room_statuses$: any;
  public dateFormat: string;

  constructor(
    private route: ActivatedRoute,
    private _rooms: RoomsController,
    private _store: Store<any>,
    @Inject(MAT_DATE_FORMATS) private _dateFormat: DateFormats
  ) {
    _store.select('rooms').subscribe((response) => {
      this.room$ = response;
    });
    this.dateFormat = this._dateFormat.parse.dateInput.replace('DD', 'dd');
  }

  public ngOnInit() {
    this.sub = this.route.params.subscribe((params) => {
      this.id = Number(params['id']);
      this._store.dispatch({
        type: types.GET_ROOMS,
        uid: this.id,
      });

      this._rooms.getRoomById(this.id).subscribe(
        (data: any) => {
          this._store.dispatch({
            type: types.GET_ROOMS_SUCCESS,
            payload: data,
          });
        },
        (error: any) => {
          this._store.dispatch({
            type: types.GET_ROOMS_FAILURE,
            error: error.error,
          });
        }
      );

      this.room_statuses$ = this._rooms.getRoomStatuses(this.id);
    });
  }

  public changeFormat() {
    this._dateFormat.value = this._dateFormat.value == 1 ? 2 : 1;
    this.dateFormat = this._dateFormat.parse.dateInput.replace('DD', 'dd');
  }

  public ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
