import { useCallback, useReducer } from 'react';

import { complete as completeApi } from 'checkout/backend/p2p';

type State =
    | { status: 'PRISTINE' }
    | { status: 'LOADING' }
    | { status: 'SUCCESS' }
    | { status: 'FAILURE'; error: unknown };

type Action = { type: 'COMPLETE_INIT' } | { type: 'COMPLETE_SUCCESS' } | { type: 'COMPLETE_FAILURE'; error: unknown };

const dataFetchReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'COMPLETE_INIT':
            return {
                status: 'LOADING',
            };
        case 'COMPLETE_SUCCESS':
            return {
                ...state,
                status: 'SUCCESS',
            };
        case 'COMPLETE_FAILURE':
            return {
                ...state,
                status: 'FAILURE',
                error: action.error,
            };
    }
};

export const useComplete = (capiEndpoint: string, accessToken: string, invoiceID: string, paymentID: string) => {
    const [state, dispatch] = useReducer(dataFetchReducer, {
        status: 'PRISTINE',
    });

    const complete = useCallback(() => {
        const fetchData = async () => {
            try {
                dispatch({ type: 'COMPLETE_INIT' });
                await completeApi(capiEndpoint, accessToken, { invoiceId: invoiceID, paymentId: paymentID });
                dispatch({
                    type: 'COMPLETE_SUCCESS',
                });
            } catch (error) {
                console.error('complete error', error);
                dispatch({ type: 'COMPLETE_FAILURE', error });
            }
        };
        fetchData();
    }, []);

    return { state, complete };
};
