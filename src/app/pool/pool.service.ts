import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';

import { Pool } from './pool.model';
import { Player } from './player.model';

import { UiService } from '../shared/ui.service';
import * as UI from '../shared/ui.actions';
import * as fromPool from './pool.reducer';
import * as PoolAct from './pool.actions';

@Injectable()
export class PoolService {
    private fbSubs: Subscription[] = [];

    constructor(private db: AngularFirestore, private uiService: UiService, private store: Store<fromPool.State>) {}

    fetchPools() {
        this.store.dispatch(new UI.StartLoading);
        this.fbSubs.push(this.db
            .collection('pools')
            .snapshotChanges()
            .map(docArray => {
                return docArray.map(doc => {
                    return {
                        id: doc.payload.doc.id,
                        name : doc.payload.doc.data().name
                    };
                });
            })
        .subscribe((pools: Pool[]) => {
            this.store.dispatch(new PoolAct.SetPools(pools));
            this.store.dispatch(new UI.StopLoading);
        }, error => {
            this.store.dispatch(new UI.StopLoading);
            this.uiService.showSnacbar('fetching exercice failed, please try again later', null, 3000);
        }));
    }

    cancelSubscriptions() {
        this.fbSubs.forEach(sub => sub.unsubscribe());
    }
}
