// Angular imports
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
} from '@angular/material/core';
import {
  MatMomentDateModule,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialogModule,
} from '@angular/material/dialog';

// ngrx and redux imports
import { StoreModule } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';
import { bookingsReducer, guestsReducer, roomsReducer } from './ducks/index';

// set environment
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { AppState } from './app.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ROUTES } from './app.routes';

// Controllers
import { RoomsController } from './ducks/rooms/rooms.controller';
import { BookingsController } from './ducks/bookings/bookings.controller';
import { GuestsController } from './ducks/guests/guests.controller';

import {
  DateFormats,
  CustomDateAdapter,
} from './helpers/dateFormat/dateFormat';

const APP_PROVIDERS = [
  AppState,
  BookingsController,
  GuestsController,
  RoomsController,
];

export function localStorageSyncReducer(reducer: any) {
  return localStorageSync({
    rehydrate: true,
    keys: ['rooms'],
  })(reducer);
}

export const metaReducers = environment.production
  ? [localStorageSyncReducer]
  : [localStorageSyncReducer];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES, {
      useHash: Boolean(history.pushState) === false,
      preloadingStrategy: PreloadAllModules,
    }),
    StoreModule.forRoot(
      {
        bookings: bookingsReducer,
        guests: guestsReducer,
        rooms: roomsReducer,
      },
      {
        metaReducers,
      }
    ),
    MatMomentDateModule,
    MatDialogModule,
  ],
  providers: [
    APP_PROVIDERS,
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    {
      provide: DateAdapter,
      useClass: CustomDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useClass: DateFormats },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
