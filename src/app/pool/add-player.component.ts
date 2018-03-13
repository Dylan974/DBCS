import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NgForm } from '@angular/forms';
// const shortid = require('shortid');

import { PoolService } from './pool.service';

@Component({
    selector: 'app-add-player',
    templateUrl: './add-player.component.html'
})

export class AddPlayerComponent {
    constructor(
        public dialogRef: MatDialogRef<AddPlayerComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private poolService: PoolService) {}

    onSubmit(form: NgForm) {
        console.log(form.value, this.data.id_pool);
        this.poolService.addPlayerToPool(this.data.id_pool, {
            // id: shortid.generate(),
            name: form.value.name,
            tel: form.value.tel,
            points: 0,
            nb_fights: 0,
            nb_wins: 0,
            nb_loses: 0
        });
        this.dialogRef.close();
    }
}
