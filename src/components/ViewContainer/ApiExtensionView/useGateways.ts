import { useCallback, useEffect, useReducer } from 'react';

import { Gateway, getGateways as getApiGateways } from '../../../common/backend/p2p';
import { extractError } from '../../../common/utils';

type State =
    | { status: 'PRISTINE' | 'LOADING' | 'FAILURE'; retryCount: number }
    | { status: 'SUCCESS'; data: Gateway[]; retryCount: number };

type Action =
    | { type: 'FETCH_START' }
    | { type: 'FETCH_SUCCESS'; payload: Gateway[] }
    | { type: 'FETCH_FAILURE' }
    | { type: 'RETRY' };

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'FETCH_START':
            return { ...state, status: 'LOADING' };
        case 'FETCH_SUCCESS':
            return { status: 'SUCCESS', data: action.payload, retryCount: 0 };
        case 'FETCH_FAILURE':
            return { status: 'FAILURE', retryCount: state.retryCount };
        case 'RETRY':
            return { ...state, retryCount: state.retryCount + 1 };
        default:
            return state;
    }
};

const MAX_RETRY_ATTEMPTS = 3;
const RETRY_TIMEOUT_MS = 3000;

export const useGateways = (capiEndpoint: string, accessToken: string, invoiceID: string, paymentID: string) => {
    const [state, dispatch] = useReducer(reducer, {
        status: 'PRISTINE',
        retryCount: 0,
    });

    const getGateways = useCallback(async () => {
        dispatch({ type: 'FETCH_START' });
        try {
            const gateways = await getApiGateways(capiEndpoint, accessToken, invoiceID, paymentID);
            dispatch({ type: 'FETCH_SUCCESS', payload: gateways });
        } catch (error) {
            if (state.retryCount < MAX_RETRY_ATTEMPTS) {
                dispatch({ type: 'RETRY' });
            }
            if (state.retryCount === MAX_RETRY_ATTEMPTS) {
                dispatch({ type: 'FETCH_FAILURE' });
                console.error(`Failed to fetch gateways. ${extractError(error)}`);
            }
        }
    }, [capiEndpoint, accessToken, invoiceID, paymentID, state.retryCount]);

    useEffect(() => {
        if (state.status === 'LOADING' && state.retryCount > 0 && state.retryCount < MAX_RETRY_ATTEMPTS) {
            const timer = setTimeout(getGateways, RETRY_TIMEOUT_MS);
            return () => clearTimeout(timer);
        }
    }, [state.status, state.retryCount, getGateways]);

    return { state, getGateways };
};
