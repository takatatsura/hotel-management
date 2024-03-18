import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class GuestsController {
  constructor(public http: HttpClient) {}

  public getGuests(): Observable<any> {
    return this.http.get<any>(environment.api_url + '/guest');
  }

  public getGuestById(guestId: number): Observable<any> {
    return this.http.get<any>(environment.api_url + '/guest/' + guestId);
  }

  public createGuest(guest: any) {
    return this.http.post(environment.api_url + '/guest', guest);
  }

  public updateGuest(guestId: number, guest: any): Observable<any> {
    return this.http.put<any>(environment.api_url + '/guest/' + guestId, guest);
  }
}
