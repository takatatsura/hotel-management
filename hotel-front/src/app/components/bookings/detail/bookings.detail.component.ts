import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  Inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { Store } from '@ngrx/store';

import { BookingsController } from '../../../ducks/bookings/bookings.controller';
import { types } from '../../../ducks/bookings/bookings.types';
import { DateFormats } from '../../../helpers/dateFormat/dateFormat';

@Component({
  selector: 'app-detail-bookings',
  templateUrl: './bookings.detail.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class BookingsDetailComponent implements OnInit, OnDestroy {
  public id: number = -1;
  public sub: any;
  public booking$: any;
  public dateFormat: string;

  constructor(
    private route: ActivatedRoute,
    private _bookings: BookingsController,
    private _store: Store<any>,
    @Inject(MAT_DATE_FORMATS) private _dateFormat: DateFormats
  ) {
    _store.select('bookings').subscribe((response) => {
      this.booking$ = response;
    });
    // Setting date format
    this.dateFormat = this._dateFormat.parse.dateInput.replace('DD', 'dd');
  }

  public ngOnInit() {
    this.sub = this.route.params.subscribe((params) => {
      this.id = Number(params['id']);
      this._store.dispatch({
        type: types.GET_BOOKINGS,
        uid: this.id,
      });

      this._bookings.getBookingById(this.id).subscribe(
        (data: any) => {
          this._store.dispatch({
            type: types.GET_BOOKINGS_SUCCESS,
            payload: data,
          });
        },
        (error: any) => {
          this._store.dispatch({
            type: types.GET_BOOKINGS_FAILURE,
            error: error.error,
          });
        }
      );
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
