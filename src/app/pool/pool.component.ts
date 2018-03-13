import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { MatTableDataSource, MatSort, MatPaginator, MatTabChangeEvent, MatDialog } from '@angular/material';
import { take } from 'rxjs/operators';

import { Pool } from './pool.model';
import { PoolService } from './pool.service';
// import * as fromPool from './pool.reducer';
import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';
import { Player } from './player.model';
import { AddPlayerComponent } from './add-player.component';
import { RegisterFightComponent } from './register-fight.component';
import { ShowFightsComponent } from './show-fights.component';
import { PlannedFightComponent } from './planned-fight.component';

@Component({
  selector: 'app-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.css']
})
export class PoolComponent implements OnInit {
  pools$: Observable<Pool[]>;
  isLoading$: Observable<boolean>;
  displayedColumns = ['name', 'points', 'nb_fights', 'nb_wins', 'nb_loses', 'tel'];
  dataSource = new MatTableDataSource<Player>();
  activePool: string;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private poolService: PoolService, private store: Store<fromRoot.State>, private dialog: MatDialog) { }

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.pools$ = this.store.select(fromRoot.getPools);
    this.fetchPools();
    this.dataSource.data = [];
  }

  fetchPools() {
    this.poolService.fetchPools();
  }

  addPlayerToPool(id_pool) {
    const dialogRef = this.dialog.open(AddPlayerComponent, { data: {
      id_pool
    }});
  }

  registerFight(pool) {
    const dialogRef = this.dialog.open(RegisterFightComponent, { data: {
      pool,
      players: pool.players
    }});
  }

  plannedFight(pool) {
    const dialogRef = this.dialog.open(PlannedFightComponent, { data: {
      pool,
      players: pool.players
    }});
  }

  seeFights(fights, planned_fights) {
    const dialogRef = this.dialog.open(ShowFightsComponent, {
      width: '550px',
      data: { fights, planned_fights }
    });
  }

  tabChanged (tabChangeEvent: MatTabChangeEvent) {
    this.activePool = tabChangeEvent.tab.textLabel;
    this.store.dispatch(new UI.SwitchPool);
    this.pools$.subscribe((pool: Pool[]) => {
      this.dataSource.data = pool.find(p => p.name === this.activePool).players;
    });
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }


  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
