import { useCallback, useEffect, useReducer } from 'react';

import { Destination, getDestinations as getApiDestinations } from '../../../common/backend/p2p';
import { extractError } from '../../../common/utils';

type State =
    | { status: 'PRISTINE' | 'LOADING' | 'FAILURE'; retryCount: number }
    | { status: 'SUCCESS'; data: Destination[]; retryCount: number };

type Action =
    | { type: 'FETCH_START' }
    | { type: 'FETCH_SUCCESS'; payload: Destination[] }
    | { type: 'FETCH_FAILURE' }
    | { type: 'RETRY' };

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'FETCH_START':
            return { ...state, status: 'LOADING' };
        case 'FETCH_SUCCESS':
            return { status: 'SUCCESS', data: action.payload, retryCount: 0 };
        case 'FETCH_FAILURE':
            return { ...state, status: 'FAILURE', retryCount: state.retryCount };
        case 'RETRY':
            return { ...state, retryCount: state.retryCount + 1 };
        default:
            return state;
    }
};

const MAX_RETRY_ATTEMPTS = 3;
const RETRY_TIMEOUT_MS = 3000;

export const useDestinations = (
    capiEndpoint: string,
    accessToken: string,
    invoiceID: string,
    paymentID: string,
    gatewayID: string,
) => {
    const [state, dispatch] = useReducer(reducer, {
        status: 'PRISTINE',
        retryCount: 0,
    });

    const getDestinations = useCallback(async () => {
        dispatch({ type: 'FETCH_START' });
        try {
            const destinations = await getApiDestinations(capiEndpoint, accessToken, invoiceID, paymentID, gatewayID);
            dispatch({ type: 'FETCH_SUCCESS', payload: destinations });
        } catch (error) {
            if (state.retryCount < MAX_RETRY_ATTEMPTS) {
                dispatch({ type: 'RETRY' });
            }
            if (state.retryCount === MAX_RETRY_ATTEMPTS) {
                dispatch({ type: 'FETCH_FAILURE' });
                console.error(`Failed to fetch destinations. ${extractError(error)}`);
            }
        }
    }, [capiEndpoint, accessToken, invoiceID, paymentID, gatewayID, state.retryCount]);

    useEffect(() => {
        if (state.status === 'LOADING' && state.retryCount > 0 && state.retryCount < MAX_RETRY_ATTEMPTS) {
            const timer = setTimeout(getDestinations, RETRY_TIMEOUT_MS);
            return () => clearTimeout(timer);
        }
    }, [state.status, state.retryCount, getDestinations]);

    return { state, getDestinations };
};
