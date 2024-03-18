import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class RoomsController {
  httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Request-Method': 'POST',
    }),
  };
  constructor(public http: HttpClient) {}

  public getRooms(status: string = ''): Observable<any> {
    let params = new HttpParams();
    params = params.append('status', status);
    return this.http.get<any>(environment.api_url + '/room', {
      params: params,
    });
  }

  public getRoomById(roomId: number): Observable<any> {
    return this.http.get<any>(environment.api_url + '/room/' + roomId);
  }

  public createRoom(room: any) {
    return this.http.post(
      environment.api_url + '/room',
      room,
      this.httpOptions
    );
  }

  public updateRoom(roomId: number, room: any): Observable<any> {
    return this.http.put<any>(environment.api_url + '/room/' + roomId, room);
  }

  public getRoomStatuses(roomId: number) {
    return this.http.get<any>(environment.api_url + '/room-status/' + roomId);
  }
}
