import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { GuestsController } from '../../../ducks/guests/guests.controller';
import { types } from '../../../ducks/guests/guests.types';

@Component({
    selector: 'app-detail-guests',
    templateUrl: './guests.detail.component.html',
    encapsulation: ViewEncapsulation.None
})
export class GuestsDetailComponent implements OnInit, OnDestroy {
    public id: number;
    public sub: any;
    public guest$: any;

    constructor(private route: ActivatedRoute, private _guests: GuestsController, private _store: Store<any>) {
        _store.select('guests').subscribe((response) => {
            this.guest$ = response;
        });
    }

    public ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.id = Number(params['id']);
            this._store.dispatch({
                type: types.GET_GUESTS,
                uid: this.id
            });

            this._guests.getGuestById(this.id).subscribe((data: any) => {
                this._store.dispatch({
                    type: types.GET_GUESTS_SUCCESS,
                    payload: data
                });
            }, (error: any) => {
                this._store.dispatch({
                    type: types.GET_GUESTS_FAILURE,
                    error: error.error
                });
            });
        });
    }

    public ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
