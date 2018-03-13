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
                        players: doc.payload.doc.data().players,
                        fights: doc.payload.doc.data().fights,
                        planned_fights: doc.payload.doc.data().planned_fights
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

    private getPlayersInPool(id_pool: string) {
        let players;
        this.store.select(fromRoot.getPools).pipe(take(1)).subscribe(pool => {
            players = pool.find(p => p.id === id_pool).players;
        });
        return players;
    }

    private getFightsInPool(id_pool: string) {
        let fights;
        this.store.select(fromRoot.getPools).pipe(take(1)).subscribe(pool => {
            fights = pool.find(p => p.id === id_pool).fights;
        });
        return fights;
    }

    private getPlannedFightsInPool(id_pool: string) {
        let fights;
        this.store.select(fromRoot.getPools).pipe(take(1)).subscribe(pool => {
            fights = pool.find(p => p.id === id_pool).planned_fights;
        });
        return fights;
    }

    private getPlayerByName(name: string, players) {
        return players.find(p => {
            if (p.name === name) {
                return p;
            }
        });
    }

    addPlayerToPool(id_pool: string, player: Player) {
        const players = this.getPlayersInPool(id_pool);
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

    registerFight(id_pool: string, player1: string, player2: string, score1: number, score2: number, organisateur: string) {
        const players = this.getPlayersInPool(id_pool);
        const p1 = this.getPlayerByName(player1, players);
        const p2 = this.getPlayerByName(player2, players);
        p1.nb_fights += 1;
        p2.nb_fights += 1;
        if (score1 > score2) {
            p1.nb_wins += 1;
            p1.points += 1;
            p2.nb_loses += 1;
            p2.points -= 1;
        } else {
            p2.nb_wins += 1;
            p2.points += 1;
            p1.nb_loses += 1;
            p1.points -= 1;
        }
        players.find(p => {
            if (p.name === p1.name) {
                p = p1;
            } else if (p.name === p2.name) {
                p = p2;
            }
        });
        const fights = this.getFightsInPool(id_pool);
        fights.push({player1, player2, score1, score2, organisateur, date: new Date()});
        this.db.doc('pools/' + id_pool).update({players});
        this.db.doc('pools/' + id_pool).update({fights});
        this.db.collection('fights').add({ ...fights });
    }

    plannedFight(id_pool: string, player1: string, player2: string, organisateur: string, date: Date) {
        const players = this.getPlayersInPool(id_pool);
        const fights = this.getPlannedFightsInPool(id_pool);
        fights.push({player1, player2, organisateur, date});
        this.db.doc('pools/' + id_pool).update({planned_fights: fights});
    }



    // private addDataToDatabase(exercise: Exercise) {
    //     this.db.collection('finishedExercises').add(exercise);
    // }
}
