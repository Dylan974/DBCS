import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NgForm } from '@angular/forms';

import { PoolService } from './pool.service';

@Component({
    selector: 'app-register-fight',
    templateUrl: './register-fight.component.html'
})

export class RegisterFightComponent {
    constructor(
        public dialogRef: MatDialogRef<RegisterFightComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private poolService: PoolService) {}

    onSubmit(form: NgForm) {
        console.log(form.value, this.data.pool.id);
        this.poolService.registerFight(this.data.pool.id,
            form.value.fighter1,
            form.value.fighter2,
            form.value.score1,
            form.value.score2,
            form.value.organisateur
        );
        this.dialogRef.close();
    }
}
