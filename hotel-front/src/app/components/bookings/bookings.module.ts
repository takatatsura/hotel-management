import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import {
  MomentDateModule,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MatMomentDateModule,
} from '@angular/material-moment-adapter';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import * as _moment from 'moment';

import { routes } from './bookings.routes';
import { BookingsListComponent } from './list/bookings.list.component';
import { BookingsFormComponent } from './form/bookings.form.component';
import { BookingsDetailComponent } from './detail/bookings.detail.component';

import { LoadingSpinnerModule } from '../loading-spinner/loading-spinner.module';
import { SearchFilterModule } from '../../helpers/search/searchFilter.module';
import { CustomDateAdapter } from '../../helpers/dateFormat/dateFormat';

const moment = _moment;

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AngularMultiSelectModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MatAutocompleteModule,
    MatDatepickerModule,
    LoadingSpinnerModule,
    SearchFilterModule,
    MatSlideToggleModule,
    MomentDateModule,
    MatDialogModule,
    MatButtonModule,
  ],
  declarations: [
    BookingsListComponent,
    BookingsFormComponent,
    BookingsDetailComponent,
  ],
  providers: [
    MatDatepickerModule,
    MatDialogModule,
    MomentDateAdapter,
    CustomDateAdapter,
    MatDialogContent,
    MatDialogActions,
    {
      provide: DateAdapter,
      useClass: CustomDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
  ],
})
export class BookingsModule {
  public static routes = routes;
}
