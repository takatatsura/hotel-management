import { Injectable } from '@angular/core';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { DateAdapter, NativeDateAdapter } from '@angular/material/core';

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
  formato = '';
  override parse(value: any) {
    const parts = value.match(/\d{1,4}/g);
    if (parts && parts.length == 3) {
      const order = this.formato.match(/Y{2,4}|M{1,2}|D{1,2}/g);
      if (order) {
        const year =
          +parts[
            order.indexOf('YYYY') < 0
              ? order.indexOf('YY')
              : order.indexOf('YYYY')
          ];
        const month =
          +parts[
            order.indexOf('MM') < 0 ? order.indexOf('M') : order.indexOf('MM')
          ];
        const day =
          +parts[
            order.indexOf('DD') < 0 ? order.indexOf('D') : order.indexOf('DD')
          ];
        return new Date(year < 100 ? year + 2000 : year, month - 1, day);
      }
    }
    return null;
  }
  override format(date: any, displayFormat: any): string {
    if (displayFormat == 'MMM YYYY')
      return (
        this.getMonthNames('long')[date.getMonth()] + ' ' + date.getFullYear()
      );

    const result = displayFormat
      .replace('YYYY', date.getFullYear())
      .replace('YY', date.getYear())
      .replace('MMM', this.getMonthNames('long')[date.getMonth()])
      .replace('MM', ('00' + (date.getMonth() + 1)).slice(-2))
      .replace('M', date.getMonth() + 1)
      .replace('DD', ('00' + date.getDate()).slice(-2))
      .replace('M', date.getDate());
    return result;
  }
}

export class DateFormats {
  value = 1;
  constructor() {}
  get display() {
    return this.value == 1
      ? {
          dateInput: 'YYYY/MM/DD',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY',
        }
      : {
          dateInput: 'DD/MM/YYYY',
          monthYearLabel: 'MM YYYY',
          dateA11yLabel: 'DD/MM/YYYY',
          monthYearA11yLabel: 'MM YYYY',
        };
  }
  get parse() {
    return this.value == 1
      ? {
          dateInput: 'YYYY/MM/DD',
        }
      : {
          dateInput: 'DD/MM/YYYY',
        };
  }
}
