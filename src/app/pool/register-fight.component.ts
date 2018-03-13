import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NgForm } from '@angular/forms';

import { PoolService } from './pool.service';

@Component({
    selector: 'app-register-fight',
    templateUrl: './register-fight.component.html'
})

export class RegisterFightComponent implements OnInit {
    fighter1: string;
    fighter2: string;
    organisateur: string;

    constructor(
        public dialogRef: MatDialogRef<RegisterFightComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private poolService: PoolService) {}

    ngOnInit() {
        console.log(this.data);
        if (this.data.planned) {
            this.fighter1 = this.data.player1;
            this.fighter2 = this.data.player2;
            this.organisateur = this.data.organisateur;
        } else {

        }
    }

    onSubmit(form: NgForm) {
        if (this.data.planned) {
            console.log(form.value, this.data.player1, this.data.player2, this.data.pool.id);
            this.poolService.registerFight(
                this.data.pool.id,
                this.data.player1,
                this.data.player2,
                form.value.score1,
                form.value.score2,
                this.data.organisateur,
                this.data.planned
            );
        } else {
            console.log(form.value, this.data.pool.id);
            this.poolService.registerFight(
                this.data.pool.id,
                form.value.fighter1,
                form.value.fighter2,
                form.value.score1,
                form.value.score2,
                form.value.organisateur,
                this.data.planned
            );
        }
        this.dialogRef.close();
    }
}
