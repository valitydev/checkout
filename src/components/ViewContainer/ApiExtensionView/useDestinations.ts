import { useCallback, useReducer, useRef } from 'react';

import { Destination, getDestinations as getApiDestinations } from 'checkout/backend/p2p';
import { extractError, withRetry } from 'checkout/utils';

type State = { status: 'PRISTINE' | 'LOADING' | 'FAILURE' } | { status: 'SUCCESS'; data: Destination[] };

type Action = { type: 'FETCH_START' } | { type: 'FETCH_SUCCESS'; payload: Destination[] } | { type: 'FETCH_FAILURE' };

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'FETCH_START':
            return { ...state, status: 'LOADING' };
        case 'FETCH_SUCCESS':
            return { status: 'SUCCESS', data: action.payload };
        case 'FETCH_FAILURE':
            return { ...state, status: 'FAILURE' };
        default:
            return state;
    }
};

export const useDestinations = (capiEndpoint: string, accessToken: string, invoiceID: string, paymentID: string) => {
    const [destinationsState, dispatch] = useReducer(reducer, {
        status: 'PRISTINE',
    });
    // In React dev mode, calling getDestinations twice in quick succession can lead to a 500 error.
    const lastGatewayIDRef = useRef<string | null>(null);

    const getDestinations = useCallback(
        async (gatewayID?: string) => {
            if (lastGatewayIDRef.current === gatewayID) {
                return;
            }
            lastGatewayIDRef.current = gatewayID;

            dispatch({ type: 'FETCH_START' });
            try {
                const getDestinationsWithRetry = withRetry(getApiDestinations);
                const destinations = await getDestinationsWithRetry(
                    capiEndpoint,
                    accessToken,
                    invoiceID,
                    paymentID,
                    gatewayID,
                );
                dispatch({ type: 'FETCH_SUCCESS', payload: destinations });
            } catch (error) {
                dispatch({ type: 'FETCH_FAILURE' });
                // Api returns 500 error when there are no no requisites available.
                // Api 400 error is a common case
                if ('status' in error && error.status !== 500 && error.status !== 400) {
                    console.error(`Failed to fetch destinations. ${extractError(error)}`);
                }
            }
        },
        [capiEndpoint, accessToken, invoiceID, paymentID],
    );

    return { destinationsState, getDestinations };
};
