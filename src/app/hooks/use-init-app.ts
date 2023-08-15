import { useCallback, useReducer } from 'react';

import { InitParams } from 'checkout/initialize';

import { InitialData, initApp } from './init-app';

type State =
    | { status: 'PRISTINE' }
    | { status: 'SUCCESS'; data: InitialData }
    | { status: 'FAILURE'; data: null; error: unknown };

type Action = { type: 'APP_INIT_SUCCESS'; payload: InitialData } | { type: 'APP_INIT_FAILURE'; error: unknown };

const dataFetchReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'APP_INIT_SUCCESS':
            return {
                ...state,
                status: 'SUCCESS',
                data: action.payload,
            };
        case 'APP_INIT_FAILURE':
            return {
                ...state,
                status: 'FAILURE',
                error: action.error,
                data: null,
            };
    }
};

export const useInitApp = () => {
    const [state, dispatch] = useReducer(dataFetchReducer, {
        status: 'PRISTINE',
    });

    const init = useCallback((initParams: InitParams) => {
        const fetchData = async () => {
            try {
                const payload = await initApp(initParams);
                dispatch({
                    type: 'APP_INIT_SUCCESS',
                    payload,
                });
            } catch (error) {
                dispatch({ type: 'APP_INIT_FAILURE', error });
                console.error('Initialize app failure', error);
            }
        };
        fetchData();
    }, []);

    return { state, init };
};
