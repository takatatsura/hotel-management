import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { BookingsController } from '../../../ducks/bookings/bookings.controller';
import { types as BookingTypes } from '../../../ducks/bookings/bookings.types';
import { types } from '../../../ducks/bookings/bookings.types';
import { DateFormats } from '../../../helpers/dateFormat/dateFormat';

@Component({
  selector: 'app-list-bookings',
  templateUrl: './bookings.list.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class BookingsListComponent implements OnInit {
  public bookings$: any;
  public dateFormat: string;

  constructor(
    private _bookings: BookingsController,
    private _store: Store<any>,
    private route: ActivatedRoute,
    private _router: Router,
    public dialog: MatDialog,
    @Inject(MAT_DATE_FORMATS) private _dateFormat: DateFormats
  ) {
    _store.select('bookings').subscribe((response) => {
      this.bookings$ = response;
    });
    this.dateFormat = this._dateFormat.parse.dateInput.replace('DD', 'dd');
  }

  public ngOnInit() {
    this._store.dispatch({
      type: types.LIST_BOOKINGS,
    });

    this._bookings.getBookings().subscribe(
      (data: any) => {
        this._store.dispatch({
          type: types.LIST_BOOKINGS_SUCCESS,
          payload: data,
        });
      },
      (error: any) => {
        this._store.dispatch({
          type: types.LIST_BOOKINGS_FAILURE,
          error: error.error,
        });
      }
    );
  }

  public changeFormat() {
    this._dateFormat.value = this._dateFormat.value == 1 ? 2 : 1;
    this.dateFormat = this._dateFormat.parse.dateInput.replace('DD', 'dd');
  }

  public openModal(mode: string, id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { mode: mode, id: id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this._router.navigate(['/bookings/view', id]);
    });
  }
}

@Component({
  selector: 'confirm-dialog',
  templateUrl: 'confirm-dialog.html',
})
export class ConfirmDialogComponent {
  constructor(
    private _bookings: BookingsController,
    private route: ActivatedRoute,
    private _router: Router,
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: string; id: number }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirm() {
    if (this.data.mode == 'checkIn') {
      this._bookings
        .checkInBooking(this.data.id, { checkedIn: true })
        .subscribe(this.handleAfterRequest, this.handleRequestError);
    } else {
      this._bookings
        .checkOutBooking(this.data.id, { checkedOut: true })
        .subscribe(this.handleAfterRequest, this.handleRequestError);
    }
    this.dialogRef.close();
  }

  handleAfterRequest(data: any) {
    // this._router.navigate(['/bookings/view', data.id]);
  }

  handleRequestError(error: any) {
    console.log(error);
  }
}
