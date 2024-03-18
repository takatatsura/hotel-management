import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';

import { GuestsController } from '../../../ducks/guests/guests.controller';
import { types } from '../../../ducks/guests/guests.types';

@Component({
    selector: 'app-list-guests',
    templateUrl: './guests.list.component.html',
    encapsulation: ViewEncapsulation.None
})
export class GuestsListComponent implements OnInit {
    public guests$: any;

    constructor(private _guests: GuestsController, private _store: Store<any>) {
        _store.select('guests').subscribe((response) => {
            this.guests$ = response;
        });
    }

    public ngOnInit() {
        this._store.dispatch({
            type: types.LIST_GUESTS
        });

        this._guests.getGuests().subscribe((data: any) => {
            this._store.dispatch({
                type: types.LIST_GUESTS_SUCCESS,
                payload: data
            });
        }, (error: any) => {
            this._store.dispatch({
                type: types.LIST_GUESTS_FAILURE
            });
        });
    }
}
