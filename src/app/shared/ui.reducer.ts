import { Action } from '@ngrx/store';

import { UIActions, START_LOADING, STOP_LOADING, SWITCH_POOL } from './ui.actions';

export interface State {
    isLoading: boolean;
    activePool: string;
}

const initialState: State = {
    isLoading: false,
    activePool: ''
};

export function uiReducer(state = initialState, action: UIActions) {
    switch (action.type) {
        case START_LOADING:
            return {
                ...state,
                isLoading: true
            };
        case STOP_LOADING:
            return {
                ...state,
                isLoading: false
            };
        case SWITCH_POOL:
            if ( state.activePool === '') {
                return {
                    ...state,
                    activePool: 'Pool 1'
                };
            } else if (state.activePool === 'Pool 1') {
                return {
                    ...state,
                    activePool: 'Pool 2'
                };
            } else {
                return {
                    ...state,
                    activePool: 'Pool 1'
                };
            }
        default: {
            return state;
        }
    }
}

export const getIsLoading = (state: State) => state.isLoading;
export const getActivePool = (state: State) => state.activePool;
