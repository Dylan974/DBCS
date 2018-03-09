import { Action } from '@ngrx/store';

import { Pool } from './pool.model';

export const SET_POOLS = '[Pool] Set Pools';

export class SetPools implements Action {
    readonly type = SET_POOLS;

    constructor(public payload: Pool[]) {}
}


export type PoolActions = SetPools;
