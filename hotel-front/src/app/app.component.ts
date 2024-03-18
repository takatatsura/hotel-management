import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AppState } from './app.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-component',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  public name = 'Hotel Management';
  public openSidebar = false;
  public openNotifications = false;

  constructor(
    public _appState: AppState,
    private _titleService: Title,
    private _router: Router
  ) {}

  public ngOnInit() {
    this.name = environment.name;
    this._titleService.setTitle(`${environment.name} Admin`);
  }
}
