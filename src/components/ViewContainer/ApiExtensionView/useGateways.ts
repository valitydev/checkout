import { useCallback, useReducer } from 'react';

import { Gateway, getGateways as getApiGateways } from '../../../common/backend/p2p';
import { extractError, withRetry } from '../../../common/utils';

type State = { status: 'PRISTINE' | 'LOADING' | 'FAILURE' } | { status: 'SUCCESS'; data: Gateway[] };

type Action = { type: 'FETCH_START' } | { type: 'FETCH_SUCCESS'; payload: Gateway[] } | { type: 'FETCH_FAILURE' };

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'FETCH_START':
            return { ...state, status: 'LOADING' };
        case 'FETCH_SUCCESS':
            return { status: 'SUCCESS', data: action.payload };
        case 'FETCH_FAILURE':
            return { status: 'FAILURE' };
        default:
            return state;
    }
};

export const useGateways = (capiEndpoint: string, accessToken: string, invoiceID: string, paymentID: string) => {
    const [state, dispatch] = useReducer(reducer, {
        status: 'PRISTINE',
    });

    const getGateways = useCallback(async () => {
        dispatch({ type: 'FETCH_START' });
        try {
            const getGatewaysWithRetry = withRetry(getApiGateways);
            const gateways = await getGatewaysWithRetry(capiEndpoint, accessToken, invoiceID, paymentID);
            dispatch({ type: 'FETCH_SUCCESS', payload: gateways });
        } catch (error) {
            dispatch({ type: 'FETCH_FAILURE' });
            console.error(`Failed to fetch gateways. ${extractError(error)}`);
        }
    }, [capiEndpoint, accessToken, invoiceID, paymentID]);

    return { state, getGateways };
};
