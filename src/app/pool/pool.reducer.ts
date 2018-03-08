import { Action, createFeatureSelector, createSelector } from '@ngrx/store';

import { PoolActions, SET_POOLS} from './pool.actions';
import { Pool } from './pool.model';
import * as fromRoot from '../app.reducer';

export interface PoolState {
    pools: Pool[];
}

export interface State extends fromRoot.State {
    pool: PoolState;
}

const initialState: PoolState = {
    pools: []
};

export function poolReducer(state = initialState, action: PoolActions) {
    switch (action.type) {
        case SET_POOLS:
            return {
                ...state,
                pools: action.payload
            };
        default: {
            return state;
        }
    }
}

// export const getPoolState = createFeatureSelector<PoolState>('pool');
// export const getPools = createSelector(getPoolState, (state: PoolState) => state.pools);
