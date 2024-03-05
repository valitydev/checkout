import { useCallback, useEffect, useReducer } from 'react';

import { Gateway, getGateways as getApiGateways } from '../../../common/backend/p2p';
import { extractError } from '../../../common/utils';

type State =
    | { status: 'PRISTINE' | 'LOADING'; retryCount: number }
    | { status: 'SUCCESS'; data: Gateway[]; retryCount: number }
    | { status: 'FAILURE'; retryCount: number };

type Action =
    | { type: 'FETCH_START' }
    | { type: 'FETCH_SUCCESS'; payload: Gateway[] }
    | { type: 'FETCH_ATTEMPT_FAILURE' }
    | { type: 'FETCH_FAILURE' }
    | { type: 'RETRY' }
    | { type: 'RESET_RETRY' };

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'FETCH_START':
            return { ...state, status: 'LOADING' };
        case 'FETCH_SUCCESS':
            return { status: 'SUCCESS', data: action.payload, retryCount: 0 };
        case 'FETCH_ATTEMPT_FAILURE':
            return { status: 'LOADING', retryCount: state.retryCount };
        case 'FETCH_FAILURE':
            return { status: 'FAILURE', retryCount: state.retryCount };
        case 'RETRY':
            return { ...state, retryCount: state.retryCount + 1 };
        case 'RESET_RETRY':
            return { ...state, retryCount: 0 };
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
            dispatch({ type: 'FETCH_ATTEMPT_FAILURE' });
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
        if (state.status === 'FAILURE' && state.retryCount < MAX_RETRY_ATTEMPTS) {
            const timer = setTimeout(getGateways, RETRY_TIMEOUT_MS);
            return () => clearTimeout(timer);
        }
    }, [state.status, state.retryCount, getGateways]);

    return { state, getGateways };
};
