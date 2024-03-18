import {
  Component,
  OnInit,
  ViewEncapsulation,
  OnDestroy,
  Inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {
  MatDatepickerModule,
  MatDatepickerIntl,
} from '@angular/material/datepicker';
import {
  MomentDateModule,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

import { startWith, map } from 'rxjs/operators';

import { BookingsController } from '../../../ducks/bookings/bookings.controller';
import { RoomsController } from '../../../ducks/rooms/rooms.controller';
import { GuestsController } from '../../../ducks/guests/guests.controller';
import { types as BookingTypes } from '../../../ducks/bookings/bookings.types';
import { types as RoomTypes } from '../../../ducks/rooms/rooms.types';
import { types as GuestTypes } from '../../../ducks/guests/guests.types';
import {
  DateFormats,
  CustomDateAdapter,
} from '../../../helpers/dateFormat/dateFormat';

@Component({
  selector: 'app-form-bookings',
  templateUrl: './bookings.form.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class BookingsFormComponent implements OnInit, OnDestroy {
  public id: number = -1;
  public sub: any;
  public booking$: any;
  public rooms$: any;
  public guests$: any;

  public guestControl: FormControl = new FormControl();
  public guestOptions: any[] = [];
  public guestFiltered: Observable<any[]>;

  public availableRooms: any[];
  public selectedRooms: any[];
  public dropdownSettings: any = {
    singleSelection: false,
    text: 'Select Rooms',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    classes: 'multiselect',
  };

  public form: any = {
    checkin: new FormControl(new Date()),
    checkout: new FormControl(new Date()),
    adults: 1,
    children: 0,
    type: 'desk',
    confirmed: false,
    guest_id: null,
    rooms: null,
    comments: null,
  };

  public types: string[] = ['online', 'phone', 'agency', 'desk'];

  constructor(
    private _router: Router,
    private _bookings: BookingsController,
    private _room: RoomsController,
    private _guest: GuestsController,
    private _store: Store<any>,
    @Inject(DateAdapter) private dateAdapter: CustomDateAdapter,
    private _intl: MatDatepickerIntl,
    @Inject(MAT_DATE_FORMATS) private dateFormat: DateFormats
  ) {
    this.dateAdapter.formato = 'YYYY/MM/DD';
    _store.select('bookings').subscribe((response) => {
      this.booking$ = response;
    });

    _store.select('rooms').subscribe((response) => {
      this.rooms$ = response;
    });

    _store.select('guests').subscribe((response) => {
      this.guests$ = response;
    });

    // Room list
    this._store.dispatch({
      type: RoomTypes.LIST_ROOMS,
    });

    this._room.getRooms('availables').subscribe(
      (data: any) => {
        this.availableRooms = _.map(data, (item) => {
          return {
            id: item.uid,
            itemName: `${item.name} (${item.type} - ${item.max_guests} guest)`,
          };
        });
        this._store.dispatch({
          type: RoomTypes.LIST_ROOMS_SUCCESS,
          payload: data,
        });
      },
      (error: any) => {
        this._store.dispatch({
          type: RoomTypes.LIST_ROOMS_FAILURE,
          error: error.error,
        });
      }
    );

    this._store.dispatch({
      type: GuestTypes.LIST_GUESTS,
    });

    // Guest list
    this._guest.getGuests().subscribe(
      (data: any) => {
        this.guestOptions = _.map(data, (guest) => {
          const email = guest.email !== null ? `(${guest.email})` : '';
          return Object.assign(
            {},
            {
              id: guest.uid,
              name: `${guest.first_name} ${guest.last_name} ${guest.email}`,
            }
          );
        });

        this.guestFiltered = this.guestControl.valueChanges.pipe(
          startWith(null),
          map((guest) => {
            return guest && typeof guest === 'object' ? guest.name : guest;
          }),
          map((name) => {
            return name ? this.filter(name) : this.guestOptions.slice();
          })
        );

        this._store.dispatch({
          type: GuestTypes.LIST_GUESTS_SUCCESS,
          payload: data,
        });
      },
      (error: any) => {
        this._store.dispatch({
          type: GuestTypes.LIST_GUESTS_FAILURE,
          error: error.error,
        });
      }
    );
  }

  public ngOnInit() {
    this.sub = this.route.params.subscribe((params) => {
      this.id = Number(params['id']);

      if (!isNaN(this.id) && this.id != -1) {
        this._store.dispatch({
          type: BookingTypes.GET_BOOKINGS,
          uid: this.id,
        });

        this._bookings.getBookingById(this.id).subscribe(
          (data: any) => {
            this.form = {
              checkin: data.checkin,
              checkout: data.checkout,
              adults: data.adults,
              children: data.children,
              type: data.type,
              confirmed: data.confirmed,
              comments: data.comments,
            };

            this.selectedRooms = _.map(data.room, (room) => {
              return {
                id: room.uid,
                itemName: `${room.name} (${room.type} - ${room.max_guests} guest)`,
              };
            });

            this.guestControl.setValue({
              id: data.guest.uid,
              name: `${data.guest.first_name} ${data.guest.last_name} ${data.guest.email}`,
            });

            this._store.dispatch({
              type: BookingTypes.GET_BOOKINGS_SUCCESS,
              payload: data,
            });
          },
          (error: any) => {
            this._store.dispatch({
              type: BookingTypes.GET_BOOKINGS_FAILURE,
              error: error.error,
            });
          }
        );
      }
    });
  }

  public changeFormat() {
    this.dateFormat.value = this.dateFormat.value == 1 ? 2 : 1;
    this.form.checkin = new FormControl(this.form.checkin.value);
    this.form.checkout = new FormControl(this.form.checkout.value);
  }

  public ngOnDestroy() {
    this.sub.unsubscribe();
  }

  public onSubmit(e: MouseEvent) {
    e.preventDefault();

    // Get guest id value
    (this.form.guest_id = this.guestControl.value
      ? this.guestControl.value.id
      : null),
      // Get selected rooms
      (this.form.rooms = _.map(this.selectedRooms, (room) => room.id));

    // If there's an Id, then it's updating a booking
    if (isNaN(this.id) || this.id == -1) {
      // Dispatch create
      this._store.dispatch({
        type: BookingTypes.CREATE_BOOKINGS,
      });

      // Create booking
      this._bookings.createBooking(this.form).subscribe(
        (data: any) => {
          this._store.dispatch({
            type: BookingTypes.CREATE_BOOKINGS_SUCCESS,
            payload: data,
          });

          this._router.navigate(['/bookings/view', data.id]);
        },
        (error: any) => {
          this._store.dispatch({
            type: BookingTypes.CREATE_BOOKINGS_FAILURE,
            error: error.error,
          });
        }
      );
    } else {
      // Dispatch update
      this._store.dispatch({
        type: BookingTypes.UPDATE_BOOKINGS,
      });

      // Update booking
      this._bookings.updateBooking(this.id, this.form).subscribe(
        (data: any) => {
          this._store.dispatch({
            type: BookingTypes.UPDATE_BOOKINGS_SUCCESS,
            payload: data,
          });

          this._router.navigate(['/bookings/view', data.id]);
        },
        (error: any) => {
          this._store.dispatch({
            type: BookingTypes.UPDATE_BOOKINGS_FAILURE,
            error: error.error,
          });
        }
      );
    }
  }

  public filter(name: any): any[] {
    return this.guestOptions.filter((option) => {
      const selected = name && typeof name === 'object' ? name.name : name;
      return option.name.toLowerCase().indexOf(selected.toLowerCase()) >= 0;
    });
  }

  public displayFn(option: any): any {
    return option ? option.name : option;
  }
}
