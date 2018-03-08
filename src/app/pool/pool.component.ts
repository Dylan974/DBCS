import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { Pool } from './pool.model';
import { PoolService } from './pool.service';
// import * as fromPool from './pool.reducer';
import * as fromRoot from '../app.reducer';

@Component({
  selector: 'app-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.css']
})
export class PoolComponent implements OnInit {
  private pools$: Observable<Pool[]>;
  isLoading$: Observable<boolean>;

  constructor(private poolService: PoolService, private store: Store<fromRoot.State>) { }

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.pools$ = this.store.select(fromRoot.getPools);
    this.fetchPools();
    console.log(this.pools$);
  }

  fetchPools() {
    this.poolService.fetchPools();
  }

}
