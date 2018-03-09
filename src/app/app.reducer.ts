import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromUi from './shared/ui.reducer';
import * as fromAuth from './auth/auth.reducer';
import * as fromPool from './pool/pool.reducer';

export interface State {
    ui: fromUi.State;
    auth: fromAuth.State;
    pool: fromPool.PoolState;
}

export const reducers: ActionReducerMap<State> = {
    ui: fromUi.uiReducer,
    auth: fromAuth.authReducer,
    pool: fromPool.poolReducer,
};

export const getUiState = createFeatureSelector<fromUi.State>('ui');
export const getIsLoading = createSelector(getUiState, fromUi.getIsLoading);

export const getAuthState = createFeatureSelector<fromAuth.State>('auth');
export const getIsAuth = createSelector(getAuthState, fromAuth.getIsAuth);

export const getPoolState = createFeatureSelector<fromPool.PoolState>('pool');
export const getPools = createSelector(getPoolState, (state: fromPool.PoolState) => state.pools);
