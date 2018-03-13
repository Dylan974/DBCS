import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NgForm } from '@angular/forms';

import { PoolService } from './pool.service';

@Component({
    selector: 'app-planned-fight',
    templateUrl: './planned-fight.component.html'
})

export class PlannedFightComponent implements OnInit {
    minDate;
    constructor(
        public dialogRef: MatDialogRef<PlannedFightComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private poolService: PoolService) {}

    ngOnInit() {
        this.minDate = new Date();
    }

    onSubmit(form: NgForm) {
        form.value.date.setHours(parseInt(form.value.time.slice(0, 2), 10), parseInt(form.value.time.slice(3, 5), 10)); // add time to date
        console.log(form.value);
        this.poolService.plannedFight(this.data.pool.id,
            form.value.fighter1,
            form.value.fighter2,
            form.value.organisateur,
            form.value.date
        );
        this.dialogRef.close();
    }
}
