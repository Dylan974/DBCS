import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { MatTableDataSource, MatSort, MatPaginator, MatTabChangeEvent } from '@angular/material';

import { Pool } from './pool.model';
import { PoolService } from './pool.service';
// import * as fromPool from './pool.reducer';
import * as fromRoot from '../app.reducer';
import { Player } from './player.model';

@Component({
  selector: 'app-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.css']
})
export class PoolComponent implements OnInit, AfterViewInit {
  private pools$: Observable<Pool[]>;
  isLoading$: Observable<boolean>;
  displayedColumns = ['name', 'nb_fights', 'nb_wins', 'nb_loses', 'tel'];
  dataSource = new MatTableDataSource<Player>();
  activePool: string;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private poolService: PoolService, private store: Store<fromRoot.State>) { }

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.pools$ = this.store.select(fromRoot.getPools);
    this.fetchPools();
  }

  fetchPools() {
    this.poolService.fetchPools();
  }

  addPlayerToPool(id_pool) {
    this.poolService.addPlayerToPool(id_pool, {
      id: '1',
      name: 'dyl',
      tel: '0693979745',
      points: 0,
      nb_fights: 0,
      nb_wins: 0,
      nb_loses: 0
    });
  }

  tabChanged (tabChangeEvent: MatTabChangeEvent) {
    this.activePool = tabChangeEvent.tab.textLabel;
    console.log(this.activePool);
    this.pools$.subscribe((pool: Pool[]) => {
      this.dataSource.data = pool.find(p => p.name === this.activePool).players;
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
