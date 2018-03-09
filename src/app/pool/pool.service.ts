import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

import { Pool } from './pool.model';
import { Player } from './player.model';

import { UiService } from '../shared/ui.service';
import * as UI from '../shared/ui.actions';
import * as fromPool from './pool.reducer';
import * as fromRoot from '../app.reducer';
import * as PoolAct from './pool.actions';

@Injectable()
export class PoolService {
    private fbSubs: Subscription[] = [];
    private playersDB: Player[];

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
                        name : doc.payload.doc.data().name,
                        players: doc.payload.doc.data().players
                    };
                });
            })
        .subscribe((pools: Pool[]) => {
            this.store.dispatch(new PoolAct.SetPools(pools));
            this.store.dispatch(new UI.StopLoading);
        }, error => {
            this.store.dispatch(new UI.StopLoading);
            this.uiService.showSnacbar('fetching pools failed, please try again later', null, 3000);
        }));

        this.store.dispatch(new UI.StartLoading);
        this.fbSubs.push(this.db
            .collection('players')
            .snapshotChanges()
            .map(docArray => {
                return docArray.map(doc => {
                    return doc.payload.doc.data();
                });
            })
        .subscribe((players: Player[]) => {
            this.playersDB = players;
            this.store.dispatch(new UI.StopLoading);
        }, error => {
            this.store.dispatch(new UI.StopLoading);
            this.uiService.showSnacbar('fetching fighters failed, please try again later', null, 3000);
        }));
    }

    cancelSubscriptions() {
        this.fbSubs.forEach(sub => sub.unsubscribe());
    }

    addPlayerToPool(id_pool: string, player: Player) {
        let players;
        this.store.select(fromRoot.getPools).pipe(take(1)).subscribe(pool => {
            players = pool.find(p => p.id === id_pool).players;
        });
        if (this.playersDB.find(p => p.name === player.name)) {
            this.uiService.showSnacbar('Fighter already in another pool.', null, 3000);
        } else if (players.find(p => p.name === player.name)) {
            this.uiService.showSnacbar('Fighter already in the pool.', null, 3000);
        } else {
            this.store.dispatch(new UI.StartLoading);
            players.push(player);
            this.db.doc('pools/' + id_pool).update({players});
            this.db.collection('players').add(player);
            this.store.dispatch(new UI.StopLoading);
            this.uiService.showSnacbar('Fighter was added in the pool.', null, 3000);
        }
    }

    // private addDataToDatabase(exercise: Exercise) {
    //     this.db.collection('finishedExercises').add(exercise);
    // }
}
