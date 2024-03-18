import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class BookingsController {
  constructor(public http: HttpClient) {}

  public getBookings(): Observable<any> {
    return this.http.get<any>(environment.api_url + '/booking');
  }

  public getBookingById(bookingId: number): Observable<any> {
    return this.http.get<any>(environment.api_url + '/booking/' + bookingId);
  }

  public createBooking(booking: any) {
    return this.http.post(environment.api_url + '/booking', booking);
  }

  public updateBooking(bookingId: number, booking: any): Observable<any> {
    return this.http.put<any>(
      environment.api_url + '/booking/' + bookingId,
      booking
    );
  }

  public checkInBooking(bookingId: number, booking: any): Observable<any> {
    return this.http.put<any>(
      environment.api_url + '/booking-check-in/' + bookingId,
      booking
    );
  }
  public checkOutBooking(bookingId: number, booking: any): Observable<any> {
    return this.http.put<any>(
      environment.api_url + '/booking-check-out/' + bookingId,
      booking
    );
  }
}
