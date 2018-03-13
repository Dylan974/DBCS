import { Component, Inject, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource, MatSort, MatPaginator, MatDialog } from '@angular/material';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { PoolService } from './pool.service';
import { Fight } from './fight.model';
import { RegisterFightComponent } from './register-fight.component';
import * as fromRoot from '../app.reducer';

@Component({
    selector: 'app-show-fights',
    templateUrl: './show-fights.component.html'
})

export class ShowFightsComponent implements OnInit, AfterViewInit {
    displayedColumns = ['date', 'fighter1', 'fighter2', 'organisateur', 'register'];
    dataSource = new MatTableDataSource<Fight>();
    type_fights = 'planned';
    isAuth$: Observable<boolean>;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    constructor(
        public dialogRef: MatDialogRef<ShowFightsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private poolService: PoolService,
        private dialog: MatDialog,
        private store: Store<fromRoot.State>) {}

    ngOnInit() {
        this.isAuth$ = this.store.select(fromRoot.getIsAuth);
        this.type_fights = 'planned';
        this.dataSource.data = this.data.planned_fights;
    }

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    }

    doFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    selectedFightsChanged(type) {
        this.type_fights = type;
        if (type === 'planned') {
            this.dataSource.data = this.data.planned_fights;
            this.displayedColumns = ['date', 'fighter1', 'fighter2', 'organisateur', 'register'];
        } else {
            this.dataSource.data = this.data.fights;
            this.displayedColumns = ['date', 'fighter1', 'score', 'fighter2', 'organisateur'];
        }
    }

    registerPlannedFight(element) {
        console.log(element);
        const dialogRef = this.dialog.open(RegisterFightComponent, { data: {
            pool: this.data.pool,
            player1: element.player1,
            player2: element.player2,
            organisateur: element.organisateur,
            planned: true
        }});
        this.dialogRef.close();
    }

}
