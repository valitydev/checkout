import { useCallback, useReducer } from 'react';

import { InitParams, initialize } from '../../app/initialize';
import { Transport } from '../../communicator';

type State =
    | { status: 'PRISTINE' }
    | { status: 'SUCCESS'; data: [Transport, InitParams] }
    | { status: 'FAILURE'; data: null; error: unknown };

type Action =
    | { type: 'INITIALIZE_SUCCESS'; payload: [Transport, InitParams] }
    | { type: 'INITIALIZE_FAILURE'; error: unknown };

const dataReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'INITIALIZE_SUCCESS':
            return {
                ...state,
                status: 'SUCCESS',
                data: action.payload,
            };
        case 'INITIALIZE_FAILURE':
            return {
                ...state,
                status: 'FAILURE',
                error: action.error,
                data: null,
            };
        default:
            return state;
    }
};

export const useInitialize = () => {
    const [state, dispatch] = useReducer(dataReducer, {
        status: 'PRISTINE',
    });

    const init = useCallback(() => {
        (async () => {
            try {
                const payload = await initialize();
                dispatch({
                    type: 'INITIALIZE_SUCCESS',
                    payload,
                });
            } catch (error) {
                dispatch({ type: 'INITIALIZE_FAILURE', error });
            }
        })();
    }, []);

    return { state, init };
};
